const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");

function checkbox() {
  return { checked: false, dataset: {}, listeners: {}, addEventListener(type, handler) { this.listeners[type] = handler; } };
}

for (const ready of [true, false]) {
  test("FormFlow completion requires all checks and supports " + (ready ? "ready tracking" : "queued tracking"), () => {
    const events = [];
    const button = checkbox();
    const checks = [checkbox(), checkbox(), checkbox()];
    const status = {};
    const section = {
      querySelector(selector) { return selector === "button" ? button : status; },
      querySelectorAll() { return checks; },
      addEventListener() {},
      getAttribute(name) { return name === "data-product" ? "FormFlow" : "formflow_sheet_approved_confirmed"; },
      hasAttribute(name) { return name === "data-checklist-complete"; }
    };
    const window = ready ? { FormSuiteTrack: { event(name, data) { events.push({ name, data }); } } } : {};
    const document = { querySelectorAll() { return [section]; } };
    vm.runInNewContext(fs.readFileSync(path.join(root, "first-result-confirmation.js"), "utf8"), { window, document });
    button.listeners.click();
    assert.equal(events.length, 0);
    assert.equal(window.formsuiteTrackQueue, undefined);
    checks.forEach((input) => { input.checked = true; });
    button.listeners.click();
    const sent = ready ? events : window.formsuiteTrackQueue;
    assert.deepEqual(Array.from(sent, (event) => event.name), ["formflow_sheet_approved_confirmed", "checklist_complete"]);
    assert.equal(sent[1].data.source, "self_reported_copied_form_test");
    assert.equal(button.hidden, true);
  });
}

test("Choice Sync completion requires all steps and public preview, once per page", () => {
  const inputs = [checkbox(), checkbox(), checkbox(), checkbox()];
  const confirm = checkbox();
  const fields = { "[data-preview-confirm]": confirm, "[data-review-outcome]": {}, "[data-support-outcome]": {}, "[data-first-run-progress]": {} };
  const workspace = { querySelectorAll() { return inputs; }, querySelector(selector) { return fields[selector]; } };
  const document = { querySelectorAll() { return []; }, querySelector(selector) { return selector === "[data-formranger-first-run]" ? workspace : null; } };
  const localStorage = { getItem() { return null; }, setItem() {} };
  const window = { FormRangerFirstSuccessState: require("../formranger/first-success-state.js") };
  vm.runInNewContext(fs.readFileSync(path.join(root, "formranger/first-success.js"), "utf8"), { window, document, localStorage });
  assert.equal(confirm.disabled, true);
  confirm.checked = true;
  confirm.listeners.change();
  assert.equal(confirm.checked, false);
  assert.equal(window.formsuiteTrackQueue, undefined);
  inputs.forEach((input) => { input.checked = true; input.listeners.change(); });
  assert.equal(confirm.disabled, false);
  const completions = () => (window.formsuiteTrackQueue || []).filter((event) => event.name === "checklist_complete");
  assert.equal(completions().length, 0);
  confirm.checked = true;
  confirm.listeners.change();
  assert.equal(completions().length, 1);
  assert.equal(fields["[data-review-outcome]"].hidden, false);
  const previews = () => window.formsuiteTrackQueue.filter((event) => event.name === "formranger_public_preview_confirmed");
  assert.equal(previews().length, 1);
  assert.equal(previews()[0].data.progress_complete, 4);
  inputs[0].checked = false;
  inputs[0].listeners.change();
  assert.equal(confirm.disabled, true);
  assert.equal(confirm.checked, false);
  assert.equal(fields["[data-review-outcome]"].hidden, true);
  inputs[0].checked = true;
  inputs[0].listeners.change();
  assert.equal(fields["[data-review-outcome]"].hidden, true);
  confirm.checked = false;
  confirm.listeners.change();
  confirm.checked = true;
  confirm.listeners.change();
  assert.equal(completions().length, 1);
  assert.equal(previews().length, 1);
});
