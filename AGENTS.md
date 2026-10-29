# Repository Instructions

- Noteous Preview is a static, local-first web app. Keep the existing vanilla JavaScript, native ES modules, HTML, and CSS architecture; do not add frameworks or dependencies without a clear need.
- The main app is `index.html` and `index.js`. Supporting pages include the gallery, hub, and debug views. Shared browser storage and note helpers live in `modules/`; the service worker is `sw.js`.
- Preserve users' local data. Treat changes to LocalStorage, IndexedDB, imports/exports, and service-worker caches as compatibility-sensitive; avoid destructive migrations or clearing data.
- Keep user-facing text in Brazilian Portuguese and follow the conventions of the files being changed. Avoid unrelated formatting or cleanup.
- There is no package manifest, configured build, or automated test suite in the repository. Do not assume npm scripts exist. For browser-facing changes, validate the affected flow in a browser served over HTTP, including relevant responsive behavior.
- Contribution guidance says to base work on `main-preview` and target pull requests to `main-preview`. Do not switch branches as part of a task unless requested.