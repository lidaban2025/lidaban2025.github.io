# FormSuite promotion QA gate — FormGuard + FormRanger

Date: 2026-06-13

This is a promotion-only QA gating note. Do not modify website HTML from this note unless explicitly requested.

## Short verdict

Continue promotion, but keep claims careful and run focused runtime smoke tests before stronger review pushes or paid ads.

Promotion should not wait for exhaustive edge-case testing. It should be gated by whether the core user promise has been verified enough for the channel and claim being used.

## Product gate status

### FormRanger

Status: promotion allowed with careful wording.

Evidence:

- Later runtime QA pass recorded in `qa/formranger-runtime-qa-pass-2026-06-12.md` supersedes the earlier blocked result.
- Real Google Forms add-on path passed: editor opened, add-on menu listed, center menu opened, Configure opened the real sidebar, stale mapping removed, new mapping saved, Preflight passed, updates enabled, Update now returned `1 question(s) updated`, and public/respondent preview showed `Alpha` / `Beta`.
- Cleanup was recorded: temporary QA runner/shims/scopes removed; local regression recorded as `12/12 tests passed`.

Allowed promotion wording:

- Sync Google Forms choices from Google Sheets.
- Safer setup path with Save, Preflight, Update now, and public preview verification.
- Useful for dropdowns, multiple choice, checkboxes, and grid-style choice workflows when lists change often.

Avoid:

- bug-free
- works in every domain
- fully production-proven for every possible Forms setup
- replaces every Apps Script workflow

Recommended next retest before stronger claims:

1. Clean copied Google Form + clean source Sheet.
2. Map one dropdown from a real option column.
3. Save, Preflight, Update now.
4. Verify editor choices and public preview choices.
5. Repeat at least checkbox and one grid type before claiming full supported-type coverage.

### FormGuard

Status: promotion allowed for problem/intent and Marketplace discovery; stronger claims should wait for a fresh runtime smoke pass.

Evidence:

- Public site, support, privacy, terms, core guides, and Marketplace install path are reachable.
- Core pages returned HTTP 200 in a 2026-06-13 smoke check:
  - `https://formsuite.dev/formguard/`
  - `https://formsuite.dev/formguard/google-forms-response-limit.html`
  - `https://formsuite.dev/formguard/google-forms-choice-limit.html`
  - `https://formsuite.dev/formguard/support.html`
  - `https://formsuite.dev/formguard/privacy-policy.html`
  - `https://formsuite.dev/formguard/terms-of-service.html`
  - Marketplace listing canonical redirect returned HTTP 200.
- Earlier baseline explicitly said FormGuard runtime quota/close behavior was not yet run in that session.

Allowed promotion wording:

- Google Forms add-on for response limits, choice/seat caps, close messages, owner alerts, and manual close/reopen workflows.
- Built for event registration, class signup, appointment slots, workshop capacity, and waitlist/closed-message workflows.
- Tell users to test copied forms with tiny quotas before using a live form.

Avoid until fresh runtime pass:

- bug-free
- race-condition-proof
- all quota edge cases tested
- guaranteed to block every simultaneous over-cap submission
- production-proven for all Google Forms workflows

Recommended runtime smoke before review push / paid ads:

1. Install/open FormGuard inside a copied Google Form.
2. Configure total response limit of 1 or 2.
3. Submit from public respondent view until cap is reached.
4. Confirm the form closes or shows configured closed/full message.
5. Configure one choice quota on a dropdown/multiple-choice/checkbox item.
6. Submit enough responses to fill one option.
7. Confirm only that option/session becomes unavailable or blocked according to product behavior.
8. Enable owner notification and confirm alert/email behavior if available.
9. Test manual Close and Reopen.
10. Confirm the copied-form tiny-quota test passes before applying to real user forms.

## 2026-06-13 live availability smoke check

Result: core public pages and Marketplace listings were reachable.

- FormGuard product and core guide/support/legal pages: HTTP 200.
- FormRanger product and core guide/support/legal pages: HTTP 200.
- FormGuard Marketplace install URL: HTTP 200 and redirects to canonical listing.
- FormRanger Marketplace install URL: HTTP 200.

## Promotion execution rule

Keep promoting both products, but match the claim to the test evidence:

- For directory submissions, educational answers, and Marketplace discovery: continue now.
- For review requests: ask only after a user completes the relevant success action.
- For paid ads or strong conversion claims: first complete the focused runtime smoke tests above, especially FormGuard.

## Do not do

- Do not pause all promotion waiting for exhaustive testing.
- Do not modify website HTML from this note.
- Do not spend money on generic launch directories.
- Do not claim indexing, reviews, or runtime success unless directly verified.
