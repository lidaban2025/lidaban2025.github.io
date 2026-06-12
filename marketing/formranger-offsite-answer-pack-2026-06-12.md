# FormRanger off-site answer pack — no-new-pages version

Date: 2026-06-12

Use these only where the question is genuinely about keeping Google Forms choices in sync with Google Sheets. Do not paste the same answer everywhere. Lead with the native/Apps Script solution, then disclose FormRanger as the no-code option.

## Disclosure line

I’m building FormRanger, so treat this as disclosure. The general workflow also applies if you maintain your own Apps Script.

## Answer 1 — Google Forms dropdown from Google Sheets

Google Forms does not keep a dropdown automatically linked to a Google Sheets range. The normal pattern is to run an update step whenever the source list changes.

If you want to do it with Apps Script, the flow is:

1. Put the dropdown values in one Sheets column.
2. Read the range and filter blanks/duplicates.
3. Open the target Form by ID.
4. Find the dropdown/ListItem question.
5. Call `setChoiceValues(values)`.
6. Open the public form preview and confirm the respondent sees the new values.

If you do not want to maintain Apps Script, FormRanger is a no-code add-on for the same owner-run update workflow. It maps a Sheets column to a Google Forms dropdown, multiple-choice, checkbox, or grid choice question, then runs Preflight before updating.

Guide: https://formsuite.dev/formranger/import-google-forms-choices-from-google-sheets.html

## Answer 2 — Choices not updating

The most common mistake is checking the Google Forms editor instead of the respondent-facing preview, or assuming the list updates live while a respondent is filling out the form.

I would check these in order:

1. The source Sheet tab and column still contain the expected values.
2. Blank rows and duplicate values are filtered before updating choices.
3. The target Forms question type is supported: dropdown, multiple choice, checkbox, or grid choices.
4. The update step actually ran after the Sheet changed.
5. The public preview shows the new choices.

For Apps Script, log the final array before calling `setChoiceValues`. For FormRanger, run Preflight, then Update now, then check the public preview.

Troubleshooting guide: https://formsuite.dev/formranger/google-forms-dropdown-not-updating-from-google-sheets.html

## Answer 3 — No Apps Script option

If the requirement is simply “use a Google Sheets column as the source for Google Forms choices,” you have two practical options:

- Apps Script: more flexible, but someone has to own the script, triggers, permissions, and debugging.
- Add-on workflow: less custom, but easier for non-developers to run and verify.

FormRanger is built for the second option. It does not turn Google Forms into a live booking system; it updates the form owner’s choice list from Sheets before respondents use the form.

Comparison: https://formsuite.dev/formranger/google-forms-dropdown-from-google-sheets-without-apps-script.html

## Answer 4 — Grid choices from Sheets

For grid questions, separate two things:

- row/column choice labels shown in the form,
- respondent answers submitted later.

You can update the row or column choices from a source list, but it should be treated as an owner-run setup/update step. Test on a copied form first, because changing choices on a live form can confuse later reporting.

FormRanger supports mapping Sheets data into multiple-choice grid and checkbox grid choices. The safe workflow is: source column → mapping → Preflight → Update now → public preview.

Main guide: https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html

## Posting rules

- Prefer WebApps StackExchange over Stack Overflow for no-code/add-on mentions.
- On Stack Overflow, include working Apps Script direction first or skip posting.
- Use only one link per answer unless the thread explicitly asks for alternatives.
- Always include the disclosure line if mentioning FormRanger.
- Skip old/answered threads unless the answer adds a materially new workflow.
