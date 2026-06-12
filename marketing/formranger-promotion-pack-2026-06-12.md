# FormRanger promotion pack — runtime-verified launch version — 2026-06-12

## Runtime status

FormRanger has passed the real Google Forms add-on runtime loop on the QA form.

Verified path:

1. Google Forms editor opened.
2. Add-ons menu listed `FormRanger Pro - Dynamic Choice Sync`.
3. FormRanger center menu opened.
4. `Configure FormRanger` opened the real sidebar.
5. Existing stale mapping was removed.
6. New mapping was created: `Choose a sessionUntitled Question` → `Sheet1 -> Order`.
7. Settings were saved.
8. Preflight passed.
9. `Update now` updated 1 question with 2 choices.
10. Public/respondent preview showed `Alpha` and `Beta`.

Local regression also passed: `12/12 tests passed`.

Use this as the core claim:

> Sync Google Forms choices from Google Sheets, then verify the public respondent view before launch.

Avoid overclaims:

- `bug-free`
- `works in every Google Workspace domain`
- `replaces all Apps Script workflows`
- `production-proven for every possible form structure`

## Best target users

1. Teachers managing class rosters, groups, sections, or session lists.
2. Event/workshop organizers changing session/location options in Sheets.
3. Internal ops teams maintaining product, location, employee, or asset lists.
4. Admins who do not want to maintain custom Apps Script.
5. Google Forms users searching for a FormRanger/Form Ranger alternative that is still maintained.

## High-intent keywords

Primary:

- Google Forms dropdown from Google Sheets
- auto update Google Forms dropdown
- populate Google Forms choices from Sheets
- dynamic Google Forms choices
- sync Google Forms choices from Google Sheets

Secondary:

- Google Forms checkbox list from Google Sheets
- Google Forms multiple choice from Google Sheets
- Google Forms grid choices from Google Sheets
- Google Forms dropdown not updating
- Google Forms choices without Apps Script
- FormRanger alternative Google Forms

## Marketplace copy draft

Title:

```text
FormRanger: Dynamic Choices from Google Sheets for Google Forms
```

Short description:

```text
Sync Google Sheets data into Google Forms dropdowns, multiple choice, checkboxes, and grid choices without maintaining Apps Script.
```

Long description opener:

```text
Stop manually copy-pasting long choice lists into Google Forms. FormRanger lets you keep the source list in Google Sheets and update supported Google Forms choice questions from that sheet.

Use it for class rosters, workshop sessions, appointment slots, locations, product lists, internal request categories, and other lists that change often.

Before launch, run Preflight, update the form, and open the public respondent preview to confirm people see the expected choices.
```

Screenshot order:

1. Source Google Sheet with clean option values.
2. FormRanger sidebar mapping a sheet column to a Google Forms question.
3. Preflight/check step before changing the form.
4. Update result showing the changed question.
5. Public preview showing the updated choices.

## Landing page hero options

Option A:

```text
Sync Google Forms choices from Sheets.
Keep dropdowns, multiple-choice questions, checkboxes, and grid choices easier to update from a Google Sheet.
```

Option B:

```text
Stop manually editing long Google Forms dropdowns.
Use a Sheet as your source list and refresh supported Form choices when the list changes.
```

Option C:

```text
Dynamic Google Forms choices without maintaining Apps Script.
FormRanger is built for changing rosters, sessions, locations, products, and internal lists.
```

## Manual distribution answers

### Google Help / forum answer

```text
If your Google Forms choices come from a list that changes often, the cleanest setup is usually:

1. Keep the source list in Google Sheets.
2. Use one clean column for the choices you want respondents to see.
3. Sync that column into the Google Forms dropdown, multiple-choice, checkbox, or grid question.
4. Open the public preview and confirm the respondent-facing choices before sharing the form.

I’m building FormRanger for exactly this workflow: syncing Google Forms choices from Google Sheets without maintaining Apps Script.

Guide: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html
```

### Reddit / Indie Hackers soft launch

```text
I built a small Google Forms add-on for a boring but common workflow: keeping form choices in Google Sheets.

The problem: if you run workshops, classes, internal request forms, or signup forms, the option list changes all the time. Manually editing dropdowns or multiple-choice options inside Google Forms gets annoying fast.

FormRanger syncs supported Google Forms choice questions from a Sheet source list, so the Sheet stays the source of truth. I’ve been testing the full loop inside Google Forms: configure mapping, save, preflight, update, and check the public respondent preview.

Current focus:
- dropdown choices from Sheets
- multiple-choice choices from Sheets
- checkbox choices from Sheets
- grid choices from Sheets
- clearer preflight/check-before-update flow

Landing page: https://formsuite.dev/formranger/
Setup guide: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html

Would love feedback from anyone who maintains Forms for classes, events, workshops, or internal ops.
```

### Short social posts

```text
If you maintain long Google Forms dropdowns, don’t keep copy-pasting choices manually.

Keep the list in Google Sheets, then sync it into Google Forms.

FormRanger: https://formsuite.dev/formranger/
```

```text
Tiny Google Forms workflow that saves admin time:

Sheet = source list
Form = respondent UI
FormRanger = sync layer

Useful for rosters, sessions, locations, and changing internal lists.
https://formsuite.dev/formranger/
```

```text
Built FormRanger for people who use Google Forms like an operations tool.

If your dropdown choices live in a spreadsheet, your form should not require manual copy-paste every time the list changes.

https://formsuite.dev/formranger/
```

## Review request templates

Short:

```text
If FormRanger saved you from manually copy-pasting Google Forms choices, could you leave a short Marketplace review? Even one sentence helps other Google Forms users decide faster.
https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524
```

Support-first:

```text
If anything is confusing, reply here first and I’ll help you fix it. If it worked, a short Marketplace review would help a lot:
https://workspace.google.com/marketplace/app/formranger_pro_dynamic_choice_sync/18856558524
```

## 7-day promotion plan

Day 1:

- Update the runtime QA record from blocked to passed.
- Use the verified screenshot sequence: source sheet, mapping sidebar, preflight, update result, public preview.
- Start with owned pages and manual answers, not spammy broad launch posts.

Day 2:

- Update Marketplace title/short description if not already aligned with `Google Sheets` + `Google Forms choices`.
- Add or reorder screenshots around the verified workflow.
- Add one short review request to support replies after successful syncs.

Day 3:

- Refresh one guide around `Google Forms dropdown from Google Sheets`.
- Request indexing for FormRanger homepage and top guide in Search Console if available.

Day 4:

- Post one soft-launch discussion in a relevant no-spam community.
- Use the guide link, not direct Marketplace spam.

Day 5:

- Answer 2-3 high-intent help/forum questions manually.
- Keep answers educational; one link maximum.

Day 6:

- Ask successful users for reviews.
- Do not ask users who hit setup bugs.

Day 7:

- Review analytics/Search Console queries.
- Double down on pages/posts that show impressions for dropdown/sheets/form choices keywords.

## Guardrails

- Stronger promotion is now unlocked because the real runtime loop passed.
- Still avoid universal stability claims.
- Public posting is OK when the destination allows self-promotion or the reply genuinely answers a matching question.
- For every post, link the most relevant guide instead of always linking the homepage.
