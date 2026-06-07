# FormGuard + FormRanger live baseline QA — 2026-06-07

## Version snapshot

- Snapshot time: 2026-06-07 08:51 UTC
- Repository: `lidaban2025/lidaban2025.github.io`
- Branch: `main`
- Commit tested: `2f89572` — `Unify FormSuite guide styling and remove duplicate guide section`
- Production host: `https://formsuite.dev/`
- Scope: public production pages, install links, Marketplace listing reachability, metadata/schema, declared feature inventory, and support/compliance pages.
- Runtime update: a logged-in Google Forms browser session was later used for FormRanger manual smoke testing; results are recorded below. FormGuard runtime testing remains pending.

## Current declared feature inventory

### FormGuard

Source evidence: `formguard/index.html`, `formguard/permissions.html`, `formguard/privacy-policy.html`, `formguard/terms-of-service.html`, Marketplace listing metadata.

Current baseline feature items:

- Response/capacity control for Google Forms signups.
- Per-choice quotas for sessions, roles, appointment slots, signup options, dropdown items, multiple-choice items, and checkbox items.
- Time-slot/session capacity workflows.
- Closed/full message shown to visitors after a quota/limit is reached.
- Owner alerts / owner notifications when enabled.
- Manual close/reopen actions, based on terms page wording.
- Safe launch path: test a copied form with tiny quotas before using a live form.
- Public install path through Google Workspace Marketplace.
- Support and permissions pages available.

Boundary notes:

- The public product page says native Google Forms response limits may be enough for simple total caps; FormGuard is positioned for per-choice quotas, close messages, alerts, and launch testing.
- The repository checked here is the public site/marketing/compliance repo. It does not contain the Apps Script implementation, so code-level verification of quota logic was not possible from this workspace.

### FormRanger

Source evidence: `formranger/index.html`, `formranger/permissions.html`, `formranger/privacy.html`, `formranger/terms.html`, Marketplace listing metadata.

Current baseline feature items:

- Sync selected Google Sheets columns into Google Forms choices.
- Supported question types declared: dropdown, multiple choice, checkbox, multiple-choice grid, and checkbox grid choices.
- One-question first-run workflow: select source, run Preflight, update, check public preview.
- Preflight checks for file access, sheet tab, column, and question mapping before changing choices.
- Update now / choice refresh workflow.
- Public respondent preview verification after update.
- Use cases: class rosters/groups, sessions/locations, product/item lists.
- Public install path through Google Workspace Marketplace.
- Support, permissions, privacy, terms, troubleshooting, demo, and review-after-success paths available.

Boundary notes:

- FormRanger is explicitly not a booking system, inventory lock, payment system, or respondent-time conditional/dependent dropdown filter.
- It updates choices from selected spreadsheet data before respondents use the form.
- The repository checked here is the public site/marketing/compliance repo. It does not contain the Apps Script implementation, so code-level verification of Sheet-to-Form mutation logic was not possible from this workspace.

## Automated live checks

### Production page availability

All seed pages returned HTTP 200:

- `https://formsuite.dev/`
- `https://formsuite.dev/formguard/`
- `https://formsuite.dev/formguard/google-forms-response-limit.html`
- `https://formsuite.dev/formguard/google-forms-choice-limit.html`
- `https://formsuite.dev/formguard/permissions.html`
- `https://formsuite.dev/formguard/support.html`
- `https://formsuite.dev/formguard/privacy-policy.html`
- `https://formsuite.dev/formguard/terms-of-service.html`
- `https://formsuite.dev/formranger/`
- `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html`
- `https://formsuite.dev/formranger/auto-update-google-forms-dropdown-from-google-sheets.html`
- `https://formsuite.dev/formranger/formranger-alternative-google-forms.html`
- `https://formsuite.dev/formranger/permissions.html`
- `https://formsuite.dev/formranger/support.html`
- `https://formsuite.dev/formranger/privacy.html`
- `https://formsuite.dev/formranger/terms.html`
- `https://formsuite.dev/resources/demo-videos.html`

### Key link check

- Unique links checked from the seed pages: 56
- Failures found: 0
- Install links checked:
  - FormGuard: `https://workspace.google.com/marketplace/app/formguard_google_forms_allinone/410120194423` → HTTP 200, redirects to canonical Marketplace listing.
  - FormRanger: `https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524` → HTTP 200.
