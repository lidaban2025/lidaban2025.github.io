const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const flowPricing = "Free: 50 approval flow runs per month, up to 5 approval levels, unlimited approvers and requesters. Pro: $79/year per admin, unlimited flow runs, up to 5 levels, unlimited approvers. No per-approver fees.";
const choicePricing = "Free: 100 syncs per calendar month, up to 3 linked questions. Pro: $29/year, unlimited syncs and linked questions.";

for (const file of ["index.html", "pricing.html", "llms.txt", "formflow/index.html", "formflow/free-google-forms-approval-workflow.html", "formflow/form-approvals-pricing-alternative.html", "formflow/form-approvals-alternative-google-forms.html"]) {
  test(file + " publishes the FormFlow Free and Pro limits", () => {
    const text = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.ok(text.includes(flowPricing));
    assert.doesNotMatch(text, /TODO[^\n]*(FormFlow|approver|reviewer)|FormFlow pricing is on its Marketplace listing|does not state a FormFlow price/i);
  });
}

for (const file of ["index.html", "pricing.html", "llms.txt", "formranger/index.html", "formranger/choice-sync.html", "formranger/support.html", "formranger/choice-eliminator-alternative-google-forms.html"]) {
  test(file + " publishes Choice Sync limits and preserves the checkout pause", () => {
    const text = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.ok(text.includes(choicePricing));
    assert.match(text, /checkout is paused/i);
    assert.match(text, /support@formsuite\.dev/);
    assert.doesNotMatch(text, /free during (the )?(public )?launch|Free launch|early-bird pricing|proposed Pro|TODO[^\n]*(Choice Sync|100 manual)/i);
    assert.doesNotMatch(text, /href=["']https?:\/\/[^"']*(?:checkout|buy\.creem)/i);
  });
}

function applications(file) {
  const schemas = [...read(file).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const found = [];
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if (value["@type"] === "SoftwareApplication") found.push(value);
    for (const child of Object.values(value)) visit(child);
  }
  schemas.forEach(visit);
  return found;
}

for (const file of ["index.html", "pricing.html", "formflow/index.html", "formranger/index.html", "formranger/choice-sync.html"]) {
  test(file + " has accurate Free and annual Pro structured offers", () => {
    const apps = applications(file);
    assert.ok(apps.length > 0);
    for (const app of apps) {
      const isFlow = app.name === "FormFlow";
      assert.equal(app.offers.length, 2);
      const free = app.offers.find((offer) => offer.name === "Free");
      const pro = app.offers.find((offer) => offer.name === "Pro");
      assert.equal(free.price, "0");
      assert.equal(pro.price, isFlow ? "79" : "29");
      assert.equal(free.priceCurrency, "USD");
      assert.equal(pro.priceCurrency, "USD");
      assert.match(free.description, isFlow ? /50 approval flow runs per month.*5 approval levels.*unlimited approvers and requesters/ : /100 syncs per calendar month.*3 linked questions/);
      assert.match(pro.description, isFlow ? /\$79\/year per admin.*Unlimited flow runs.*5 levels.*unlimited approvers.*No per-approver fees/ : /\$29\/year.*Unlimited syncs and linked questions.*checkout is paused/);
      assert.equal(pro.url, "https://formsuite.dev/pricing.html");
    }
  });
}

function loadWorker(assetsFetch) {
  const context = {
    module: { exports: {} },
    URL,
    Response,
    formulaApi: { fetch: () => new Response("formula") },
    indexabilityApi: { fetch: () => new Response("indexability") }
  };
  const source = read("worker.js").replace(/^import .*;\r?\n/gm, "").replace("export default", "module.exports =");
  vm.runInNewContext(source, context);
  return (pathname) => context.module.exports.fetch(new Request("https://formsuite.dev" + pathname), { ASSETS: { fetch: assetsFetch } }, {});
}

const retiredPaths = [
  "/formcopy", "/formcopy/", "/formcopy/index.html",
  "/formcopy/google-forms-response-sheet-formulas-guide.html",
  "/formcopy/google-forms-response-sheet-row-2-model.html",
  "/formcopy/test-google-forms-response-sheet-formulas-before-launch.html",
  "/formcopy/copy-down-alternative-for-google-forms-response-sheets.html",
  "/formcopy/copy-formulas-to-new-google-forms-responses.html",
  "/formcopy/automatically-copy-formulas-when-google-form-is-submitted.html",
  "/formcopy/calculated-columns-google-forms-response-sheet.html",
  "/formcopy/google-forms-response-sheet-helper-columns.html",
  "/formcopy/google-forms-response-sheet-scoring-formulas.html",
  "/formcopy/google-forms-response-sheet-formulas-not-copying.html",
  "/formcopy/google-forms-response-sheet-formulas-move-after-new-submission.html",
  "/formcopy/google-forms-response-sheet-formulas-skipping-rows.html",
  "/formcopy/support.html", "/formcopy/permissions.html", "/formcopy/privacy.html", "/formcopy/terms.html",
  "/formcopy/future-guide.html?utm_source=legacy", "/formcopy/nested/guide.html", "/formcopy/?ref=legacy"
];

for (const pathname of retiredPaths) {
  test(pathname + " redirects permanently to the homepage before asset handling", async () => {
    const fetch = loadWorker(() => assert.fail("Retired paths must not reach ASSETS"));
    const response = await fetch(pathname);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), "https://formsuite.dev/");
  });
}

test("non-FormCopy assets and API routing remain unchanged", async () => {
  const fetch = loadWorker((request) => new Response(new URL(request.url).pathname));
  for (const pathname of ["/", "/formcopycat/", "/formcopy.html", "/formflow/", "/formranger/choice-sync.html"]) {
    const response = await fetch(pathname);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), pathname);
  }
  assert.equal(await (await fetch("/api/formula")).text(), "formula");
  assert.equal(await (await fetch("/api/indexability-check")).text(), "indexability");
});

test("sitemap and LLM index exclude retired FormCopy URLs", () => {
  assert.doesNotMatch(read("sitemap.xml"), /\/formcopy(?:\/|<)/i);
  assert.doesNotMatch(read("llms.txt"), /https?:\/\/\S*\/formcopy(?:\/|\b)/i);
  const locations = [...read("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.ok(locations.length > 0);
  assert.ok(locations.some((url) => url.pathname === "/formflow/"));
  assert.ok(locations.some((url) => url.pathname === "/formranger/"));
});

test("retired HTML is removed from source, build, and internal links", () => {
  assert.deepEqual(fs.readdirSync(path.join(root, "formcopy")).filter((file) => file.endsWith(".html")), []);
  assert.doesNotMatch(read("scripts/build-site.js"), /['"]formcopy['"]/);
  function checkDirectory(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || ["node_modules", "_site", "scripts"].includes(entry.name)) continue;
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) checkDirectory(filename);
      else if (entry.name.endsWith(".html")) assert.doesNotMatch(fs.readFileSync(filename, "utf8"), /href\s*=\s*["'][^"']*\bformcopy\/(?:[^"']*)["']/i, filename);
    }
  }
  checkDirectory(root);
});
