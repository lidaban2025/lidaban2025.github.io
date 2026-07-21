# FormRanger verified video proof design

## Goal

Connect the verified 60-second FormRanger first-run video to the existing high-intent troubleshooting page so visitors can see the success path before installing or troubleshooting a live form.

The target page is:

`/formranger/google-forms-dropdown-not-updating-from-google-sheets.html`

## Evidence

- The page produced the only recent FormRanger first-run signal in the latest seven-day funnel.
- The current Open Graph and Twitter image metadata still references the older YouTube video ID `h7jBGOmMm9c`.
- The verified public first-run video is `https://youtu.be/RE8HR9t9n_0`.
- The current funnel has Marketplace CTA activity but too few completed first runs, so the immediate job is to improve proof and first-run completion rather than create another synonymous SEO page.

## Approved approach

Use the lightweight proof-entry option approved by the user:

1. Replace the old YouTube thumbnail ID in Open Graph and Twitter metadata with `RE8HR9t9n_0`.
2. Add one visible proof section immediately after the existing quick answer.
3. Link the proof section to the public 60-second YouTube video.
4. Keep the existing copied-form Alpha/Beta checklist as the adjacent next action.
5. Do not autoplay or load a YouTube iframe.

This approach gives visitors visible proof without adding a heavy embed or another page.

## Content design

The new section will have one purpose: show what a passing first run looks like.

- Eyebrow: `60-second verified test`
- Heading: `See the first-run pass before touching a live form`
- Supporting text: explain that success requires Preflight to pass, Update now to report at least one updated question, and the public respondent preview to show the expected Sheets values.
- Primary link: `Watch the 60-second test` to `https://youtu.be/RE8HR9t9n_0`.
- Secondary link: `Run the Alpha/Beta checklist` to the existing first-run test page.
- Disclosure: identify the video as a FormRanger demonstration and preserve the product boundary. Do not imply real-time dependent dropdowns, inventory locking, booking, payments, or capacity control.

## Visual design

- Reuse the page's existing typography, spacing, colors, and 8px radius.
- Use the new YouTube thumbnail as the visible media signal.
- Keep the section unframed within the page flow; do not nest a card inside another card.
- Keep a stable 16:9 thumbnail ratio so the layout does not shift.
- Stack the media and copy on small screens and keep both actions readable without horizontal overflow.
- Do not add animation or autoplay.

## Analytics

- Preserve the existing Marketplace and first-run tracking behavior.
- Do not add internal UTM parameters that overwrite the visitor's acquisition source.
- Do not change or assume the current YouTube description in this task. The page integration must work independently, and any future YouTube-description edit needs separate verification.
- Treat a published page or IndexNow response as distribution activity, not as growth. Growth still requires qualified visits, CTA movement, first-run completion, or a real support/success signal.

## Non-goals

- No new dropdown-from-Sheets SEO page.
- No duplicate YouTube upload.
- No changes to FormRanger add-on behavior.
- No review request before a verified successful update.
- No claims that IndexNow guarantees indexing or ranking.

## Verification

Before the page is considered ready:

1. Confirm the old video ID is absent from the target page.
2. Confirm the new video ID appears in Open Graph metadata, Twitter metadata, and the visible proof link.
3. Confirm the visible thumbnail has meaningful alt text and stable 16:9 sizing.
4. Run the repository's focused link and static-site checks.
5. Inspect the page at desktop and mobile widths for overflow, overlap, and readable actions.
6. Confirm the public YouTube URL and the copied-form checklist return HTTP `200`.

Deployment and IndexNow refresh happen only after the source change passes verification and can be published without including unrelated worktree changes.
