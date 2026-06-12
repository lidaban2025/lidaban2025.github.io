# FormRanger runtime QA pass — 2026-06-12

## Scope

Product: FormRanger Pro - Dynamic Choice Sync

Test form ID: `1UlmYMYWCK_kZdkK4LVo516JZb-lk-B3GLy7tjI-inDQ`

Goal: verify the real Google Forms add-on runtime loop before unlocking promotion.

## Verdict

PASS — FormRanger is clear for careful promotion.

This pass covers the actual Google Forms add-on user path, not just backend or local regression.

## Verified runtime path

1. Google Forms editor opened.
2. Add-ons menu listed `FormRanger Pro - Dynamic Choice Sync`.
3. FormRanger center menu opened.
4. `Configure FormRanger` opened the real FormRanger sidebar.
5. Existing stale mapping was removed.
6. A new mapping was created:
   - Question: `Choose a sessionUntitled Question`
   - Source: `Sheet1 -> Order`
7. Settings were saved.
8. Preflight passed:
   - `Setup check passed.`
   - `Linked questions: 1`
9. `Enable updates` was turned on and settings were saved.
10. `Update now` succeeded:
    - `1 question(s) updated.`
    - `Choose a sessionUntitled Question: updated (2 choices)`
11. Public/respondent preview showed the synced choices:
    - `Alpha`
    - `Beta`

## Important finding

The first `Update now` returned `0 updated` because `Enable updates` was off. Code inspection confirmed this is expected behavior: `updateAllMappings()` returns no updates when config is disabled. After enabling updates, the same path succeeded.

## Cleanup verification

Temporary QA runner and temporary code were removed before final promotion status:

- `deploy/RuntimeQa.gs` does not exist.
- Temporary Forms/Sheets broad scopes were removed.
- Temporary `AIService.gs` QA shim was removed.
- Local regression passed: `12/12 tests passed`.

## Promotion implication

Promotion is unlocked for FormRanger with careful wording.

Allowed claims:

- Sync Google Forms choices from Google Sheets.
- Supports a safer setup path with Save, Preflight, Update now, and public preview verification.
- Useful for dropdowns, multiple choice, checkboxes, and grid-style choice workflows when lists change often.

Avoid claims:

- `bug-free`
- `works in every domain`
- `replaces every Apps Script workflow`
- `fully production-proven for all possible Forms setups`

## Evidence artifact

Public preview screenshot captured in the session:

`/home/ubuntu/.hermes/cache/screenshots/browser_screenshot_32a483849adc48a8ba0d2129add1d80b.png`
