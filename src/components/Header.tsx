import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Locale } from '../data/menu';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark, ElSultanWordmark } from './BrandMarks';
import { ScrollProgressRail } from './ScrollReveal';

export type PageId = 'home' | 'menu' | 'choose-for-me' | 'visit';

interface HeaderProps {
  locale: Locale;
  t: TranslationBundle;
  activePage: PageId;
  callListCount?: number;
  onChangeLocale: (next: Locale) => void;
  onNavigatePage: (page: PageId) => void;
  onOpenOrderModal: () => void;
}

const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'lt', label: 'Lietuvių' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export const Header: React.FC<HeaderProps> = ({
  locale,
  t,
  activePage,
  callListCount = 0,
  onChangeLocale,
  onNavigatePage,
  onOpenOrderModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [focusedLangIdx, setFocusedLangIdx] = useState(() =>
    Math.max(0, LOCALES.findIndex((l) => l.code === locale))
  );

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePage]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (langMenuOpen) {
          setLangMenuOpen(false);
          langTriggerRef.current?.focus();
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileToggleRef.current?.focus();
        }
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [langMenuOpen, mobileMenuOpen]);

  useEffect(() => {
    setFocusedLangIdx(Math.max(0, LOCALES.findIndex((l) => l.code === locale)));
  }, [locale]);

  const overDarkHero = !scrolled && !mobileMenuOpen;

  const primaryLinks: Array<{ id: Exclude<PageId, 'home'>; label: string }> = [
    { id: 'menu', label: t.nav.menu },
    { id: 'choose-for-me', label: t.nav.chooseForMe },
    { id: 'visit', label: t.nav.visit },
  ];

  const handleLinkClick = (id: PageId) => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
    onNavigatePage(id);
  };

  const openLangMenu = (targetIndex?: number) => {
    const baseIdx = Math.max(0, LOCALES.findIndex((l) => l.code === locale));
    const idx = typeof targetIndex === 'number' ? targetIndex : baseIdx;
    setFocusedLangIdx(idx);
    setLangMenuOpen(true);
    window.requestAnimationFrame(() => optionRefs.current[idx]?.focus());
  };

  const handleTriggerClick = () => {
    if (langMenuOpen) {
      setLangMenuOpen(false);
    } else {
      openLangMenu();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const baseIdx = Math.max(0, LOCALES.findIndex((l) => l.code === locale));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openLangMenu(langMenuOpen ? (focusedLangIdx + 1) % LOCALES.length : baseIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openLangMenu(
        langMenuOpen ? (focusedLangIdx - 1 + LOCALES.length) % LOCALES.length : LOCALES.length - 1
      );
    }
  };

  const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusedLangIdx + 1) % LOCALES.length;
      setFocusedLangIdx(next);
      optionRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (focusedLangIdx - 1 + LOCALES.length) % LOCALES.length;
      setFocusedLangIdx(prev);
      optionRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedLangIdx(0);
      optionRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = LOCALES.length - 1;
      setFocusedLangIdx(last);
      optionRefs.current[last]?.focus();
    } else if (e.key === 'Tab') {
      setLangMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        overDarkHero
          ? 'bg-[#191B1A]/78 backdrop-blur-md border-b border-[#F3EADA]/14 text-[#F3EADA]'
          : 'bg-[#F3EADA]/96 backdrop-blur-md border-b border-[#191B1A]/14 text-[#191B1A]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-16 px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Exact SVG Logo Lockup (Chair Emblem + Wordmark) */}
        <a
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className={`group shrink-0 py-1 inline-flex items-center gap-2.5 sm:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            overDarkHero ? 'focus-visible:outline-[#C98B54]' : 'focus-visible:outline-[#672938]'
          }`}
          aria-label="EL SULTAN"
        >
          <ChairMark
            tone={overDarkHero ? 'ochre' : 'burgundy'}
            className="h-5 sm:h-6 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
          />
          <ElSultanWordmark
            tone={overDarkHero ? 'bone' : 'burgundy'}
            className="h-7 sm:h-9 w-auto"
          />
        </a>

        {/* Zone 2: Single-Line Navigation Links (Desktop 1024px+) */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.12em]"
        >
          {primaryLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href={`/${locale}/${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors after:absolute after:left-0 after:bottom-1 after:h-[1.5px] after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  overDarkHero
                    ? `focus-visible:outline-[#C98B54] ${
                        isActive
                          ? 'text-[#C98B54] after:bg-[#C98B54] after:w-full'
                          : 'text-[#F3EADA] hover:text-[#C98B54] after:bg-[#C98B54] after:w-0 hover:after:w-full'
                      }`
                    : `focus-visible:outline-[#672938] ${
                        isActive
                          ? 'text-[#672938] after:bg-[#672938] after:w-full'
                          : 'text-[#191B1A]/85 hover:text-[#672938] after:bg-[#672938] after:w-0 hover:after:w-full'
                      }`
                }`}
              >
                {item.label}
                {item.id === 'menu' && callListCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#C98B54] text-[#191B1A] text-[10px] font-bold tabular-nums leading-none">
                    {callListCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Compact Language Dropdown + 1 Prominent Order CTA (+ Mobile Drawer Toggle) */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <div ref={langDropdownRef} className="relative">
            <button
              ref={langTriggerRef}
              type="button"
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-label={t.nav.languageLabel}
              onClick={handleTriggerClick}
              onKeyDown={handleTriggerKeyDown}
              className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${
                overDarkHero
                  ? 'text-[#F3EADA] hover:text-[#C98B54] hover:bg-[#F3EADA]/[0.08] focus-visible:outline-[#C98B54]'
                  : 'text-[#191B1A] hover:text-[#672938] hover:bg-[#191B1A]/[0.06] focus-visible:outline-[#672938]'
              }`}
            >
              <span>{locale.toUpperCase()}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  langMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {langMenuOpen && (
              <div
                role="listbox"
                aria-label={t.nav.languageLabel}
                onKeyDown={handleListboxKeyDown}
                className="absolute right-0 top-full mt-2 min-w-[168px] bg-[#191B1A]/96 backdrop-blur-xl text-[#F3EADA] border border-[#F3EADA]/20 py-1.5 z-50 rounded-2xl overflow-hidden"
              >
                {LOCALES.map((item, idx) => {
                  const active = item.code === locale;
                  return (
                    <button
                      key={item.code}
                      ref={(el) => {
                        optionRefs.current[idx] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setLangMenuOpen(false);
                        onChangeLocale(item.code);
                        langTriggerRef.current?.focus();
                      }}
                      className={`w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-between gap-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#C98B54] ${
                        active
                          ? 'text-[#C98B54] bg-[#F3EADA]/[0.08]'
                          : 'text-[#F3EADA] hover:text-[#C98B54] hover:bg-[#F3EADA]/[0.05]'
                      }`}
                    >
                      <span>{item.code.toUpperCase()}</span>
                      <span className="font-normal normal-case tracking-normal text-[#F3EADA]/75 text-xs">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenOrderModal}
            className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-5 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
              overDarkHero
                ? 'bg-[#C98B54] text-[#191B1A] hover:bg-[#d69b66] focus-visible:outline-[#F3EADA]'
                : 'bg-[#672938] text-[#F3EADA] hover:bg-[#4f1d29] focus-visible:outline-[#C98B54]'
            }`}
          >
            <span>{t.nav.order}</span>
            <span aria-hidden="true">↗</span>
          </button>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              overDarkHero
                ? 'text-[#F3EADA] hover:text-[#C98B54] hover:bg-[#F3EADA]/10 focus-visible:outline-[#C98B54]'
                : 'text-[#191B1A] hover:text-[#672938] hover:bg-[#191B1A]/10 focus-visible:outline-[#672938]'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={t.nav.openMenuLabel}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Editorial Navigation Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-[#F3EADA] text-[#191B1A] border-t border-b border-[#191B1A]/14 px-4 sm:px-8 py-6"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {primaryLinks.map((item, idx) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={`/${locale}/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-xl sm:text-2xl font-display py-4 border-b border-[#191B1A]/12 flex items-baseline justify-between transition-colors focus-visible:outline-2 focus-visible:outline-[#672938] ${
                    isActive ? 'text-[#672938]' : 'text-[#191B1A] hover:text-[#672938]'
                  }`}
                >
                  <span>
                    <span className="text-xs font-body font-bold text-[#672938] mr-4 tabular-nums">
                      0{idx + 1}
                    </span>
                    {item.label}
                  </span>
                  <span aria-hidden="true" className="text-[#672938] text-base">
                    ↗
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
      <ScrollProgressRail overDark={overDarkHero} />
    </header>
  );
};
