const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

const starters = [
  ["assets/starter-kits/choice-sync-dirty-column-starter.csv", "Choice", "Alpha"],
  ["assets/starter-kits/formmerge-protected-send-starter.csv", "business_key,recipient,subject,body,status", "example.invalid"],
  ["assets/starter-kits/docforge-verified-batch-starter.csv", "row_id,Name,Project,Amount,Expected Output", "DF-001"]
];

for (const [file, header, marker] of starters) {
  test(`${file} is a synthetic downloadable starter`, () => {
    const csv = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(csv, new RegExp(header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(csv, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.doesNotMatch(csv, /@gmail\.com|@outlook\.com|@yahoo\.com/i);
  });
}

test("first-success pages expose starters and success-gated pilot interest", () => {
  const choiceTest = fs.readFileSync(path.join(root, "formranger/test-google-forms-dynamic-choices-before-launch.html"), "utf8");
  const choiceSuccess = fs.readFileSync(path.join(root, "formranger/review-after-first-success.html"), "utf8");
  const merge = fs.readFileSync(path.join(root, "formmerge/test-mail-merge-on-a-copied-sheet-before-sending.html"), "utf8");
  const forge = fs.readFileSync(path.join(root, "docforge/generate-one-pdf-from-google-sheets-before-batch.html"), "utf8");

  assert.match(choiceTest, /choice-sync-dirty-column-starter\.csv/);
  assert.match(choiceSuccess, /Choice%20Sync%20automation%20history%20pilot/);
  assert.match(merge, /formmerge-protected-send-starter\.csv/);
  assert.match(merge, /id="success-message"[\s\S]*FormMerge%20protected%20automation%20pilot/);
  assert.match(forge, /docforge-verified-batch-starter\.csv/);
  assert.match(forge, /id="docforge-success-actions"[\s\S]*DocForge%20verified%20batch%20pilot/);
});

test("tracking records pilot interest without email body fields", () => {
  const tracking = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");
  assert.match(tracking, /return "pilot_interest"/);
  assert.match(tracking, /pilot_interest_click/);
  assert.doesNotMatch(tracking, /destination_(subject|body)/);
});
