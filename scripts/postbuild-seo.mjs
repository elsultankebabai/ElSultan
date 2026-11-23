import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('[postbuild-seo] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const rawSiteUrl = (process.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
const allowIndexing = process.env.VITE_ALLOW_INDEXING === 'true' && Boolean(rawSiteUrl);
const siteUrl = allowIndexing ? rawSiteUrl : '';

const LOCALES = ['lt', 'en', 'ru'];

const ROUTE_META = {
  lt: {
    ogLocale: 'lt_LT',
    pages: {
      home: {
        title: 'EL SULTAN — Kebabai ir patiekalai ant žarijų | Vilnius',
        description:
          'EL SULTAN — tavo vieta Vilniuje, Ūmėdžių g. 2. Švieži kebabai lavaše, brandintos jautienos ir vištienos šašlikai ant žarijų, picos bei pietūs vietoje ar išsinešimui.',
        h1: 'EL SULTAN — Čia Tavo Vieta | Vilnius',
        summary:
          'Kebabai lavaše, šašlikai ant tikrų medžio žarijų, picos, lėkštės ir darbo dienų pietūs Vilniuje, Ūmėdžių g. 2.',
      },
      menu: {
        title: 'EL SULTAN — Meniu | Vilnius',
        description:
          'Visas EL SULTAN meniu Vilniuje: perkamiausi patiekalai, kebabai lavaše, šašlikai ant žarijų, picos, lėkštės, užkandžiai, sriubos ir gėrimai su kainomis.',
        h1: 'EL SULTAN Meniu — Vilnius',
        summary:
          'Perkamiausi patiekalai, kebabai lavaše nuo €6.50, šašlikai ant žarijų nuo €10.00, picos nuo €11.00 ir šeimos lėkštės.',
      },
      'choose-for-me': {
        title: 'EL SULTAN — Parink man | Vilnius',
        description:
          'Greitas EL SULTAN patiekalų parinkimas pagal progą, biudžetą ir skonį — raskite tobulą kebabą, šašliką ant žarijų ar picą Vilniuje.',
        h1: 'EL SULTAN — Parink man',
        summary:
          'Interaktyvus patiekalų parinkiklis vienam, dviem ar kompanijai pagal biudžetą ir užsakymo būdą.',
      },
      visit: {
        title: 'EL SULTAN — Atvykimas ir darbo laikas | Vilnius',
        description:
          'EL SULTAN restoranas Vilniuje, Ūmėdžių g. 2 (Žemieji Paneriai). Darbo laikas I–IV ir VII 10:00–21:00, V–VI 10:00–22:00. Telefonas +370 628 23001.',
        h1: 'EL SULTAN — Ūmėdžių g. 2, Vilnius',
        summary:
          'Apsilankykite mūsų jaukioje salėje Vilniuje, užsisakykite atsiėmimui telefonu +370 628 23001 arba per Wolt ir Bolt Food.',
      },
    },
  },
  en: {
    ogLocale: 'en_US',
    pages: {
      home: {
        title: 'EL SULTAN — Kebabs & Charcoal Grill | Vilnius',
        description:
          'EL SULTAN at Ūmėdžių g. 2, Vilnius. Fresh lavash kebabs, aged-beef and chicken shashlik off live charcoal, pizzas, and weekday lunch dine-in or takeaway.',
        h1: 'EL SULTAN — Your Place in Vilnius',
        summary:
          'Lavash kebabs, live-charcoal shashlik, baked pizzas, plates, and everyday hospitality at Ūmėdžių g. 2, Vilnius.',
      },
      menu: {
        title: 'EL SULTAN — Menu | Vilnius',
        description:
          'Full EL SULTAN kitchen menu in Vilnius: Most Ordered dishes, lavash kebabs, charcoal shashlik & grill, pizzas, plates, snacks, soups, and drinks with prices.',
        h1: 'EL SULTAN Menu — Vilnius',
        summary:
          'Most ordered favourites, lavash kebabs from €6.50, charcoal shashlik from €10.00, pizzas from €11.00, and family plates.',
      },
      'choose-for-me': {
        title: 'EL SULTAN — Choose for Me | Vilnius',
        description:
          'Quick guided meal recommendation from EL SULTAN Vilnius based on group size, budget, and flavour preference.',
        h1: 'EL SULTAN — Choose for Me',
        summary:
          'Answer 4 quick steps to match your exact kebab, charcoal grill platter, or pizza at EL SULTAN.',
      },
      visit: {
        title: 'EL SULTAN — Visit & Hours | Vilnius',
        description:
          'Visit EL SULTAN at Ūmėdžių g. 2, Vilnius. Open Mon–Thu & Sun 10:00–21:00, Fri–Sat 10:00–22:00. Call +370 628 23001 for takeaway or order on Wolt & Bolt Food.',
        h1: 'EL SULTAN — Ūmėdžių g. 2, Vilnius',
        summary:
          'Calm weekday lunch window, dining room in Žemieji Paneriai, phone pickup (+370 628 23001), Wolt, and Bolt Food.',
      },
    },
  },
  ru: {
    ogLocale: 'ru_RU',
    pages: {
      home: {
        title: 'EL SULTAN — Кебабы и шашлык на углях | Вильнюс',
        description:
          'EL SULTAN в Вильнюсе, Ūmėdžių g. 2. Свежие кебабы в лаваше, шашлык из выдержанной говядины и курицы на живых углях, пицца и обеды в зале или навынос.',
        h1: 'EL SULTAN — Ваше место в Вильнюсе',
        summary:
          'Кебабы в лаваше, шашлык на живых углях, пиццы, тарелки и уютный зал в Вильнюсе по адресу Ūmėdžių g. 2.',
      },
      menu: {
        title: 'EL SULTAN — Меню | Вильнюс',
        description:
          'Полное меню EL SULTAN в Вильнюсе: самые популярные блюда, кебабы в лаваше, шашлык и гриль на углях, пиццы, тарелки, закуски, супы и напитки с ценами.',
        h1: 'Меню EL SULTAN — Вильнюс',
        summary:
          'Чаще всего заказываемые блюда, кебабы от €6.50, шашлык на углях от €10.00, пиццы от €11.00 и семейные тарелки.',
      },
      'choose-for-me': {
        title: 'EL SULTAN — Подбери мне | Вильнюс',
        description:
          'Быстрый подбор блюда в EL SULTAN Вильнюс по бюджету, компании и предпочтениям — кебабы, шашлык на углях или пицца.',
        h1: 'EL SULTAN — Подбери мне',
        summary:
          '4 простых шага, чтобы подобрать идеальное блюдо для обеда, ужина или компании в EL SULTAN.',
      },
      visit: {
        title: 'EL SULTAN — Визит и часы работы | Вильнюс',
        description:
          'Ресторан EL SULTAN в Вильнюсе, Ūmėdžių g. 2. Часы работы: Пн–Чт и Вс 10:00–21:00, Пт–Сб 10:00–22:00. Телефон +370 628 23001.',
        h1: 'EL SULTAN — Ūmėdžių g. 2, Вильнюс',
        summary:
          'Обеденное время по будням, зал в Вильнюсе, заказ навынос по телефону +370 628 23001, а также Wolt и Bolt Food.',
      },
    },
  },
};

const PAGES = ['home', 'menu', 'choose-for-me', 'visit'];
const baseTemplate = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function routePath(locale, page) {
  return page === 'home' ? `/${locale}` : `/${locale}/${page}`;
}

function buildPageHtml(locale, page) {
  const localeData = ROUTE_META[locale];
  const meta = localeData.pages[page];
  const pathStr = routePath(locale, page);
  const pageSuffix = page === 'home' ? '' : `/${page}`;

  let html = baseTemplate;
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${locale}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${localeData.ogLocale}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  );

  const headInjectLines = [];
  if (allowIndexing && siteUrl) {
    const absUrl = `${siteUrl}${pathStr}`;
    const absOgImage = `${siteUrl}/og-share.jpg`;
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:image" content="${absOgImage}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:image" content="${absOgImage}" />`
    );
    html = html.replace(/"image":\s*"\/og-share\.jpg"/, `"url": "${absUrl}",\n        "image": "${absOgImage}"`);
    headInjectLines.push(`<link rel="canonical" href="${absUrl}" />`);
    headInjectLines.push(`<meta property="og:url" content="${absUrl}" />`);
    for (const altLocale of LOCALES) {
      headInjectLines.push(
        `<link rel="alternate" hreflang="${altLocale}" href="${siteUrl}/${altLocale}${pageSuffix}" />`
      );
    }
    headInjectLines.push(
      `<link rel="alternate" hreflang="x-default" href="${siteUrl}/lt${pageSuffix}" />`
    );
  } else {
    headInjectLines.push('<meta name="robots" content="noindex, nofollow" />');
  }

  html = html.replace('<!-- SEO_HEAD_INJECT -->', headInjectLines.join('\n    '));

  const noscriptBlock = `<noscript>
      <main style="max-width:860px;margin:0 auto;padding:40px 24px;font-family:sans-serif;color:#191B1A;">
        <h1>${escapeHtml(meta.h1)}</h1>
        <p>${escapeHtml(meta.summary)}</p>
        <p>Ūmėdžių g. 2, Vilnius · +370 628 23001 · elsultankebabai@gmail.com</p>
        <p>Mon–Thu &amp; Sun: 10:00–21:00 · Fri–Sat: 10:00–22:00</p>
        <nav>
          <a href="/${locale}">Home</a> ·
          <a href="/${locale}/menu">Menu</a> ·
          <a href="/${locale}/choose-for-me">Choose for Me</a> ·
          <a href="/${locale}/visit">Visit</a>
        </nav>
      </main>
    </noscript>`;

  html = html.replace('<!-- SEO_NOSCRIPT_INJECT -->', noscriptBlock);
  return html;
}

