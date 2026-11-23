import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { LUNCH_PROMOTION_CONFIG, getVilniusLunchState } from '../data/business';
import { Locale, MENU_ITEMS, MenuCategoryId, formatCents } from '../data/menu';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import { EditorialReveal, ParallaxFrame, ScrollFloat } from './ScrollReveal';
import { soundManager } from '../utils/sound';

interface BeyondUsualChapterProps {
  locale: Locale;
  t: TranslationBundle;
  onExploreCharcoal: (cat: MenuCategoryId) => void;
  onSelectDishInMenu: (dishId: string, cat: MenuCategoryId) => void;
  onVisitClick: () => void;
}

export const BeyondUsualChapter: React.FC<BeyondUsualChapterProps> = ({
  locale,
  t,
  onSelectDishInMenu,
}) => {
  const [vilniusClock, setVilniusClock] = useState(() => getVilniusLunchState());

  useEffect(() => {
    const id = window.setInterval(() => {
      setVilniusClock(getVilniusLunchState());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const lunchDishes = LUNCH_PROMOTION_CONFIG.recommendedDishIds
    .map((id) => MENU_ITEMS.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <section id="beyond-usual" className="bg-[#191B1A] text-[#F3EADA] relative overflow-hidden">
      {!vilniusClock.isExpired && (
        <div className="relative bg-[#F3EADA] text-[#191B1A] border-b border-[#191B1A]/14 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none select-none hidden lg:block absolute -left-12 top-12 opacity-[0.05]"
          >
            <ScrollFloat yRange={[24, -24]} xRange={[0, 0]} rotateRange={[0, 0]} scaleRange={[0.98, 1.02]}>
              <ChairMark tone="burgundy" className="w-[260px] h-auto" />
            </ScrollFloat>
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <EditorialReveal className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#672938]">
                  <span>
                    {vilniusClock.isWindowActive
                      ? t.beyondUsual.lunchActiveEyebrow
                      : t.beyondUsual.lunchScheduleEyebrow}
                  </span>
                  {vilniusClock.vilniusTimeLabel && (
                    <span className="inline-flex items-center gap-1.5 text-[#191B1A]/65 tabular-nums">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {t.beyondUsual.lunchTimeLabel}: {vilniusClock.vilniusTimeLabel}
                      </span>
                    </span>
                  )}
                </div>

                <h2 className="font-display text-[clamp(2.3rem,4.6vw,4.1rem)] leading-[0.9] tracking-[-0.03em] text-[#191B1A]">
                  {t.beyondUsual.lunchHeadline}
                </h2>

                <p className="text-sm sm:text-base text-[#191B1A]/80 leading-relaxed max-w-xl">
                  {vilniusClock.isWindowActive
                    ? t.beyondUsual.lunchSubActive
                    : t.beyondUsual.lunchSubSchedule}
                </p>

                {/* Recommended Lunch Dishes */}
                <div className="pt-2 border-t border-[#191B1A]/15 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#672938]">
                    {t.beyondUsual.lunchDishesTitle} · {vilniusClock.windowLabel}
                  </p>
                  <div className="divide-y divide-[#191B1A]/12">
                    {lunchDishes.map((dish) => (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectDishInMenu(dish.id, dish.category);
                        }}
                        className="w-full py-3 flex items-baseline justify-between gap-4 text-left hover:text-[#672938] transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm">{dish.name[locale]}</span>
                        <span className="font-display text-base text-[#672938] tabular-nums shrink-0">
                          {formatCents(dish.variants?.[0]?.priceCents || dish.basePriceCents)} →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </EditorialReveal>

              <div className="lg:col-span-6">
                <ParallaxFrame
                  src="/images/venue/table-service.webp"
                  srcSet="/images/venue/table-service-760.webp 760w, /images/venue/table-service.webp 1440w"
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  width={1440}
                  height={810}
                  loading="eager"
                  fetchPriority="high"
                  alt="EL SULTAN table service in Vilnius with hot soup, charcoal grill plate, fries, and house menu"
                  aspectClass="aspect-[16/10]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
