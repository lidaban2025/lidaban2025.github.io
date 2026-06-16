# FormFlow StackOverflow / WebApps leads - 2026-06-15

Status: candidate drafting only. Do not post product-first answers on StackOverflow. Use an Apps Script architecture answer first, with one disclosed FormFlow link only if genuinely helpful and allowed.

## Strong candidates found via Stack Exchange API

### 1. Google forms approval workflow

- URL: https://stackoverflow.com/questions/52023578/google-forms-approval-workflow
- Score: 2
- Answers: 1
- Answered: true
- Fit: high topical fit, but already answered; comment/answer only if adding durable Web App + Sheet locator architecture.

### 2. Adding approval step for Google Form entries -> Google Sheet/Doc

- URL: https://stackoverflow.com/questions/67489362/adding-approval-step-for-google-form-entries-google-sheet-doc
- Score: 0
- Answers: 2
- Answered: true
- Fit: high topical fit; already answered.

### 3. Creating a script for approve workflow in Google Forms

- URL: https://stackoverflow.com/questions/57469745/creating-a-script-for-approve-workflow-in-google-forms
- Score: 1
- Answers: 3
- Answered: false
- Fit: high topical fit; possible if thread is not locked and answer adds concrete Apps Script design.

### 4. Google app script approval workflow where the approver decision is updated to the responses spreadsheet

- URL: https://stackoverflow.com/questions/55275429/google-app-script-approval-workflow-where-the-approver-decision-is-updated-to-th
- Score: 1
- Answers: 0
- Answered: false
- Fit: strongest architecture match.

### 5. How can i get the hyperlink for "Approve", "Reject" work in Email using Apps Script

- URL: https://stackoverflow.com/questions/59247024/how-can-i-get-the-hyperlink-for-approve-reject-work-in-email-using-apps-scr
- Score: 0
- Answers: 1
- Answered: true
- Fit: strong approve/reject email link fit.

## Safe answer draft for candidate 4

```text
For this kind of workflow, don't try to make the email link update "the active form" directly. The approval link will run as a web app request, outside the Google Forms editor context, so you need to store a durable row locator when the form response is created.

A typical Apps Script design is:

1. Install an `onFormSubmit` trigger on the Google Form.
2. In the submit handler, get the linked response spreadsheet and the newly submitted row.
3. Add columns such as `Approval ID`, `Approval Status`, `Approval Comments`, and `Last Updated`.
4. Generate a unique approval ID for the row and write `Pending` / `Pending Level 1` into the status column.
5. Send an email containing a Web App URL like:

`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?id=APPROVAL_ID&action=approve`

6. In `doGet(e)` or `doPost(e)`, read `e.parameter.id`, look up that approval ID in the response sheet, and update the matching row to `Approved` or `Rejected`.

The important part is step 4: store enough information to find the same row later. Do not rely on `FormApp.getActiveForm()` in the web app approval handler, because there may be no active form in that context.

Disclosure: I maintain a Google Workspace Marketplace add-on called FormFlow that packages this pattern for Google Forms approvals. If you prefer a maintained add-on instead of custom Apps Script, this is the listing: https://workspace.google.com/marketplace/app/formflow_approval_workflow_for_google_fo/1082615279531
```

## Posting rules

- Only post if logged in and the answer box is available.
- Do not post if the thread is closed, locked, duplicate, or not asking for approval workflow architecture.
- If posting on StackOverflow, the answer must stand on its own without the product link.
- Record exact published answer URL only after visible verification.
