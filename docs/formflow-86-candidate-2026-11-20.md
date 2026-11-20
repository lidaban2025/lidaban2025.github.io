# FormFlow 86: controlled acceptance candidate

Version 86 is an immutable Apps Script candidate, saved to the Marketplace **draft** for the two existing tester accounts. It has not replaced the public listing or the approval Web App deployment.

The previous writer read a whole response row and wrote it back with RAW values. That could retype native timestamps or overwrite concurrently edited answers. The candidate writes individual approval metadata cells in one batch and rejects invalid rows, unknown metadata keys, missing or duplicate metadata headers, and question titles colliding with reserved approval columns.

A direct host-menu entry opens the linked-response-spreadsheet Picker when the sidebar-to-modal path does not display a dialog. The sidebar identifies its setup Google account and shows the build date. It no longer reports that Picker opened merely because the server call returned.

Validation: 36 targeted local behavioral checks passed; the existing website npm test chain and 2,669 local-link checks passed. Immutable version 86 was fetched again and all 23 source files matched the private candidate. The prior Google HEAD matched the owned version-85 candidate before upload.

Observed browser result: the new direct menu displayed the real Google Picker; the synthetic linked responses spreadsheet was selected through it. Actual submission, email, approval, payment and refund acceptance are still in progress. This is implementer evidence, not independent or blind QA.

The external-request scope remains pending Google verification. The test account's full English authorization flow was captured locally after its user-completed identity verification; it must be combined with actual feature evidence and checked before review submission. Raw private snapshots and recordings are excluded from Git.
