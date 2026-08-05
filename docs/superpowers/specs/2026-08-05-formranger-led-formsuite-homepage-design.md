# FormRanger-led FormSuite homepage design

## Goal

Make `https://formsuite.dev/` route substantially more qualified visitors into FormRanger's first-success flow while preserving FormSuite as the portfolio brand and retaining every existing product and search URL.

The homepage should communicate one primary job in its first viewport:

`Keep Google Forms choices synced from Google Sheets.`

## Evidence

- FormRanger is the current primary plugin growth asset.
- The 2026-08-05 Marketplace snapshot shows 500 visible FormRanger users, up from 468 on 2026-08-03.
- A successful one-day diagnostic fetch observed 8 anonymous active user keys and 7 distinct keys with at least one successful update. These are usage signals, not verified new installs or complete DAU.
- The latest seven-day web funnel recorded 10 FormRanger Marketplace CTA events, 2 first-run clicks, 2 checklist step events, and 0 public-preview confirmations.
- The current homepage visually features FormFlow first and FormRanger second. FormFlow still produced 11 organic product views and 5 Marketplace CTA events, so its route should remain available and indexable even though it is not the current homepage priority.

## Considered approaches

### 1. Convert the entire domain to FormRanger

Rejected. It would discard portfolio search coverage, weaken existing FormFlow demand signals, and create unnecessary redirect and link risk.

### 2. Keep the current portfolio-neutral homepage

Rejected. It gives the strongest homepage position to FormFlow even though current product-outcome evidence favors FormRanger.

### 3. Make the homepage FormRanger-led while preserving the portfolio

Approved. This concentrates the first viewport and primary conversion path on FormRanger without deleting useful product routes or changing the FormSuite brand.

## Information architecture

- Keep `FormSuite` as the site and organization name.
- Keep all current routes, canonical URLs, legal pages, product pages, resources, and sitemap entries.
- Make FormRanger the first and only featured product on the homepage.
- Move FormFlow and the remaining add-ons into the secondary product grid without removing their install and first-test paths.
- Keep the existing free tools section, including the uncommitted AI Indexability Checker route already present in the working tree.

## First viewport

- Eyebrow: identify FormRanger as the featured FormSuite add-on without claiming that it is the only product.
- H1: state the literal Sheets-to-Google-Forms choice-sync job.
- Supporting copy: distinguish owner-controlled refresh from respondent-time dependent dropdowns, booking, inventory, or live capacity.
- Primary action: open the existing FormRanger copied-form first-success checklist.
- Secondary action: open the FormRanger Marketplace listing with a new, attributable homepage campaign/content pair.
- Visual: reuse verified FormRanger screenshots and show the sequence `Select source -> Map question -> Update and preview`.

## Product section

- Place FormRanger first and apply the existing featured styling.
- Label FormRanger according to its supported job rather than with an unverified superlative.
- Place FormFlow second with its current copy and routes intact, but remove the `Breakout` emphasis.
- Preserve every remaining product card and destination.

## SEO and structured data

- Update the homepage title, description, Open Graph, Twitter, WebSite description, ItemList order, and relevant FAQ answer so the homepage consistently leads with FormRanger while still describing the suite.
- Put FormRanger first in the structured ItemList and FormFlow second.
- Keep the canonical URL at `https://formsuite.dev/`.
- Do not remove or redirect any existing page.

## Analytics

- Use one new homepage campaign for both first-success and Marketplace actions.
- Give the two actions different `utm_content` values.
- Preserve the site's existing acquisition tracking and do not overwrite inbound attribution in client-side code.
- Measure CTA and first-run movement; do not treat deployment, page views, or IndexNow submission as product growth.

## Visual constraints

- Preserve the current dark FormSuite design language, typography, spacing, and 8px-or-less control radii.
- Replace the generic multi-product hero preview with FormRanger product screenshots already in the repository.
- Keep stable image dimensions and responsive grid constraints.
- Do not add autoplay, decorative animation, nested cards, or new visual assets.
- Maintain readable buttons and no horizontal overflow at desktop and mobile widths.

## Non-goals

- No FormRanger add-on code changes.
- No new SEO page.
- No deletion or deindexing of FormFlow or other products.
- No pricing, review, user-count, ranking, or competitive claims in homepage copy.
- No production deployment mixed with unrelated working-tree changes.

## Verification

1. Add a focused static test that fails against the current homepage and asserts FormRanger-first hero copy, CTA destinations, product order, and structured ItemList order.
2. Run the focused test before implementation to verify the expected failure.
3. Implement only the approved homepage and metadata changes, preserving the existing AI Indexability Checker addition.
4. Run the focused test, full repository tests, link checks, and the site build.
5. Inspect desktop and mobile renders for hierarchy, overflow, image loading, and interaction targets.
6. Verify the built homepage contains the same FormRanger-first content and all existing product routes remain available.
7. Deploy only after source verification and an intentional review of the dirty worktree scope.
