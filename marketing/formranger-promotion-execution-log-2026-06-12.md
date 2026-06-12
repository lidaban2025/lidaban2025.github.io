# FormRanger promotion execution log — 2026-06-12

## Owned exposure completed

Existing FormRanger URLs found in sitemap: 18.

IndexNow key file verified live: `[REDACTED]`

Submitted all existing FormRanger sitemap URLs to:

- `https://api.indexnow.org/indexnow` — HTTP 200
- `https://www.bing.com/indexnow` — HTTP 200

Note: this means URL discovery was pushed/accepted. It does not mean Google/Bing ranking or indexing is complete.

## Existing URLs submitted

- `https://formsuite.dev/formranger/`
- `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html`
- `https://formsuite.dev/formranger/import-google-forms-choices-from-google-sheets.html`
- `https://formsuite.dev/formranger/test-google-forms-dynamic-choices-before-launch.html`
- `https://formsuite.dev/formranger/review-after-first-success.html`
- `https://formsuite.dev/formranger/auto-update-google-forms-dropdown-from-google-sheets.html`
- `https://formsuite.dev/formranger/google-forms-dropdown-from-google-sheets-without-apps-script.html`
- `https://formsuite.dev/formranger/google-forms-dependent-dropdown-from-google-sheets.html`
- `https://formsuite.dev/formranger/google-forms-dropdown-not-updating-from-google-sheets.html`
- `https://formsuite.dev/formranger/formranger-alternative-google-forms.html`
- `https://formsuite.dev/formranger/populate-google-forms-multiple-choice-from-google-sheets.html`
- `https://formsuite.dev/formranger/google-forms-checkbox-list-from-google-sheets.html`
- `https://formsuite.dev/formranger/google-forms-grid-choices-from-google-sheets.html`
- `https://formsuite.dev/formranger/support.html`
- `https://formsuite.dev/formranger/permissions.html`
- `https://formsuite.dev/formranger/privacy.html`
- `https://formsuite.dev/formranger/terms.html`
- `https://formsuite.dev/formranger/google-forms-dynamic-choices-with-capacity.html`

## Stack Exchange candidates found

Use caution. Stack Overflow/WebApps are strict about self-promotion. Answer with the native/Apps Script solution first. Only mention FormRanger as a no-code option if the answer genuinely fits and disclosure is included.

### Best WebApps candidates

1. `How can I get data from Google Sheets to a Google Forms dropdown list?`
   - URL: `https://webapps.stackexchange.com/questions/137212/how-can-i-get-data-from-google-sheets-to-a-google-forms-dropdown-list`
   - Status: answered, score 1
   - Fit: high intent, old question, probably only comment/update if policy allows.
   - Suggested link: `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html`

2. `App script sheets to update google form dropdown`
   - URL: `https://webapps.stackexchange.com/questions/155539/app-script-sheets-to-update-google-form-dropdown`
   - Status: answered, score 0
   - Fit: high intent, Apps Script-first answer required.
   - Suggested link: `https://formsuite.dev/formranger/google-forms-dropdown-from-google-sheets-without-apps-script.html`

3. `How do I create a multiple choice question in Google Forms based on spreadsheet data?`
   - URL: `https://webapps.stackexchange.com/questions/53383/how-do-i-create-a-multiple-choice-question-in-google-forms-based-on-spreadsheet`
   - Status: answered, score 4
   - Fit: very high intent but old/answered; use only if adding genuinely new no-code angle.
   - Suggested link: `https://formsuite.dev/formranger/populate-google-forms-multiple-choice-from-google-sheets.html`

### Best Stack Overflow candidates

1. `Multiple dropdown questions on a google-form tied to spreadsheet`
   - URL: `https://stackoverflow.com/questions/79356267/multiple-dropdown-questions-on-a-google-form-tied-to-spreadsheet`
   - Status: answered, score -3
   - Fit: relevant, but low score. Probably skip unless answer quality is poor and recent enough.

2. `How to google form with multiple sections, each section with a dropdown list, populate from Google sheet`
   - URL: `https://stackoverflow.com/questions/78219231/how-to-google-form-with-multiple-sections-each-section-with-a-dropdown-list-po`
   - Status: answered, score 0
   - Fit: relevant. Apps Script-first answer required.

3. `Trying to use a for each loop to populate a dropdown list field using Google Script in a Google Form`
   - URL: `https://stackoverflow.com/questions/79251997/trying-to-use-a-for-each-loop-to-populate-a-dropdown-list-field-using-google-scr`
   - Status: answered, score 0
   - Fit: developer/App Script audience. Do not lead with FormRanger.

4. `Setting the row Choices in a Google Form Multi Choice Grid Item?`
   - URL: `https://stackoverflow.com/questions/70596081/setting-the-row-choices-in-a-google-form-multi-choice-grid-item`
   - Status: answered, score 0
   - Fit: grid choices, relevant to FormRanger support. Apps Script-first.

