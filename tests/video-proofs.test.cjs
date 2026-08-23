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
  },
  {
    file: "formranger/google-forms-dropdown-not-updating-from-google-sheets.html",
    id: "il0ZJYrp9UA",
    type: "safe_scheduled_sync"
  },
  {
    file: "formmerge/form-mule-not-sending-emails.html",
    id: "xXX9I7bkL3M",
    type: "protected_operational_automation"
  },
  {
    file: "docforge/google-docs-template-merge-fields-not-replacing-from-google-sheets.html",
    id: "0KmBS2EKxAk",
    type: "verified_batch"
  },
  {
    file: "formranger/google-forms-dropdown-not-updating-from-google-sheets.html",
    id: "tGH7qXetLTU",
    type: "choice_full_tutorial"
  },
  {
    file: "formmerge/form-mule-not-sending-emails.html",
    id: "YF0AZtQvAt0",
    type: "formmerge_full_tutorial"
  },
  {
    file: "docforge/google-docs-template-merge-fields-not-replacing-from-google-sheets.html",
    id: "bIxylBLI_nY",
    type: "docforge_full_tutorial"
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
