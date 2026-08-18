const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const page = path.join(root, "docforge", "generate-one-pdf-from-google-sheets-before-batch.html");
const html = fs.readFileSync(page, "utf8");

test("DocForge review action is hidden behind a completed one-file check", () => {
  assert.match(html, /id="docforge-first-success-checklist"/);
  const checklist = html.match(/<div class="checklist" id="docforge-first-success-checklist">([\s\S]*?)<\/div>/);
  assert.ok(checklist, "first-success checklist should exist");
  assert.equal((checklist[1].match(/type="checkbox"/g) || []).length, 3);
  assert.match(html, /id="confirm-docforge-success"[^>]*disabled/);

  const successBlock = html.match(/<div id="docforge-success-actions"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(successBlock, "success actions block should exist");
  assert.match(successBlock[0], /hidden/);
  assert.match(successBlock[0], /utm_medium=review_after_success/);
  assert.doesNotMatch(html.replace(successBlock[0], ""), /utm_medium=review_after_success/);
});

test("DocForge confirmation is explicitly self-reported and unlocks the actions", () => {
  assert.match(html, /actions\.hidden = false/);
  assert.match(html, /docforge_one_file_success_confirmed/);
  assert.match(html, /state: 'self_reported_success'/);
  assert.match(html, /button\.disabled = !boxes\.every/);
});

test("DocForge install CTA has a dedicated first-success campaign", () => {
  assert.match(html, /utm_campaign=docforge_first_success/);
  assert.match(html, /utm_content=one_row_one_file_proof/);
});
