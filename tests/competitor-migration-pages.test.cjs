const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

test("the short FormFlow comparison is canonical and linked from the landing page", () => {
  for (const filename of ["form-approvals-alternative.html", "form-approvals-alternative-google-forms.html"]) {
    const html = fs.readFileSync(path.join(root, "formflow", filename), "utf8");
    assert.ok(html.includes('<link rel="canonical" href="https://formsuite.dev/formflow/form-approvals-alternative.html">'));
  }
  const landing = fs.readFileSync(path.join(root, "formflow/index.html"), "utf8");
  assert.ok(landing.includes('href="./form-approvals-alternative.html"'));
});

const pages = [
  {
    file: "formflow/form-approvals-alternative.html",
    campaign: "formflow_install",
    terms: ["50 approval flow runs/month", "5 levels", "$79/year per admin", "20 responses/month", "$96 for 12 months", "not affiliated", "test-google-forms-approval-workflow-before-launch.html", "FAQPage"]
  },
  {
    file: "formranger/choicetide-alternative-google-forms.html",
    campaign: "choice_sync_install",
    terms: ["Preflight", "exact added/removed/unchanged diff", "Choice Hygiene", "drive.file", "Five bounded recovery versions", "not affiliated", "100 syncs/month", "3 linked questions", "$29/year", "checkout is paused", "support@formsuite.dev", "FAQPage"]
  },
  {
    file: "formranger/formranger-alternative-google-forms.html",
    campaign: "choice_sync_install",
    terms: ["exact added/removed/unchanged diff", "Every 6 hours or Daily", "Five bounded recovery versions", "tGH7qXetLTU", "not affiliated"]
  },
  {
    file: "formmerge/form-mule-alternative-google-sheets.html",
    terms: ["30-day protected-message fingerprint", "SEND_UNCERTAIN", "watchdog pause", "YF0AZtQvAt0", "not a drop-in replacement"]
  },
  {
    file: "docforge/autocrat-alternative-google-sheets-document-merge.html",
    terms: ["Durable proof fingerprint", "Manifest reuses unchanged", "Retry failed rows only", "bIxylBLI_nY", "not a drop-in replacement"]
  }
];

for (const page of pages) {
  test(`${page.file} keeps the current factual migration boundary`, () => {
    const html = fs.readFileSync(path.join(root, page.file), "utf8");
    for (const term of page.terms) assert.match(html, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(html, /<link rel="canonical" href="https:\/\/formsuite\.dev\//);
    assert.match(html, /https:\/\/workspace\.google\.com\/marketplace\/app\//);
    assert.match(html, /utm_source=formsuite/);
    assert.match(html, new RegExp("utm_campaign=" + (page.campaign || "")));
    assert.doesNotMatch(html, /full (Form Ranger|Form Mule|Autocrat) replacement/i);
  });
}
