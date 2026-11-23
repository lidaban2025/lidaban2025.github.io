# FormFlow submission candidate — 15 November 2026

The isolated candidate now replaces both last-row writes in new-submission processing with a guarded resolver. It also serializes submission handling with a script lock and prevents a second dispatch when the matched row already contains an approval ID. The implementation is in `scripts/formflow-candidate/SubmissionSafety.js`; the reproducible candidate builder copies it into the private audit candidate, without publishing or changing any Google project.

The resolver checks that the event form's destination is the selected spreadsheet, verifies the response ID is unique among Forms responses within its second, reads unformatted numeric Sheets timestamps, converts using the spreadsheet time zone and requires exactly one matching row. It refuses same-second collisions, unknown/multiple Timestamp columns, missing rows, missing timestamp precision, large scans and nearby time-zone clock changes. It requires an English `Timestamp` header. This is a conservative experimental guard; it needs real Forms/Sheets tests for precision, synchronization and visibility before release. The lock does not prevent people from sorting or editing the sheet concurrently; that remains an acceptance concern.

Failures save up to20 response references per Google user and form, containing only response ID and first-seen time in Google User Properties. The add-on menu gains a manual `Retry oldest unsent request` action for the current form. A successful retry clears its reference; ambiguous or failed retries preserve it. The bounded list never evicts earlier references to make room. Storage failure/full-list errors are reported for owner recovery. These are not background retries, and there is no guarantee of eventual delivery.

An existing approval record blocks automatic resend even if the earlier send result is uncertain. A crash between reservation and email can therefore require owner inspection. This deliberately avoids claiming exactly-once email delivery. Form submission reports now distinguish actual creation from quota/disabled outcomes.

## Local validation

Run with `FORMFLOW_AUDIT_ROOT` pointing at the private ignored audit directory:

```
node scripts/prepare-formflow-84-audit-candidate.cjs
node --test tests/formflow-license-snapshot.test.cjs tests/formflow-submission-row.test.cjs
node scripts/check-appsscript-release-snapshot.mjs <private-candidate-directory>
```

29 tests pass using synthetic keys, responses, sheets, locks, and network mocks. They cover the original84 activation and row defects, candidate licensing, scoped manual decision sync, delayed-response row selection, duplicate dispatch, collisions, non-UTC spreadsheet time, lost millisecond precision, lock release, bounded recovery and cross-form preservation. The static named-service scope scan passes. They do not prove Google OAuth approval, a current-version real trigger, Creem webhook delivery or live payment/refund.

## Release status

No Google source, Marketplace configuration, checkout, webhook or public plugin version was changed. FormFlow83 is still the user-reported published version; this run has no direct current Console readback. A connected authenticated browser-control tool is not exposed in this session. The corrected source remains a local candidate pending real Google and merchant acceptance; existing Google project source is not overwritten to obtain a test result.

References: [Google submission event types](https://developers.google.com/apps-script/guides/triggers/events), [Form responses and timestamps](https://developers.google.com/apps-script/reference/forms/form-response), [Sheets numeric versus formatted dates](https://developers.google.com/workspace/sheets/api/reference/rest/v4/DateTimeRenderOption).
