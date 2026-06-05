# Search-discovered candidate leads — 2026-06-05

These are candidate leads and channel targets prepared with ShipSolo ops rules. They are **not posted**. Screen page state before posting.

## FormRanger — WebApps.SE — blocked_risk

- Query: `"Google Forms" "dropdown from Google Sheets"`
- Title: How can I get data from Google Sheets to a Google Forms dropdown list?
- URL: https://webapps.stackexchange.com/questions/137212/how-can-i-get-data-from-google-sheets-to-a-google-forms-dropdown-list
- Evidence: Bing result is exact high-intent; browser hit Cloudflare security verification, so use normal logged-in browser if posting.
- Recommended link: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html?utm_source=webapps_stackexchange&utm_medium=answer&utm_campaign=shipsolo_coldstart
- Draft angle: explain Apps Script vs add-on, public preview testing, no-code sync.
- Status: blocked_risk

## FormRanger — Google Help — likely_locked

- Query: `"Google Forms" "dropdown from Google Sheets"`
- Title: Can you have a drop down list in Google Forms that comes from a Google spreadsheet?
- URL: https://support.google.com/docs/thread/188086454/can-you-have-a-drop-down-list-in-google-forms-that-comes-from-a-google-spreadsheet?hl=en
- Evidence: known high-intent thread; earlier checks showed Google Help threads often locked/soft locked.
- Recommended link: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html?utm_source=google_help&utm_medium=answer&utm_campaign=shipsolo_coldstart
- Draft angle: Google Forms does not maintain a native live link; use Apps Script or an add-on; always test public form view.
- Status: likely_locked

## FormRanger — StackOverflow — candidate_with_policy_risk

- Query: `"Google Forms" "dropdown from Google Sheets"`
- Title: Google form dropdown list from a google sheet
- URL: https://stackoverflow.com/questions/55820557/google-form-drop-down-list-from-a-google-sheet
- Evidence: exact technical query; strict self-promotion rules.
- Recommended link: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html?utm_source=stackoverflow&utm_medium=answer&utm_campaign=shipsolo_coldstart
- Draft angle: only answer if code/API explanation is primary; link must be disclosed and secondary.
- Status: candidate_with_policy_risk

## FormRanger — Reddit — blocked_risk

- Query: `"Google Forms" "dropdown from Google Sheets"`
- Title: Change Google Form based on range in Google Sheet
- URL: https://www.reddit.com/r/googlesheets/comments/18umspg/change_google_form_based_on_range_in_google_sheet/
- Evidence: high-intent but Reddit has repeatedly blocked cloud/local browser by network security.
- Recommended link: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html?utm_source=reddit&utm_medium=comment&utm_campaign=shipsolo_coldstart
- Draft angle: no-code Sheets → Forms choices sync; skip if archived/no comment box.
- Status: blocked_risk

## FormGuard — Quora — candidate

- Query: `Google Forms limit each option`
- Target topic: How do I limit responses for each option/session/time slot in Google Forms?
- URL: Search Quora for exact phrase before posting.
- Evidence: prior FormRanger Quora answer posted successfully; FormGuard second answer was uncertain due to Cloudflare.
- Recommended link: https://formsuite.dev/formguard/google-forms-choice-limit.html?utm_source=quora&utm_medium=answer&utm_campaign=shipsolo_coldstart
- Draft angle: distinguish total response limit vs option-level/session quota.
- Status: candidate

## FormGuard — Google Help — likely_locked

- Query: `"Google Forms" "event registration" "seats"`
- Target topic: limit workshop/class/event seats in a Google Form.
- URL: Search Google Help; only post if composer exists.
- Evidence: previous Google Help capacity threads were locked/soft locked; use as keyword intelligence if locked.
- Recommended link: https://formsuite.dev/formguard/google-forms-choice-limit.html?utm_source=google_help&utm_medium=answer&utm_campaign=shipsolo_coldstart
- Draft angle: per-choice quotas, tiny test limits, full/waitlist message.
- Status: likely_locked

## FormGuard — directories / maker communities — manual_required

- Query: Google Workspace add-on directories / form builder tool directories.
- Target: AlternativeTo, SaaSHub, StartupBase, Indie Hackers feedback post.
- URL: create listing/post only if account creation/payment is acceptable.
- Recommended link: https://formsuite.dev/formguard/?utm_source=directory&utm_medium=listing&utm_campaign=shipsolo_coldstart
- Draft angle: Google Forms per-choice quota / workshop seats / appointment slots.
- Status: directory_manual_required

## FormRanger — directories / maker communities — manual_required

- Query: Google Workspace add-on directories / spreadsheet automation tool directories.
- Target: AlternativeTo, SaaSHub, StartupBase, Indie Hackers feedback post.
- URL: create listing/post only if account creation/payment is acceptable.
- Recommended link: https://formsuite.dev/formranger/?utm_source=directory&utm_medium=listing&utm_campaign=shipsolo_coldstart
- Draft angle: Google Sheets → Google Forms choices sync without Apps Script maintenance.
- Status: directory_manual_required

[DONE]
