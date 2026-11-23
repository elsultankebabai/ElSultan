import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Clock, Mail, MapPin, Phone, X } from 'lucide-react';
import { Locale, RESTAURANT_INFO } from '../data/menu';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import { PageId } from './Header';
import { EditorialReveal } from './ScrollReveal';
import { soundManager } from '../utils/sound';
export { SiteFooter } from './SiteFooter';

interface OrderingAndLocationProps {
  locale: Locale;
  t: TranslationBundle;
  onChangeLocale?: (next: Locale) => void;
  onNavigatePage?: (page: PageId) => void;
  onOpenPrivacy?: () => void;
}

export const OrderingAndLocation: React.FC<OrderingAndLocationProps> = ({
  locale,
  t,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const facadeImgRef = useRef<HTMLImageElement>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current || !facadeImgRef.current) return;

    let cancelled = false;
    let revertFn: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled || !sectionRef.current || !facadeImgRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          gsap.fromTo(
            facadeImgRef.current,
            { scale: 1.07, yPercent: -3 },
            {
              scale: 1,
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: facadeImgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }, sectionRef);

        revertFn = () => ctx.revert();
      })
      .catch(() => {
        // Fallback cleanly to static entrance image
      });

    return () => {
      cancelled = true;
      revertFn?.();
    };
  }, []);

  return (
    <section id="visit" ref={sectionRef}>
      {/* PART 1: ORDERING CHANNELS LEDGER */}
      <div className="bg-[#F3EADA] text-[#191B1A] border-b border-[#191B1A]/12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <EditorialReveal className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <ChairMark tone="burgundy" className="w-8 h-auto" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#672938]">
                  {t.ordering.eyebrow}
                </p>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,4.8vw,4.3rem)] leading-[0.9] tracking-[-0.03em] text-[#191B1A]">
                {t.ordering.headline}
              </h2>
              <p className="text-sm sm:text-base text-[#191B1A]/80 leading-relaxed">
                {t.ordering.subcopy}
              </p>

              <div className="pt-2 space-y-4">
                <a
                  href={RESTAURANT_INFO.phoneHref}
                  onClick={() => soundManager.playConfirm()}
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#672938] text-[#F3EADA] text-xs sm:text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#4f1d29] active:scale-[0.97] transition-all"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="tabular-nums">{RESTAURANT_INFO.phoneDisplay}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
                <p className="text-xs font-bold text-[#672938] max-w-md leading-relaxed">
                  {t.ordering.platformNote}
                </p>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.1} className="lg:col-span-7 divide-y divide-[#191B1A]/15 border-t border-b border-[#191B1A]/15">
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-bold tabular-nums text-[#672938]">
                    01 · {t.ordering.cards.dineInTitle}
                  </span>
                  <p className="text-sm text-[#191B1A]/80 leading-relaxed">
                    {t.ordering.cards.dineInDesc}
                  </p>
                </div>
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-[0.09em] text-[#191B1A] border-b border-[#191B1A]/50 pb-1 hover:text-[#672938] hover:border-[#672938] transition-colors shrink-0 self-start sm:self-center"
                >
                  {t.ordering.cards.dineInAction} ↗
                </a>
              </div>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-bold tabular-nums text-[#672938]">
                    02 · {t.ordering.cards.phoneTitle}
                  </span>
                  <p className="text-sm text-[#191B1A]/80 leading-relaxed">
                    {t.ordering.cards.phoneDesc}
                  </p>
                </div>
                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="text-xs font-bold uppercase tracking-[0.09em] text-[#672938] border-b border-[#672938] pb-1 hover:opacity-75 transition-opacity shrink-0 self-start sm:self-center tabular-nums"
                >
                  {t.ordering.cards.phoneAction} ↗
                </a>
              </div>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-bold tabular-nums text-[#672938]">
                    03 · {t.ordering.cards.woltTitle}
                  </span>
                  <p className="text-sm text-[#191B1A]/80 leading-relaxed">
                    {t.ordering.cards.woltDesc}
                  </p>
                </div>
                <a
                  href={RESTAURANT_INFO.woltUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-[0.09em] text-[#191B1A] border-b border-[#191B1A]/50 pb-1 hover:text-[#672938] hover:border-[#672938] transition-colors shrink-0 self-start sm:self-center"
                >
                  {t.ordering.cards.woltAction} ↗
                </a>
              </div>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-bold tabular-nums text-[#672938]">
                    04 · {t.ordering.cards.boltTitle}
                  </span>
                  <p className="text-sm text-[#191B1A]/80 leading-relaxed">
                    {t.ordering.cards.boltDesc}
                  </p>
                </div>
                <a
                  href={RESTAURANT_INFO.boltUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-[0.09em] text-[#191B1A] border-b border-[#191B1A]/50 pb-1 hover:text-[#672938] hover:border-[#672938] transition-colors shrink-0 self-start sm:self-center"
                >
                  {t.ordering.cards.boltAction} ↗
                </a>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </div>

      {/* PART 1.5: OFFICIAL FAQ ACCORDION (https://elsultan.lt/#faq) */}
      <div id="faq" className="bg-[#F3EADA] text-[#191B1A] border-b border-[#191B1A]/12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <EditorialReveal className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#672938]">
                {t.faq.eyebrow}
              </p>
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.03em] text-[#191B1A] uppercase">
                {t.faq.title}
              </h2>
              <p className="text-sm sm:text-base text-[#191B1A]/80 leading-relaxed max-w-md">
                {t.faq.lead}
              </p>
            </EditorialReveal>

            <div className="lg:col-span-7 divide-y divide-[#191B1A]/15 border-t border-b border-[#191B1A]/15">
              {t.faq.items.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={item.q} className="py-5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      onClick={() => {
                        soundManager.playClick();
                        setOpenFaqIdx(isOpen ? null : idx);
                      }}
                      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#672938]"
                    >
                      <span className="font-display text-lg sm:text-xl text-[#191B1A] group-hover:text-[#672938] transition-colors">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-[#672938] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <p
                        id={`faq-panel-${idx}`}
                        className="pt-3 pr-8 text-sm sm:text-base text-[#191B1A]/80 leading-relaxed"
                      >
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: LOCATION, HOURS & FACADE */}
      <div className="relative bg-[#191B1A] text-[#F3EADA] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-20 lg:pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <EditorialReveal className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C98B54]">
                  {t.location.eyebrow}
                </p>
                <h2 className="font-display text-[clamp(2.8rem,5.6vw,5.2rem)] leading-[0.89] tracking-[-0.03em] text-[#F3EADA]">
                  {t.location.headline}
                </h2>
                <p className="text-base sm:text-lg text-[#F3EADA]/80 max-w-lg leading-relaxed">
                  {t.location.subcopy}
                </p>
              </div>

              <dl className="space-y-5 border-t border-[#F3EADA]/15 pt-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#C98B54] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#F3EADA]/60">
                      {t.location.addressLabel}
                    </dt>
                    <dd className="text-base sm:text-lg font-bold text-[#F3EADA]">
                      {RESTAURANT_INFO.address} · {RESTAURANT_INFO.district[locale]}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#C98B54] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#F3EADA]/60">
                      {t.location.hoursLabel}
                    </dt>
                    <dd className="text-sm sm:text-base font-bold text-[#F3EADA] tabular-nums space-y-0.5 mt-0.5">
                      <div>
                        {RESTAURANT_INFO.openingHours.monThu.days[locale]}:{' '}
                        {RESTAURANT_INFO.openingHours.monThu.hours}
                      </div>
                      <div>
                        {RESTAURANT_INFO.openingHours.friSat.days[locale]}:{' '}
                        {RESTAURANT_INFO.openingHours.friSat.hours}
                      </div>
                      <div>
                        {RESTAURANT_INFO.openingHours.sun.days[locale]}:{' '}
                        {RESTAURANT_INFO.openingHours.sun.hours}
                      </div>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[#C98B54] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#F3EADA]/60">
                      {t.location.phoneLabel}
                    </dt>
                    <dd className="text-base sm:text-lg font-bold text-[#F3EADA] tabular-nums">
                      <a
                        href={RESTAURANT_INFO.phoneHref}
                        className="hover:text-[#C98B54] transition-colors"
                      >
                        {RESTAURANT_INFO.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#C98B54] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#F3EADA]/60">
                      {locale === 'ru' ? 'Эл. почта' : locale === 'lt' ? 'El. paštas' : 'Email'}
                    </dt>
                    <dd className="text-base sm:text-lg font-bold text-[#F3EADA]">
                      <a
                        href={RESTAURANT_INFO.emailHref}
                        className="hover:text-[#C98B54] transition-colors"
                      >
                        {RESTAURANT_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playConfirm()}
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#672938] text-[#F3EADA] text-xs sm:text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#7d3345] active:scale-[0.97] transition-all"
                >
                  <span>{t.location.directionsBtn}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#F3EADA]/[0.08] backdrop-blur-md border border-[#F3EADA]/20 text-xs sm:text-sm font-bold uppercase tracking-[0.09em] text-[#F3EADA] hover:border-[#C98B54] hover:text-[#C98B54] active:scale-[0.97] transition-all tabular-nums"
                >
                  <span>{t.location.callBtn}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </EditorialReveal>

            <div className="lg:col-span-6 space-y-5">
              <div className="relative aspect-[16/10] bg-[#0f100f] rounded-3xl overflow-hidden shadow-2xl border border-[#F3EADA]/10">
                <img
                  ref={facadeImgRef}
                  src="/images/venue/entrance-windows.webp"
                  srcSet="/images/venue/entrance-windows-760.webp 760w, /images/venue/entrance-windows.webp 1440w"
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  width={1440}
                  height={810}
                  alt="EL SULTAN dining room entrance and street-facing windows at Ūmėdžių g. 2, Vilnius"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex items-end justify-end">
                <ChairMark tone="ochre" className="w-40 sm:w-52 h-auto -mb-14 opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface OrderModalProps {
  open: boolean;
  t: TranslationBundle;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ open, t, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#F3EADA] text-[#191B1A] p-8 space-y-6 border border-[#191B1A]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 id="order-modal-title" className="font-display text-2xl sm:text-3xl text-[#672938]">
              {t.orderModal.title}
            </h3>
            <p className="text-sm text-[#191B1A]/80">{t.orderModal.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.orderModal.close}
            className="w-10 h-10 rounded-full inline-flex items-center justify-center text-[#191B1A]/75 hover:bg-[#191B1A]/8 hover:text-[#672938] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-bold text-[#672938] border-t border-b border-[#191B1A]/15 py-3 leading-relaxed">
          {t.orderModal.charcoalWarning}
        </p>

        <div className="space-y-4">
          <a
            href={RESTAURANT_INFO.phoneHref}
            onClick={() => soundManager.playConfirm()}
            className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#672938] text-[#F3EADA] font-bold text-sm hover:bg-[#521f2b] active:scale-[0.98] transition-all"
          >
            <span className="inline-flex items-center gap-2.5">
              <Phone className="w-4 h-4" />
              <span>{t.ordering.cards.phoneTitle}</span>
            </span>
            <span className="tabular-nums">{RESTAURANT_INFO.phoneDisplay}</span>
          </a>

          <div className="divide-y divide-[#191B1A]/12 border-t border-b border-[#191B1A]/12">
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 flex items-center justify-between text-sm font-bold text-[#191B1A] hover:text-[#672938] transition-colors"
            >
              <span>
                {t.ordering.cards.dineInTitle} · {RESTAURANT_INFO.address}
              </span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={RESTAURANT_INFO.woltUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 flex items-center justify-between text-sm font-bold text-[#191B1A] hover:text-[#672938] transition-colors"
            >
              <span>Wolt</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={RESTAURANT_INFO.boltUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 flex items-center justify-between text-sm font-bold text-[#191B1A] hover:text-[#672938] transition-colors"
            >
              <span>Bolt Food</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PrivacyModalProps {
  open: boolean;
  t: TranslationBundle;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ open, t, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#F3EADA] text-[#191B1A] p-8 space-y-6 border border-[#191B1A]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="privacy-modal-title" className="font-display text-xl sm:text-2xl text-[#672938]">
            {t.privacyModal.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.privacyModal.close}
            className="w-10 h-10 rounded-full inline-flex items-center justify-center text-[#191B1A]/75 hover:bg-[#191B1A]/8 hover:text-[#672938] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-[#191B1A]/85 leading-relaxed">
          {t.privacyModal.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-7 py-3 rounded-full bg-[#191B1A] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#672938] active:scale-[0.97] transition-all cursor-pointer"
        >
          {t.privacyModal.close}
        </button>
      </div>
    </div>
  );
};
