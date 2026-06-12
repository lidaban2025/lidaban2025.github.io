# FormRanger next promotion actions — no website edits

Date: 2026-06-12

This is a promotion-only plan. Do not modify website HTML from this document.

## Current state

- Product runtime loop: passed.
- Website edits: stop here; do not keep changing the homepage.
- Search Console manual actions: blocked by user/IP friction.
- Stack Overflow: blocked by Cloudflare/IP restriction.
- Marketplace console: wrong project/listing target risk exists; do not touch without verifying the target again.
- No-login directory: ActiveSearchResults already confirmed.

## Best next actions

### A. Low-risk actions that can still be done without website edits

1. **Prepare review request follow-ups**
   - Use only after a real user successfully syncs choices.
   - Keep it short and support-first.
   - Asset: `marketing/formranger-review-request-templates-2026-06-12.md`

2. **Prepare one manual answer pack for each major intent**
   - Google Forms dropdown from Sheets
   - Google Forms multiple choice from Sheets
   - Google Forms checkbox list from Sheets
   - Google Forms choices plus capacity limits
   - Asset: `marketing/formranger-offsite-answer-pack-2026-06-12.md`

3. **Keep tracker/ledger updated**
   - Record what was blocked, confirmed, or only drafted.
   - Do not count CAPTCHA or unclear flows as success.
   - Asset: `marketing/formranger-low-install-channel-tracker-2026-06-12.csv`
   - Asset: `marketing/formranger-promotion-execution-log-2026-06-12.md`

### B. Next external submission candidates worth checking

These were probed and may be worth further manual review if they fit the product and allow submission without account friction:

- **DevHunt** — submit page exists and appears reachable.
- **Microlaunch** — submit/pricing page reachable; verify whether a free or meaningful submission path exists.
- **BetaList** — probe timed out; may need a direct browser/manual check.

Lower priority / friction-heavy:

- SaaSHub — login/GitHub friction.
- TinyStartups — sign-in friction.
- Uneed — login/payment friction.
- AlternativeTo — direct add page returned 403.
- StartupBase — sign-in/login friction.
- Launched — SSL issue in probe; recheck only if needed.

### C. What to do next if you want more installs without touching the website

1. **Check DevHunt submission flow**
   - Verify whether it needs login, approval, or a public launch date.
   - If submission is possible, use the existing product summary and the Marketplace/guide links only.

2. **Check Microlaunch submission flow**
   - See whether it accepts a tool listing and what fields are required.
   - Use the marketplace URL as the canonical conversion target if they allow it.

3. **Re-check BetaList**
   - Only if it has a non-login submission path.
   - Stop immediately if it asks for account creation or payment.

## Messaging rule

- Prefer one clear product sentence.
- Use one relevant link.
- Do not mention the whole FormSuite catalog unless the channel allows it.
- Never claim the product is a booking engine or live inventory lock.

## The honest answer on profit

FormRanger can make money only if it gets enough installs and enough successful users to justify a paid tier or bundle. The cleanest money path is still:

- FormRanger as the discovery product,
- FormGuard as the paid control product,
- reviews and Marketplace trust as the conversion layer.

If you want the next concrete work item, the most useful one is to verify whether DevHunt or Microlaunch can accept a FormRanger submission without login friction.
