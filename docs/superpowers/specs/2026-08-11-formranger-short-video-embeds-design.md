# FormRanger Short Video Embeds Design

Date: 2026-08-11

## Objective

Connect the three published FormRanger problem-led YouTube Shorts to the three guide pages that match their exact search intent. The change should make the guides easier to scan, give visitors a 30-second visual path, and expose accurate video metadata to search engines without slowing the first render or changing unrelated site behavior.

## Selected Approach

Add one vertical video module to each matching guide page. The module uses a standard YouTube embed with lazy loading, no autoplay, an explicit title, and a direct fallback link. Add one matching `VideoObject` entry to each page's existing JSON-LD graph.

This approach is preferred over a central video gallery because each video remains attached to the problem it solves. It is preferred over link-only placement because the guide gains a useful visual explanation without sending the visitor away immediately.

## Page And Video Mapping

| Guide page | Video | YouTube ID |
| --- | --- | --- |
| `/formranger/auto-update-google-forms-dropdown-from-google-sheets.html` | Google Forms Dropdown From Sheets? Test This Safe Flow | `ge0_RjQ293c` |
| `/formranger/google-forms-dropdown-not-updating-from-google-sheets.html` | Google Forms Dropdown Not Updating? Check These 3 Things | `wk8UJvKUS34` |
| `/formranger/test-google-forms-dynamic-choices-before-launch.html` | FormRanger First Success: Verify The Public Preview | `S9M6PiKJANQ` |

## Page Placement

Place the video module immediately after each page's quick-answer section and before the detailed steps or troubleshooting content. This keeps the answer visible first, then offers the visual walkthrough before the longer text.

Each module contains:

- a short intent-matched heading;
- one sentence explaining what the viewer will verify;
- a centered 9:16 iframe constrained to a stable maximum width;
- a direct YouTube link as a fallback and explicit viewing option.

## Presentation

The iframe container uses `aspect-ratio: 9 / 16`, `width: min(100%, 360px)`, and a small border radius consistent with the existing page. It does not use autoplay, decorative animation, or a nested card. The iframe uses `loading="lazy"`, `allowfullscreen`, and a descriptive `title`.

The page-specific styles remain inline in each existing static page. No shared stylesheet is changed because `product-inner.css` already has unrelated local modifications and the three pages have separate local visual systems.

## Structured Data

Add one `VideoObject` item to each page's existing `@graph` with:

- exact video name;
- concise, accurate description;
- YouTube thumbnail URL;
- upload date `2026-08-11`;
- duration `PT30S`;
- canonical Short URL as `contentUrl`;
- YouTube embed URL as `embedUrl`.

Update the page `Article.dateModified` value to `2026-08-11`. Where a page still uses a generic or unrelated social image, use the matching YouTube thumbnail for Open Graph and Twitter metadata.

## Tracking And Product Boundaries

The embedded videos preserve the published descriptions and their existing distinct `utm_content` guide links. The page copy must keep the FormRanger boundary clear: owner-controlled choice refresh before respondents use a form, not respondent-time dependent dropdowns, inventory, booking, payment, or reservation logic.

No new review prompt is added. The first-success page retains its existing rule that a review is appropriate only after Preflight, Update now, and public preview success.

## Failure Handling

- If YouTube is blocked, the direct fallback link remains usable.
- The fixed aspect ratio prevents layout shift while the player loads.
- Lazy loading prevents off-screen video players from delaying the initial page render.
- Existing text instructions remain complete, so the video is supplemental rather than required.

## Verification

1. Run the existing FormRanger tests and site link checker.
2. Run the static site build.
3. Validate that each iframe ID, public Short URL, thumbnail URL, and JSON-LD mapping match.
4. Serve the built site locally and inspect all three pages at desktop and mobile widths.
5. Confirm no text overlaps, iframe overflow, unexpected autoplay, or layout shift.
6. Confirm the deployed URLs return `200` after release.

## Scope

Only the three mapped HTML pages are implementation targets. Shared styles, tracking scripts, other FormRanger pages, FormFlow, FormGuard, the site home page, and the existing first-success JavaScript are outside this change.
