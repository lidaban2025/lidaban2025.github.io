# FormSuite Strict QA + Promotion Pass — 2026-06-26

## Verdict

Status: Conditional pass for the Sheet Formula site; promotion may continue for FormFlow and FormRanger with strict claim limits.

Do not claim fresh full runtime QA for FormFlow or FormRanger from this pass. The browser had logged-in Google context, but the critical add-on paths were not completed end-to-end in this run.

## Sheet Formula Helper QA

URL: https://formsuite.dev/sheetformula/

Result: Conditional pass.

Verified:

- Main page returns HTTP 200.
- Support, Privacy, Terms return HTTP 200.
- `robots.txt`, `sitemap.xml`, and `llms.txt` return HTTP 200.
- Sitemap includes:
  - `https://formsuite.dev/sheetformula/`
  - `https://formsuite.dev/sheetformula/support.html`
  - `https://formsuite.dev/sheetformula/privacy.html`
  - `https://formsuite.dev/sheetformula/terms.html`
- `llms.txt` includes the Sheet Formula Helper URLs.
- Page title: `Sheet Formula Helper | Fix, explain, and generate formulas`.
- Meta description, canonical, H1, OG title, and SoftwareApplication schema exist.
- Frontend secret scan passed for common patterns: `OPENAI_API_KEY`, `CLOUDFLARE_API_TOKEN`, `client_secret`, `PRIVATE_KEY`, `cfut_`, `Bearer ...`.
- Real browser UI path completed:
  - Opened production URL.
  - Filled broken VLOOKUP formula.
  - Filled `#N/A` context.
  - Clicked `Generate result`.
  - Result displayed corrected formula: `=IFERROR(VLOOKUP(A2, Products!A:C, 3, FALSE), "")`.
  - Source clearly stated: `local browser rules. AI endpoint was unavailable (API returned 405)`.
- Responsive sweep at 1440, 1280, 1024, 768, 430, 390, 360, 320 found no horizontal overflow.

Issues:

- P1: Production AI endpoint is not active on `formsuite.dev`; `POST /api/formula` returns `405`. The page falls back to local browser rules, so it is usable as a basic formula helper but not a real AI formula tool on the main domain.
- P2: Core buttons are about 40px tall, below the 44px mobile touch target guideline.
- P2: Analytics/event verification was not confirmed in a live analytics dashboard during this pass.

Safe public claim:

- `Sheet Formula Helper is live as a browser-based formula fixer/explainer/generator with local fallback rules.`

Avoid:

- `AI formula tool fully launched`.
- `production AI tested`.
- `complete QA passed`.

## FormFlow QA

Product: FormFlow - Approval Workflow for Google Forms™
Marketplace App ID: `1082615279531`
Marketplace URL: https://workspace.google.com/marketplace/app/formflow_approval_workflow_for_google_fo/1082615279531

Result: Partial / blocked for fresh runtime QA.

Observed:

- Logged-in Google browser context exists.
- FormFlow Marketplace listing is reachable and title is visible.
- Existing approval-page tabs are reachable, but the currently inspected approval page showed only the Apps Script wrapper text in the parent document:
  - `This application was created by a Google Apps Script user`
  - `Report abuse`
  - `Learn more`
- Several current/old FormFlow approval URLs in the browser had `userCodeAppPanel?createOAuthDialog=true` iframes, consistent with the earlier authorization-wrapper blocker.

Conclusion:

- This pass does not prove a fresh approve/reject → Sheet writeback runtime success.
- Continue promotion only with careful wording based on earlier verified flows, not as a new complete pass.

Safe claim for promotion:

- `FormFlow turns Google Forms submissions into approval workflows with email decision links and linked-Sheet status tracking.`

Avoid:

- `fresh runtime pass completed today`.
- `fully tested`.
- `approve/reject writeback reverified today`.

## FormRanger QA

Product: FormRanger Pro - Dynamic Choice Sync
Marketplace URL: https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524

Result: Partial / blocked for fresh runtime QA.

Observed:

- Logged-in Google Forms editor is visible for `QA Runtime Test FormGuard FormRanger 2026-06-07`.
- The Google Forms editor account shows `lidaban2025@gmail.com`.
- Add-ons menu is visible and contains:
  - `FormFlow - Approval Workflow for Google Forms™`
  - `FormGuard - Response Limits for Google Forms™`
  - `FormNotifier - Smart Form Notifications`
  - `FormRanger Pro - Dynamic Choice Sync`
