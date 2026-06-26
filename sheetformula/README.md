# Sheet Formula Helper API

The page at `/sheetformula/` now works in two layers:

1. It tries `POST /api/formula` for AI output.
2. If the endpoint is unavailable, it falls back to local browser rules.

No AI key is exposed in the browser.

## Cloudflare Worker endpoint

Use `sheetformula/api-formula-worker.js` as the Worker code for `/api/formula`.

Required secret:

```bash
wrangler secret put OPENAI_API_KEY
```

Optional variable:

```bash
wrangler secret put OPENAI_MODEL
# suggested default if omitted: gpt-4o-mini
```

## Request shape

```json
{
  "mode": "fix",
  "platform": "Google Sheets",
  "formula": "=VLOOKUP(A2, Products!A:C, 3)",
  "context": "It returns #N/A but I want a blank when no match is found."
}
```

Allowed modes:

- `fix`
- `explain`
- `generate`

## Response shape

```json
{
  "result": "Formula:\n=IFERROR(VLOOKUP(A2, Products!A:C, 3, FALSE), \"\")\n\nExplanation:\n..."
}
```

## Deployment note

This repository now includes a Worker wrapper:

- `worker.js` routes `POST /api/formula` to `sheetformula/api-formula-worker.js`.
- `wrangler.json` serves static files from `_site` through the `ASSETS` binding.
- `scripts/build-site.js` copies publishable static assets into `_site` and excludes `node_modules` / marketing work files.

Deploy flow:

```bash
npm install
npm run cf:check
wrangler secret put OPENAI_API_KEY
npm run deploy
```

After deployment, the live endpoint should be:

```txt
https://formsuite.dev/api/formula
```

Without the secret or route, the frontend still works through local fallback rules.
