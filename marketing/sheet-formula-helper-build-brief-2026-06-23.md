# Sheet Formula Helper Build Brief - 2026-06-23

## Build Scope

Launch a single working page at `/sheetformula/` with:

- Formula Fixer mode.
- Formula Explainer mode.
- Formula Generator mode.
- A private API handoff to `/api/formula` or an equivalent Worker endpoint.
- Local browser-rule fallback when the API endpoint is unavailable.

## Frontend Requirements

- Keep the tool usable as the first screen.
- Use tabs for mode selection.
- Use a platform selector for Google Sheets and Excel.
- Use one input area for formula/sample data and one input area for context or goal.
- Return copy-ready output.
- Include a copy result action.

## API Contract

The frontend may send:

```json
{
  "mode": "fix",
  "platform": "google-sheets",
  "formula": "=VLOOKUP(A2, Products!A:C, 3)",
  "goal": "",
  "errorMessage": "It returns #N/A",
  "sampleData": ""
}
```

The API should return one or more of:

- `result`
- `correctedFormula`
- `explanation`
- `steps`
- `assumptions`
- `warnings`

## Launch Checks

- Homepage returns 200.
- Support, privacy, terms, and API worker files exist.
- No broken local links.
- The formula tool still returns useful local fallback output without API access.

## Next Build Step

Deploy the Worker API, configure the AI provider secret server-side, and add usage limits before scaling public promotion.
