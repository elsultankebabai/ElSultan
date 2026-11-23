import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  Locale,
  MENU_ITEMS,
  MenuCategoryId,
  formatCents,
} from '../data/menu';
import {
  getCategoryImage,
  getIsolatedCategoryImage,
  getIsolatedProductImage,
  getProductImage,
} from '../data/productImages';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import { EASE_APPLE } from './ScrollReveal';
import { soundManager } from '../utils/sound';
import { AudioControl } from './AudioControl';

interface HeroSectionProps {
  locale: Locale;
  t: TranslationBundle;
  onExploreMenuDish: (dishId: string, category?: MenuCategoryId) => void;
  onOpenChooseForMe: () => void;
  onGoDirectory?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  locale,
  t,
  onExploreMenuDish,
  onOpenChooseForMe,
  onGoDirectory,
}) => {
  const prefersReduced = useReducedMotion();
  const [activeCardId, setActiveCardId] = useState<string>('brandintos-jautienos-saslikas');
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 24 });

  const signatureDishes = useMemo(() => {
    const specs: Array<{
      id: string;
      targetDishId: string;
      index: string;
      title: string;
      note: string;
      price: string;
      category: MenuCategoryId;
      isCategoryAsset?: boolean;
    }> = [
      {
        id: 'brandintos-jautienos-saslikas',
        targetDishId: '',
        index: '01',
        title:
          locale === 'ru'
            ? 'Шашлык и гриль'
            : locale === 'lt'
            ? 'Šašlikai ir grilis'
            : 'Shashlik & Grill',
        note:
          locale === 'ru'
            ? '6 блюд на живых углях'
            : locale === 'lt'
            ? '6 patiekalai ant tikrų žarijų'
            : '6 dishes off live coals',
        price:
          locale === 'ru'
            ? 'от €10.00'
            : locale === 'lt'
            ? 'nuo €10.00'
            : 'from €10.00',
        category: 'charcoal',
      },
      {
        id: 'kebabas-lavase',
        targetDishId: '',
        index: '02',
        title:
          locale === 'ru'
            ? 'Кебабы в лаваше'
            : locale === 'lt'
            ? 'Kebabai lavaše'
            : 'Lavash Kebabs',
        note:
          locale === 'ru'
            ? '4 вкуса в свежем лаваше'
            : locale === 'lt'
            ? '4 skoniai šviežiame lavaše'
            : '4 fresh grilled wraps',
        price:
          locale === 'ru'
            ? 'от €6.50'
            : locale === 'lt'
            ? 'nuo €6.50'
            : 'from €6.50',
        category: 'kebabs',
        isCategoryAsset: true,
      },
      {
        id: 'pica-kebabu-jautiena',
        targetDishId: '',
        index: '03',
        title:
          locale === 'ru'
            ? 'Пиццы'
            : locale === 'lt'
            ? 'Picos'
            : 'Pizzas',
        note:
          locale === 'ru'
            ? '5 видов · Средняя и Большая'
            : locale === 'lt'
            ? '5 rūšys · Vidutinė ir Didelė'
            : '5 varieties · Medium & Large',
        price:
          locale === 'ru'
            ? 'от €11.00'
            : locale === 'lt'
            ? 'nuo €11.00'
            : 'from €11.00',
        category: 'pizza',
      },
    ];

    return specs.map((spec) => {
      if (spec.isCategoryAsset) {
        const catAsset = getCategoryImage(spec.category);
        const catIsolated = getIsolatedCategoryImage(spec.category);
        return {
          ...spec,
          img: catIsolated || catAsset?.src,
          isIsolated: Boolean(catIsolated),
          imgAlt: catAsset?.alt[locale] || spec.title,
        };
      }
      const asset = getProductImage(spec.id);
      const isolated = getIsolatedProductImage(spec.id);
      return {
        ...spec,
        img: isolated || asset?.src,
        isIsolated: Boolean(isolated),
        imgAlt: asset?.alt[locale] || spec.title,
      };
    });
  }, [locale]);

  const feedDishes = useMemo(() => {
    const pickIds = [
      'brandintos-jautienos-saslikas',
      'sultono-kebabas',
      'pica-kebabu-jautiena',
      'liulia-kebabas',
      'kebabas-lekstaje',
      'vistienos-saslikas',
    ];
    return pickIds
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, []);

  const activeIndex = Math.max(
    0,
    signatureDishes.findIndex((d) => d.id === activeCardId)
  );
  const activeDish = signatureDishes[activeIndex] || signatureDishes[0];

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !heroRef.current) return;

    let cancelled = false;
    let revertFn: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled || !heroRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          if (bgImgRef.current) {
            gsap.fromTo(
              bgImgRef.current,
              { scale: 1.0, yPercent: 0 },
              {
                scale: 1.12,
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                  trigger: heroRef.current,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          const scrubCfg = {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          };

          gsap.fromTo(
            '.hero-scroll-copy',
            { y: 0, opacity: 1 },
            { y: -32, opacity: 0.72, ease: 'none', scrollTrigger: scrubCfg }
          );

          gsap.fromTo(
            '.hero-orbit-rings',
            { scale: 1, rotate: 0, opacity: 1 },
            { scale: 1.18, rotate: 16, opacity: 0.35, ease: 'none', scrollTrigger: scrubCfg }
          );

          gsap.fromTo(
            '.hero-chair-float',
            { x: 0, y: 0, rotate: 0 },
            { x: -34, y: -58, rotate: -8, ease: 'none', scrollTrigger: scrubCfg }
          );

          gsap.fromTo(
            '.hero-plane-0',
            { y: 0, x: 0 },
            { y: -44, x: -6, ease: 'none', scrollTrigger: scrubCfg }
          );

          gsap.fromTo(
            '.hero-plane-1',
            { y: 0, x: 0 },
            { y: -74, x: 26, ease: 'none', scrollTrigger: scrubCfg }
          );

          gsap.fromTo(
            '.hero-plane-2',
            { y: 0, x: 0 },
            { y: 18, x: -24, ease: 'none', scrollTrigger: scrubCfg }
          );
        }, heroRef);

        revertFn = () => ctx.revert();
      })
      .catch(() => {
        // Graceful fallback without scroll scrub
      });

    return () => {
      cancelled = true;
      revertFn?.();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx * 22);
    pointerY.set(ny * 16);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="your-place"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative lg:min-h-screen bg-[#191B1A] text-[#F3EADA] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 border-b border-[#F3EADA]/14"
    >
      {/* Ambient Dining Room Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          ref={bgImgRef}
          src="/assets/brand/hero_scene_master.webp"
          srcSet="/assets/brand/hero_scene_master-760.webp 760w, /assets/brand/hero_scene_master.webp 1536w"
          sizes="100vw"
          width={1536}
          height={864}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          alt={t.hero.tableAltDesktop}
          className="w-full h-full object-cover object-center brightness-[0.34] contrast-[1.08] will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#191B1A]/96 via-[#191B1A]/74 to-[#191B1A]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191B1A] via-transparent to-black/55" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-16 flex-1 flex flex-col justify-between gap-4 lg:gap-8">
        {/* Single-Line Quiet Architectural Location Header */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#F3EADA]/12 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#F3EADA]/70">
          <span className="text-[#C98B54] truncate">{t.hero.locationTag}</span>
          <span className="shrink-0 tabular-nums">Ūmėdžių g. 2 · Vilnius</span>
        </div>

        {/* Center Flying Stage + Typography */}
        <div className="my-auto py-3 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
          {/* Left 5 Columns: Tight Mobile & Desktop Typography + Apple Capsule Actions */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_APPLE }}
            className="hero-scroll-copy lg:col-span-5 space-y-4 sm:space-y-5 relative z-20 will-change-transform"
          >
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C98B54]">
              {t.hero.headline}
            </p>

            <h1 className="font-display text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[0.87] tracking-[-0.03em] text-[#F3EADA] uppercase">
              EL SULTAN.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#F3EADA]/85 leading-relaxed max-w-md">
              {locale === 'ru'
                ? 'Искусство приготовления на живых углях встречает повседневное гостеприимство. От сочного шашлыка до хрустящих кебабов.'
                : locale === 'lt'
                ? 'Kai medžio anglių ugnis susitinka su namine svetingumo tradicija. Šašlikai, švieži kebabai ir picos kasdieniam džiaugsmui.'
                : 'Where live wood charcoal meets everyday hospitality. From sizzling aged-beef shashlik to fresh lavash kebabs.'}
            </p>

            {/* Compact Side-by-Side Apple Capsules even on 390px mobile */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundManager.playConfirm();
                  onExploreMenuDish(activeDish.targetDishId, activeDish.category);
                }}
                className="group inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-[#672938] text-[#F3EADA] text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] hover:bg-[#7d3345] transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54] whitespace-nowrap"
              >
                <span>{t.hero.ctaMenu}</span>
                <ArrowRight
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenChooseForMe();
                }}
                className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-[#F3EADA]/[0.09] backdrop-blur-md border border-[#F3EADA]/22 text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-[#F3EADA] hover:bg-[#F3EADA]/[0.16] hover:border-[#C98B54]/70 hover:text-[#C98B54] transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54] whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C98B54]" aria-hidden="true" />
                <span>{t.hero.ctaChoose}</span>
              </button>
            </div>

            {/* Desktop Active Dish Flight Caption (Moved inline into compact mobile switcher below on mobile) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDish.id}
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE_APPLE }}
                className="hidden lg:flex pt-4 border-t border-[#F3EADA]/14 items-baseline justify-between max-w-md"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54] block">
                    {activeDish.index} · {activeDish.note}
                  </span>
                  <span className="font-display text-xl text-[#F3EADA]">
                    {activeDish.title}
                  </span>
                </div>
                <span className="font-display text-2xl text-[#C98B54] tabular-nums">
                  {activeDish.price}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right 7 Columns: Compact Mobile + Expander Desktop 3-Plane Flying Choreography */}
          <div ref={stageRef} className="lg:col-span-7 flex flex-col gap-3 sm:gap-5 will-change-transform">
            <motion.div
              style={prefersReduced ? undefined : { x: smoothX, y: smoothY }}
              className="relative h-[230px] sm:h-[360px] lg:h-[460px] flex items-center justify-center"
            >
              {/* Soft Architectural Burgundy Aura, Orbital Hairline Ring & Official Chair Mark */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="hero-orbit-rings relative flex items-center justify-center will-change-transform">
                  <div className="w-[180px] sm:w-[310px] lg:w-[390px] h-[180px] sm:h-[310px] lg:h-[390px] rounded-full border border-[#F3EADA]/[0.08]" />
                  <div className="absolute w-[240px] sm:w-[410px] lg:w-[510px] h-[240px] sm:h-[410px] lg:h-[510px] rounded-full border border-[#C98B54]/[0.08]" />
                </div>
                <div className="absolute w-[64%] h-[68%] rounded-full bg-gradient-to-tr from-[#672938]/55 via-[#672938]/24 to-[#C98B54]/12 blur-2xl" />
                <div className="hero-chair-float hidden sm:block absolute right-8 bottom-6 opacity-[0.13] will-change-transform">
                  <ChairMark tone="bone" className="w-32 sm:w-44 h-auto" />
                </div>
              </div>

              {/* Simultaneous Orbiting Cutouts on 3 Spatial Planes */}
              {signatureDishes.map((dish, idx) => {
                const rel = (idx - activeIndex + signatureDishes.length) % signatureDishes.length;
                const isFocal = rel === 0;
                const isWrap = dish.id === 'kebabas-lavase';
                const orbitTargets =
                  rel === 0
                    ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 20 }
                    : rel === 1
                    ? {
                        x: isWrap ? '95%' : '70%',
                        y: isWrap ? '-14%' : '-24%',
                        scale: 0.72,
                        opacity: 0.95,
                        rotate: isWrap ? 8 : 7,
                        zIndex: 25,
                      }
                    : {
                        x: isWrap ? '-95%' : '-70%',
                        y: isWrap ? '14%' : '24%',
                        scale: 0.7,
                        opacity: 0.93,
                        rotate: isWrap ? -8 : -8,
                        zIndex: 25,
                      };

                const floatAnimClass = prefersReduced
                  ? ''
                  : isFocal
                  ? 'animate-float-focal'
                  : rel === 1
                  ? 'animate-float-wing-a'
                  : 'animate-float-wing-b';

                const planeScrollClass = `hero-plane-${rel}`;

                return (
                  <div
                    key={dish.id}
                    className={`pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform ${planeScrollClass}`}
                    style={{ zIndex: orbitTargets.zIndex }}
                  >
                    <motion.button
                      type="button"
                      initial={false}
                      animate={orbitTargets}
                      transition={{
                        type: 'spring',
                        stiffness: 210,
                        damping: 25,
                        mass: 0.9,
                      }}
                      onClick={() => {
                        if (isFocal) {
                          soundManager.playConfirm();
                          onExploreMenuDish(dish.targetDishId, dish.category);
                        } else {
                          soundManager.playClick();
                          setActiveCardId(dish.id);
                        }
                      }}
                      aria-label={
                        isFocal
                          ? `${dish.title} — ${t.hero.ctaMenu}`
                          : `${dish.title} — ${t.hero.selectDishLabel}`
                      }
                      className={`pointer-events-auto absolute flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C98B54] ${
                        dish.id === 'kebabas-lavase'
                          ? isFocal
                            ? 'w-[140px] sm:w-[200px] lg:w-[235px]'
                            : 'w-[100px] sm:w-[145px] lg:w-[175px] hover:opacity-100'
                          : isFocal
                          ? 'w-[205px] sm:w-[300px] lg:w-[360px]'
                          : 'w-[132px] sm:w-[205px] lg:w-[250px] hover:opacity-100'
                      }`}
                      style={{ zIndex: orbitTargets.zIndex }}
                    >
                      {dish.img ? (
                        <div
                          className={`relative w-full ${
                            dish.id === 'kebabas-lavase' ? 'aspect-[2/3]' : 'aspect-[4/3]'
                          } flex items-center justify-center select-none will-change-transform ${floatAnimClass}`}
                        >
                          {/* Soft ground contact shadow grounded inside dark/burgundy stage */}
                          <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/75 blur-xl transition-all duration-300 ${
                              dish.id === 'kebabas-lavase'
                                ? isFocal
                                  ? 'w-[62%] h-6 opacity-85'
                                  : 'w-[56%] h-5 opacity-60'
                                : isFocal
                                ? 'w-[76%] h-7 opacity-85'
                                : 'w-[68%] h-5 opacity-60'
                            }`}
                          />
                          <img
                            src={dish.img}
                            alt={dish.imgAlt}
                            width={dish.id === 'kebabas-lavase' ? 393 : 800}
                            height={dish.id === 'kebabas-lavase' ? 960 : 600}
                            loading="eager"
                            decoding={isFocal ? 'sync' : 'async'}
                            fetchPriority={isFocal ? 'high' : 'low'}
                            className={
                              dish.isIsolated
                                ? 'relative z-10 w-full h-full object-contain object-center select-none drop-shadow-[0_22px_26px_rgba(0,0,0,0.68)]'
                                : 'relative z-10 w-full h-full object-cover object-center rounded-2xl border border-[#F3EADA]/20 select-none'
                            }
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[3/2] rounded-2xl border border-[#F3EADA]/25 bg-[#191B1A]/95 p-4 flex flex-col justify-center text-left">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C98B54]">
                            {dish.index}
                          </span>
                          <span className="font-display text-sm sm:text-base text-[#F3EADA]">
                            {dish.title}
                          </span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>

            {/* Mobile Active Caption Bar (Ultra compact) */}
            <div className="flex lg:hidden items-baseline justify-between border-t border-[#F3EADA]/14 pt-2.5 text-xs">
              <span className="font-bold text-[#F3EADA]">
                <span className="text-[#C98B54] mr-1.5 tabular-nums">{activeDish.index}</span>
                {activeDish.title}
              </span>
              <span className="font-display text-base text-[#C98B54] tabular-nums">
                {activeDish.price}
              </span>
            </div>

            {/* Single-Row Scrollable on Mobile, Flex-Wrap on Desktop Plate Switcher */}
            <div
              role="tablist"
              aria-label={t.hero.selectDishLabel}
              className="flex items-center lg:justify-start gap-2.5 overflow-x-auto no-scrollbar pb-1"
            >
              {signatureDishes.map((dish) => {
                const isActive = dish.id === activeDish.id;
                return (
                  <button
                    key={dish.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveCardId(dish.id);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.11em] whitespace-nowrap shrink-0 transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54] ${
                      isActive
                        ? 'bg-[#C98B54] text-[#191B1A]'
                        : 'bg-[#F3EADA]/[0.07] text-[#F3EADA]/78 border border-[#F3EADA]/16 hover:bg-[#F3EADA]/[0.14] hover:text-[#F3EADA]'
                    }`}
                  >
                    <span className="tabular-nums">{dish.index}</span>
                    <span>{dish.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continuous Culinary Feed Ribbon along Hero Base */}
      <div className="relative z-20 border-t border-[#F3EADA]/14 bg-[#141615]/92 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 lg:pr-44 py-3 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-8 whitespace-nowrap w-max animate-feed-marquee">
              {[...feedDishes, ...feedDishes].map((dish, idx) => (
                <button
                  key={`${dish.id}-${idx}`}
                  type="button"
                  onClick={() => {
                    soundManager.playConfirm();
                    onExploreMenuDish(dish.id, dish.category);
                  }}
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.13em] text-[#F3EADA]/78 hover:text-[#C98B54] transition-colors cursor-pointer"
                >
                  <span className="text-[#C98B54] tabular-nums">
                    {formatCents(dish.variants?.[0]?.priceCents || dish.basePriceCents)}
                  </span>
                  <span>{dish.name[locale]}</span>
                  <span aria-hidden="true" className="text-[#F3EADA]/25 ml-2">
                    /
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {onGoDirectory && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onGoDirectory();
                }}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#C98B54] hover:text-[#F3EADA] transition-colors cursor-pointer"
              >
                <span>{t.hero.scrollHint}</span>
                <span aria-hidden="true">↓</span>
              </button>
            )}
            <AudioControl locale={locale} variant="inline" className="lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
};
