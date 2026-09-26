const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const tracking = fs.readFileSync(path.join(root, "formsuite-tracking.js"), "utf8");

const firstSuccessRoutes = [
  ["formranger/test-google-forms-dynamic-choices-before-launch.html", "Run the copied-form test"],
  ["formmerge/test-mail-merge-on-a-copied-sheet-before-sending.html", "Run the copied-sheet test"],
  ["docforge/generate-one-pdf-from-google-sheets-before-batch.html", "Run the one-row, one-file test"]
];

test("homepage routes each priority add-on into its smallest first-success test", () => {
  for (const [route, label] of firstSuccessRoutes) {
    assert.match(homepage, new RegExp(`href="${route.replaceAll("/", "\\/")}(?:\\?[^\"]*)?"[^>]*>${label}`));
  }
  assert.doesNotMatch(homepage, /Watch (routing|duplicate|one-file) proof/);
});

function trackedEvent(href) {
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
  const link = { getAttribute() { return href; }, textContent: "Run first-success test" };
  clickHandler({ target: { closest(selector) { return selector === "a[href]" ? link : null; } } });
  return sent.at(-1);
}

test("all three homepage first-success routes emit the same checklist event", () => {
  for (const [route] of firstSuccessRoutes) {
    const event = trackedEvent(`https://formsuite.dev/${route}`);
    assert.equal(event.event, "first_run_checklist_click", route);
    assert.equal(event.target_type, "first_run_checklist", route);
  }
});
