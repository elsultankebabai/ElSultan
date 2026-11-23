import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  Locale,
  MenuCategoryId,
  MenuItem,
  calculateUnitWithExtrasCents,
} from './data/menu';
import { TRANSLATIONS } from './i18n/translations';
import { Header, PageId } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HomeShowcase } from './components/HomeShowcase';
import { PageHeader } from './components/PageHeader';
import { SiteFooter } from './components/SiteFooter';
import { AudioControl } from './components/AudioControl';
import { soundManager } from './utils/sound';
import { OrderLineItem, buildOrderLineId } from './utils/orderLine';

const MenuSection = lazy(() =>
  import('./components/MenuSection').then((m) => ({ default: m.MenuSection }))
);
const ChooseForMe = lazy(() =>
  import('./components/ChooseForMe').then((m) => ({ default: m.ChooseForMe }))
);
const BeyondUsualChapter = lazy(() =>
  import('./components/BeyondUsualChapter').then((m) => ({ default: m.BeyondUsualChapter }))
);
const OurPlaceSection = lazy(() =>
  import('./components/OurPlaceSection').then((m) => ({ default: m.OurPlaceSection }))
);
const RegularsValueSection = lazy(() =>
  import('./components/OurPlaceSection').then((m) => ({ default: m.RegularsValueSection }))
);
const OrderingAndLocation = lazy(() =>
  import('./components/OrderingAndLocation').then((m) => ({ default: m.OrderingAndLocation }))
);
const OrderModal = lazy(() =>
  import('./components/OrderingAndLocation').then((m) => ({ default: m.OrderModal }))
);
const PrivacyModal = lazy(() =>
  import('./components/OrderingAndLocation').then((m) => ({ default: m.PrivacyModal }))
);

