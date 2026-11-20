# FormSuite closeout — 20 November 2026

This is an evidence ledger, not a claim that every plugin passed acceptance.

## Verified current facts

- Normal Google Cloud UI: FormGuard configuration71 and FormFlow83 store pages say published without a draft banner. Choice Sync initially showed116 with a draft banner; the developer and test accounts are draft testers. That does not establish the ordinary user's public script version.
- Pulled immutable Choice116/117, Guard71 and Flow83/84 into private snapshots. Other plugin HEAD snapshots are development-state evidence only.
- Choice116 actually reports Free mappingLimit=-1. A candidate based on116 restores the advertised three-question limit, guards direct bulk saves, serializes mapping edits, retains existing over-cap configurations without allowing growth, recovers a late Picker selection, and persists save failures.
- Eleven boundary/Picker tests and the existing25 license mocks passed. In a real new synthetic Google Form the corrected sidebar shows Free3/3; adding the fourth mapping returns `This plan allows up to 3 linked question(s).` The recovery button actually reloads the previously selected source sheet after the original Picker poll stopped.
- Real Free6-hour automation request was explicitly rejected. Turning automation off, saving, Preflight, preview approval and actual sync succeeded; the respondent page showed Alpha/Beta. This does not prove an unattended run.
- A new ordinary Creem **Test** Choice Sync annual checkout completed. The Test license email was delivered. The existing online service returns active for that buyer in Test, rejects the same key in Live, and rejects another buyer. Add-on activation, real clock, refund/revocation and restoration are still being executed.
- Owner-scoped Test-only builds120/121 are temporary Marketplace drafts and must never be publicly published.121 adds automatic backup before Test activation and an explicit restore control. The original HEAD117 snapshot remains available for restoration after clock acceptance. Production candidate output is now constrained to the expected immutable source file list, preventing stale QA helper files from accidentally entering a release.
- A newly generated clean candidate contains the17 intended source files, with identical existing scopes. No new Google permission grant or public release has occurred in this phase.

## Other plugins

- FormFlow local candidate fixes missing online-license definitions, unsafe last-row writes, serialized submission intake and bounded manual retry references.31 mocked tests passed. Actual Google row precision, close submissions, mail/recovery and current billing acceptance remain required.
- Guard71 source is re-pulled; it has full Forms and external-request scopes, billing enabled, three-form/one-quota-question Free limits and a Pro timer gate. A constant describing a paused narrow-scope build is still in the source, but TIMER_PUBLIC_ENABLED is true; the constant alone is not evidence that current timers are disabled. Real timer and current Test activation/refund remain required.
- Current normal remote HEAD snapshots for FormNotifier, DocForge and FormMerge explicitly remain free launch builds. They do not provide a working Creem paid-plan activation path. These are not proof of the exact Marketplace-distributed versions. No paid SKU, price or paid entitlement has been invented for them.
- FormCopy retirement/listing alignment remains to be verified. No permanent Marketplace unpublication is authorized by this ledger.

Private keys, buyer identifiers, source snapshots and account state backups stay outside this repository. Current execution evidence is in D:/forms_source_code/plugin-closeout-20261120/PROGRESS_CN.md; three-site closeout precedes plugins and is documented in D:/forms_source_code/three-sites-closeout-20261120/WORKLIST_CN.md.
