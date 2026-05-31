# FormSuite Indexing and Launch Checklist

_Last updated: 2026-05-30_

## Current sitemap

- Sitemap: https://formsuite.dev/sitemap.xml
- Robots: https://formsuite.dev/robots.txt

## Priority URLs to inspect first

### Product directory

- https://formsuite.dev/
- https://formsuite.dev/choose-google-workspace-addon.html
- https://formsuite.dev/install.html

### Product homepages

- https://formsuite.dev/formguard/
- https://formsuite.dev/formranger/
- https://formsuite.dev/formnotifier/
- https://formsuite.dev/formcopy/
- https://formsuite.dev/formflow/
- https://formsuite.dev/formmerge/
- https://formsuite.dev/docforge/

### Best seed pages

- https://formsuite.dev/formguard/google-forms-limits-guides.html
- https://formsuite.dev/formguard/google-forms-response-limit.html
- https://formsuite.dev/formguard/google-forms-choice-limit.html
- https://formsuite.dev/formranger/dynamic-google-forms-dropdown-guide.html
- https://formsuite.dev/formnotifier/send-google-forms-confirmation-email-after-submit.html
- https://formsuite.dev/formcopy/google-forms-response-sheet-formulas-not-copying.html
- https://formsuite.dev/formflow/google-forms-approval-workflow-guide.html
- https://formsuite.dev/formmerge/mail-merge-from-google-sheets-with-gmail.html
- https://formsuite.dev/docforge/google-sheets-rows-to-pdf.html

## Google Search Console

1. Add property for `https://formsuite.dev/` if not already added.
2. Submit sitemap: `https://formsuite.dev/sitemap.xml`.
3. URL Inspection → request indexing for the product directory first.
4. Request indexing for the 7 product homepages.
5. Request indexing for the best seed pages above.
6. Wait 24-72 hours, then check:
   - indexed pages,
   - impressions,
   - top queries,
   - pages with impressions but low CTR.

## Bing Webmaster Tools

1. Add site or import from Google Search Console.
2. Submit sitemap: `https://formsuite.dev/sitemap.xml`.
3. Use URL Submission for the product directory and 7 homepages.

## Manual quality checks before posting links

For any URL you post publicly, check:

```bash
curl -L -s -o /tmp/page.html -w '%{http_code} %{size_download}\n' https://formsuite.dev/path
```

Confirm:

- HTTP 200
- title exists
- canonical exists
- page is visually dark style
- no obvious broken relative links
- one clear CTA

## Launch tracking sheet columns

Create a simple sheet with columns:

- Date
- Channel
- Page promoted
- Query / thread topic
- Exact answer variant
- Clicks / replies
- Indexed? yes/no
- Notes

## Query buckets to monitor in Search Console

### FormGuard

- google forms response limit
- google forms choice limit
- google forms stop responses when full
- google forms close after 100 responses
- choice eliminator alternative
- formlimiter alternative

### FormRanger

- google forms dropdown from google sheets
- auto update google forms dropdown
- populate google forms choices from sheets
- formranger alternative

### FormNotifier

- google forms confirmation email
- google forms email notification not received
- notify team when google form submitted

### FormCopy

- google forms response sheet formulas not copying
- copy down alternative google forms
- copy formulas to new google forms responses

### FormFlow

- google forms approval workflow
- approve reject google forms responses by email

### FormMerge

- mail merge from google sheets with gmail
- send email to each row in google sheets

### DocForge

- google sheets rows to pdf
- google docs template merge from google sheets
- certificate generator from google sheets