const CONFIGURED_SITE_URL = (import.meta.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
const ALLOW_INDEXING =
  import.meta.env.VITE_ALLOW_INDEXING === 'true' && Boolean(CONFIGURED_SITE_URL);

function parseUrl(pathname: string, hash: string): { locale: Locale; page: PageId } {
  const parts = pathname
    .split('/')
    .filter(Boolean)
    .map((p) => p.toLowerCase());

  let locale: Locale = 'lt';
  let rest = parts;
  if (parts[0] === 'lt' || parts[0] === 'en' || parts[0] === 'ru') {
    locale = parts[0];
    rest = parts.slice(1);
  }

  const candidate = rest[0] || hash.replace('#', '');
  if (candidate === 'menu') return { locale, page: 'menu' };
  if (candidate === 'choose-for-me') return { locale, page: 'choose-for-me' };
  if (
    candidate === 'visit' ||
    candidate === 'our-place' ||
    candidate === 'beyond-usual' ||
    candidate === 'charcoal-grill'
  ) {
    return { locale, page: 'visit' };
  }

  return { locale, page: 'home' };
}

function buildPath(locale: Locale, page: PageId): string {
  return page === 'home' ? `/${locale}` : `/${locale}/${page}`;
}

const PageLoader: React.FC = () => (
  <div
    aria-busy="true"
    className="min-h-[45vh] bg-[#F3EADA] flex items-center justify-center px-4 py-20"
  >
    <div className="w-8 h-8 rounded-full border-2 border-[#672938]/25 border-t-[#672938] animate-spin" />
  </div>
);

export default function App() {
  const initial =
    typeof window !== 'undefined'
      ? parseUrl(window.location.pathname, window.location.hash)
      : { locale: 'lt' as Locale, page: 'home' as PageId };

  const [locale, setLocale] = useState<Locale>(initial.locale);
  const [activePage, setActivePage] = useState<PageId>(initial.page);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId | 'all'>('all');
  const [highlightedDishId, setHighlightedDishId] = useState<string | undefined>(undefined);
  const [callList, setCallList] = useState<OrderLineItem[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const t = TRANSLATIONS[locale];

  // Handle browser Back / Forward buttons cleanly
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseUrl(window.location.pathname, window.location.hash);
      setLocale(parsed.locale);
      setActivePage(parsed.page);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Ensure every route view begins cleanly at the very top (y = 0)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activePage]);

  // Sync URL path, HTML lang, localized SEO metadata, canonical, and hreflang links
  useEffect(() => {
    const targetPath = buildPath(locale, activePage);
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }

    document.documentElement.lang = locale;

    const pageTitlePrefix =
      activePage === 'menu'
        ? t.nav.menu
        : activePage === 'choose-for-me'
        ? t.nav.chooseForMe
        : activePage === 'visit'
        ? t.nav.visit
        : null;

    const resolvedTitle = pageTitlePrefix
      ? `EL SULTAN — ${pageTitlePrefix} | Vilnius`
      : t.seo.title;

    document.title = resolvedTitle;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute('content', content);
    };

    const ogLocaleMap: Record<Locale, string> = {
      lt: 'lt_LT',
      en: 'en_US',
      ru: 'ru_RU',
    };

    setMeta('meta[name="description"]', t.seo.description);
    setMeta('meta[property="og:title"]', resolvedTitle);
    setMeta('meta[property="og:description"]', t.seo.ogDescription);
    setMeta('meta[property="og:locale"]', ogLocaleMap[locale]);
    setMeta('meta[name="twitter:title"]', resolvedTitle);
    setMeta('meta[name="twitter:description"]', t.seo.ogDescription);

    // Only emit canonical + hreflang URLs when an authorized production domain is configured
    const existingCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const existingAlternates = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="alternate"][hreflang]'
    );

    if (ALLOW_INDEXING && CONFIGURED_SITE_URL) {
      const canonicalHref = `${CONFIGURED_SITE_URL}${targetPath}`;
      if (existingCanonical) {
        existingCanonical.setAttribute('href', canonicalHref);
      } else {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonicalHref);
        document.head.appendChild(link);
      }
      setMeta('meta[property="og:url"]', canonicalHref);

      existingAlternates.forEach((el) => el.remove());
      const suffix = activePage === 'home' ? '' : `/${activePage}`;
      (['lt', 'en', 'ru'] as const).forEach((code) => {
        const alt = document.createElement('link');
        alt.setAttribute('rel', 'alternate');
        alt.setAttribute('hreflang', code);
        alt.setAttribute('href', `${CONFIGURED_SITE_URL}/${code}${suffix}`);
        document.head.appendChild(alt);
      });
      const xDef = document.createElement('link');
      xDef.setAttribute('rel', 'alternate');
      xDef.setAttribute('hreflang', 'x-default');
      xDef.setAttribute('href', `${CONFIGURED_SITE_URL}/lt${suffix}`);
      document.head.appendChild(xDef);
    } else {
      existingCanonical?.remove();
    }
  }, [locale, activePage, t]);

  // Tactile sound listeners (sound remains OFF by default until user enables AudioControl)
  useEffect(() => {
    const onScroll = () => {
      if (soundManager.isMuted()) return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      soundManager.handleScroll(window.scrollY, maxScroll);
    };

    const onDocClick = (e: MouseEvent) => {
      if (soundManager.isMuted()) return;
      const target = (e.target as HTMLElement | null)?.closest('button, a');
      if (!target || target.getAttribute('data-sound-control') === 'true') return;
      soundManager.playClick();
    };

    const onDocPointerOver = (e: PointerEvent) => {
      if (soundManager.isMuted() || e.pointerType !== 'mouse') return;
      const target = (e.target as HTMLElement | null)?.closest('button, a');
      if (!target) return;
      const related = e.relatedTarget as Node | null;
      if (related && target.contains(related)) return;
      soundManager.playTick();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('pointerover', onDocPointerOver, true);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('pointerover', onDocPointerOver, true);
    };
  }, []);

  const navigatePage = useCallback(
    (nextPage: PageId) => {
      const nextPath = buildPath(locale, nextPage);
      if (nextPage !== activePage) {
        window.history.pushState(null, '', nextPath);
        setActivePage(nextPage);
        const pageIndex = ['home', 'menu', 'choose-for-me', 'visit'].indexOf(nextPage);
        soundManager.playChapterEnter(nextPage, Math.max(0, pageIndex));
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    },
    [locale, activePage]
  );

  const handleChangeLocale = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    window.history.pushState(null, '', buildPath(next, activePage));
  };

  const handleExploreDishInMenu = (dishId: string, cat?: MenuCategoryId) => {
    if (cat) setSelectedCategory(cat);
    else setSelectedCategory('all');
    setHighlightedDishId(dishId || undefined);
    navigatePage('menu');
  };

  const handleExploreCategory = (cat: MenuCategoryId) => {
    setSelectedCategory(cat);
    setHighlightedDishId(undefined);
    navigatePage('menu');
  };

  const handleAddCallItem = (
    dish: MenuItem,
    variantId?: string,
    extraIds: string[] = [],
    qty = 1
  ) => {
    const variant = variantId
      ? dish.variants?.find((v) => v.id === variantId)
      : dish.variants?.[0];
    const resolvedVariantId = variant?.id;
    const cleanExtras = [...extraIds].sort();
    const lineId = buildOrderLineId(dish.id, resolvedVariantId, cleanExtras);
    const unitWithExtrasCents = calculateUnitWithExtrasCents(
      dish,
      resolvedVariantId,
      cleanExtras
    );

    setCallList((prev) => {
      const existing = prev.find((c) => c.id === lineId);
      if (existing) {
        return prev.map((c) =>
          c.id === lineId ? { ...c, qty: Math.min(20, c.qty + qty) } : c
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          dishId: dish.id,
          variantId: resolvedVariantId,
          extraIds: cleanExtras,
          unitWithExtrasCents,
          qty: Math.max(1, Math.min(20, qty)),
        },
      ];
    });
  };

  const handleUpdateCallItemQty = (lineId: string, delta: number) => {
    setCallList((prev) =>
      prev
        .map((c) => (c.id === lineId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const handleRemoveCallItem = (lineId: string) => {
    setCallList((prev) => prev.filter((c) => c.id !== lineId));
  };

  const handleToggleCallItem = (dish: MenuItem) => {
    const exists = callList.some((c) => c.dishId === dish.id);
    if (exists) {
      setCallList((prev) => prev.filter((c) => c.dishId !== dish.id));
    } else {
      handleAddCallItem(dish, dish.variants?.[0]?.id, [], 1);
    }
  };

  const visitSubtitle =
    locale === 'ru'
      ? 'Обеденное время по будням, зал в Вильнюсе и все способы заказа.'
      : locale === 'lt'
      ? 'Darbo dienų pietūs, mūsų salė Vilniuje ir patogūs užsakymo būdai.'
      : 'Weekday lunch window, our Vilnius dining room, and direct ordering.';

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EADA] text-[#191B1A]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#672938] focus:text-[#F3EADA] focus:font-bold"
      >
        Skip to content
      </a>

      <Header
        locale={locale}
        t={t}
        activePage={activePage}
        callListCount={callList.reduce((acc, i) => acc + i.qty, 0)}
        onChangeLocale={handleChangeLocale}
        onNavigatePage={navigatePage}
        onOpenOrderModal={() => setOrderModalOpen(true)}
      />

      <main id="main-content" className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <>
            <HeroSection
              locale={locale}
              t={t}
              onExploreMenuDish={handleExploreDishInMenu}
              onOpenChooseForMe={() => navigatePage('choose-for-me')}
              onGoDirectory={() => {
                document
                  .getElementById('home-directory')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
            <HomeShowcase
              locale={locale}
              t={t}
              onNavigatePage={navigatePage}
              onExploreMenuDish={handleExploreDishInMenu}
            />
            <Suspense fallback={null}>
              <RegularsValueSection t={t} />
            </Suspense>
          </>
        )}

        {activePage === 'menu' && (
          <>
            <PageHeader
              locale={locale}
              eyebrow={t.menuSection.eyebrow}
              title={t.menuSection.headline}
              subtitle={t.menuSection.subcopy}
              onGoHome={() => navigatePage('home')}
            />
            <Suspense fallback={<PageLoader />}>
              <MenuSection
                locale={locale}
                t={t}
                selectedCategory={selectedCategory}
                highlightedDishId={highlightedDishId}
                onClearHighlightedDish={() => setHighlightedDishId(undefined)}
                onSelectCategory={setSelectedCategory}
                callList={callList}
                onAddCallItem={handleAddCallItem}
                onUpdateCallItemQty={handleUpdateCallItemQty}
                onRemoveCallItem={handleRemoveCallItem}
                onClearCallList={() => setCallList([])}
              />
            </Suspense>
          </>
        )}

        {activePage === 'choose-for-me' && (
          <>
            <PageHeader
              locale={locale}
              eyebrow={t.chooseForMe.eyebrow}
              title={t.chooseForMe.headline}
              subtitle={t.chooseForMe.intro}
              onGoHome={() => navigatePage('home')}
            />
            <Suspense fallback={<PageLoader />}>
              <ChooseForMe
                locale={locale}
                t={t}
                callListIds={callList.map((c) => c.dishId)}
                onToggleCallList={handleToggleCallItem}
                onExploreDishInMenu={handleExploreDishInMenu}
              />
            </Suspense>
          </>
        )}

        {activePage === 'visit' && (
          <>
            <PageHeader
              locale={locale}
              eyebrow={t.ordering.eyebrow}
              title={t.location.headline}
              subtitle={visitSubtitle}
              onGoHome={() => navigatePage('home')}
            />
            <Suspense fallback={<PageLoader />}>
              <BeyondUsualChapter
                locale={locale}
                t={t}
                onExploreCharcoal={handleExploreCategory}
                onSelectDishInMenu={handleExploreDishInMenu}
                onVisitClick={() => navigatePage('visit')}
              />
              <OurPlaceSection
                locale={locale}
                t={t}
                onExploreCharcoal={handleExploreCategory}
              />
              <OrderingAndLocation locale={locale} t={t} />
            </Suspense>
          </>
        )}
      </main>

      <SiteFooter
        locale={locale}
        t={t}
        onChangeLocale={handleChangeLocale}
        onNavigatePage={navigatePage}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      {orderModalOpen && (
        <Suspense fallback={null}>
          <OrderModal
            open={orderModalOpen}
            t={t}
            onClose={() => setOrderModalOpen(false)}
          />
        </Suspense>
      )}

      {privacyModalOpen && (
        <Suspense fallback={null}>
          <PrivacyModal
            open={privacyModalOpen}
            t={t}
            onClose={() => setPrivacyModalOpen(false)}
          />
        </Suspense>
      )}

      <AudioControl locale={locale} />
    </div>
  );
}
