# FormFlow actual submission: storage failure before mail

After restoring a single Google session, the synthetic form editor and the candidate sidebar both reported the 2026 test account. The response spreadsheet was selected again through Google Picker. Settings saved, Preflight passed, and a normal respondent submission was recorded.

The exported Google response contains the exact chosen answer and a native date timestamp, with an approval ID and Pending Level 1. However, Gmail had no matching approval message and the saved execution report contained Google's property-storage-quota error. This is a failed workflow acceptance, not proof of delivery. The affected row is retained for diagnosis and must not be blindly resent after an uncertain dispatch.

The next local candidate prepares per-request context and all approval messages before writing a Pending record. A storage/token-preparation error leaves the native response unreserved and recoverable. MailApp exceptions now produce an explicit unconfirmed-delivery result instead of being logged and silently reported as success. This does not establish inbox delivery; actual receiving-mailbox confirmation is still required.

41 targeted candidate checks passed, including failure at each preparation stage, no partial sending during message preparation, refusal of an empty dispatch, failed MailApp handling, source-cell preservation, duplicate refusal and license isolation. These changes have not yet been activated in the Marketplace test draft or released publicly.

A separate immutable private diagnostic version 87 reports aggregate storage counts/sizes only and is restricted to the owned synthetic form and test account. It does not return raw values or modify properties. The Marketplace test draft remains 86 until normal developer-console access is restored. No existing approval records have been deleted or migrated.
