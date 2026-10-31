# Repository Instructions for Agents

- noteous preview is a static, local-first web app. Keep the existing vanilla JavaScript, native ES modules, HTML, and CSS architecture; do not add frameworks or dependencies without a clear need.
- The main app is `index.html` and `index.js`. Supporting pages include the gallery, hub, and debug views. Shared browser storage and note helpers live in `modules/`; the service worker is `sw.js`.
- Preserve users' local data and existing worktree changes. Treat LocalStorage, IndexedDB, imports/exports, migrations, and service-worker caches as compatibility-sensitive; avoid destructive changes. Pay special attention to `modules/storage-service.js` and `sw.js` when changing persistence or caching.
- Keep user-facing text in Brazilian Portuguese. Write code identifiers and comments in English and follow the conventions of the files being changed. Avoid unrelated formatting or cleanup.
- There is no package manifest, configured build, or automated test suite in the repository. Do not assume npm scripts exist.
- For browser-facing changes, when browser tools are available, start the app with `node dev-server.js` from the repository root and open `http://localhost:5500`; do not open the HTML file directly. Test the affected flow at narrow and wide viewport sizes and check the browser console.
- CONTRIBUTING.md guidance says to base work on `main-preview` and target pull requests to `main-preview`. Do not switch branches as part of a task unless requested.

## Implementation

- Investigate relevant code and project instructions. Understand current behavior and look for existing solutions and patterns.
- Ask before assuming when an important product or behavior decision is ambiguous.
- Make complete, focused changes that preserve existing behavior and avoid unrelated changes. Update directly affected documentation when needed.
- Verify the requested behavior end to end, not just that the code compiles. Run appropriate tests and checks, covering relevant states and cases such as themes, editing, closing, and returning.
- Use isolated test data; do not modify or delete real user data.
- If an attempt does not fully solve the problem, investigate and iterate.
- Summarize the changes and validation. Clearly state what could not be tested and why; never claim a check was performed when it was not.