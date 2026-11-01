const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "formranger", "google-forms-dropdown-not-updating-from-google-sheets.html"), "utf8");
const supportHtml = fs.readFileSync(path.join(__dirname, "..", "formranger", "support.html"), "utf8");
const reviewHtml = fs.readFileSync(path.join(__dirname, "..", "formranger", "review-after-first-success.html"), "utf8");
const firstRunHtml = fs.readFileSync(path.join(__dirname, "..", "formranger", "test-google-forms-dynamic-choices-before-launch.html"), "utf8");

test("first-run guide routes unpublished previews to safe copied-form recovery", () => {
  const recoveryCard = firstRunHtml.match(/<div class="card"><strong>Preview unavailable<\/strong>[\s\S]*?<\/div>/);
  assert.ok(recoveryCard, "separate unavailable-preview recovery instead of treating it as a failed write");
  assert.match(recoveryCard[0], /href="\.\/support\.html#unpublished-copy"/);
  assert.match(recoveryCard[0], /synthetic Alpha\/Beta/);
  assert.match(recoveryCard[0], /Do not broaden access, change a production form, or repeat a successful update/);
  assert.match(recoveryCard[0], /stop and ask the owner or administrator/);
  assert.match(recoveryCard[0], /unverified, not a failed write or a reason to request a review/);
  assert.match(supportHtml, /id="unpublished-copy"/);
});

test("review-page support fallback uses synthetic stages without private source details", () => {
  assert.doesNotMatch(reviewHtml, /selected sheet tab|source column, update report|source sheet details, update report/i);
  assert.match(reviewHtml, /Do not send screenshots, form or spreadsheet IDs, tab names, column headers, question text, source values, credentials, or respondent data/);
  const schema = JSON.parse(reviewHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = schema["@graph"].find(entry => entry["@type"] === "FAQPage");
  for (const text of [reviewHtml, faq.mainEntity[1].acceptedAnswer.text]) {
    assert.match(text, /Preflight pass\/blocked, current-preview approved\/not-approved, updated-question count/);
    assert.match(text, /same copied form matches the synthetic Alpha\/Beta choices/);
  }
});

test("review page separates approval from successful update and keeps reviews optional", () => {
  assert.match(reviewHtml, /Review and approve the current exact update preview before Update now/);
  assert.match(reviewHtml, /Approval alone is not a successful update/);
  assert.match(reviewHtml, /A disabled Update now button means not-run, not a failed write/);
  assert.match(reviewHtml, /A review is optional; no particular rating is requested/);
  assert.match(reviewHtml, /Update now reports at least one updated question/);
});

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

test("unpublished copied-form recovery preserves access controls and success gates", () => {
  const recovery = supportHtml.match(/<section[^>]*id="unpublished-copy"[\s\S]*?<\/section>/);
  assert.ok(recovery, "dedicated unpublished-copy recovery section");
  assert.match(recovery[0], /synthetic Alpha\/Beta/);
  assert.match(recovery[0], /Publish and review the intended test audience/);
  assert.match(recovery[0], /Do not broaden organizational access or change a production form/);
  assert.match(recovery[0], /stop and ask the form owner or administrator/);
  assert.match(recovery[0], /does not by itself mean the choice update failed/);
  assert.match(recovery[0], /Do not rerun an already successful update/);
  assert.match(recovery[0], /form_not_published, blocked, not-checked, matches, or stale/);
  assert.match(recovery[0], /Do not send URLs, IDs, screenshots, source values, question text, credentials, or respondent content/);
  assert.match(recovery[0], /Do not request a review while the public preview is unverified/);
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
