import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import {
  Locale,
  MenuCategoryId,
  RESTAURANT_INFO,
  VERIFIED_GOOGLE_REVIEWS,
} from '../data/menu';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import {
  EditorialReveal,
  EditorialRule,
  ParallaxFrame,
  ScrollFloat,
} from './ScrollReveal';
import { soundManager } from '../utils/sound';

interface OurPlaceSectionProps {
  locale: Locale;
  t: TranslationBundle;
  onExploreCharcoal: (cat: MenuCategoryId) => void;
}

export const OurPlaceSection: React.FC<OurPlaceSectionProps> = ({
  t,
  onExploreCharcoal,
}) => {
  return (
    <section id="our-place" className="bg-[#F3EADA] text-[#191B1A] overflow-hidden">
      {/* CHAPTER 05 · PART 1: DINING ROOM ARCHITECTURE */}
      <div className="relative border-b border-[#191B1A]/12">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none hidden lg:block absolute -right-14 top-12 opacity-[0.06]"
        >
          <ScrollFloat yRange={[45, -45]} rotateRange={[-5, 6]}>
            <ChairMark tone="burgundy" className="w-[320px] h-auto" />
          </ScrollFloat>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <ParallaxFrame
                src="/images/venue/dining-room.webp"
                srcSet="/images/venue/dining-room-760.webp 760w, /images/venue/dining-room.webp 1440w"
                sizes="(min-width: 1024px) 48vw, 100vw"
                width={1440}
                height={960}
                alt="EL SULTAN Vilnius dining room with warm wood slats, burgundy velvet seats, and freshly served grill table"
                aspectClass="aspect-[16/10]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <ParallaxFrame
                  src="/images/venue/interior-counter.webp"
                  srcSet="/images/venue/interior-counter-760.webp 760w, /images/venue/interior-counter.webp 1440w"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                  width={1440}
                  height={810}
                  alt="EL SULTAN dining hall interior with curved black chairs, hammered copper wall plates, and drinks counter"
                  aspectClass="aspect-[16/10]"
                />
                <ParallaxFrame
                  src="/images/venue/charcoal-table.webp"
                  srcSet="/images/venue/charcoal-table-760.webp 760w, /images/venue/charcoal-table.webp 1440w"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                  width={1440}
                  height={810}
                  alt="EL SULTAN charcoal skewers, warm flatbread, garlic sauce, and branded table setting"
                  aspectClass="aspect-[16/10]"
                />
              </div>
            </div>

            <EditorialReveal className="lg:col-span-6 space-y-7">
              <div className="flex items-center gap-3">
                <ChairMark tone="burgundy" className="w-8 h-auto" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#672938]">
                  {t.ourPlace.usualEyebrow}
                </p>
              </div>

              <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[0.9] tracking-[-0.03em] text-[#191B1A]">
                {t.ourPlace.usualHeadline}
              </h2>

              <p className="text-base sm:text-lg text-[#191B1A]/85 leading-relaxed">
                {t.ourPlace.usualBody}
              </p>

              <div className="space-y-4 text-sm sm:text-base text-[#191B1A]/80 leading-relaxed pt-6">
                <EditorialRule tone="dark" className="mb-4" />
                {t.ourPlace.placeParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <dl className="divide-y divide-[#191B1A]/15 border-t border-b border-[#191B1A]/15">
                {t.ourPlace.placeDetails.map((d) => (
                  <div
                    key={d.label}
                    className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
                  >
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#672938]">
                      {d.label}
                    </dt>
                    <dd className="text-sm font-bold text-[#191B1A]">{d.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playConfirm();
                    onExploreCharcoal('charcoal');
                  }}
                  className="text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-[#672938] border-b border-[#672938]/60 pb-1 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  {t.ourPlace.usualCta} →
                </button>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </div>

      {/* PART 2: GUEST IMPRESSIONS & VERIFIED RATINGS */}
      <RegularsValueSection t={t} />
    </section>
  );
};

interface RegularsValueSectionProps {
  t: TranslationBundle;
}

export const RegularsValueSection: React.FC<RegularsValueSectionProps> = ({ t }) => {
  return (
    <section
      id="what-regulars-value"
      aria-labelledby="regulars-value-heading"
      className="relative bg-[#672938] text-[#F3EADA] py-14 sm:py-16 lg:py-24 border-b border-[#F3EADA]/14 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none select-none hidden sm:block absolute -right-12 bottom-4 opacity-[0.06]"
      >
        <ScrollFloat yRange={[24, -24]} xRange={[0, 0]} rotateRange={[0, 0]} scaleRange={[0.98, 1.02]}>
          <ChairMark tone="bone" className="w-[240px] lg:w-[320px] h-auto" />
        </ScrollFloat>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 space-y-12">
        <div className="space-y-8">
          <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C98B54]">
                {t.ourPlace.reviewsEyebrow}
              </p>
              <h2
                id="regulars-value-heading"
                className="font-display text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[0.9] tracking-[-0.03em] text-[#F3EADA] uppercase"
              >
                {t.ourPlace.reviewsHeadline}
              </h2>
              <p className="text-sm text-[#F3EADA]/78 leading-relaxed">
                {t.ourPlace.reviewsNote}
              </p>

              {/* Verified Cross-Platform Ratings Ledger */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-[#F3EADA] tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#C98B54] fill-[#C98B54]" aria-hidden="true" />
                  Google {RESTAURANT_INFO.ratings.google.score.toFixed(1)} ({RESTAURANT_INFO.ratings.google.count})
                </span>
                <span aria-hidden="true" className="text-[#F3EADA]/30">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#C98B54] fill-[#C98B54]" aria-hidden="true" />
                  Bolt Food {RESTAURANT_INFO.ratings.bolt.score.toFixed(1)} ({RESTAURANT_INFO.ratings.bolt.count})
                </span>
                <span aria-hidden="true" className="text-[#F3EADA]/30">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#C98B54] fill-[#C98B54]" aria-hidden="true" />
                  Wolt {RESTAURANT_INFO.ratings.wolt.score.toFixed(1)}
                </span>
              </div>
            </div>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#F3EADA]/[0.1] backdrop-blur-md border border-[#F3EADA]/22 text-xs font-bold uppercase tracking-[0.1em] text-[#F3EADA] hover:bg-[#F3EADA]/[0.18] hover:border-[#C98B54] hover:text-[#C98B54] active:scale-[0.97] transition-all shrink-0 self-start md:self-end"
            >
              <span>{t.ourPlace.googleLinkLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </EditorialReveal>
          <EditorialRule tone="light" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-[#F3EADA]/15">
          {t.ourPlace.highlights.map((item, idx) => (
            <EditorialReveal
              key={item.title}
              delay={idx * 0.1}
              yOffset={28}
              className={`space-y-3 ${idx > 0 ? 'pt-8 md:pt-0 md:pl-10' : ''}`}
            >
              <span className="text-xs font-bold tabular-nums text-[#C98B54] block">
                0{idx + 1} · {item.source}
              </span>
              <h3 className="font-display text-2xl text-[#F3EADA] leading-snug">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-[#F3EADA]/80 leading-relaxed">
                {item.detail}
              </p>
            </EditorialReveal>
          ))}
        </div>

        {/* Public Google Reviews Excerpts */}
        <div className="pt-8 border-t border-[#F3EADA]/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VERIFIED_GOOGLE_REVIEWS.slice(0, 3).map((review) => (
            <blockquote key={review.id} className="space-y-2 text-xs sm:text-sm text-[#F3EADA]/85">
              <p className="italic leading-relaxed line-clamp-4">„{review.text}“</p>
              <footer className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C98B54]">
                — {review.author} · {review.stars}.0 ★ Google
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

