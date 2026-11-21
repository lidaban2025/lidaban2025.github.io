# FormFlow OAuth policy-link repair — 20 November 2026

The privacy and terms URLs actually presented by Google's FormFlow consent screen were `/formflow-site/privacy.html` and `/formflow-site/terms.html`. Both returned the mother-brand homepage with HTTP200, not their named policies. Current owner readback confirmed this before editing.

The production worker now redirects these exact historical URLs to the maintained FormFlow policies. Historical home/index aliases also redirect to the product homepage; unrelated routes and the existing FormCopy retirement keep their original handling. Queries remain on the same origin.

The maintained privacy policy now states the actual paid-license payload (key, active purchasing Google email and fixed product identifier), the absence of form/Sheet/approval content from that payload, separate license-status storage, and the roles of Cloudflare, Creem and Resend. It dates the earlier Google approval and the current staged re-verification separately. It does not call the newly requested permission verified or claim that every piece of metadata stays only in Google storage.

Preservation before deployment:243 current production static files matched the previous local build byte-for-byte or by line-ending normalization. The two API modules and the original router matched the deployed source map; no API behavior, model setting, price, checkout, customer record or Google scope was edited by this website release. Upload reported only the policy asset changed, with242 other assets already present.

Validation: three routing tests passed and the220HTML/2669local-link check found no broken links. Existing warnings for one pilot-page description and two FAQ detections were retained. Normal production GETs now follow both old consent URLs to the actual FormFlow privacy/terms pages. Privacy content contains the new license disclosure; the retired FormCopy path still reaches the homepage.

Production `formsuite-site` version: `41cb4866-0c13-432e-907d-d420d7f91cef`,100% traffic. Previous version `9708236e-8a1d-410c-8ee7-211e24285c16` remains available for rollback.

Separately, Choice Sync final version125 was pulled back from Google and matched the intended17files. The old immutable116 contained two historical QA helpers; these and the current QA clock helper are explicitly excluded from the final Live release.125 is submitted for Marketplace review, with a confirmed in-review receipt and automatic publication on approval. It is not yet described as publicly distributed. The final sidebar has a visible calendar-version marker for support.

FormFlow85 remains a named-tester draft pending actual row/mail/billing acceptance and Google re-verification. The test account's access was reset with explicit human approval, then restored through the full English Google permission screen; the complete identity/permission recordings were saved before the authorization window closed. Raw recordings stay private and require review/redaction before upload. No verification approval or completed end-to-end approval workflow is claimed here.
