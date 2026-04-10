# FormSuite Publish-Ready Checklist

Date: `2026-04-10`

## Already done

- Homepage updated with direct offer links
- Starter kit page and installation guide created
- Fixed service package page created
- Offers/contact page created
- Checkout path page created
- `FormFlow` page updated with pilot-oriented CTAs
- `404.html` added
- `sitemap.xml` updated
- `robots.txt` already points to sitemap

## Still needed before true self-serve checkout

1. Create one real payment link per offer
2. Copy `buy/payment-links.example.js` to `buy/payment-links.js`
3. Fill the three values:
   - `starterKit`
   - `setupPackage`
   - `formflowPilot`
4. Test `/buy/` and confirm buttons switch from manual checkout to secure checkout
5. Test payment success and delivery workflow

## Still needed before public launch

1. Push latest site changes to `lidaban2025/lidaban2025.github.io`
2. Verify GitHub Pages publishes successfully
3. Open these URLs after publish:
   - `/`
   - `/offers/`
   - `/buy/`
   - `/starter-kit/`
   - `/services/google-workspace-ai-automation.html`
   - `/formflow/`
4. Confirm all `mailto:` links open correctly
5. Decide whether to keep manual payment for week 1 or switch immediately to Stripe/Gumroad/etc.

## Suggested payment providers

- Stripe Payment Links
- Gumroad
- Lemon Squeezy
- PayPal payment links

## Fastest Stripe-ready switch

1. Create 3 Stripe Payment Links
2. Save them in `buy/payment-links.js`
3. Push once
4. Re-open `/buy/`
5. Confirm the badges now show `Secure checkout ready`

## Recommended next move

If you want the fastest launch:

- Keep manual payment for now
- Push the site live
- Start sending `/offers/` and `/buy/`
- Add payment links only after the first real buyer flow is clear
