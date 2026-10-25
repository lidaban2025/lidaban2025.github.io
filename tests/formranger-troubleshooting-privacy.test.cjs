const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "formranger", "google-forms-dropdown-not-updating-from-google-sheets.html"), "utf8");
const supportHtml = fs.readFileSync(path.join(__dirname, "..", "formranger", "support.html"), "utf8");

test("support intake uses synthetic stage results without screenshots or private content", () => {
  assert.doesNotMatch(supportHtml, /<strong>Screenshot<\/strong>|Include the Preflight text, last update report, and the public preview/i);
  assert.match(supportHtml, /Do not send screenshots, form or spreadsheet IDs, tab names, column headers, question text, source values, credentials, or respondent data/);
  assert.match(supportHtml, /Preflight pass\/blocked, current-preview approved\/not-approved, updated-question count/);
  assert.match(supportHtml, /same copied form matches the synthetic Alpha\/Beta choices/);
});

test("support quick start requires current-preview approval before updating", () => {
  assert.match(supportHtml, /Run Preflight, review and approve the current exact update preview, click Update now/);
  assert.match(supportHtml, /A disabled button is not an update attempt/);
  assert.match(supportHtml, /<strong>Current-preview approval<\/strong>/);
});

test("troubleshooting support intake asks for stage results instead of private content", () => {
  assert.doesNotMatch(html, /collect a screenshot|send it with the source column|Spreadsheet tab name, source column header|Mapped question title and type/i);
  assert.match(html, /Do not send screenshots, form or spreadsheet IDs, tab names, column headers, question text, source values, credentials, or respondent data/);
  assert.match(html, /Preflight pass\/blocked, current-preview approved\/not-approved, updated-question count/);
  assert.match(html, /same copied form matches the synthetic Alpha\/Beta choices/);
});

test("source and mapping evidence use synthetic results without naming private fields", () => {
  for (const label of ["Source context", "Mapping context", "Source proof"]) {
    const card = html.match(new RegExp(`<strong>${label}</strong><p>([^<]+)</p>`));
    assert.ok(card, label);
    assert.doesNotMatch(card[1], /tab name|column header|question title|visible values|visible test values/i);
    assert.match(card[1], /Alpha\/Beta|question type/);
  }
});