## Safe answer template for Stack Exchange

```text
Google Forms does not keep a Forms choice item automatically linked to a Sheets range. You usually need to run an update step: either Apps Script or an add-on.

For Apps Script, the rough pattern is:

1. read the source range from Sheets,
2. filter blanks/duplicates,
3. open the Form by ID,
4. get the target list/multiple-choice/checkbox item,
5. call the appropriate choice-setting method,
6. test the public preview after the update.

If you do not want to maintain Apps Script, I’m building FormRanger for this no-code update workflow. Disclosure: it is my add-on. The relevant setup guide is here:
https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html
```

## Next recommended manual actions

1. Use Search Console URL Inspection for:
   - `https://formsuite.dev/formranger/`
   - `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html`
   - `https://formsuite.dev/formranger/google-forms-dropdown-from-google-sheets-without-apps-script.html`
   - `https://formsuite.dev/formranger/google-forms-dropdown-not-updating-from-google-sheets.html`
2. Check Marketplace listing screenshots: source Sheet → mapping sidebar → Preflight → Update now → public preview.
3. If logged in to Stack Exchange, answer only one highly relevant question first and disclose ownership.
4. Ask successful FormRanger users for reviews only after a real sync succeeds.


## Search Console check — 2026-06-12 follow-up

Checked through the verified `https://formsuite.dev/` URL-prefix property.

- `https://formsuite.dev/formranger/` — URL is on Google; Page is indexed.
- `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html` — URL is on Google; Page is indexed; FAQ and video enhancements detected.
- `https://formsuite.dev/formranger/import-google-forms-choices-from-google-sheets.html` — URL is not on Google; URL is unknown to Google. Request indexing was attempted, but the Search Console flow did not reach the final `Indexing requested` confirmation in the agent browser, likely due to invisible reCAPTCHA/session friction.

Do not claim Google indexing for the import page yet. Retry manually from a normal local browser if needed.

## Expanded Stack Exchange lead scan — 2026-06-12 follow-up

Source: Stack Exchange API advanced search across WebApps and Stack Overflow. Saved raw expanded CSV locally during execution as `/tmp/formranger-stackexchange-expanded-leads.csv`.

High-signal candidates to review manually:

1. `Dynamically edit multiple choice options in live Google Form using Apps Script`
   - URL: `https://stackoverflow.com/questions/18645999/dynamically-edit-multiple-choice-options-in-live-google-form-using-apps-script`
   - Score: 9; Answers: 3; Status: answered.
   - Use: keyword/FAQ inspiration or a careful Apps Script-first answer only if a genuinely new no-code option is allowed.

2. `Multiple Selection Dropdown List in Google Forms`
   - URL: `https://stackoverflow.com/questions/55857940/multiple-selection-dropdown-list-in-google-forms`
   - Score: 5; Answers: 0; Status: unanswered.
   - Use: relevant but may be product-mismatch if the asker needs multi-select dropdown rather than synced choices.

3. `How do I create a multiple choice question in Google Forms based on spreadsheet data?`
   - URL: `https://webapps.stackexchange.com/questions/53383/how-do-i-create-a-multiple-choice-question-in-google-forms-based-on-spreadsheet`
   - Score: 4; Answers: 3; Status: answered.
   - Use: very high-intent; only contribute if adding a materially updated no-code workflow.

4. `Is there a script to draw a list of variables from a table to Google Forms?`
   - URL: `https://webapps.stackexchange.com/questions/94519/is-there-a-script-to-draw-a-list-of-variables-from-a-table-to-google-forms`
   - Score: 2; Answers: 1; Status: answered.
   - Use: good Apps Script-first angle; FormRanger can be disclosed as a no-code alternative.

5. `How to set the answer key for a Forms Griditem using Google Apps Script?`
   - URL: `https://stackoverflow.com/questions/68422724/how-to-set-the-answer-key-for-a-forms-griditem-using-google-apps-script`
   - Score: 2; Answers: 0; Status: unanswered.
   - Use: grid-specific keyword/support-content angle; do not force FormRanger if answer-key behavior is outside product scope.

Recommended posting order if manually posting with an owned account:

1. WebApps high-intent Forms-from-Sheets questions first.
2. Stack Overflow only when the answer includes working Apps Script details before any product mention.
3. Never post duplicate promotional answers across multiple questions.


## No-login follow-up — internal links and discovery

Because manual Search Console operation is unavailable, the fallback was executed without adding new pages:

- Added a direct homepage card linking to `https://formsuite.dev/formranger/import-google-forms-choices-from-google-sheets.html`.
- Added a support-page utility link to the same import guide.
- Resubmitted the core FormRanger URLs to IndexNow endpoints:
  - `https://api.indexnow.org/indexnow` — HTTP 200
  - `https://www.bing.com/indexnow` — HTTP 200
