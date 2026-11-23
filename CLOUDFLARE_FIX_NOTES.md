# EL SULTAN — Cloudflare Pages hotfix

This is a **source-level hotfix**, NOT a verified production build. The approved hero, visual components, restaurant media and menu data are unchanged.

Changes:
1. Removed the empty `bun.lock` causing the reported Cloudflare `bun install --frozen-lockfile` failure. `package-lock.json` was not present in the user's upload and is **not fabricated** here.
2. Fixed `functions/assets/[[path]].ts` and `functions/images/[[path]].ts` to serve legitimate static files via `context.env.ASSETS.fetch(request)` and return 404 only when missing or replaced by an HTML SPA fallback.
3. Added `.node-version` = `22.16.0` as a tested compatible Node release for the declared Vite 8 toolchain.

**Before deploying, in a network-enabled environment:**

```bash
npm install
npm ci
npm run lint
npm run build
```

Commit the new `package-lock.json` along with source changes to GitHub. If any command fails, fix the actual error before deploy. Do not restore `bun.lock` unless using Bun and regenerating it.

Cloudflare Pages:
- Repository root: `/`
- Build command: `npm run build`
- Output directory: `dist`
- NODE_VERSION: `22.16.0` (or let `.node-version` apply)
- For temporary staging: VITE_ALLOW_INDEXING=`false`; VITE_SITE_URL unset.

After deployment, verify `/lt`, `/en`, `/ru`, `/lt/menu`, `/en/choose-for-me`, `/ru/visit`, real image URLs, valid Vite JS/CSS URLs, missing `/assets/missing.js` -> 404, missing `/images/missing.webp` -> 404, and external ordering links. Test mobile Safari and PageSpeed Insights separately.

**Important:** the original archive's `DELIVERABLES_AND_QA.md` may be outdated (it names image files that are absent from the actual public folder). No browser-based real Cloudflare test was performed in this environment.
