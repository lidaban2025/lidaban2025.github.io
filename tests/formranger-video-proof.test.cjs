const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("dropdown troubleshooting page exposes the verified 60-second proof", () => {
  const html = fs.readFileSync(
    path.join(root, "formranger", "google-forms-dropdown-not-updating-from-google-sheets.html"),
    "utf8"
  );

  assert.doesNotMatch(html, /h7jBGOmMm9c/);
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/img\.youtube\.com\/vi\/RE8HR9t9n_0\/hqdefault\.jpg">/
  );
  assert.match(
    html,
    /<meta name="twitter:image" content="https:\/\/img\.youtube\.com\/vi\/RE8HR9t9n_0\/hqdefault\.jpg">/
  );

  const proofSectionMatch = html.match(
    /<section class="section video-proof" aria-labelledby="video-proof-title">[\s\S]*?<\/section>/
  );
  assert.ok(proofSectionMatch, "expected the verified video proof section");

  const proofSection = proofSectionMatch[0];
  assert.match(
    proofSection,
    /<h2 id="video-proof-title">See the first-run pass before touching a live form<\/h2>/
  );

  const proofLinks = [...proofSection.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  const mediaLink = proofLinks.find(([, attributes, content]) => {
    const classNames = attributes.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) || [];

    return (
      classNames.includes("video-proof-media") &&
      /\bhref="https:\/\/youtu\.be\/RE8HR9t9n_0"/.test(attributes) &&
      /<img\b/.test(content)
    );
  });
  assert.ok(mediaLink, "expected the proof thumbnail to link to the verified video");
  assert.match(
    mediaLink[2],
    /<img\b(?=[^>]*src="https:\/\/img\.youtube\.com\/vi\/RE8HR9t9n_0\/hqdefault\.jpg")(?=[^>]*alt="(?=[^"]*FormRanger)(?=[^"]*first[- ]run)[^"]+")[^>]*>/i
  );

  const watchLink = proofLinks.find(
    ([, , content]) => content.trim() === "Watch the 60-second test"
  );
  assert.ok(watchLink, "expected the verified video action");
  assert.match(watchLink[1], /\bhref="https:\/\/youtu\.be\/RE8HR9t9n_0"/);

  const checklistLink = proofLinks.find(
    ([, , content]) => content.trim() === "Run the Alpha/Beta checklist"
  );
  assert.ok(checklistLink, "expected the Alpha/Beta checklist action");
  assert.match(
    checklistLink[1],
    /\bhref="\.\/test-google-forms-dynamic-choices-before-launch\.html"/
  );

  assert.match(
    html,
    /<section class="section" aria-labelledby="answer-title">(?:(?!<\/section>)[\s\S])*<\/section>\s*<section class="section video-proof" aria-labelledby="video-proof-title">/
  );
  assert.match(html, /\.video-proof-media\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
  assert.doesNotMatch(html, /<iframe/i);
});
