# FormFlow shared property storage repair

Actual private version-87 diagnostics found 2,472 Script Properties entries occupying 526,267 UTF-8 bytes including keys. Most space belonged to 1,755 historical access-token entries. User storage was 177 bytes. Raw property values were not returned by the diagnostic.

Deleting old tokens could invalidate existing links. Instead, `LegacyConfigPacking.js` removes only explicitly present, known default fields from approval runtime configurations and stores their presence in a V1 mask. A frozen dictionary reconstructs the original JSON fields and values. Unknown fields, absent/null fields, custom approvers and custom policy values are preserved. The V1 dictionary must remain frozen when future application defaults change.

The old readers in all 17 unique deployed immutable source versions (14 through 84) were checked. Their interpretation of the packed configurations remains the same; newer readers explicitly reconstruct the original values before normalization. Invalid packed data fails closed. No tokens, locators, history, decisions or secrets are removed or rewritten.

49 targeted local checks passed. Google version 88 is a private QA build, saved only as a Marketplace test draft. Its immutable source was fetched again and all 26 files matched the private build. Subsequent owner-only maintenance wrappers exist in the current development HEAD, not in version 88.

The project owner's normal Apps Script editor ran the read-only plan: 39 configurations, 8,727 bytes saved. The subsequent operation reported 39 applied, zero skipped, unchanged property keys, unchanged unrelated values, and all original configurations recoverable. The complete safe receipt is in the local closeout workspace. This repaired storage allocation; it does not itself prove email delivery or final approval completion.

The original synthetic request failed before any locator, runtime configuration or snapshot was saved. Its old Pending marker must be repaired only after matching the exact owned test row and preserving its prior metadata. Actual retry, inbox delivery, approval button, native timestamp/answer preservation and final state are the next acceptance steps. No public Marketplace release or new real-money payment has occurred.
