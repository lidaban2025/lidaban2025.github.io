# FormGuard promotion verification — 2026-06-12

## Verdict

FormGuard is OK to keep promoting with existing careful positioning.

This verification checked promotional readiness: live pages, Marketplace link, support/legal pages, demo/embed, and existing distribution assets. It did not rerun a fresh full Google Forms UI end-to-end regression in this session.

## Checked assets

Live pages returned 200:

- `https://formsuite.dev/formguard/`
- `https://formsuite.dev/formguard/support.html`
- `https://formsuite.dev/formguard/privacy.html`
- `https://formsuite.dev/formguard/terms.html`

Core promotion links returned 200:

- `https://workspace.google.com/marketplace/app/formguard_google_forms_allinone/410120194423`
- `https://formsuite.dev/formguard/google-forms-limits-guides.html`
- `https://formsuite.dev/formguard/google-forms-response-limit.html`
- `https://formsuite.dev/formguard/google-forms-choice-limit.html`
- `https://formsuite.dev/formguard/google-forms-timer-add-on.html`
- `https://formsuite.dev/formguard/formranger-alternative-google-forms.html`
- `https://formsuite.dev/formguard/formlimiter-alternative-google-forms.html`
- `https://formsuite.dev/formguard/choice-eliminator-alternative-google-forms.html`
- `https://formsuite.dev/formguard/event-registration-google-forms.html`
- `https://formsuite.dev/formguard/appointment-booking-google-forms.html`
- `https://formsuite.dev/formguard/workshop-signup-google-forms.html`
- `https://formsuite.dev/formguard/quiz-timer-google-forms.html`
- `https://formsuite.dev/formguard/class-signup-google-forms.html`

Existing distribution assets:

- `formguard/marketing/distribution-pack.md`
- `marketing/manual-distribution-answers.md`

## Positioning to use

One-line positioning:

> FormGuard adds response limits, choice quotas, notifications, and timer-style workflows to Google Forms.

Clear distinction from FormRanger:

> FormRanger is for syncing Google Forms choices from Google Sheets. FormGuard is for controlling availability after people start submitting: response limits, choice quotas, notifications, close messages, and timer-style workflows.

## Safe channels now

- Existing FormGuard landing page and guides.
- Manual answers to high-intent questions about response limits, choice limits, event/workshop capacity, and appointment slots.
- Cross-promotion from FormRanger only when the user asks about capacity/overbooking, not Sheet syncing.
- Marketplace install link when the user is ready to install, not as the first line of a cold answer.

## Guardrails

Do not claim:

- `Complete FormRanger replacement`
- `Complete FormLimiter clone`
- `Exam proctoring software`
- Fake user counts, ratings, revenue, or testimonials
- Fresh full UI regression passed today unless a separate runtime test is actually run

## Minor note

Link checker reported 404 for bare `https://fonts.googleapis.com` and `https://fonts.gstatic.com`, but those are preconnect/root-domain checks, not broken product links. The actual Inter CSS URL returned 200.
