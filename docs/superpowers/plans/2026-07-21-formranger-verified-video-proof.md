# FormRanger Verified Video Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the verified 60-second FormRanger first-run video as lightweight visible proof on the existing dropdown troubleshooting page without adding another SEO page or loading an autoplaying iframe.

**Architecture:** Keep the change inside the existing static troubleshooting page and its current Node test file. A contract test will lock the new video ID, old-ID removal, proof copy, two destinations, responsive 16:9 media, and no iframe; the page will then add one unframed proof section using existing styles and tracking behavior.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, existing site link checker/build scripts, Browser-based responsive verification, Cloudflare Wrangler dry-run.

---

## File structure

- Modify `tests/formranger-first-success.test.cjs`: add the regression contract for the verified video proof.
- Modify `formranger/google-forms-dropdown-not-updating-from-google-sheets.html`: update social metadata and add the lightweight proof section plus responsive styles.
- Do not modify `product-inner.css`; this proof belongs to one page and should not create a site-wide component without a second consumer.
- Do not create a new FormRanger content page.

### Task 1: Create an isolated implementation worktree

**Files:**
- Reference: `docs/superpowers/specs/2026-07-21-formranger-verified-video-proof-design.md`
- Reference: `docs/superpowers/plans/2026-07-21-formranger-verified-video-proof.md`

- [ ] **Step 1: Invoke the required isolation skill**

Use `superpowers:using-git-worktrees` before changing product or test files. The source repository has unrelated dirty changes, so execution must not occur in the existing working tree.

- [ ] **Step 2: Create the feature worktree**

Run from `D:\forms_source_code\lidaban2025.github.io`:

```powershell
git worktree add D:\forms_source_code\formranger-video-proof-worktree -b feature/formranger-video-proof HEAD
```

Expected: a clean worktree on `feature/formranger-video-proof` containing commit `731c748` or a descendant that still includes the approved design and plan.

- [ ] **Step 3: Install the existing Node dependencies**

Run:

```powershell
npm install
```

Expected: dependencies install without changing application behavior.

- [ ] **Step 4: Run the baseline FormRanger test**

Run:

```powershell
npm run test:formranger
```

Expected: the existing FormRanger tests pass before the new regression test is added.

### Task 2: Add the failing verified-video contract test

**Files:**
- Modify: `tests/formranger-first-success.test.cjs`
- Test: `tests/formranger-first-success.test.cjs`

- [ ] **Step 1: Add the regression test**

Append this test after the existing first-run page tests:

```js
test("dropdown troubleshooting page exposes the verified 60-second proof", () => {
  const html = fs.readFileSync(
    path.join(root, "formranger", "google-forms-dropdown-not-updating-from-google-sheets.html"),
    "utf8"
  );

  assert.doesNotMatch(html, /h7jBGOmMm9c/);
  assert.ok((html.match(/RE8HR9t9n_0/g) || []).length >= 5);
  assert.match(html, /aria-labelledby="video-proof-title"/);
  assert.match(html, /See the first-run pass before touching a live form/);
  assert.match(html, /Watch the 60-second test/);
  assert.match(html, /Run the Alpha\/Beta checklist/);
  assert.match(html, /href="\.\/test-google-forms-dynamic-choices-before-launch\.html"/);
  assert.match(html, /\.video-proof-media\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/);
  assert.doesNotMatch(html, /<iframe/i);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/formranger-first-success.test.cjs
```

Expected: FAIL because the target page still contains `h7jBGOmMm9c` and does not contain the new proof section.

- [ ] **Step 3: Commit the failing contract**

Run:

```powershell
git add tests/formranger-first-success.test.cjs
git commit -m "Test FormRanger verified video proof"
```

Expected: one commit containing only the regression test.

### Task 3: Implement the lightweight proof entry

