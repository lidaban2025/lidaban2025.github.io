const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const proofs = [
  {
    file: "formranger/google-forms-section-routing-choice-update-risk.html",
    id: "CrQfguq0MEQ",
    type: "routing_blocker"
  },
  {
    file: "formmerge/prevent-duplicate-mail-merge-emails-google-sheets.html",
    id: "yCey8ig5A2Y",
    type: "duplicate_send_blocker"
  },
  {
    file: "docforge/generate-one-pdf-from-google-sheets-before-batch.html",
    id: "dk0Cbncsn5E",
    type: "one_row_one_file"
  }
];

for (const proof of proofs) {
  test(`${proof.type} keeps a click-to-load proof and VideoObject`, () => {
    const html = fs.readFileSync(path.join(root, proof.file), "utf8");
    assert.match(html, new RegExp(`data-video-proof="${proof.type}"`));
    assert.match(html, new RegExp(`data-video-id="${proof.id}"`));
    assert.match(html, /<iframe[^>]+hidden><\/iframe>/);
    assert.doesNotMatch(html, /<iframe[^>]+src=/);
    assert.match(html, /"@type"\s*:\s*"VideoObject"/);
    assert.match(html, new RegExp(`youtube-nocookie\\.com/embed/${proof.id}`));
  });
}

test("tracking loads the privacy-enhanced player and records the proof type", () => {
  const tracking = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");
  assert.match(tracking, /video_proof_play/);
  assert.match(tracking, /www\.youtube-nocookie\.com\/embed\//);
  assert.match(tracking, /proof_type/);
  assert.match(tracking, /codex_smoke_test/);
});
