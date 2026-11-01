const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const tracking = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");
const worker = fs.readFileSync(path.join(root, "worker.js"), "utf8");

const formflowInstall = "https://workspace.google.com/marketplace/app/formflow_approval_workflow_for_google_fo/1082615279531?utm_source=formsuite&amp;utm_medium=homepage&amp;utm_campaign=formflow_install&amp;utm_content=hero_install";
const choiceInstall = "https://workspace.google.com/marketplace/app/formsuite_choice_sync/18856558524?utm_source=formsuite&amp;utm_medium=homepage&amp;utm_campaign=choice_sync_install&amp;utm_content=hero_install";

test("homepage promotes FormFlow and Choice Sync with real Marketplace figures", () => {
  assert.match(homepage, /Approval workflows and Sheets-backed choices for Google Forms/);
  assert.match(homepage, /1,000\+ installs/);
  assert.match(homepage, /772 installs/);
  assert.match(homepage, /4\.0/);
  assert.match(homepage, /2 reviews/);
  assert.match(homepage, new RegExp(formflowInstall.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(homepage, new RegExp(choiceInstall.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(homepage, /formranger\/test-google-forms-dynamic-choices-before-launch\.html\?utm_source=formsuite&amp;utm_medium=homepage&amp;utm_campaign=choice_sync_copied_form_first_success/);
  assert.match(homepage, /href="more-tools\.html"/);
  assert.doesNotMatch(homepage, /OAuth verified by Google/i);
  assert.doesNotMatch(homepage, /formnotifier|formcopy|formmerge|docforge|FormNotifier|FormCopy|FormMerge|DocForge/i);
});

test("FormNotifier enquiry, registration first-run and delivery guidance stays on its product page", () => {
  const formnotifier = fs.readFileSync(path.join(root, "formnotifier", "index.html"), "utf8");
  const moreTools = fs.readFileSync(path.join(root, "more-tools.html"), "utf8");
  assert.ok(formnotifier.includes("Acknowledge the enquiry. Notify your team."));
  assert.ok(formnotifier.includes("Verify your first enquiry or registration email."));
  assert.ok(formnotifier.includes("Use one copied form and email addresses you control"));
  assert.ok(formnotifier.includes("both the respondent acknowledgement and the owner or team alert actually arrive with the correct merge-field values"));
  assert.ok(formnotifier.includes("successful email-provider call does not prove inbox delivery"));
  assert.ok(formnotifier.includes("check spam and account sending limits"));
  assert.ok(formnotifier.includes('href="support.html">delivery support guidance'));
  assert.ok(formnotifier.includes("disable notifications and unpublish the copied form"));
  assert.ok(formnotifier.includes("not payment, approval or a reserved place"));
  assert.ok(formnotifier.includes('href="test-google-forms-confirmation-email-before-launch.html"'));
  assert.ok(moreTools.includes('href="formnotifier/"'));
});

test("worker redirects the FormCopy home to the homepage", () => {
  assert.match(worker, /pathname === '\/formcopy'/);
  assert.match(worker, /Response\.redirect\([\s\S]*301\)/);
});

function trackedEvents(href, text) {
  const sent = [];
  let clickHandler;
  const storage = () => ({ getItem() { return null; }, setItem() {} });
  const window = {
    location: { hostname: "localhost", origin: "https://localhost", href: "https://localhost/", pathname: "/", search: "" },
    localStorage: storage(),
    sessionStorage: storage()
  };
  const document = {
    currentScript: { dataset: { endpoint: "https://events.example.test" } },
    referrer: "",
    addEventListener(type, handler) { if (type === "click") clickHandler = handler; },
    querySelector() { return null; }
  };
  const navigator = { sendBeacon(url, body) { sent.push(JSON.parse(body)); return true; } };
  vm.runInNewContext(tracking, { window, document, navigator, URL, URLSearchParams });
  const link = { getAttribute() { return href; }, textContent: text };
  clickHandler({ target: { closest(selector) { return selector === "a[href]" ? link : null; } } });
  return sent;
}

test("Marketplace install links emit install_click and keep the legacy marketplace event", () => {
  const cases = [
    [formflowInstall.replaceAll("&amp;", "&"), "Install FormFlow", "FormFlow"],
    [choiceInstall.replaceAll("&amp;", "&"), "Install Choice Sync", "FormRanger"]
  ];
  for (const [href, label, product] of cases) {
    const sent = trackedEvents(href, label);
    const install = sent.find((event) => event.event === "install_click");
    const legacy = sent.find((event) => event.event === "marketplace_cta_click");
    assert.ok(install, href);
    assert.equal(install.target_type, "install");
    assert.equal(install.product, product);
    assert.equal(legacy.event, "marketplace_cta_click");
    assert.equal(legacy.target_type, "marketplace");
  }
});

test("FormFlow and Choice Sync pages share one install URL and campaign", () => {
  const htmlFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) htmlFiles.push(full);
    }
  }
  walk(path.join(root, "formflow"));
  walk(path.join(root, "formranger"));
  walk(path.join(root, "resources"));

  const hrefs = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/https:\/\/workspace\.google\.com\/marketplace\/app\/[^"'<\s]+/g)) {
      hrefs.push(match[0].replaceAll("&amp;", "&"));
    }
  }
  const js = fs.readFileSync(path.join(root, "formranger", "first-success.js"), "utf8");
  for (const match of js.matchAll(/https:\/\/workspace\.google\.com\/marketplace\/app\/[^"'<\s]+/g)) {
    hrefs.push(match[0]);
  }

  const choice = hrefs.filter((href) => href.includes("18856558524") || href.includes("formranger_pro") || href.includes("formsuite_choice_sync") || href.includes("/choice_sync"));
  const flow = hrefs.filter((href) => href.includes("1082615279531") || href.includes("formflow_approval"));
  assert.ok(choice.length > 0);
  assert.ok(flow.length > 0);
  for (const href of choice) {
    const url = new URL(href);
    assert.equal(url.pathname, "/marketplace/app/formsuite_choice_sync/18856558524");
    assert.equal(url.searchParams.get("utm_source"), "formsuite");
    assert.equal(url.searchParams.get("utm_campaign"), "choice_sync_install");
    assert.ok(["site_cta", "review_after_success"].includes(url.searchParams.get("utm_medium")), href);
  }
  for (const href of flow) {
    const url = new URL(href);
    assert.equal(url.pathname, "/marketplace/app/formflow_approval_workflow_for_google_fo/1082615279531");
    assert.equal(url.searchParams.get("utm_source"), "formsuite");
    assert.equal(url.searchParams.get("utm_campaign"), "formflow_install");
    assert.ok(["site_cta", "review_after_success"].includes(url.searchParams.get("utm_medium")), href);
  }
});
