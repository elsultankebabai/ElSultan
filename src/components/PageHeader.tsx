import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Locale } from '../data/menu';
import { ChairMark } from './BrandMarks';
import { EASE_APPLE } from './ScrollReveal';
import { soundManager } from '../utils/sound';

interface PageHeaderProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  onGoHome: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  locale,
  eyebrow,
  title,
  subtitle,
  onGoHome,
}) => {
  const prefersReduced = useReducedMotion();

  const homeLabel =
    locale === 'ru' ? 'Главная' : locale === 'lt' ? 'Pradžia' : 'Home';

  return (
    <div className="relative bg-[#191B1A] text-[#F3EADA] pt-24 pb-12 lg:pt-28 lg:pb-16 border-b border-[#F3EADA]/14 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-10 -bottom-16 opacity-[0.07]"
      >
        <ChairMark tone="ochre" className="w-[260px] sm:w-[340px] h-auto" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F3EADA]/[0.08] backdrop-blur-md border border-[#F3EADA]/18 text-[#F3EADA] text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#F3EADA]/[0.16] hover:border-[#C98B54]/60 transition-all duration-200 active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54]"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 text-[#C98B54] transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>{homeLabel}</span>
          </button>

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C98B54]">
            {eyebrow}
          </span>
        </div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_APPLE }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.88] tracking-[-0.03em] text-[#F3EADA] uppercase">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#F3EADA]/80 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
