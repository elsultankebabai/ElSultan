import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  Locale,
  MenuCategoryId,
} from '../data/menu';
import {
  getCategoryImage,
  getIsolatedHorizontalCategoryImage,
  getIsolatedProductImage,
  getProductImage,
} from '../data/productImages';
import { TranslationBundle } from '../i18n/translations';
import { PageId } from './Header';
import { ChairMark } from './BrandMarks';
import {
  EASE_APPLE,
  EditorialReveal,
  EditorialRule,
  ScrollFloat,
} from './ScrollReveal';
import { soundManager } from '../utils/sound';

interface HomeShowcaseProps {
  locale: Locale;
  t: TranslationBundle;
  onNavigatePage: (page: PageId) => void;
  onExploreMenuDish: (dishId: string, category?: MenuCategoryId) => void;
}

export const HomeShowcase: React.FC<HomeShowcaseProps> = ({
  locale,
  t,
  onNavigatePage,
  onExploreMenuDish,
}) => {
  const prefersReduced = useReducedMotion();
  const [hoveredChapter, setHoveredChapter] = useState<PageId | null>(null);
  const [scrollFocusIdx, setScrollFocusIdx] = useState<number>(0);
  const [hoveredDishIdx, setHoveredDishIdx] = useState<number | null>(null);

  const signaturesSectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: sigScrollProgress } = useScroll({
    target: signaturesSectionRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const smoothSigProgress = useSpring(sigScrollProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  // Subtle upright vertical depth parallax for the 3 signature planes (zero tilt/wobble)
  const planeY0 = useTransform(smoothSigProgress, [0, 0.5, 1], [18, 0, -14]);
  const planeY1 = useTransform(smoothSigProgress, [0, 0.5, 1], [28, -4, -22]);
  const planeY2 = useTransform(smoothSigProgress, [0, 0.5, 1], [16, 0, -12]);
  const planeYs = [planeY0, planeY1, planeY2];

  // Horizontal light sweep position behind the 3 signature columns as you scroll
  const auraX = useTransform(smoothSigProgress, [0, 1], ['16%', '84%']);

  // Track which culinary signature (0 -> 1 -> 2) sits in the active reading window
  useMotionValueEvent(sigScrollProgress, 'change', (latest) => {
    if (prefersReduced) return;
    if (latest < 0.34) setScrollFocusIdx(0);
    else if (latest < 0.67) setScrollFocusIdx(1);
    else setScrollFocusIdx(2);
  });

  useEffect(() => {
    if (prefersReduced) setScrollFocusIdx(0);
  }, [prefersReduced]);

  const activeDishIdx = hoveredDishIdx !== null ? hoveredDishIdx : scrollFocusIdx;

  const kebabsCatImg =
    getIsolatedHorizontalCategoryImage('kebabs') || getCategoryImage('kebabs')?.src;
  const beefShashlikImg =
    getIsolatedProductImage('brandintos-jautienos-saslikas') ||
    getProductImage('brandintos-jautienos-saslikas')?.src;
  const kebabPizzaImg =
    getIsolatedProductImage('pica-kebabu-jautiena') ||
    getProductImage('pica-kebabu-jautiena')?.src;

  const signaturePillars: Array<{
    id: MenuCategoryId;
    kicker: string;
    title: string;
    priceLabel: string;
    description: string;
    img?: string;
    isIsolated: boolean;
    imgAlt: string;
  }> = [
    {
      id: 'kebabs',
      kicker:
        locale === 'ru'
          ? '4 вкуса в лаваше'
          : locale === 'lt'
          ? '4 skoniai lavaše'
          : '4 wraps in lavash',
      title: locale === 'ru' ? 'Кебабы' : locale === 'lt' ? 'Kebabai' : 'Kebabs',
      priceLabel:
        locale === 'ru' ? 'от €6.50' : locale === 'lt' ? 'nuo €6.50' : 'from €6.50',
      description:
        locale === 'ru'
          ? 'Кебаб Султана, Американо, Панеряй и веганский — в свежем хрустящем лаваше с курицей или говядиной.'
          : locale === 'lt'
          ? 'Sultono, Amerikonas, Panerių ir veganiškas — šviežiai susukti traškiame lavaše su vištiena arba jautiena.'
          : "Sultan's, Amerikonas, Paneriai, and vegan — freshly grilled in crisp lavash with chicken or beef.",
      img: kebabsCatImg,
      isIsolated: Boolean(getIsolatedHorizontalCategoryImage('kebabs')),
      imgAlt:
        getCategoryImage('kebabs')?.alt[locale] ||
        (locale === 'ru' ? 'Кебабы EL SULTAN в лаваше' : locale === 'lt' ? 'EL SULTAN kebabai lavaše' : 'EL SULTAN lavash kebabs'),
    },
    {
      id: 'charcoal',
      kicker:
        locale === 'ru'
          ? '6 блюд на живых углях'
          : locale === 'lt'
          ? '6 patiekalai ant žarijų'
          : '6 dishes off the coals',
      title:
        locale === 'ru'
          ? 'Шашлык и гриль'
          : locale === 'lt'
          ? 'Šašlikai ir grilis'
          : 'Shashlik & Grill',
      priceLabel:
        locale === 'ru' ? 'от €10.00' : locale === 'lt' ? 'nuo €10.00' : 'from €10.00',
      description:
        locale === 'ru'
          ? 'Шашлык из выдержанной говядины и курицы, люля-кебаб, четверть и крылышки на углях с рисом или фри.'
          : locale === 'lt'
          ? 'Brandintos jautienos ir vištienos šašlikai, liulia kebabas, ketvirtis ir sparneliai ant žarijų su ryžiais arba bulvytėmis.'
          : 'Aged beef and chicken shashlik, beef lula kebab, chicken quarter, and wings off live coals with rice or fries.',
      img: beefShashlikImg,
      isIsolated: Boolean(getIsolatedProductImage('brandintos-jautienos-saslikas')),
      imgAlt:
        getProductImage('brandintos-jautienos-saslikas')?.alt[locale] ||
        (locale === 'ru' ? 'Шашлык и гриль EL SULTAN' : locale === 'lt' ? 'EL SULTAN šašlikai ant žarijų' : 'EL SULTAN charcoal shashlik and grill'),
    },
    {
      id: 'pizza',
      kicker:
        locale === 'ru'
          ? '5 видов · Средняя и Большая'
          : locale === 'lt'
          ? '5 rūšys · Vidutinė ir Didelė'
          : '5 varieties · Medium & Large',
      title: locale === 'ru' ? 'Пиццы' : locale === 'lt' ? 'Picos' : 'Pizzas',
      priceLabel:
        locale === 'ru' ? 'от €11.00' : locale === 'lt' ? 'nuo €11.00' : 'from €11.00',
      description:
        locale === 'ru'
          ? 'С куриным или говяжьим кебабом, вегетарианская, с куриными колбасками и говяжьей колбасой — средняя и большая.'
          : locale === 'lt'
          ? 'Su vištienos ar jautienos kebabo mėsa, vegetariška, su vištienos dešrelėmis ar jautienos dešra — vidutinė ir didelė.'
          : 'Chicken or beef kebab, vegetarian, chicken sausage, and beef sausage pizzas — baked fresh in medium and large.',
      img: kebabPizzaImg,
      isIsolated: Boolean(getIsolatedProductImage('pica-kebabu-jautiena')),
      imgAlt:
        locale === 'ru'
          ? 'Пиццы EL SULTAN — свежая выпечка в двух размерах'
          : locale === 'lt'
          ? 'EL SULTAN picos — šviežiai keptos, vidutinės ir didelės'
          : 'EL SULTAN freshly baked pizzas in medium and large',
    },
  ];

  const directoryItems: Array<{
    page: Exclude<PageId, 'home'>;
    index: string;
    kicker: string;
    title: string;
    note: string;
    previewImg?: string;
  }> = [
    {
      page: 'menu',
      index: '01',
      kicker:
        locale === 'ru'
          ? 'Кебабы · Угли · Пицца'
          : locale === 'lt'
          ? 'Kebabai · Žarijos · Picos'
          : 'Kebabs · Charcoal · Pizza',
      title: t.menuSection.headline,
      note:
        locale === 'ru'
          ? 'Весь ассортимент кухни с ценами, составом и быстрым списком для звонка.'
          : locale === 'lt'
          ? 'Visas restorano meniu su tiksliomis kainomis, sudėtimi ir atsiėmimo sąrašu.'
          : 'Full kitchen ledger with live pricing, ingredients, allergens & pickup list.',
      previewImg: kebabsCatImg,
    },
    {
      page: 'choose-for-me',
      index: '02',
      kicker:
        locale === 'ru'
          ? 'Персональный подбор'
          : locale === 'lt'
          ? '4 greiti žingsniai'
          : 'Guided 4-Step Match',
      title: t.chooseForMe.headline,
      note:
        locale === 'ru'
          ? 'Подберём точное блюдо по вашему бюджету, поводу и способу заказа.'
          : locale === 'lt'
          ? 'Atrinkime tikslų patiekalą pagal biudžetą, laiką ir norimą skonį.'
          : 'Interactive pairing engine tuned to budget, timing & dietary preference.',
      previewImg: beefShashlikImg,
    },
    {
      page: 'visit',
      index: '03',
      kicker: 'Ūmėdžių g. 2 · Vilnius',
      title:
        locale === 'ru'
          ? 'ВИЗИТ И ОБЕДЫ.'
          : locale === 'lt'
          ? 'ATVYKIMAS IR PIETŪS.'
          : 'VISIT & DINING.',
      note:
        locale === 'ru'
          ? 'Часы работы, обеденное время I–V, отзывы гостей и каналы заказа.'
          : locale === 'lt'
          ? 'Darbo laikas, darbo dienų pietūs, svečių įspūdiai ir atvykimo gidas.'
          : 'Opening hours, calm weekday lunch window, dining room notes & map.',
      previewImg: kebabPizzaImg,
    },
  ];

  return (
    <>
      {/* SECTION 01: EXPLORE PAGES EDITORIAL DIRECTORY (Clean Warm Bone Architectural Band) */}
      <section
        id="home-directory"
        className="relative bg-[#F3EADA] text-[#191B1A] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-b border-[#191B1A]/12"
      >
        {/* Subtle scroll-depth Chair emblem anchored cleanly in lower-right open breathing space */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none hidden sm:block absolute -right-10 bottom-2 opacity-[0.045]"
        >
          <ScrollFloat yRange={[-24, 24]} xRange={[0, 0]} rotateRange={[0, 0]} scaleRange={[0.98, 1.02]}>
            <ChairMark tone="burgundy" className="w-[260px] lg:w-[340px] h-auto" />
          </ScrollFloat>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <EditorialReveal yOffset={16} className="flex flex-wrap items-baseline justify-between gap-4 pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#672938]">
              {locale === 'ru'
                ? 'Разделы сайта'
                : locale === 'lt'
                ? 'Tinklalapio puslapiai'
                : 'Explore Pages'}
            </p>
            <p className="text-xs text-[#191B1A]/55 font-bold uppercase tracking-[0.14em]">
              {locale === 'ru'
                ? 'Выберите раздел'
                : locale === 'lt'
                ? 'Pasirinkite puslapį'
                : 'Select a destination'}
            </p>
          </EditorialReveal>

          <EditorialRule tone="dark" />

          <div>
            {directoryItems.map((item, idx) => {
              const isHovered = hoveredChapter === item.page;
              return (
                <React.Fragment key={item.page}>
                  <motion.a
                    href={`/${locale}/${item.page}`}
                    initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE_APPLE }}
                    onClick={(e) => {
                      e.preventDefault();
                      soundManager.playConfirm();
                      onNavigatePage(item.page);
                    }}
                    onMouseEnter={() => {
                      setHoveredChapter(item.page);
                      soundManager.playTick();
                    }}
                    onMouseLeave={() => setHoveredChapter(null)}
                    className="group relative py-6 sm:py-9 lg:py-11 flex items-center justify-between gap-4 sm:gap-6 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#672938]"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-10 min-w-0">
                      <span className="font-display text-sm sm:text-base text-[#672938] tabular-nums shrink-0">
                        {item.index}
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#191B1A]/55 group-hover:text-[#672938] transition-colors">
                          {item.kicker}
                        </span>
                        <h2 className="font-display text-[clamp(1.75rem,4.6vw,3.9rem)] leading-[0.9] tracking-[-0.03em] text-[#191B1A] group-hover:text-[#672938] group-hover:translate-x-2 transition-all duration-300 uppercase">
                          {item.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#191B1A]/75 max-w-xl leading-relaxed">
                          {item.note}
                        </p>
                      </div>
                    </div>

                    {/* Meaningful contextual destination dish preview shown intentionally on desktop row hover */}
                    <div className="flex items-center gap-5 shrink-0">
                      {item.previewImg && (
                        <img
                          src={item.previewImg}
                          alt=""
                          aria-hidden="true"
                          className={`hidden lg:block w-28 aspect-[3/2] ${
                            item.previewImg.endsWith('.webp')
                              ? 'object-contain drop-shadow-[0_10px_14px_rgba(25,27,26,0.28)]'
                              : 'object-cover object-center rounded-2xl shadow-sm'
                          } transition-all duration-300 pointer-events-none ${
                            isHovered
                              ? 'opacity-100 scale-105 -translate-y-1'
                              : 'opacity-0 scale-95 translate-y-2'
                          }`}
                        />
                      )}
                      <span className="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-[#191B1A]/[0.06] border border-[#191B1A]/16 flex items-center justify-center text-[#191B1A] group-hover:bg-[#672938] group-hover:border-[#672938] group-hover:text-[#F3EADA] group-hover:scale-105 transition-all duration-200">
                        <ArrowRight
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </motion.a>
                  <EditorialRule tone="dark" delay={0.04 * (idx + 1)} />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 02: THREE SIGNATURES GALLERY (Smart Scroll-Spotlight + Upright Depth Choreography) */}
      <section
        ref={signaturesSectionRef}
        id="home-signatures"
        className="relative bg-[#191B1A] text-[#F3EADA] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 border-b border-[#F3EADA]/14 overflow-hidden"
      >
        {/* Subtle Scroll-Linked Warm Dining Table Spotlight sweeping across desktop showcase */}
        {!prefersReduced && (
          <motion.div
            aria-hidden="true"
            style={{ left: auraX }}
            className="hidden md:block pointer-events-none absolute top-[54%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] rounded-full bg-gradient-to-tr from-[#672938]/38 via-[#C98B54]/14 to-transparent blur-3xl opacity-80"
          />
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto space-y-8 lg:space-y-12">
          <div className="space-y-6">
            <EditorialReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C98B54]">
                  {locale === 'ru'
                    ? 'Кебабы · Шашлык · Пиццы'
                    : locale === 'lt'
                    ? 'Kebabai · Šašlikai · Picos'
                    : 'Kebabs · Shashlik · Pizzas'}
                </p>
                <h2 className="font-display text-[clamp(1.9rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.03em] text-[#F3EADA] uppercase">
                  {locale === 'ru'
                    ? 'ТРИ ВКУСА СТОЛА.'
                    : locale === 'lt'
                    ? 'TRYS STALO ŽVAIGŽDĖS.'
                    : 'THREE SIGNATURES.'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playConfirm();
                  onNavigatePage('menu');
                }}
                className="group self-start sm:self-auto inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#672938] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#7d3345] transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54]"
              >
                <span>{t.hero.ctaMenu}</span>
                <ArrowRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </EditorialReveal>
            <EditorialRule tone="light" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-[#F3EADA]/14 divide-y md:divide-y-0 divide-[#F3EADA]/14">
            {signaturePillars.map((pillar, idx) => {
              const isFocused = activeDishIdx === idx;
              const depthY = planeYs[idx] || planeY0;

              return (
                <motion.button
                  key={pillar.id}
                  type="button"
                  initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{ duration: 0.6, delay: idx * 0.09, ease: EASE_APPLE }}
                  onMouseEnter={() => {
                    setHoveredDishIdx(idx);
                    soundManager.playTick();
                  }}
                  onMouseLeave={() => setHoveredDishIdx(null)}
                  onFocus={() => setHoveredDishIdx(idx)}
                  onBlur={() => setHoveredDishIdx(null)}
                  onClick={() => {
                    soundManager.playConfirm();
                    onExploreMenuDish('', pillar.id);
                  }}
                  className={`group relative text-left py-5 md:py-3 flex md:flex-col justify-between items-center md:items-stretch gap-4 md:gap-5 cursor-pointer transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C98B54] ${
                    idx === 0
                      ? 'md:pr-8'
                      : idx === 1
                      ? 'md:px-8'
                      : 'md:pl-8'
                  }`}
                >
                  {/* Meaningful Active Spotlight Hairline on Desktop */}
                  <div className="hidden md:block relative h-[2px] w-full bg-[#F3EADA]/10 overflow-hidden">
                    <motion.div
                      animate={{ scaleX: isFocused ? 1 : 0.15, opacity: isFocused ? 1 : 0.35 }}
                      transition={{ duration: 0.45, ease: EASE_APPLE }}
                      style={{ transformOrigin: '0% 50%' }}
                      className="h-full w-full bg-[#C98B54]"
                    />
                  </div>

                  {/* Desktop Top Category Kicker + Starting Price */}
                  <div className="hidden md:flex items-baseline justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                    <span
                      className={`tabular-nums transition-colors duration-300 ${
                        isFocused ? 'text-[#C98B54]' : 'text-[#F3EADA]/55'
                      }`}
                    >
                      0{idx + 1} · {pillar.kicker}
                    </span>
                    <span className="font-display text-lg text-[#F3EADA] tabular-nums shrink-0 normal-case">
                      {pillar.priceLabel}
                    </span>
                  </div>

                  {/* Upright Scroll-Parallax Presentation (Isolated cutout over dark charcoal stage) */}
                  {pillar.img && (
                    <motion.div
                      style={prefersReduced ? undefined : { y: depthY }}
                      className={`relative w-28 h-22 sm:w-36 sm:h-28 md:w-full md:h-[250px] lg:h-[290px] shrink-0 flex items-center justify-center ${
                        pillar.isIsolated ? '' : 'rounded-3xl overflow-hidden bg-[#141615] shadow-md'
                      }`}
                    >
                      {pillar.isIsolated && (
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black/70 blur-lg ${
                            pillar.id === 'kebabs'
                              ? 'bottom-8 w-[80%] h-5'
                              : 'bottom-1 w-[72%] h-5'
                          }`}
                        />
                      )}
                      <img
                        src={pillar.img}
                        alt={pillar.imgAlt}
                        width={pillar.id === 'kebabs' ? 960 : 800}
                        height={pillar.id === 'kebabs' ? 393 : 600}
                        loading="lazy"
                        decoding="async"
                        className={`max-w-full max-h-full transition-transform duration-500 will-change-transform ${
                          pillar.isIsolated
                            ? 'relative z-10 w-full h-full object-contain object-center drop-shadow-[0_18px_22px_rgba(0,0,0,0.68)]'
                            : 'w-full h-full object-cover object-center'
                        } ${
                          isFocused
                            ? 'md:scale-[1.04]'
                            : 'md:scale-100 md:opacity-92'
                        }`}
                      />
                    </motion.div>
                  )}

                  {/* Pillar Title + Description + Action */}
                  <div className="flex-1 md:flex-none min-w-0 md:border-t md:border-[#F3EADA]/12 md:pt-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <span className="md:hidden block text-[11px] font-bold uppercase tracking-[0.14em] text-[#C98B54] tabular-nums">
                          0{idx + 1} · {pillar.priceLabel} · {pillar.kicker}
                        </span>
                        <h3
                          className={`font-display text-lg sm:text-xl md:text-2xl tracking-tight transition-colors leading-snug ${
                            isFocused ? 'text-[#C98B54]' : 'text-[#F3EADA] group-hover:text-[#C98B54]'
                          }`}
                        >
                          {pillar.title}
                        </h3>
                      </div>
                      <span
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isFocused
                            ? 'bg-[#672938] border-[#672938] text-[#F3EADA] scale-105'
                            : 'border-[#F3EADA]/22 text-[#F3EADA] group-hover:bg-[#672938] group-hover:border-[#672938]'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </div>

                    <p
                      className={`hidden md:block text-xs leading-relaxed line-clamp-2 transition-colors duration-300 ${
                        isFocused ? 'text-[#F3EADA]/85' : 'text-[#F3EADA]/60'
                      }`}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
