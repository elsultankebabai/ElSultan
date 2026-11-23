import React from 'react';
import { Mail } from 'lucide-react';
import { Locale, RESTAURANT_INFO } from '../data/menu';
import { TranslationBundle } from '../i18n/translations';
import { ElSultanWordmark } from './BrandMarks';
import { PageId } from './Header';
import { soundManager } from '../utils/sound';
import { AudioControl } from './AudioControl';

export interface SiteFooterProps {
  locale: Locale;
  t: TranslationBundle;
  onChangeLocale: (next: Locale) => void;
  onNavigatePage: (page: PageId) => void;
  onOpenPrivacy: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

export const SiteFooter: React.FC<SiteFooterProps> = ({
  locale,
  t,
  onChangeLocale,
  onNavigatePage,
  onOpenPrivacy,
}) => {
  const followLabel =
    locale === 'ru' ? 'Мы в соцсетях' : locale === 'lt' ? 'Sekite mus' : 'Follow us';

  return (
    <footer className="border-t border-[#F3EADA]/15 bg-[#141615] text-[#F3EADA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-10 lg:py-12 space-y-8">
        {/* Top Row: Brand + Navigation + Language */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <a
              href={`/${locale}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('home');
              }}
              aria-label="EL SULTAN"
            >
              <ElSultanWordmark tone="bone" className="h-9 w-auto" />
            </a>
            <div className="text-xs text-[#F3EADA]/70 space-y-1">
              <p className="font-bold text-[#F3EADA]">{t.footer.tagline}</p>
              <p>{t.footer.rights}</p>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-[0.08em] text-[#F3EADA]/80"
          >
            <a
              href={`/${locale}/menu`}
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('menu');
              }}
              className="hover:text-[#C98B54] cursor-pointer transition-colors"
            >
              {t.nav.menu}
            </a>
            <a
              href={`/${locale}/choose-for-me`}
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('choose-for-me');
              }}
              className="hover:text-[#C98B54] cursor-pointer transition-colors"
            >
              {t.nav.chooseForMe}
            </a>
            <a
              href={`/${locale}/visit`}
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('visit');
              }}
              className="hover:text-[#C98B54] cursor-pointer transition-colors"
            >
              {t.nav.visit}
            </a>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-[#C98B54] underline underline-offset-4 cursor-pointer transition-colors"
            >
              {t.footer.privacyLink}
            </button>
          </nav>

          <div className="flex flex-wrap items-center gap-4 self-start lg:self-auto">
            <div className="flex items-center gap-3">
              {(['lt', 'en', 'ru'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeLocale(code)}
                  aria-pressed={code === locale}
                  className={`relative pb-0.5 text-xs font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors ${
                    code === locale
                      ? 'text-[#F3EADA] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[#C98B54]'
                      : 'text-[#F3EADA]/55 hover:text-[#F3EADA]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            <AudioControl locale={locale} variant="inline" className="lg:hidden" />
          </div>
        </div>

        {/* Bottom Row: Direct Contact & Social Media */}
        <div className="pt-6 border-t border-[#F3EADA]/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#F3EADA]/65">
            <span className="font-bold text-[#F3EADA]/85">{RESTAURANT_INFO.address}</span>
            <span aria-hidden="true" className="text-[#F3EADA]/25">
              ·
            </span>
            <a
              href={RESTAURANT_INFO.phoneHref}
              className="tabular-nums hover:text-[#C98B54] transition-colors"
            >
              {RESTAURANT_INFO.phoneDisplay}
            </a>
            <span aria-hidden="true" className="text-[#F3EADA]/25">
              ·
            </span>
            <a
              href={RESTAURANT_INFO.emailHref}
              className="inline-flex items-center gap-1.5 hover:text-[#C98B54] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C98B54]" aria-hidden="true" />
              <span>{RESTAURANT_INFO.email}</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54] mr-1">
              {followLabel}
            </span>
            <a
              href={RESTAURANT_INFO.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EL SULTAN Instagram"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EADA]/[0.07] border border-[#F3EADA]/14 text-xs font-bold text-[#F3EADA] hover:bg-[#672938] hover:border-[#C98B54]/60 active:scale-[0.97] transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#C98B54]" />
              <span>Instagram</span>
              <span aria-hidden="true" className="text-[#F3EADA]/60 text-[11px]">
                ↗
              </span>
            </a>
            <a
              href={RESTAURANT_INFO.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EL SULTAN TikTok"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EADA]/[0.07] border border-[#F3EADA]/14 text-xs font-bold text-[#F3EADA] hover:bg-[#672938] hover:border-[#C98B54]/60 active:scale-[0.97] transition-all"
            >
              <TikTokIcon className="w-3.5 h-3.5 text-[#C98B54]" />
              <span>TikTok</span>
              <span aria-hidden="true" className="text-[#F3EADA]/60 text-[11px]">
                ↗
              </span>
            </a>
            <a
              href={RESTAURANT_INFO.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EL SULTAN Facebook"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EADA]/[0.07] border border-[#F3EADA]/14 text-xs font-bold text-[#F3EADA] hover:bg-[#672938] hover:border-[#C98B54]/60 active:scale-[0.97] transition-all"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-[#C98B54]" />
              <span>Facebook</span>
              <span aria-hidden="true" className="text-[#F3EADA]/60 text-[11px]">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
