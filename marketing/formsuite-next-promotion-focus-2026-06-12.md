# FormSuite next promotion focus — FormGuard + FormRanger

Date: 2026-06-12

This is a promotion-only document. Do not modify website HTML from this plan unless explicitly requested.

## Current product confidence

Both products are now past the "can we promote this at all?" stage, but the public wording should stay careful:

- **FormGuard**: promote as a Google Forms control add-on for response limits, choice/seat caps, close dates, notifications, and timer-style workflows. Avoid saying bug-free or universally race-condition-proof.
- **FormRanger**: promote as a Google Forms add-on for syncing choices from Google Sheets. Say the real Google Forms add-on workflow passed; do not say fully tested in every edge case.

## Main bottleneck

The bottleneck is no longer core implementation. The bottleneck is distribution:

1. Marketplace conversion
2. reviews from successful users
3. high-intent Q&A/community answers
4. confirmed no-login directory/indexing paths
5. small, targeted paid search only after review/conversion assets improve

## Completed in this batch

Submitted FormGuard to ActiveSearchResults and received confirmation for:

- `https://formsuite.dev/formguard/`
- `https://formsuite.dev/formguard/google-forms-response-limit.html`
- `https://formsuite.dev/formguard/google-forms-choice-limit.html`

Status is recorded in `marketing/promotion-tracker.csv` as `submitted_confirmation`.

## Next concrete actions

### P0 — Marketplace trust and conversion

- Verify public Marketplace titles/descriptions for both products.
- Do not edit the wrong listing: FormGuard and FormRanger must be checked separately.
- Screenshot order should show the actual workflow, not generic marketing:
  - FormGuard: limit setup → quota/cap setting → notification/closed message → public behavior.
  - FormRanger: source Sheet → mapping sidebar → preflight → update → public preview.

### P0 — Reviews

Use review requests only after a real successful user action:

- FormGuard: after a user successfully closes/limits a real form.
- FormRanger: after a user successfully syncs choices and verifies public preview.

Do not ask random users for reviews.

### P1 — Manual high-intent answers

Use existing drafts and one link only. Prefer technical/helpful content first:

- FormGuard: Google Forms response limit, close after N responses, choice quota, seats per option.
- FormRanger: Google Forms choices/dropdown/multiple-choice from Google Sheets.

Do not spam duplicate answers across Reddit/Quora/StackExchange.

### P1 — Search Console / indexing

Retry from a normal local browser when available:

- FormGuard core pages already have some indexed/requested status in tracker.
- FormRanger import guide was previously unknown to Google and request was not confirmed.

Do not claim indexing unless Search Console actually confirms it.

### P2 — Launch directories

Skip paid/generic launch directories unless there is a clear reason.

- DevHunt: not worth paying right now.
- Microlaunch: not worth paying right now.
- BetaList/TinyStartups/SaaSHub/Uneed: only use if free path is clear and confirmation is visible.

## Spending rule

Do not spend money on generic launch directories now. If spending later, prioritize narrowly targeted Google Search ads around high-intent queries such as:

- `google forms limit responses`
- `google forms close after 100 responses`
- `google forms choice limit`
- `google forms dropdown from google sheets`
- `auto update google forms dropdown from sheets`

Only test ads after Marketplace copy/screenshots/review path are in better shape.
