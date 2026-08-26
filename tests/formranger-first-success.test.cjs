const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

test("review gate requires explicit public-preview confirmation", () => {
  const state = require("../formranger/first-success-state.js");
  assert.equal(state.canRequestReview({ previewConfirmed: false, steps: [true, true, true, true] }), false);
  assert.equal(state.canRequestReview({ previewConfirmed: true, steps: [true, true, true, true] }), true);
});

test("FormRanger home has three explicit user states", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "index.html"), "utf8");
  for (const value of ["not-installed", "testing", "successful"]) {
    assert.match(html, new RegExp(`data-formranger-state="${value}"`));
  }
  assert.doesNotMatch(html, /review-after-first-success\.html/);
});

test("first-run page hides the review outcome by default", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "test-google-forms-dynamic-choices-before-launch.html"), "utf8");
  assert.match(html, /data-review-outcome[^>]*hidden/);
  assert.match(html, /data-preview-confirm/);
});

test("first-run page includes a measurable Alpha/Beta starter pack", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "test-google-forms-dynamic-choices-before-launch.html"), "utf8");
  const source = fs.readFileSync(path.join(root, "formranger", "first-success.js"), "utf8");
  const csv = fs.readFileSync(path.join(root, "formranger", "choice-sync-alpha-beta.csv"), "utf8").replace(/\r\n/g, "\n");

  assert.match(html, /data-copy-starter-values/);
  assert.match(html, /data-copy-starter-status aria-live="polite"/);
  assert.match(html, /href="\.\/choice-sync-alpha-beta\.csv" download data-download-starter-values/);
  assert.match(source, /formranger_starter_values_copied/);
  assert.match(source, /formranger_starter_csv_click/);
  assert.equal(csv, "Test choice\nAlpha\nBeta\n");
});

test("owned promotion surfaces converge on the copied-form Alpha/Beta test", () => {
  const expectedPath = "formranger/test-google-forms-dynamic-choices-before-launch.html";
  for (const relativePath of ["index.html", "install.html", "choose-google-workspace-addon.html", "resources/demo-videos.html"]) {
    const html = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert.match(html, new RegExp(expectedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const relativePath of ["index.html", "install.html", "choose-google-workspace-addon.html"]) {
    const html = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert.match(html, /choice_sync_copied_form_first_success/);
  }
});

test("first-run page exposes privacy-safe three-stage recovery", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "test-google-forms-dynamic-choices-before-launch.html"), "utf8");
  const source = fs.readFileSync(path.join(root, "formranger", "first-success.js"), "utf8");
  const tracking = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");

  for (const stage of ["help-preflight", "help-update", "help-preview"]) {
    assert.match(html, new RegExp(`data-first-run-help-stage="${stage}"`));
    assert.match(tracking, new RegExp(`"${stage}"`));
  }
  assert.match(html, /do not send a form ID, spreadsheet ID, question text, source values, or respondent data/i);
  assert.match(source, /formranger_first_run_help_stage/);
  assert.match(source, /public respondent preview in a fresh window/i);
});

test("first-run review links are contained by the gated outcome", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "test-google-forms-dynamic-choices-before-launch.html"), "utf8");
  const block = html.match(/<div class="outcome review-outcome"[\s\S]*?<\/div>/);
  assert.ok(block);
  assert.match(block[0], /review-after-first-success\.html/);
  assert.doesNotMatch(html.replace(block[0], ""), /Leave a Marketplace review|review-after-first-success\.html/);
});

test("FormRanger success center has selected, gated, and mobile styles", () => {
  const css = fs.readFileSync(path.join(root, "product-inner.css"), "utf8");
  assert.match(css, /\.state-segments/);
  assert.match(css, /\[aria-selected="true"\]/);
  assert.match(css, /\.review-outcome\[hidden\]/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
});

test("FormRanger support exposes focused fixes without bypassing the review gate", () => {
  const html = fs.readFileSync(path.join(root, "formranger", "support.html"), "utf8");
  for (const id of ["selected-file", "tab-column", "question-mapping", "preflight-warning", "update-preview"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(html, /href="\.\/review-after-first-success\.html"/);
});

test("Choice Sync product and Preflight guide target distinct search intents", () => {
  const product = fs.readFileSync(path.join(root, "formranger", "index.html"), "utf8");
  const guide = fs.readFileSync(path.join(root, "formranger", "dynamic-google-forms-dropdown-guide.html"), "utf8");

  assert.match(product, /<title>Google Forms Dropdown from Google Sheets \| FormSuite Choice Sync<\/title>/);
  assert.match(guide, /<title>Google Forms Choice Update Preflight Guide \| FormSuite Choice Sync<\/title>/);
  assert.match(guide, /Preflight Google Forms choice updates before they go live/);
  assert.notEqual(product.match(/<title>(.*?)<\/title>/)[1], guide.match(/<title>(.*?)<\/title>/)[1]);
});

test("tracking keeps approved workflow fields and drops arbitrary custom data", () => {
  const source = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");
  const sent = [];
  const storage = () => {
    const values = new Map();
    return {
      getItem(key) { return values.get(key) || null; },
      setItem(key, value) { values.set(key, String(value)); }
    };
  };
  const window = {
    location: {
      hostname: "localhost",
      origin: "https://localhost",
      pathname: "/formranger/test-google-forms-dynamic-choices-before-launch.html",
      search: ""
    },
    localStorage: storage(),
    sessionStorage: storage()
  };
  const document = {
    currentScript: { dataset: { endpoint: "https://events.example.test" } },
    referrer: "",
    addEventListener() {},
    querySelector() { return null; }
  };
  const navigator = {
    sendBeacon(url, body) { sent.push({ url, body }); return true; }
  };
  vm.runInNewContext(source, { window, document, navigator, URL, URLSearchParams });

  window.FormSuiteTrack.event("formranger_first_run_step", {
    state: "testing",
    step: "preflight",
    complete: true,
    progress_complete: 3,
    confirmation: "Alpha|Beta",
    private_note: "do-not-send"
  });

  const payload = JSON.parse(sent.at(-1).body);
  assert.equal(payload.state, "testing");
  assert.equal(payload.step, "preflight");
  assert.equal(payload.complete, true);
  assert.equal(payload.progress_complete, 3);
  assert.equal(payload.confirmation, "Alpha|Beta");
  assert.equal(Object.hasOwn(payload, "private_note"), false);

  window.FormSuiteTrack.event("formranger_first_run_help_stage", {
    state: "testing",
    step: "help-update",
    private_note: "still-do-not-send"
  });
  const helpPayload = JSON.parse(sent.at(-1).body);
  assert.equal(helpPayload.step, "help-update");
  assert.equal(Object.hasOwn(helpPayload, "private_note"), false);
});
