# FormGuard runtime smoke checklist

Date: 2026-06-13

Purpose: focused runtime smoke before stronger review pushes or paid ads. This does not block low-risk promotion, but it gates stronger claims.

## Product

FormGuard — Response Limits for Google Forms

Marketplace URL:

https://workspace.google.com/marketplace/app/formguard_google_forms_allinone/410120194423

## Test rule

Use a copied Google Form, not a live user form. Use tiny limits so the test can be completed quickly.

Do not mark a step passed from code or screenshots alone. For close/limit behavior, verify in the public respondent form view.

## Environment to record

- Google account:
- Test form name:
- Test form URL:
- Public respondent URL:
- FormGuard listing/version/date observed:
- Browser:
- Date/time:

## P0 smoke path — total response limit

1. Create or copy a simple Google Form.
2. Add one required short-answer or multiple-choice question.
3. Open FormGuard from the Google Forms add-on menu/sidebar.
4. Configure total response limit: `1` or `2`.
5. Configure a clear closed/full message, for example:
   - `This test form is now full.`
6. Save the FormGuard configuration.
7. Open the public respondent URL in a fresh tab/window.
8. Submit one response.
9. If limit is `1`, reload/open the public respondent URL again.
10. Verify the form is closed or the configured closed/full message appears.
11. Record exact observed message.

Pass criteria:

- The configured cap takes effect in respondent view.
- The form does not keep accepting beyond the configured cap in the tested single-user path.
- The visible closed/full message is understandable.

## P0 smoke path — manual Close / Reopen

1. From the Google Forms editor, run FormGuard manual Close.
2. Open/reload public respondent URL.
3. Confirm respondents cannot submit, or the form shows the configured closed message.
4. Run FormGuard manual Reopen.
5. Open/reload public respondent URL.
6. Confirm the form can accept a test response again if the response cap does not block it.

Pass criteria:

- Close takes effect in public respondent view.
- Reopen takes effect in public respondent view.

## P1 smoke path — per-choice quota

1. Create a multiple-choice or dropdown question: `Choose a session`.
2. Add options:
   - `Session A`
   - `Session B`
3. Configure a quota for `Session A`, for example `1`.
4. Save configuration.
5. Open public respondent URL.
6. Submit a response choosing `Session A`.
7. Open/reload public respondent URL.
8. Confirm `Session A` is unavailable, blocked, hidden, or otherwise handled according to product behavior.
9. Confirm `Session B` remains available if it has capacity.
10. Record exact observed behavior.

Pass criteria:

- Filling one option affects that option/session only, not unrelated options.
- Respondent-facing behavior is clear enough for a normal user.

## P1 smoke path — owner notification

1. Enable owner notification if available in current public build.
2. Submit a test response.
3. Check the owner inbox/spam for notification.
4. Record sender, subject, and whether it arrived.

Pass criteria:

- Notification arrives within a reasonable time, or if the public build does not expose this setting, record as not available rather than failed.

## P1 negative checks

- If a cap is disabled, the form should behave normally.
- If configuration is saved with an impossible/blank quota, the UI should block save or show a clear error.
- If a copied form has no responses, limits should not falsely mark it full.

## Evidence to capture

- Screenshot: FormGuard configuration screen after save.
- Screenshot: public form before cap is reached.
- Screenshot: public form after cap is reached.
- Screenshot: manual close state.
- Screenshot: manual reopen state.
- If notifications are tested: screenshot of received email with private info redacted.

## Promotion decision after smoke

If P0 total response limit and manual Close/Reopen pass:

- Stronger FormGuard response-limit promotion is allowed.
- Review requests may be sent to users only after their own successful setup.

If P1 per-choice quota also passes:

- Stronger per-option/seat-cap promotion is allowed.

Still avoid:

- bug-free
- race-condition-proof
- all simultaneous over-cap submissions guaranteed blocked
- production-proven for every Google Forms setup
