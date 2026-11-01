const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage leads with FormFlow and Choice Sync, not a three-product grid", () => {
  assert.match(html, /<title>FormFlow and Choice Sync \| Google Forms add-ons \| FormSuite<\/title>/);
  assert.match(html, /id="formflow"/);
  assert.match(html, /id="choice-sync"/);
  const flow = html.indexOf('id="formflow"');
  const sync = html.indexOf('id="choice-sync"');
  assert.ok(flow > 0 && flow < sync);
  assert.doesNotMatch(html, /homepage-top3\.css/);
  assert.doesNotMatch(html, /Three priority add-ons/);
});

test("structured data lists FormFlow before Choice Sync", () => {
  const flow = html.indexOf('"name":"FormFlow"');
  const sync = html.indexOf('"name":"FormSuite Choice Sync"');
  assert.ok(flow > 0 && flow < sync);
  assert.match(html, /"position":1,"name":"FormFlow"/);
  assert.match(html, /"position":2,"name":"FormSuite Choice Sync"/);
});
