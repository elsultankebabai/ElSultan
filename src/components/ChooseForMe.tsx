import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Plus, RotateCcw, Phone } from 'lucide-react';
import {
  ALLERGEN_ENQUIRY_POLICY,
  BudgetChoice,
  Locale,
  MenuCategoryId,
  MenuItem,
  OccasionChoice,
  OrderingMethodChoice,
  PreferenceChoice,
  RESTAURANT_INFO,
  formatCents,
  recommendDish,
} from '../data/menu';
import { getIsolatedProductImage, getProductImage, getResponsiveMenuWebp } from '../data/productImages';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import { EASE_APPLE } from './ScrollReveal';
import { soundManager } from '../utils/sound';

interface ChooseForMeProps {
  locale: Locale;
  t: TranslationBundle;
  callListIds: string[];
  onToggleCallList: (item: MenuItem) => void;
  onExploreDishInMenu: (dishId: string, category?: MenuCategoryId) => void;
}

export const ChooseForMe: React.FC<ChooseForMeProps> = ({
  locale,
  t,
  callListIds,
  onToggleCallList,
  onExploreDishInMenu,
}) => {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'result'>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [budget, setBudget] = useState<BudgetChoice>('flexible');
  const [occasion, setOccasion] = useState<OccasionChoice>('skip');
  const [preference, setPreference] = useState<PreferenceChoice>('skip');
  const [orderingMethod, setOrderingMethod] = useState<OrderingMethodChoice>('skip');
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);

  const outcome = useMemo(
    () =>
      step === 'result'
        ? recommendDish({ budget, occasion, preference, orderingMethod })
        : null,
    [step, budget, occasion, preference, orderingMethod]
  );

  // Up to 3 matched dishes (Primary + 2 Qualifying Matches)
  const matchedDishes = useMemo<Array<{ item: MenuItem; priceCents: number }>>(() => {
    if (!outcome || outcome.status !== 'match') return [];
    const list: Array<{ item: MenuItem; priceCents: number }> = [
      { item: outcome.primary, priceCents: outcome.primaryPriceCents },
      ...outcome.alternatives.map((alt) => ({
        item: alt,
        priceCents: alt.variants?.[0]?.priceCents || alt.basePriceCents,
      })),
    ];
    return list.slice(0, 3);
  }, [outcome]);

  useEffect(() => {
    setSelectedMatchIdx(0);
  }, [budget, occasion, preference, orderingMethod, step]);

  const activeMatch = matchedDishes[selectedMatchIdx] || matchedDishes[0];

  const goStep = (next: 1 | 2 | 3 | 4 | 'result', dir: 1 | -1 = 1) => {
    setDirection(dir);
    setStep(next);
  };

  const reset = () => {
    setDirection(-1);
    setBudget('flexible');
    setOccasion('skip');
    setPreference('skip');
    setOrderingMethod('skip');
    setSelectedMatchIdx(0);
    setStep(1);
  };

  const budgetChoices: Array<{ value: BudgetChoice; label: string }> = [
    { value: 'up_to_8', label: t.chooseForMe.q1Options.up_to_8 },
    { value: 'up_to_10', label: t.chooseForMe.q1Options.up_to_10 },
    { value: 'up_to_12', label: t.chooseForMe.q1Options.up_to_12 },
    { value: 'flexible', label: t.chooseForMe.q1Options.flexible },
  ];

  const occasionChoices: Array<{ value: OccasionChoice; label: string }> = [
    { value: 'quick_bite', label: t.chooseForMe.q2Options.quick_bite },
    { value: 'proper_lunch', label: t.chooseForMe.q2Options.proper_lunch },
    { value: 'with_friends', label: t.chooseForMe.q2Options.with_friends },
  ];

  const preferenceChoices: Array<{ value: PreferenceChoice; label: string }> = [
    { value: 'chicken', label: t.chooseForMe.q3Options.chicken },
    { value: 'beef', label: t.chooseForMe.q3Options.beef },
    { value: 'vegetarian', label: t.chooseForMe.q3Options.vegetarian },
    { value: 'vegan', label: t.chooseForMe.q3Options.vegan },
    { value: 'surprise', label: t.chooseForMe.q3Options.surprise },
  ];

  const methodChoices: Array<{ value: OrderingMethodChoice; label: string }> = [
    { value: 'dine_in', label: t.chooseForMe.q4Options.dine_in },
    { value: 'pickup', label: t.chooseForMe.q4Options.pickup },
    { value: 'delivery', label: t.chooseForMe.q4Options.delivery },
  ];

  const rankLabels =
    locale === 'ru'
      ? ['01 · Лучший выбор', '02 · Отличный вариант', '03 · Также подходит']
      : locale === 'lt'
      ? ['01 · Geriausias pasirinkimas', '02 · Puikus variantas', '03 · Taip pat tinka']
      : ['01 · Top Match', '02 · Great Pick', '03 · Also Fits'];

  const trioTitle =
    locale === 'ru'
      ? `ПОДОБРАНО ДЛЯ ВАС (${matchedDishes.length})`
      : locale === 'lt'
      ? `ATRINKTI PATIEKALAI JUMS (${matchedDishes.length})`
      : `CURATED PICKS FOR YOU (${matchedDishes.length})`;

  const addAllLabel =
    locale === 'ru'
      ? `Добавить все (${matchedDishes.length})`
      : locale === 'lt'
      ? `Pridėti visus (${matchedDishes.length})`
      : `Add all ${matchedDishes.length} to order`;

  const allAddedLabel =
    locale === 'ru'
      ? 'Все в списке'
      : locale === 'lt'
      ? 'Visi sąraše'
      : 'All added';

  const allMatchedAdded =
    matchedDishes.length > 0 &&
    matchedDishes.every((m) => callListIds.includes(m.item.id));

  const handleAddAllMatched = () => {
    soundManager.playConfirm();
    matchedDishes.forEach(({ item }) => {
      if (!callListIds.includes(item.id)) {
        onToggleCallList(item);
      }
    });
  };

  const renderChannelActions = (item: MenuItem) => (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-bold uppercase tracking-[0.09em]">
      <a
        href={RESTAURANT_INFO.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#F3EADA] border-b border-[#F3EADA]/45 pb-0.5 hover:text-[#C98B54] hover:border-[#C98B54] transition-colors"
      >
        {t.channels.dine_in} ↗
      </a>
      <a
        href={RESTAURANT_INFO.phoneHref}
        className="inline-flex items-center gap-1.5 text-[#C98B54] border-b border-[#C98B54] pb-0.5 hover:text-[#F3EADA] hover:border-[#F3EADA] transition-colors tabular-nums"
      >
        <Phone className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t.chooseForMe.callToOrder}</span>
      </a>
      {item.channels.includes('wolt') && (
        <a
          href={RESTAURANT_INFO.woltUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F3EADA] border-b border-[#F3EADA]/45 pb-0.5 hover:text-[#C98B54] transition-colors"
        >
          Wolt ↗
        </a>
      )}
      {item.channels.includes('bolt') && (
        <a
          href={RESTAURANT_INFO.boltUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F3EADA] border-b border-[#F3EADA]/45 pb-0.5 hover:text-[#C98B54] transition-colors"
        >
          Bolt Food ↗
        </a>
      )}
    </div>
  );

  const stepVariants = {
    enter: (dir: number) =>
      prefersReduced ? { opacity: 1 } : { opacity: 0, x: dir * 32, scale: 0.99 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) =>
      prefersReduced ? { opacity: 1 } : { opacity: 0, x: dir * -28, scale: 0.99 },
  };

  const currentStepQuestions: Record<
    1 | 2 | 3 | 4,
    {
      title: string;
      options: Array<{ value: string; label: string }>;
      onSelect: (val: string) => void;
    }
  > = {
    1: {
      title: t.chooseForMe.q1Title,
      options: budgetChoices,
      onSelect: (val) => {
        soundManager.playClick();
        setBudget(val as BudgetChoice);
        goStep(2, 1);
      },
    },
    2: {
      title: t.chooseForMe.q2Title,
      options: occasionChoices,
      onSelect: (val) => {
        soundManager.playClick();
        setOccasion(val as OccasionChoice);
        goStep(3, 1);
      },
    },
    3: {
      title: t.chooseForMe.q3Title,
      options: preferenceChoices,
      onSelect: (val) => {
        soundManager.playClick();
        setPreference(val as PreferenceChoice);
        goStep(4, 1);
      },
    },
    4: {
      title: t.chooseForMe.q4Title,
      options: methodChoices,
      onSelect: (val) => {
        soundManager.playConfirm();
        setOrderingMethod(val as OrderingMethodChoice);
        goStep('result', 1);
      },
    },
  };

  const progressRatio = step === 'result' ? 1 : step / 4;

  return (
    <section
      id="choose-for-me"
      ref={sectionRef}
      className="relative bg-[#672938] text-[#F3EADA] pt-10 sm:pt-14 pb-20 sm:pb-28 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-12 -bottom-16 opacity-[0.06]"
      >
        <ChairMark tone="bone" className="w-[340px] sm:w-[440px] h-auto" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <AnimatePresence mode="wait" custom={direction}>
          {step !== 'result' ? (
            /* ===============================================================
               ANIMATED 4-STEP QUESTION FLOW
               =============================================================== */
            <motion.div
              key="wizard-shell"
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: EASE_APPLE }}
              className="max-w-4xl"
            >
              {/* Animated Step Counter + Smooth Progress Track */}
              <div className="space-y-4 pb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#C98B54] tabular-nums">
                    <span>
                      {t.chooseForMe.stepOf} 0{step} / 04
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          goStep((step - 1) as 1 | 2 | 3, -1);
                        }}
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#F3EADA]/75 hover:text-[#F3EADA] transition-colors cursor-pointer"
                      >
                        ← {t.chooseForMe.backBtn}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        if (step === 1) {
                          setBudget('skip');
                          goStep(2, 1);
                        } else if (step === 2) {
                          setOccasion('skip');
                          goStep(3, 1);
                        } else if (step === 3) {
                          setPreference('skip');
                          goStep(4, 1);
                        } else {
                          setOrderingMethod('skip');
                          goStep('result', 1);
                        }
                      }}
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[#F3EADA]/70 border-b border-[#F3EADA]/35 pb-0.5 hover:text-[#C98B54] hover:border-[#C98B54] transition-colors cursor-pointer"
                    >
                      {t.chooseForMe.skipBtn} →
                    </button>
                  </div>
                </div>

                {/* Animated Progress Rail */}
                <div className="h-1 w-full rounded-full bg-[#F3EADA]/15 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: progressRatio }}
                    transition={{ duration: 0.42, ease: EASE_APPLE }}
                    style={{ transformOrigin: '0% 50%' }}
                    className="h-full w-full rounded-full bg-[#C98B54]"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`step-${step}`}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: EASE_APPLE }}
                  className="pt-4 space-y-6"
                >
                  <h3 className="font-display text-2xl sm:text-4xl text-[#F3EADA]">
                    {currentStepQuestions[step].title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentStepQuestions[step].options.map((opt, idx) => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: prefersReduced ? 0 : idx * 0.045,
                          ease: EASE_APPLE,
                        }}
                        onClick={() => currentStepQuestions[step].onSelect(opt.value)}
                        className="group w-full rounded-2xl bg-[#F3EADA]/[0.06] border border-[#F3EADA]/15 hover:bg-[#F3EADA]/[0.13] hover:border-[#C98B54]/70 px-6 py-5 sm:py-6 flex items-center justify-between gap-4 text-left transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54]"
                      >
                        <span className="flex items-baseline gap-4 min-w-0">
                          <span className="text-xs font-bold text-[#C98B54] tabular-nums shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="font-display text-lg sm:text-2xl tracking-tight text-[#F3EADA] group-hover:text-white transition-colors">
                            {opt.label}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="w-9 h-9 rounded-full bg-[#F3EADA]/[0.08] flex items-center justify-center shrink-0 text-[#F3EADA] group-hover:bg-[#C98B54] group-hover:text-[#191B1A] transition-all duration-200"
                        >
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ===============================================================
               ANIMATED 3-PICK CURATED RESULTS + INLINE LIVE FILTERS
               =============================================================== */
            <motion.div
              key="result-shell"
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.34, ease: EASE_APPLE }}
              className="pt-2 space-y-10"
            >
              {/* Inline Editable Filter Strips (rounded soft panel) */}
              <div className="rounded-3xl bg-[#F3EADA]/[0.06] border border-[#F3EADA]/14 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54]">
                    {t.chooseForMe.editFiltersLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      reset();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#F3EADA]/75 hover:text-[#F3EADA] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.chooseForMe.chooseAgainBtn}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
                  {/* Inline Budget */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3EADA]/55 block">
                      {t.chooseForMe.q1Title}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {budgetChoices.map((b) => (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => {
                            soundManager.playTick();
                            setBudget(b.value);
                          }}
                          aria-pressed={budget === b.value}
                          className={`pb-0.5 font-bold cursor-pointer transition-colors ${
                            budget === b.value
                              ? 'text-[#C98B54] border-b border-[#C98B54]'
                              : 'text-[#F3EADA]/70 hover:text-[#F3EADA]'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inline Occasion */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3EADA]/55 block">
                      {t.chooseForMe.q2Title}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {[
                        ...occasionChoices,
                        { value: 'skip' as OccasionChoice, label: t.chooseForMe.skipTag },
                      ].map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => {
                            soundManager.playTick();
                            setOccasion(o.value);
                          }}
                          aria-pressed={occasion === o.value}
                          className={`pb-0.5 font-bold cursor-pointer transition-colors ${
                            occasion === o.value
                              ? 'text-[#C98B54] border-b border-[#C98B54]'
                              : 'text-[#F3EADA]/70 hover:text-[#F3EADA]'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inline Preference */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3EADA]/55 block">
                      {t.chooseForMe.q3Title}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {[
                        ...preferenceChoices,
                        { value: 'skip' as PreferenceChoice, label: t.chooseForMe.skipTag },
                      ].map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => {
                            soundManager.playTick();
                            setPreference(p.value);
                          }}
                          aria-pressed={preference === p.value}
                          className={`pb-0.5 font-bold cursor-pointer transition-colors ${
                            preference === p.value
                              ? 'text-[#C98B54] border-b border-[#C98B54]'
                              : 'text-[#F3EADA]/70 hover:text-[#F3EADA]'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inline Method */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3EADA]/55 block">
                      {t.chooseForMe.q4Title}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {[
                        ...methodChoices,
                        { value: 'skip' as OrderingMethodChoice, label: t.chooseForMe.skipTag },
                      ].map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => {
                            soundManager.playTick();
                            setOrderingMethod(m.value);
                          }}
                          aria-pressed={orderingMethod === m.value}
                          className={`pb-0.5 font-bold cursor-pointer transition-colors ${
                            orderingMethod === m.value
                              ? 'text-[#C98B54] border-b border-[#C98B54]'
                              : 'text-[#F3EADA]/70 hover:text-[#F3EADA]'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {outcome?.status === 'no_match' ? (
                <motion.div
                  key="no-match"
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE_APPLE }}
                  className="py-10 space-y-6 max-w-2xl"
                >
                  <h3 className="font-display text-3xl sm:text-4xl text-[#F3EADA]">
                    {t.chooseForMe.noMatchTitle}
                  </h3>
                  <p className="text-base text-[#F3EADA]/85 leading-relaxed">
                    {t.chooseForMe.noMatchBody}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {outcome.relaxBudgetHelpful && (
                      <button
                        type="button"
                        onClick={() => setBudget('flexible')}
                        className="px-6 py-3 rounded-full bg-[#F3EADA] text-[#672938] text-xs font-bold uppercase tracking-[0.1em] hover:bg-white active:scale-[0.97] transition-all cursor-pointer"
                      >
                        {t.chooseForMe.relaxBudgetBtn}
                      </button>
                    )}
                    {outcome.relaxDeliveryHelpful && (
                      <button
                        type="button"
                        onClick={() => setOrderingMethod('pickup')}
                        className="px-6 py-3 rounded-full bg-[#191B1A] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.1em] hover:bg-black active:scale-[0.97] transition-all cursor-pointer"
                      >
                        {t.chooseForMe.relaxDeliveryBtn}
                      </button>
                    )}
                    {outcome.relaxDietaryHelpful && (
                      <button
                        type="button"
                        onClick={() => setPreference('surprise')}
                        className="text-xs font-bold uppercase tracking-[0.1em] text-[#F3EADA] border-b border-[#F3EADA]/45 pb-1 cursor-pointer"
                      >
                        {t.chooseForMe.relaxDietaryBtn}
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : outcome?.status === 'match' && activeMatch ? (
                <div className="space-y-10">
                  {/* INTERACTIVE 3-PICK SELECTOR BAR (ADD 1, 2, OR ALL 3!) */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C98B54]">
                        {trioTitle}
                      </p>
                      {matchedDishes.length > 1 && (
                        <button
                          type="button"
                          onClick={handleAddAllMatched}
                          disabled={allMatchedAdded}
                          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all active:scale-[0.97] cursor-pointer ${
                            allMatchedAdded
                              ? 'bg-[#C98B54] text-[#191B1A]'
                              : 'bg-[#F3EADA] text-[#672938] hover:bg-white'
                          }`}
                        >
                          {allMatchedAdded ? (
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          <span>{allMatchedAdded ? allAddedLabel : addAllLabel}</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {matchedDishes.map((entry, idx) => {
                        const isSelected = idx === selectedMatchIdx;
                        const isAdded = callListIds.includes(entry.item.id);
                        const thumb = getProductImage(entry.item.id);
                        const isolated = getIsolatedProductImage(entry.item.id);

                        return (
                          <motion.div
                            key={entry.item.id}
                            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: prefersReduced ? 0 : idx * 0.06,
                              ease: EASE_APPLE,
                            }}
                            className={`rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between gap-4 ${
                              isSelected
                                ? 'bg-[#F3EADA]/[0.14] border-[#C98B54] shadow-lg'
                                : 'bg-[#F3EADA]/[0.05] border-[#F3EADA]/14 hover:bg-[#F3EADA]/[0.09] hover:border-[#F3EADA]/30'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playClick();
                                setSelectedMatchIdx(idx);
                              }}
                              aria-pressed={isSelected}
                              className="text-left space-y-3 cursor-pointer w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B54] rounded-2xl"
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.13em]">
                                <span className="text-[#C98B54]">{rankLabels[idx]}</span>
                                <span className="font-display text-base text-[#F3EADA] tabular-nums">
                                  {formatCents(entry.priceCents)}
                                </span>
                              </div>

                              <div className="flex items-center gap-3.5">
                                {(isolated || thumb) && (
                                  <div
                                    className={`w-20 aspect-[4/3] shrink-0 flex items-center justify-center ${
                                      isolated
                                        ? ''
                                        : 'rounded-2xl overflow-hidden bg-[#191B1A]'
                                    }`}
                                  >
                                    {isolated ? (
                                      <img
                                        src={isolated}
                                        alt={thumb?.alt[locale] || entry.item.name[locale]}
                                        width={240}
                                        height={180}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"
                                      />
                                    ) : thumb ? (() => {
                                      const webp = getResponsiveMenuWebp(thumb.src);
                                      return (
                                        <picture className="w-full h-full block">
                                          {webp && (
                                            <source
                                              type="image/webp"
                                              srcSet={webp.webpSrcSet}
                                              sizes="80px"
                                            />
                                          )}
                                          <img
                                            src={thumb.src}
                                            alt={thumb.alt[locale]}
                                            width={240}
                                            height={180}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                          />
                                        </picture>
                                      );
                                    })() : null}
                                  </div>
                                )}
                                <div className="min-w-0 space-y-1">
                                  <h4 className="font-display text-lg sm:text-xl leading-tight text-[#F3EADA]">
                                    {entry.item.name[locale]}
                                  </h4>
                                  <p className="text-xs text-[#F3EADA]/70 line-clamp-2 leading-relaxed">
                                    {entry.item.description[locale]}
                                  </p>
                                </div>
                              </div>
                            </button>

                            <div className="pt-3 border-t border-[#F3EADA]/14 flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  soundManager.playConfirm();
                                  onToggleCallList(entry.item);
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.09em] transition-all active:scale-[0.97] cursor-pointer ${
                                  isAdded
                                    ? 'bg-[#C98B54] text-[#191B1A]'
                                    : 'bg-[#F3EADA]/12 text-[#F3EADA] hover:bg-[#F3EADA] hover:text-[#672938]'
                                }`}
                              >
                                <span>
                                  {isAdded
                                    ? t.menuSection.addedToCallList
                                    : t.menuSection.addToCallList}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  soundManager.playClick();
                                  setSelectedMatchIdx(idx);
                                }}
                                className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#F3EADA]/75 hover:text-[#C98B54] cursor-pointer"
                              >
                                {isSelected
                                  ? locale === 'ru'
                                    ? 'Выбрано'
                                    : locale === 'lt'
                                    ? 'Rodoma'
                                    : 'Viewing'
                                  : locale === 'ru'
                                  ? 'Подробнее →'
                                  : locale === 'lt'
                                  ? 'Plačiau →'
                                  : 'Details →'}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ANIMATED SPOTLIGHT DETAIL VIEW FOR THE SELECTED MATCH */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMatch.item.id}
                      initial={prefersReduced ? false : { opacity: 0, y: 14, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={prefersReduced ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
                      transition={{ duration: 0.28, ease: EASE_APPLE }}
                      className="rounded-3xl bg-[#191B1A]/25 border border-[#F3EADA]/14 p-6 sm:p-10"
                    >
                      {(() => {
                        const dish = activeMatch.item;
                        const dishAsset = getProductImage(dish.id);
                        const dishIsolated = getIsolatedProductImage(dish.id);
                        const hasVisual = Boolean(dishIsolated || dishAsset);
                        const isAdded = callListIds.includes(dish.id);

                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            {hasVisual && (
                              <div className="lg:col-span-5 relative flex items-center justify-center">
                                {dishIsolated ? (
                                  <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
                                    <div
                                      aria-hidden="true"
                                      className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 w-[74%] h-7 rounded-full bg-black/55 blur-xl"
                                    />
                                    <img
                                      src={dishIsolated}
                                      alt={dishAsset?.alt[locale] || dish.name[locale]}
                                      width={800}
                                      height={600}
                                      decoding="async"
                                      className="relative z-10 w-full h-full object-contain object-center drop-shadow-[0_24px_26px_rgba(0,0,0,0.58)]"
                                    />
                                  </div>
                                ) : (() => {
                                  const webp = getResponsiveMenuWebp(dishAsset!.src);
                                  return (
                                    <div className="w-full aspect-[3/2] rounded-3xl overflow-hidden bg-[#191B1A] shadow-xl">
                                      <picture>
                                        {webp && (
                                          <source
                                            type="image/webp"
                                            srcSet={webp.webpSrcSet}
                                            sizes="(min-width: 1024px) 42vw, 100vw"
                                          />
                                        )}
                                        <img
                                          src={dishAsset!.src}
                                          alt={dishAsset!.alt[locale]}
                                          width={840}
                                          height={560}
                                          decoding="async"
                                          className="w-full h-full object-cover object-center"
                                        />
                                      </picture>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            <div
                              className={`${
                                hasVisual ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'
                              } space-y-5`}
                            >
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C98B54]">
                                {rankLabels[selectedMatchIdx] || t.chooseForMe.resultEyebrow}
                              </p>

                              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#F3EADA]/20 pb-4">
                                <h3 className="font-display text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[0.95] text-[#F3EADA]">
                                  {dish.name[locale]}
                                </h3>
                                <span className="font-display text-3xl sm:text-4xl text-[#C98B54] tabular-nums shrink-0">
                                  {formatCents(activeMatch.priceCents)}
                                </span>
                              </div>

                              {selectedMatchIdx === 0 && (
                                <p className="text-base sm:text-lg text-[#F3EADA] font-bold leading-relaxed">
                                  {t.chooseForMe.reasons[outcome.reasonKey]}
                                </p>
                              )}

                              <p className="text-sm sm:text-base text-[#F3EADA]/80 leading-relaxed">
                                {dish.description[locale]}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-[#F3EADA]/15 text-xs sm:text-sm">
                                {dish.ingredients?.[locale] && (
                                  <div>
                                    <span className="font-bold block mb-1 uppercase tracking-wider text-[11px] text-[#C98B54]">
                                      {t.chooseForMe.ingredientsLabel}
                                    </span>
                                    <p className="text-[#F3EADA]/75 leading-relaxed">
                                      {dish.ingredients[locale]}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold block mb-1 uppercase tracking-wider text-[11px] text-[#C98B54]">
                                    {t.chooseForMe.allergensLabel}
                                  </span>
                                  <p className="text-[#F3EADA]/75 leading-relaxed">
                                    {ALLERGEN_ENQUIRY_POLICY[locale]}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-[#F3EADA]/15 space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3EADA]/65 block">
                                  {t.chooseForMe.channelsLabel}
                                </span>
                                {renderChannelActions(dish)}
                              </div>

                              <div className="flex flex-wrap items-center gap-5 pt-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundManager.playConfirm();
                                    onToggleCallList(dish);
                                  }}
                                  className={`px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] active:scale-[0.97] transition-all cursor-pointer ${
                                    isAdded
                                      ? 'bg-[#C98B54] text-[#191B1A]'
                                      : 'bg-[#F3EADA] text-[#672938] hover:bg-white'
                                  }`}
                                >
                                  {isAdded
                                    ? t.chooseForMe.addedToCallListBtn
                                    : t.chooseForMe.addToCallListBtn}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onExploreDishInMenu(dish.id, dish.category)}
                                  className="text-xs font-bold uppercase tracking-[0.1em] text-[#F3EADA] border-b border-[#F3EADA]/45 pb-1 hover:text-[#C98B54] hover:border-[#C98B54] transition-colors cursor-pointer"
                                >
                                  {t.chooseForMe.exploreMenuBtn} →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Gentle Charcoal Alternative Hint (if wrap picked) */}
                  {outcome.charcoalUpgradeNote && (
                    <div className="rounded-3xl bg-[#F3EADA]/[0.06] border border-[#F3EADA]/14 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54]">
                          {t.chooseForMe.charcoalDiscoveryTitle}
                        </p>
                        <p className="font-display text-lg sm:text-xl text-[#F3EADA] tabular-nums">
                          {outcome.charcoalUpgradeNote.name[locale]} ·{' '}
                          {formatCents(outcome.charcoalUpgradeNote.basePriceCents)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          outcome.charcoalUpgradeNote &&
                          onExploreDishInMenu(
                            outcome.charcoalUpgradeNote.id,
                            outcome.charcoalUpgradeNote.category
                          )
                        }
                        className="text-xs font-bold uppercase tracking-[0.1em] text-[#F3EADA] border-b border-[#F3EADA]/50 pb-1 hover:text-[#C98B54] transition-colors self-start sm:self-center cursor-pointer"
                      >
                        {t.menuSection.compareCharcoalCta} ↗
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