- Tried legacy sitemap ping endpoints:
  - Google sitemap ping — HTTP 404
  - Bing sitemap ping — HTTP 410

The sitemap ping endpoints are deprecated/unsupported responses, so rely on sitemap availability plus IndexNow/Bing discovery rather than claiming a Google manual request.

## Off-site answer pack created

Created `marketing/formranger-offsite-answer-pack-2026-06-12.md` with reusable Apps-Script-first answers for:

- Google Forms dropdown from Google Sheets
- Choices not updating
- No Apps Script option
- Grid choices from Sheets

Use disclosure when mentioning FormRanger. Do not paste the same answer repeatedly.


## Direct promotion batch — 2026-06-12 no-login execution

Completed without requiring user manual login and without adding new website pages.

### ActiveSearchResults submissions

Submitted and received `Added Web Site Confirmation` for:

- `https://formsuite.dev/formranger/`
- `https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html`
- `https://formsuite.dev/formranger/import-google-forms-choices-from-google-sheets.html`

### Marketplace CTA tracking

Updated existing FormRanger Marketplace links to include UTM parameters:

- `utm_source=formsuite`
- `utm_medium=site_cta`
- `utm_campaign=formranger_low_install`
- `utm_content=<page>`

Scope: 18 existing FormRanger HTML pages, 29 FormRanger Marketplace links.

The existing `formsuite-tracking.js` already records marketplace CTA clicks as `marketplace_cta_click` and identifies FormRanger from the destination URL/text.

### Assets created

- `marketing/formranger-marketplace-listing-optimization-2026-06-12.md`
- `marketing/formranger-review-request-templates-2026-06-12.md`

These are execution assets only. They do not publish external posts and do not create new site pages.


## Marketplace console attempt and fallback distribution — 2026-06-12

### Marketplace console

Attempted to open the Google Cloud Marketplace SDK configuration page for project `formguard-489511`:

- URL: `https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=formguard-489511`
- Browser account/session: Google account was present and project switched to FormGuard.
- Result: Google Cloud Console page repeatedly showed `Failed to load` with retry not recovering.
- Tracking number shown by Cloud Console: `c7339001810207383`.

No Marketplace listing changes were saved from the console in this batch. Use `marketing/formranger-marketplace-listing-optimization-2026-06-12.md` as the prepared copy pack when the console is accessible.

### Additional no-login directory checks

Checked/attempted additional channels after console was blocked:

- `ActiveSearchResults` — already confirmed earlier with `Added Web Site Confirmation` for the FormRanger homepage, dynamic guide, and import guide.
- `ExactSeek` — submit form exists, but real action requires CAPTCHA; not submitted.
- `SonicRun` — submit form exists, but real action requires CAPTCHA; not submitted.
- `SoMuch` — reached link-information form and queue language, but no final submitted/thank-you confirmation; not counted as submitted.
- `Jayde` — form is large business-directory style; skipped to avoid low-quality/overbroad submission without a reliable confirmation path.
- `Anoox` — login/register style fields present; skipped.

Rule kept: only `ActiveSearchResults` is counted as confirmed. CAPTCHA or unclear flows are recorded as blocked/unclear, not success.

## 2026-06-12 follow-up — Marketplace target check and Stack Overflow draft

- Marketplace SDK Store Listing fallback URL loaded successfully, but the visible listing language is `FormGuard - Response Limits for Google Forms™`, not FormRanger. No listing copy was changed or saved to avoid overwriting the wrong product listing.
- Stack Exchange API scan found a high-intent Stack Overflow thread about dynamic Google Forms dropdown/multiple-choice options from Google Sheets: https://stackoverflow.com/questions/74529492/can-i-make-dynamic-forms-with-dropdown-or-multiple-choice-options-from-google-sh
- Direct browser posting is blocked by Stack Overflow Cloudflare security verification in the agent browser. No answer was posted.
- Added a specific Apps Script-first, disclosed FormRanger fallback answer draft to `marketing/formranger-offsite-answer-pack-2026-06-12.md`.

## 2026-06-12 follow-up — cross-product CTA attribution cleanup

- Stack Overflow direct posting is currently not usable because the user also hits IP restrictions. No public answer was posted.
- Confirmed FormRanger promotion status: real Google Forms add-on runtime path previously passed, but wording should remain careful and avoid universal/bug-free claims.
- Removed stale untracked 2026-06-07 FormRanger drafts that still said `Configure FormRanger` was unreliable, so future promotion work does not pick up obsolete blocked status.
- Added missing UTM params to remaining FormRanger and FormGuard Marketplace install links across existing pages only. No new pages were created.
