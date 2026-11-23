# EL SULTAN — Vilnius Restaurant Website

Static React + Vite + TypeScript website for **EL SULTAN** (`Ūmėdžių g. 2, Vilnius`), supporting **Lithuanian (`/lt`)**, **English (`/en`)**, and **Russian (`/ru`)** with static prerendered SEO routes and Cloudflare Pages compatibility.

## Architecture

- **Frontend**: Static React 19 + Vite + Tailwind CSS v4 (no Node.js / Express backend required).
- **Routing & Prerendering**: `npm run build` compiles the Vite bundle into `dist/` and runs `scripts/postbuild-seo.mjs` to generate crawlable localized HTML for `/`, `/lt`, `/en`, `/ru`, and all `/menu`, `/choose-for-me`, and `/visit` routes.
- **Cloudflare Pages Static Asset 404 Protection**: Lightweight Cloudflare Pages Functions in `functions/assets/[[path]].ts` and `functions/images/[[path]].ts` return HTTP `404` for missing files under `/assets/*` and `/images/*` instead of falling back to `index.html`, while preserving Cloudflare Pages' native SPA fallback for application routes.
- **Security & Caching Headers**: Configured in `public/_headers` (copied automatically into `dist/_headers`).

## Local Development & Production Verification

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Type-check
npm run lint

# Build production bundle + prerender localized routes
npm run build

# Preview production build locally
npm run preview
```

## Deploying via GitHub → Cloudflare Pages

1. Regenerate and commit a valid `package-lock.json` with `npm install`; verify `npm ci && npm run lint && npm run build`. Push the project to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
3. Configure the build settings:
   - **Framework preset**: `None` (or `Vite`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `22.16.0` (or `NODE_VERSION=22.16.0` in Environment Variables)
4. Configure **Environment Variables** (Production only — no secrets required):
   - `VITE_SITE_URL`: Your authorized live production origin without a trailing slash (e.g. `https://your-domain.lt` or `https://el-sultan.pages.dev`).
   - `VITE_ALLOW_INDEXING`: Set to `true` **only** on the live production environment so canonical links, `hreflang`, `sitemap.xml`, and `robots.txt` (`Allow: /`) are generated for your real production domain.
   - Leave both unset (or `VITE_ALLOW_INDEXING=false`) for Preview deployments so staging URLs automatically stay `noindex, nofollow` and `Disallow: /`.
5. Click **Save and Deploy**. Cloudflare Pages will serve `dist/` globally and automatically wire `dist/_headers` and `functions/`.

## Post-Deploy Verification Checklist

After deploying to your live Cloudflare Pages domain, verify:
- Direct load and browser refresh on `/`, `/lt`, `/en`, `/ru`, `/lt/menu`, `/en/menu`, `/ru/menu`, `/lt/choose-for-me`, `/lt/visit`.
- Missing asset URL returns HTTP `404` (not HTML): `curl -I https://<your-domain>/images/does-not-exist.jpg`
- Security & caching headers are present: `curl -I https://<your-domain>/lt`
- Real-device check on iOS Safari (audio remains off by default and unlocks cleanly on tapping the Sound toggle).