- Demo links checked:
  - FormGuard YouTube demo: HTTP 200.
  - FormRanger YouTube demo: HTTP 200.

### Marketplace listing availability

FormGuard Marketplace listing:

- URL checked: `https://workspace.google.com/marketplace/app/formguard_google_forms_allinone/410120194423`
- HTTP status: 200
- Final URL: `https://workspace.google.com/marketplace/app/formguard_response_limits_for_google_for/410120194423`
- Title observed: `FormGuard - Response Limits for Google Forms™ - Google Workspace Marketplace`
- Description observed: `Control Google Forms™ signups with response caps, choice quotas, clear closed messages, owner alerts, and manual Close/Reopen.`
- Install text present: yes

FormRanger Marketplace listing:

- URL checked: `https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524`
- HTTP status: 200
- Final URL: same as checked URL
- Title observed: `FormRanger Pro - Dynamic Choice Sync - Google Workspace Marketplace`
- Description observed: `Sync choices for Google Forms™ from selected Google Sheets™ ranges.`
- Install text present: yes

### SEO / metadata / structured data

FormGuard product page:

- HTTP status: 200
- Title: `FormGuard | Google Forms choice quotas and capacity controls`
- Meta description present.
- Canonical: `https://formsuite.dev/formguard/`
- H1: `Capacity controls for Google Forms signups.`
- Open Graph tags present.
- JSON-LD present and parseable.

FormRanger product page:

- HTTP status: 200
- Title: `FormRanger | Sync Google Forms choices from Sheets`
- Meta description present.
- Canonical: `https://formsuite.dev/formranger/`
- H1: `Sync Google Forms choices from Sheets.`
- Open Graph tags present.
- JSON-LD present and parseable, including SoftwareApplication and FAQPage graph.

Robots and sitemap:

- `https://formsuite.dev/robots.txt` returned HTTP 200 and allows crawling.
- `https://formsuite.dev/sitemap.xml` returned HTTP 200.

### Browser rendering smoke test

FormGuard page:

- Browser loaded `https://formsuite.dev/formguard/` successfully.
- H1, key capability chips, Marketplace CTA, response-limit guide CTA, support link, and embedded demo area rendered.
- Observed key capabilities: Choice quotas, Time-slot limits, Close messages, Owner alerts.

FormRanger page:

- Browser loaded `https://formsuite.dev/formranger/` successfully.
- H1, Marketplace CTA, setup guide CTA, demo CTA, support link, permissions link, review guidance, FAQ, and boundary section rendered.
- Observed key workflow text: Select a source column, Run Preflight, Check public preview.
- Observed Marketplace links: 3 links to the FormRanger Marketplace listing.

## Issues found

### QA-001 — Root-level privacy/terms URLs are 404

- Severity: Low
- Category: Compliance/navigation hygiene
- URLs checked:
  - `https://formsuite.dev/privacy.html` → 404
  - `https://formsuite.dev/terms.html` → 404
- Product-specific policy pages are OK:
  - `https://formsuite.dev/formguard/privacy-policy.html` → 200
  - `https://formsuite.dev/formguard/terms-of-service.html` → 200
  - `https://formsuite.dev/formranger/privacy.html` → 200
  - `https://formsuite.dev/formranger/terms.html` → 200
- Recommendation: optional. Add root-level policy hub pages or redirects only if Marketplace/GCP OAuth brand configuration or user-facing footer needs root URLs. Product-specific pages already work.

### QA-002 — Old FormGuard Marketplace slug returns 400

- Severity: Low
- Category: External URL hygiene
- URL checked: `https://workspace.google.com/marketplace/app/formguard/738107142097`
- Result: HTTP 400
- Current correct URL works: `https://workspace.google.com/marketplace/app/formguard_google_forms_allinone/410120194423` → HTTP 200.
- Recommendation: avoid using the old slug in future docs, tracker rows, or external replies. Current site links use the correct URL.

## Blocked / manual verification required

The following cannot be honestly marked as passed without a logged-in Google Workspace session and test Forms/Sheets files:

### FormGuard manual smoke tests

