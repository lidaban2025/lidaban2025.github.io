# FormRanger-led FormSuite Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** Make the FormSuite homepage lead qualified visitors into FormRanger's copied-form first-success flow while preserving the FormSuite portfolio and all existing product routes.

**Architecture:** Keep the current static single-file homepage and inline design system. Update only homepage copy, structured metadata, hero links/visual, product-card order/emphasis, and campaign parameters. Add a Node built-in static test that checks the contract without introducing a new runtime dependency.

**Tech Stack:** Static HTML/CSS, JSON-LD, Node.js `node:test`, existing `npm` scripts, Cloudflare static build.

---

### Task 1: Add the failing homepage contract test

**Files:**
- Create: `D:\forms_source_code\lidaban2025.github.io\tests\homepage-formranger-led.test.cjs`
- Read: `D:\forms_source_code\lidaban2025.github.io\index.html`

- [ ] **Step 1: Write the failing test**

Create a Node test that reads the homepage and asserts:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage leads with the FormRanger choice-sync job", () => {
  assert.match(html, /<title>FormRanger \| Sync Google Forms choices from Google Sheets \| FormSuite<\/title>/);
  assert.match(html, /Keep Google Forms choices synced from Google Sheets/);
  assert.match(html, /formranger\/test-google-forms-dynamic-choices-before-launch\.html\?utm_source=formsuite&utm_medium=homepage_hero&utm_campaign=formranger_homepage_first_success_20260805&utm_content=hero_checklist/);
  assert.match(html, /formranger_pro_dynamic_choice_sync\/18856558524\?utm_source=formsuite&utm_medium=homepage_hero&utm_campaign=formranger_homepage_first_success_20260805&utm_content=marketplace_install/);
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
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/homepage-formranger-led.test.cjs`

Expected: FAIL because the current title, hero copy, CTA URLs, featured-card order, and ItemList order still lead with the portfolio/FormFlow framing.

### Task 2: Implement the FormRanger-led homepage contract

**Files:**
- Modify: `D:\forms_source_code\lidaban2025.github.io\index.html`

- [ ] **Step 1: Update SEO metadata and structured data**

Change only the homepage metadata and JSON-LD:

```html
<title>FormRanger | Sync Google Forms choices from Google Sheets | FormSuite</title>
<meta name="description" content="Keep Google Forms dropdown, checkbox, and multiple-choice options synced from Google Sheets with FormRanger, then prove one update before launch.">
<meta property="og:title" content="FormRanger | Sync Google Forms choices from Google Sheets | FormSuite">
<meta property="og:description" content="Keep Google Forms choices synced from Google Sheets, test one update, and send respondents to a form that shows the expected options.">
<meta name="twitter:title" content="FormRanger | Sync Google Forms choices from Google Sheets | FormSuite">
<meta name="twitter:description" content="A focused FormSuite add-on for refreshing Google Forms choices from a selected Google Sheets source.">
```

In the JSON-LD `WebSite` description, lead with the FormRanger job while retaining the suite description. In `ItemList`, set FormRanger to position 1 and FormFlow to position 2; leave the remaining products present.

- [ ] **Step 2: Update the first viewport and campaign links**

Use FormRanger-first copy and the existing screenshots:

```html
<div class="eyebrow">Featured FormSuite add-on · FormRanger</div>
<h1 id="hero-title">Keep Google Forms choices synced from Google Sheets.</h1>
<p>Refresh dropdown, checkbox, and multiple-choice options from a selected Sheet before respondents use your form. Prove one copied-form update first; this is owner-controlled refresh, not respondent-time dependent logic.</p>
<div class="hero-actions">
  <a class="btn btn-primary" href="formranger/test-google-forms-dynamic-choices-before-launch.html?utm_source=formsuite&amp;utm_medium=homepage_hero&amp;utm_campaign=formranger_homepage_first_success_20260805&amp;utm_content=hero_checklist">Run the first-success test</a>
  <a class="btn" href="https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524?utm_source=formsuite&amp;utm_medium=homepage_hero&amp;utm_campaign=formranger_homepage_first_success_20260805&amp;utm_content=marketplace_install">Install FormRanger</a>
</div>
```

Replace the generic hero preview rows with the existing FormRanger icon and screenshots, and label the workflow `Select source`, `Map question`, `Update and preview`.

- [ ] **Step 3: Reorder and restyle only the product emphasis**

Move the existing FormRanger article before FormFlow. Give FormRanger the existing `featured` class and label it `Featured`. Keep its current description, first-test path, and add the same campaign values to its Marketplace install link. Remove `featured` from FormFlow, change its badge from `Breakout` to `Approval workflow`, and leave its install and first-test URLs unchanged. Keep all remaining cards and the existing AI Indexability Checker route untouched.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --test tests/homepage-formranger-led.test.cjs`

Expected: PASS with three passing tests.

### Task 3: Run repository checks and build

**Files:**
- Read: `D:\forms_source_code\lidaban2025.github.io\package.json`
- Read: `D:\forms_source_code\lidaban2025.github.io\sitemap.xml`

- [ ] **Step 1: Run the full static test suite**

Run: `npm test`

Expected: all FormRanger behavior tests and local-link checks pass; no broken local links are introduced.

- [ ] **Step 2: Build the static site**

Run: `npm run build:site`

Expected: the build completes and copies the modified homepage plus all existing product directories into `_site`.

- [ ] **Step 3: Verify the built homepage contract**

Run: `node --test tests/homepage-formranger-led.test.cjs` and inspect `_site/index.html` for the FormRanger title, first-success CTA, Marketplace CTA, and FormFlow route.

Expected: the source and built homepage contain the same approved FormRanger-first contract.

### Task 4: Smoke-test and review scope before deployment

**Files:**
- Read: `D:\forms_source_code\lidaban2025.github.io\_site\index.html`
- Read: `D:\forms_source_code\lidaban2025.github.io\index.html`

- [ ] **Step 1: Start the existing local static server**

Run: `npx serve _site -l 8899` from the repository root, using another free port if 8899 is occupied.

Expected: the homepage loads at the local URL with no console-blocking asset errors.

- [ ] **Step 2: Check responsive layout**

Inspect the homepage at 1440px and 390px widths. Confirm the FormRanger hero hierarchy, screenshot aspect ratios, buttons, product order, and no horizontal overflow.

- [ ] **Step 3: Review the dirty worktree scope**

Run: `git status --short` and `git diff -- index.html tests/homepage-formranger-led.test.cjs`.

Expected: only the approved homepage and new focused test are in the implementation diff; unrelated user changes remain untouched.

### Task 5: Publish only after explicit deployment approval

**Files:**
- Modify: none beyond the approved implementation files.

- [ ] **Step 1: Run the dry deployment check**

Run: `npm run cf:check`

Expected: build and Cloudflare dry-run succeed without including unrelated worktree files.

- [ ] **Step 2: Deploy the approved commit**

Run only after deployment approval: `npm run deploy`

Expected: Cloudflare reports a successful deployment; then verify `https://formsuite.dev/` returns HTTP 200 and contains the FormRanger title and first-success CTA.

- [ ] **Step 3: Record the deployment result**

Append the verified URL, deployment timestamp, commit/working-tree scope, and smoke-test result to the FormSuite marketing log. Do not claim traffic growth from deployment alone.