**Files:**
- Modify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html:19`
- Modify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html:23`
- Modify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html:77`
- Modify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html:98`
- Modify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html:132`
- Test: `tests/formranger-first-success.test.cjs`

- [ ] **Step 1: Replace the old social thumbnail metadata**

Replace the two old thumbnail URLs with:

```html
<meta property="og:image" content="https://img.youtube.com/vi/RE8HR9t9n_0/hqdefault.jpg">
<meta name="twitter:image" content="https://img.youtube.com/vi/RE8HR9t9n_0/hqdefault.jpg">
```

- [ ] **Step 2: Add the page-scoped proof styles**

Insert these rules before the existing media queries:

```css
.video-proof { display:grid; grid-template-columns:minmax(0,1.08fr) minmax(280px,.92fr); gap:22px; align-items:center; }
.video-proof-media { display:block; aspect-ratio:16 / 9; overflow:hidden; border:1px solid var(--line); border-radius:8px; background:#101826; }
.video-proof-media img { display:block; width:100%; height:100%; object-fit:cover; }
.video-proof-copy .eyebrow { margin-bottom:10px; }
.video-proof-copy p { max-width:650px; }
.video-proof-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
.video-proof-note { margin-top:10px; font-size:.9rem; }
```

Update the existing responsive rules to include the proof layout:

```css
@media (max-width:860px) { .hero,.flow,.video-proof { grid-template-columns:1fr; } .nav a:first-child { width:100%; margin-right:0; } h1 { max-width:none; } .check-row { grid-template-columns:34px 1fr; } .check-row .status { grid-column:2; } }
@media (max-width:540px) { .hero-actions .btn,.video-proof-actions .btn { width:100%; } }
```

- [ ] **Step 3: Add the visible proof section after the quick answer**

Insert this section immediately after the existing `Quick answer` section and before `Triage the failure in order`:

```html
<section class="section video-proof" aria-labelledby="video-proof-title">
  <a class="video-proof-media" href="https://youtu.be/RE8HR9t9n_0" target="_blank" rel="noopener noreferrer" aria-label="Watch the verified FormRanger 60-second first-run test on YouTube">
    <img src="https://img.youtube.com/vi/RE8HR9t9n_0/hqdefault.jpg" alt="FormRanger 60-second first-run test showing the Google Sheets to Google Forms dropdown update path" loading="lazy">
  </a>
  <div class="video-proof-copy">
    <div class="eyebrow">60-second verified test</div>
    <h2 id="video-proof-title">See the first-run pass before touching a live form</h2>
    <p>The test passes only when Preflight succeeds, Update now reports at least one updated question, and the public respondent preview shows the expected Google Sheets values.</p>
    <div class="video-proof-actions">
      <a class="btn btn-primary" href="https://youtu.be/RE8HR9t9n_0" target="_blank" rel="noopener noreferrer">Watch the 60-second test</a>
      <a class="btn" href="./test-google-forms-dynamic-choices-before-launch.html">Run the Alpha/Beta checklist</a>
    </div>
    <p class="video-proof-note">FormRanger refreshes owner-controlled choices before respondents use the form. It is not respondent-time dependent-dropdown, booking, inventory, or payment software.</p>
  </div>
</section>
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```powershell
node --test tests/formranger-first-success.test.cjs
```

Expected: PASS, including `dropdown troubleshooting page exposes the verified 60-second proof`.

- [ ] **Step 5: Commit the implementation**

Run:

```powershell
git add formranger/google-forms-dropdown-not-updating-from-google-sheets.html
git commit -m "Add FormRanger verified video proof"
```

Expected: one commit containing only the target page.

### Task 4: Run full static and responsive verification

**Files:**
- Verify: `formranger/google-forms-dropdown-not-updating-from-google-sheets.html`
- Verify: `tests/formranger-first-success.test.cjs`

- [ ] **Step 1: Run the FormRanger suite**

Run:

```powershell
npm run test:formranger
```

Expected: all FormRanger tests pass.

- [ ] **Step 2: Run the full local-link scan**

Run:

```powershell
npm run check:links
```

Expected: no broken local links.

- [ ] **Step 3: Build the static site**

Run:

```powershell
npm run build:site
```

Expected: the static build completes successfully.

- [ ] **Step 4: Run the Cloudflare dry-run**

Run:

```powershell
npm run cf:check
```

Expected: Wrangler dry-run succeeds without deploying.

- [ ] **Step 5: Start a hidden local server**

Run in PowerShell:

```powershell
$server = Start-Process python -ArgumentList '-m','http.server','4173','--directory','D:\forms_source_code\formranger-video-proof-worktree' -PassThru -WindowStyle Hidden
```

Expected: `http://127.0.0.1:4173/formranger/google-forms-dropdown-not-updating-from-google-sheets.html` returns HTTP `200`.

- [ ] **Step 6: Inspect desktop and mobile presentation**

Use the Browser tool to inspect the local page at `1440x900` and `390x844`. Verify:

- the thumbnail renders and keeps a 16:9 box;
- the heading and paragraph do not overlap the media;
- both actions fit without horizontal overflow;
- mobile stacking preserves the order media, explanation, actions;
- the page does not load a YouTube iframe or autoplay media.

Save evidence to:

```text
D:\forms_source_code\smoke_results\formranger_video_proof_20260721\desktop.png
D:\forms_source_code\smoke_results\formranger_video_proof_20260721\mobile.png
```

- [ ] **Step 7: Stop the local server**

Run:

```powershell
Stop-Process -Id $server.Id
```

Expected: the temporary server exits cleanly.

### Task 5: Prepare and verify publication

**Files:**
- Verify commit history for `tests/formranger-first-success.test.cjs`
- Verify commit history for `formranger/google-forms-dropdown-not-updating-from-google-sheets.html`

- [ ] **Step 1: Verify commit scope**

Run:

```powershell
git status --short
git log -3 --oneline
git diff HEAD~2..HEAD --check
```

Expected: the worktree is clean; the last two feature commits contain only the test and target page; the diff check reports no whitespace errors.

- [ ] **Step 2: Verify both public destinations before deployment**

Run:

```powershell
curl.exe -L -s -o NUL -w "%{http_code}" --max-time 20 https://youtu.be/RE8HR9t9n_0
curl.exe -L -s -o NUL -w "%{http_code}" --max-time 20 https://formsuite.dev/formranger/test-google-forms-dynamic-choices-before-launch.html
```

Expected: both commands print `200`. If YouTube remains unreachable from the current network, retain the previously verified public URL but report that this run could not reverify it.

- [ ] **Step 3: Request action-time deployment confirmation**

State that the next command will publish the verified static build to the live FormSuite Cloudflare Worker. Do not deploy before confirmation.

- [ ] **Step 4: Deploy from the isolated worktree after confirmation**

Run:

```powershell
npm run deploy
```

Expected: Wrangler reports a successful deployment for the FormSuite site.

- [ ] **Step 5: Verify the live page**

Run:

```powershell
curl.exe -L -s -o NUL -w "%{http_code}" --max-time 20 https://formsuite.dev/formranger/google-forms-dropdown-not-updating-from-google-sheets.html
```

Expected: `200`. Then inspect the live page and confirm the new video ID, visible proof section, and Alpha/Beta checklist link are present.

- [ ] **Step 6: Refresh supported-engine discovery without claiming ranking**

Submit the changed canonical URL only after the live verification succeeds:

```powershell
$payload = @{ host = 'formsuite.dev'; key = '7a1f17e29fe213d3500d0e9a2e211777'; keyLocation = 'https://formsuite.dev/7a1f17e29fe213d3500d0e9a2e211777.txt'; urlList = @('https://formsuite.dev/formranger/google-forms-dropdown-not-updating-from-google-sheets.html') } | ConvertTo-Json -Depth 3
Invoke-WebRequest -Uri 'https://api.indexnow.org/indexnow' -Method Post -ContentType 'application/json; charset=utf-8' -Body $payload
Invoke-WebRequest -Uri 'https://www.bing.com/indexnow' -Method Post -ContentType 'application/json; charset=utf-8' -Body $payload
```

Expected: each endpoint returns HTTP `200` or `202`. Record this only as discovery notification acceptance, never as indexing, ranking, traffic, or growth.
