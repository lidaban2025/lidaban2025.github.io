const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "formmerge", "test-mail-merge-on-a-copied-sheet-before-sending.html"), "utf8");
const migrationHtml = fs.readFileSync(path.join(root, "formmerge", "form-mule-alternative-google-sheets.html"), "utf8");
const duplicateHtml = fs.readFileSync(path.join(root, "formmerge", "prevent-duplicate-mail-merge-emails-google-sheets.html"), "utf8");
const productHtml = fs.readFileSync(path.join(root, "formmerge", "index.html"), "utf8");
const trackingJs = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");

test("FormMerge keeps review and feedback actions inside the completed-test outcome", () => {
  const outcome = html.match(/<div class="success" id="success-message"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(outcome, "completed-test outcome should exist");
  assert.match(outcome[0], /utm_medium=review_after_success/);
  assert.match(outcome[0], /copied_sheet_confirmed/);
  assert.doesNotMatch(html.replace(outcome[0], ""), /utm_medium=review_after_success/);
});

test("FormMerge requires all five copied-sheet checks before revealing the outcome", () => {
  const checklist = html.match(/<div class="checklist" id="first-success-checklist">([\s\S]*?)<\/div>/);
  assert.ok(checklist, "copied-sheet checklist should exist");
  assert.equal((checklist[1].match(/type="checkbox"/g) || []).length, 5);
  assert.match(html, /id="confirm-success"[^>]*disabled/);
  assert.match(html, /button\.disabled=!boxes\.every/);
  assert.match(html, /message\.style\.display='block'/);
});

test("FormMerge successful confirmation remains explicitly controlled-test evidence", () => {
  assert.match(html, /formmerge_copied_sheet_success_confirmed/);
  assert.match(html, /inboxes you control/);
  assert.match(html, /SEND_UNCERTAIN/);
});

test("FormMerge migration and duplicate-fault pages route directly to the copied-sheet test", () => {
  const route = /href="\.\/test-mail-merge-on-a-copied-sheet-before-sending\.html"/;
  assert.match(migrationHtml, route);
  assert.match(migrationHtml, /Run the copied-sheet test/);
  assert.match(duplicateHtml, route);
});

test("FormMerge product page routes the secondary CTA to the one-row test and tracks it", () => {
  assert.match(productHtml, /Send yourself one test email first/);
  assert.match(productHtml, /send-test-email-from-google-sheets-before-mail-merge\.html\?utm_source=formsuite&amp;utm_medium=product_page&amp;utm_campaign=formmerge_20261014&amp;utm_content=hero_test_email/);
  assert.match(trackingJs, /\/formmerge\/send-test-email-from-google-sheets-before-mail-merge/);
  assert.match(trackingJs, /return "first_run_checklist"/);
});