1. Install/open FormGuard inside a copied Google Form.
2. Configure a total response limit of 1 or 2.
3. Submit from public respondent view until the cap is reached.
4. Confirm the form closes or displays the configured closed message.
5. Configure one choice quota on a dropdown/multiple-choice/checkbox item.
6. Submit enough responses to fill one option.
7. Confirm only that option/session becomes unavailable or blocked according to the product behavior.
8. Enable owner notification and confirm an email/alert arrives.
9. Test manual Close and Reopen actions.
10. Confirm a copied form with tiny quotas passes before applying to a real form.

### FormRanger runtime smoke test — attempted

Environment:

- Test form: `QA Runtime Test FormGuard FormRanger 2026-06-07`
- Test form ID: `1UlmYMYWCK_kZdkK4LVo516JZb-lk-B3GLy7tjI-inDQ`
- Question tested: `Choose a sessionUntitled Question`
- Starting visible choices: `Alpha`, `Beta`
- Add-on opened from Google Forms Add-ons menu: PASS
- FormRanger sidebar loaded: PASS
- Source spreadsheet picker state visible in sidebar: PASS

Observed run:

1. Existing linked question card was visible in FormRanger.
2. Mapping shown by the linked question card: `Sheet1 -> Timestamp`.
3. `Save` executed and status changed to `Saved. Run Preflight.`
4. `Preflight` executed and returned: `Preflight passed. Mappings: 1. Next: Update now.`
5. `Update now` executed and returned: `Update finished with 0 updated, 0 skipped, and 0 error(s). No choices changed. Run Preflight and check the source column.`
6. Google Forms editor still showed the choices `Alpha` and `Beta`; no actual choice mutation occurred.
7. Follow-up classification test: clicked the linked card `Remove` button multiple times at the visible button center and nearby offsets.
8. Result after repeated `Remove` attempts: the linked question card `Sheet1 -> Timestamp` remained visible; there was no deletion, confirmation dialog, success message, or visible state change.

Runtime verdict:

- Add-on launch inside Google Forms: PASS.
- Sidebar render and mapping visibility: PASS.
- Save action: PASS.
- Preflight action: PASS.
- Update now action execution: PASS.
- Actual Sheet-to-Form choice sync: FAIL / NOT VERIFIED, because the active saved mapping still points to `Sheet1 -> Timestamp` instead of the intended option source column.
- Mapping management: FAIL / PRODUCT-SIDE DEFECT SUSPECTED. The visible `Remove` control did not remove the stale mapping after repeated clicks, so the tester could not cleanly replace the bad source column with `Order` from the sidebar.
- Public respondent preview verification: NOT RUN, because the editor choices did not change after Update now.

Defect classification:

- This is not yet proof that the core sync engine is broken, because the only executed update used the wrong saved source column.
- It is, however, a product-side functional/UX defect in mapping management: a stale mapping can remain stuck on `Sheet1 -> Timestamp`, the visible `Remove` action does not clear it, and the user cannot reliably replace it with the intended `Order` column through the observed sidebar workflow.
- Severity: P1 for FormRanger launch quality, because first-run users who choose the wrong column or inherit a stale mapping can reach a state where Preflight passes but Update makes no changes.

Follow-up required before marking FormRanger fully passed:

1. Fix or verify the `Remove` / edit mapping flow so stale mappings can be cleared.
2. Save a mapping to the real option source column, expected to be `Order` in the current sample sheet selector.
3. Rerun `Preflight` and `Update now`.
4. Confirm the editor choices change from `Alpha` / `Beta` to the source column values.
5. Confirm the public respondent preview shows the same updated choices.
6. Repeat for checkbox and at least one grid type before claiming full supported-type coverage.

## Current release baseline conclusion

- Public production site health: PASS.
- Key public links and Marketplace install paths: PASS.
- Product pages render and carry correct core positioning: PASS.
- SEO/canonical/Open Graph/JSON-LD smoke checks: PASS for main product pages.
- FormRanger runtime behavior inside Google Forms/Sheets: FAIL/PARTIAL. Launch, Save, Preflight, and Update now executed, but actual choice sync did not pass because the saved mapping pointed to `Sheet1 -> Timestamp`; repeated attempts to remove that stale mapping did not change the sidebar state.

## Recommended next step

Fix FormRanger mapping management first: the stale `Sheet1 -> Timestamp` linked question must be removable or editable before retesting the sync path. Then rerun the FormRanger sync test until editor and respondent preview choices actually change, and run the remaining FormGuard runtime tests in the same logged-in Google account.