- Attempted to open FormRanger from the Add-ons menu via DOM click and coordinate click, but the current tool-visible session did not open the FormRanger center menu/sidebar.
- No FormRanger sidebar iframe was present after the attempt.

Conclusion:

- This pass confirms logged-in editor access and add-on menu presence, but does not complete the required FormRanger loop: Configure → mapping → Save → Preflight → Update now → editor/public preview choices.
- Existing earlier runtime pass remains useful historical evidence, but do not call this pass a fresh full test.

Safe claim for promotion:

- `FormRanger is for updating Google Forms choices from Google Sheets through a sidebar workflow with preflight/update checks.`

Avoid:

- `fresh full sync QA passed today`.
- `all question types verified`.
- `fully tested`.

## Promotion Scan

### FormFlow

Marketplace listing:

- URL reachable.
- Title visible: `FormFlow - Approval Workflow for Google Forms™ - Google Workspace Marketplace`.
- Static fetch contains review/rating/update-related page content markers.

Today’s Q&A scan:

- StackExchange API search for approval workflow did not return a strong new candidate in this pass.
- Continue using existing manual-only FormFlow answer drafts from the daily reports, not duplicate weak threads.

Recommended next FormFlow action:

- Priority remains Marketplace conversion and tester/review recruitment after real successful workflows.
- Do not spend more time on generic directories unless a no-login confirmation path is clear.

### FormRanger

Marketplace listing:

- URL reachable.
- Title visible: `FormRanger Pro - Dynamic Choice Sync - Google Workspace Marketplace`.
- Static fetch contains review/rating/update-related page content markers.

StackOverflow candidate scan found closer technical threads:

1. `https://stackoverflow.com/questions/78084924/invalid-conversion-from-item-type-list-error`
   - Fit: Apps Script list/item conversion around form choice values.
   - Status: candidate_policy_risk; answer should lead with Apps Script fix, only disclose FormRanger as optional no-code path if appropriate.
2. `https://stackoverflow.com/questions/76141267/populate-google-form-with-short-question-from-google-sheets-app-script`
   - Fit: populating Google Form from Sheets.
   - Status: candidate_policy_risk; likely technical answer first, product mention only if natural.
3. `https://stackoverflow.com/questions/68079753/behaviour-of-google-form-script-to-set-choice-values-adds-unwanted-to-string-in-the-souce`
   - Fit: setChoiceValues/source parsing issue.
   - Status: candidate_policy_risk.
4. `https://stackoverflow.com/questions/59870477/converting-create-multiple-choice-form-question-from-spreadsheet-script-to-cr`
   - Fit: multiple choice / checkbox generation from spreadsheet.
   - Status: candidate_policy_risk.

Draft pattern for FormRanger answers:

```text
For this specific Apps Script pattern, the safer approach is to build a flat string array first, trim blanks, then pass that array to the Forms choice API. Do not pass a 2D range array directly.

Example pattern:

const values = sheet.getRange('A2:A').getValues()
  .flat()
  .map(String)
  .map(v => v.trim())
  .filter(Boolean);

item.asMultipleChoiceItem().setChoiceValues(values);

Then test on a copied form and open the public preview, because the editor can look updated before a respondent sees the expected choices.

Disclosure: I work on FormRanger, a Google Forms add-on for the same Sheets-to-Forms choice-sync workflow. The Apps Script approach above works without my add-on; FormRanger is only relevant if you want a sidebar workflow with preflight/update checks:
https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524
```

Do not post automatically without final approval and a usable logged-in posting context.

## Next Actions

P0 / P1:

1. Fix Sheet Formula production API if the product should be promoted as an AI tool. Current main domain is GitHub Pages and `POST /api/formula` returns 405.
2. Run a fresh FormFlow approval test only after the Apps Script approval-page authorization wrapper is resolved or a controllable authorized browser context is confirmed.
3. Run a fresh FormRanger sync test from a stable Google Forms UI session where the Add-ons menu actually opens the FormRanger submenu/sidebar.

P2:

1. Increase Sheet Formula mobile button min-height to at least 44px.
2. Verify analytics events for `tool_start`, `tool_success`, and `copy_formula` in the analytics dashboard.
3. Prepare FormRanger StackOverflow manual answer drafts for the four candidates above, but post only after checking each thread’s freshness, rules, and account context.

## Claim Gate

Allowed now:

- Sheet Formula: live browser fallback tool.
- FormFlow/FormRanger: continue careful promotion and tester recruitment.

Not allowed now:

- `fully tested` for either plugin.
- `production AI formula site fully tested`.
- automatic public posting or review requests before a real successful product-specific workflow.
