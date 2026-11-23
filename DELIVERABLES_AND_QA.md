# EL SULTAN — Deliverables, Asset Guide & Owner Verification Notes

## 1. Editable Menu & Translations
- **Menu data (`src/data/menu.ts`)**: All dishes, EUR prices, size/protein variations, ingredients, allergens, dietary flags, and verified ordering channels (`dine_in`, `phone`, `wolt`, `bolt`) live in `MENU_ITEMS` and `RESTAURANT_INFO`. Updating a price, toggling `available: false`, or swapping a photo path requires only editing `src/data/menu.ts`.
- **Translations (`src/i18n/translations.ts`)**: All Lithuanian (`lt`), English (`en`), and Russian (`ru`) copy is organized in typed translation bundles ready for native-language review.

## 2. Visual Assets & Replacement Guide
- Authentic restaurant photography extracted from the approved Brand Standards PDF is stored in `public/assets/brand/`:
  - `interior_chairs.jpg` — Dining room black curved chairs, burgundy seats, and vertical wooden slat wall.
  - `img_31_899x756.jpg` — Exterior restaurant facade at Ūmėdžių g. 2, Vilnius.
  - `lunch_guest_clean.jpg` — Everyday lunch break scene inside the dining room.
  - `friends_moment_frame.jpg` — Everyday friends scene with localized top-left brand overlay.
  - `charcoal_skewers_plate.jpg`, `img_36_1164x406.jpg`, `img_27_391x275.jpg` — Charcoal grill and mixed meat platters.
  - `img_20_311x759.jpg`, `img_25_646x762.jpg` — Branded EL SULTAN lavash wraps.
  - `img_29_826x761.jpg`, `img_21_582x759.jpg`, `img_19_594x759.jpg` — Apron, kraft takeaway bag, and menu book.
- Items flagged `imagePlaceholderNotice: true` in `src/data/menu.ts` (pizzas, chebureki, individual snack sides, drinks) currently display representative brand imagery and a quiet caption; replace their `image` path with studio dish photos when ready and remove `imagePlaceholderNotice`.

## 3. Items Flagged for Owner Confirmation Before Launch
1. **Exact Pizza & Side Prices / Sizes**: Verify pizza diameters (e.g., 32 cm / 42 cm) and any seasonal price adjustments against the physical counter menu at Ūmėdžių g. 2.
2. **Allergen Matrix**: Confirm exact allergen details per house sauce (garlic, mild, spicy) and cross-contamination disclaimer with the kitchen team.
3. **Parking Details**: Confirm exact nearby street/courtyard parking instructions in Žemieji Paneriai.
4. **Named Guest Reviews**: Individual customer quotes with names were intentionally omitted; add them only with explicit owner and author approval.
5. **Social Handles & Delivery Platform Deep Links**: Verify exact Bolt Food store slug and official Facebook/Instagram profile URLs before publishing.

## 4. Deployment Instructions
1. Install dependencies: `npm install`
2. Build static production bundle: `npm run build` (outputs to `dist/`)
3. Configure SPA fallback rewrite on your hosting provider (`/* -> /index.html`) so direct visits to `/lt`, `/en`, and `/ru` resolve cleanly.
