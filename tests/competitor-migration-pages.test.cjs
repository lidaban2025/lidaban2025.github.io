const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const pages = [
  {
    file: "formranger/formranger-alternative-google-forms.html",
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
    assert.match(html, /utm_campaign=/);
    assert.doesNotMatch(html, /full (Form Ranger|Form Mule|Autocrat) replacement/i);
  });
}
