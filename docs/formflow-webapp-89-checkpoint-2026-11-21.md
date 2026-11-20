# Approval Web App 89 checkpoint

The existing approval endpoint was updated from immutable 84 to 89. The URL and its seven OAuth scopes were retained. Only the metadata writer and packed-configuration reader changed; all unrelated version-84 source files are unchanged. The new immutable source was fetched again and all 22 files matched the compatibility build. Fifteen focused checks passed.

The development HEAD was restored afterward to the owned private QA build. The Marketplace test draft remains 88 and has not been published. No extra Google scopes or anonymous access were added. The official deployment API confirms WEB_APP, version89, access ANYONE, executeAs USER_DEPLOYING. A separate owner-side authorization check returned NOT_REQUIRED for all seven original scopes.

The original owned synthetic response was safely recovered and its actual approval email arrived in the test mailbox. Browser access to its approval page still returned Google's generic Drive cannot-open-file page, including after normal account selection. Final decision, native-cell integrity after approval and plugin-side payment activation therefore remain unaccepted. No successful final workflow is claimed.

Work on plugins is paused at the user's explicit request to focus exclusively on PdfTableKit, InkTextKit and DenoiseKit. No new test payment remains to refund. Preserve existing Google sessions and the original pending test record. The current private closeout checkpoint records the exact resume location.
