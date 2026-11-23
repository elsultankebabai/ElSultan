# Source Audit — 2026-11-23

## Scope
Examined the user-uploaded source ZIP. Extracted application files, excluded AI Studio temporary media artifacts. Preserved all hero, design, menu and image source files.

## Confirmed defects in uploaded ZIP
- `bun.lock` was an empty 0-byte file. Its presence triggers Bun auto-detection on Cloudflare; the earlier cloud build log showed a frozen-lockfile mismatch.
- No `package-lock.json` was supplied. `npm ci --offline` failed with a missing-lockfile message.
- Both `functions/assets/[[path]].ts` and `functions/images/[[path]].ts` unconditionally returned 404. When a route matches, this can break valid static resources. They now defer to `env.ASSETS.fetch(request)` and convert missing/SPA HTML responses to 404.

## Checks actually executed
- TypeScript source syntax parse of 24 files: 0 parse errors (does NOT replace type-checking).
- Executed menu data using standalone TypeScript transpilation: 39 items, 39 unique IDs, 8 categories, 22 mapped menu images, 0 missing mapped product files, 0 invalid base/variant prices or unresolved referenced extras.
- Executed all 480 combinations of recommendation engine inputs: no thrown exceptions; this is not a full correctness or accessibility test.
- Executed three deterministic lunch-timezone examples: active Monday lunch, inactive Monday evening and Sunday lunch.
- Verified 91 local .jpg/.png/.webp images via Pillow decoder: zero corrupt files.
- Executed `scripts/postbuild-seo.mjs` with a source HTML fixture: root plus 12 localized paths were generated (13 total), and every path had a noindex tag while staging was configured.
- Mocked Pages Functions 6 cases: valid static file -> 200; SPA fallback -> 404; missing file -> 404, for both assets and images handlers.

## Checks NOT completed
- Full `npm ci`, TypeScript type check, Vite build, Lighthouse and browser interaction tests could not be completed: this environment lacked a populated npm package cache and dependency download did not complete.
- Real Cloudflare Pages routing, headers, caching and iOS Safari require a live deployment.
- Official menu prices, visual authenticity of venue photos and owner permission for rating claims require independent restaurant verification.

## Required final release gate
In a network-enabled environment generate `package-lock.json` using `npm install`, commit it, then execute `npm ci && npm run lint && npm run build`. Deploy to a staging Cloudflare URL (`VITE_ALLOW_INDEXING=false`) and test requests for valid JS/CSS/media, missing asset HTTP 404, 13 localized routes, order links, language switching, sound, mobile and PageSpeed performance. Do not claim a verified full production build until these pass.