// 1. Update root dist/index.html (default Lithuanian home)
fs.writeFileSync(INDEX_HTML_PATH, buildPageHtml('lt', 'home'), 'utf8');

// 2. Generate all 12 static prerendered language + page routes
let generatedRoutes = 0;
for (const locale of LOCALES) {
  for (const page of PAGES) {
    const relDir = page === 'home' ? locale : path.join(locale, page);
    const outDir = path.join(DIST_DIR, relDir);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), buildPageHtml(locale, page), 'utf8');
    generatedRoutes += 1;
  }
}

// 3. Generate robots.txt & sitemap.xml cleanly based on indexing authorization
const robotsPath = path.join(DIST_DIR, 'robots.txt');
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');

if (allowIndexing && siteUrl) {
  fs.writeFileSync(
    robotsPath,
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    'utf8'
  );

  const urlBlocks = [];
  for (const page of PAGES) {
    const pageSuffix = page === 'home' ? '' : `/${page}`;
    for (const locale of LOCALES) {
      const loc = `${siteUrl}/${locale}${pageSuffix}`;
      const alternates = [
        ...LOCALES.map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt}" href="${siteUrl}/${alt}${pageSuffix}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/lt${pageSuffix}" />`,
      ].join('\n');
      urlBlocks.push(`  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlBlocks.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(
    `[postbuild-seo] Generated ${generatedRoutes} prerendered routes, sitemap.xml, and indexable robots.txt for ${siteUrl}`
  );
} else {
  fs.writeFileSync(robotsPath, 'User-agent: *\nDisallow: /\n', 'utf8');
  if (fs.existsSync(sitemapPath)) fs.unlinkSync(sitemapPath);
  console.log(
    `[postbuild-seo] Generated ${generatedRoutes} prerendered routes with preview noindex/Disallow (set VITE_SITE_URL + VITE_ALLOW_INDEXING=true for production indexing)`
  );
}
