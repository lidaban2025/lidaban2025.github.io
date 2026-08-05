const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage leads with the FormRanger choice-sync job", () => {
  assert.match(html, /<title>FormRanger \| Sync Google Forms choices from Google Sheets \| FormSuite<\/title>/);
  assert.match(html, /Keep Google Forms choices synced from Google Sheets/);
  assert.match(html, /formranger\/test-google-forms-dynamic-choices-before-launch\.html\?utm_source=formsuite&amp;utm_medium=homepage_hero&amp;utm_campaign=formranger_homepage_first_success_20260805&amp;utm_content=hero_checklist/);
  assert.match(html, /formranger_pro_dynamic_choice_sync\/18856558524\?utm_source=formsuite&amp;utm_medium=homepage_hero&amp;utm_campaign=formranger_homepage_first_success_20260805&amp;utm_content=marketplace_install/);
});

test("homepage puts FormRanger first and FormFlow remains available second", () => {
  const ranger = html.indexOf('class="product-card featured"');
  const rangerHeading = html.indexOf("<h3>FormRanger</h3>");
  const flowHeading = html.indexOf("<h3>FormFlow</h3>");
  assert.ok(ranger >= 0);
  assert.ok(rangerHeading > ranger);
  assert.ok(rangerHeading < flowHeading);
  assert.match(html, /formflow\/test-google-forms-approval-workflow-before-launch\.html/);
});

test("structured data lists FormRanger before FormFlow", () => {
  assert.match(html, /"position": 1, "name": "FormRanger"/);
  assert.match(html, /"position": 2, "name": "FormFlow"/);
});

test("homepage FAQ leads with FormRanger for Sheets-backed choices", () => {
  const recommendation = "Start with FormRanger when your Google Forms choices come from Sheets";
  assert.equal(html.match(new RegExp(recommendation, "g"))?.length, 2);
});
