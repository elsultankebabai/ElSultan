import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Check,
  Copy,
  Flame,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  ALLERGEN_ENQUIRY_POLICY,
  KEBAB_SIZE_NOTE,
  Locale,
  MENU_CATEGORIES,
  MENU_ITEMS,
  MenuCategoryId,
  MenuItem,
  MenuVariant,
  RESTAURANT_INFO,
  calculateLineTotalCents,
  calculateOrderTotalCents,
  calculateUnitWithExtrasCents,
  formatCents,
  getDishReviews,
} from '../data/menu';
import {
  getCategoryImage,
  getIsolatedProductImage,
  getProductImage,
  getResponsiveMenuWebp,
} from '../data/productImages';
import { TranslationBundle } from '../i18n/translations';
import { ChairMark } from './BrandMarks';
import { soundManager } from '../utils/sound';
import { OrderLineItem, buildOrderLineId } from '../utils/orderLine';
export { buildOrderLineId };
export type { OrderLineItem };

interface MenuSectionProps {
  locale: Locale;
  t: TranslationBundle;
  selectedCategory: MenuCategoryId | 'all';
  highlightedDishId?: string;
  onClearHighlightedDish?: () => void;
  onSelectCategory: (cat: MenuCategoryId | 'all') => void;
  callList: OrderLineItem[];
  onAddCallItem: (
    dish: MenuItem,
    variantId?: string,
    extraIds?: string[],
    qty?: number
  ) => void;
  onUpdateCallItemQty: (lineId: string, delta: number) => void;
  onRemoveCallItem: (lineId: string) => void;
  onClearCallList: () => void;
}

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

/** Short clean variant label for inline quick-add rows */
function shortVariantLabel(variant: MenuVariant, locale: Locale): string {
  if (variant.id === 'vistiena-reg' || variant.id === 'vistiena') {
    return locale === 'ru' ? 'Курица' : locale === 'lt' ? 'Vištiena' : 'Chicken';
  }
  if (variant.id === 'jautiena-reg' || variant.id === 'jautiena') {
    return locale === 'ru' ? 'Говядина' : locale === 'lt' ? 'Jautiena' : 'Beef';
  }
  if (variant.id === 'veg-reg') {
    return locale === 'ru' ? 'Стандарт' : locale === 'lt' ? 'Standartinis' : 'Regular';
  }
  return variant.label[locale];
}

/** Primary display variants on a card (e.g., for kebabs show Chicken & Beef standard; large +€1.50 in modal) */
function getCardDisplayVariants(item: MenuItem): MenuVariant[] {
  if (!item.variants?.length) return [];
  if (item.category === 'kebabs') {
    const regulars = item.variants.filter((v) => v.id.endsWith('-reg'));
    if (regulars.length > 0) return regulars;
  }
  return item.variants;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  locale,
  t,
  selectedCategory,
  highlightedDishId,
  onClearHighlightedDish,
  onSelectCategory,
  callList,
  onAddCallItem,
  onUpdateCallItemQty,
  onRemoveCallItem,
  onClearCallList,
}) => {
  const prefersReduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalDish, setActiveModalDish] = useState<MenuItem | null>(null);
  const [modalVariantId, setModalVariantId] = useState<string | undefined>(undefined);
  const [modalExtras, setModalExtras] = useState<string[]>([]);
  const [modalQty, setModalQty] = useState<number>(1);
  const [callDrawerOpen, setCallDrawerOpen] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [justAddedToast, setJustAddedToast] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);

  // Open detail modal automatically if navigated here with a specific highlightedDishId
  useEffect(() => {
    if (!highlightedDishId) return;
    const found = MENU_ITEMS.find((m) => m.id === highlightedDishId);
    if (found) {
      openDishModal(found);
    }
    onClearHighlightedDish?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedDishId]);

  // Escape key closes modal or order drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModalDish) setActiveModalDish(null);
        else if (callDrawerOpen) setCallDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalDish, callDrawerOpen]);

  // Lock body scroll while modal or drawer is open
  useEffect(() => {
    if (activeModalDish || callDrawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeModalDish, callDrawerOpen]);

  const showAddedFeedback = (label: string) => {
    setJustAddedToast(label);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setJustAddedToast(null);
    }, 1800);
  };

  const openDishModal = (item: MenuItem, preselectedVariantId?: string) => {
    soundManager.playClick();
    setActiveModalDish(item);
    setModalVariantId(preselectedVariantId || item.variants?.[0]?.id);
    setModalExtras([]);
    setModalQty(1);
  };

  const handleQuickAdd = (item: MenuItem, variantId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playConfirm();
    const resolvedVariantId = variantId || item.variants?.[0]?.id;
    onAddCallItem(item, resolvedVariantId, [], 1);
    const variantObj = resolvedVariantId
      ? item.variants?.find((v) => v.id === resolvedVariantId)
      : undefined;
    const suffix = variantObj ? ` (${shortVariantLabel(variantObj, locale)})` : '';
    showAddedFeedback(`${item.name[locale]}${suffix}`);
  };

  const handleQuickDecrement = (item: MenuItem, variantId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playTick();
    const resolvedVariantId = variantId || item.variants?.[0]?.id;
    const lineId = buildOrderLineId(item.id, resolvedVariantId, []);
    const exactLine = callList.find((c) => c.id === lineId);
    if (exactLine) {
      onUpdateCallItemQty(exactLine.id, -1);
      return;
    }
    // Fallback: decrement latest matching dish+variant entry if customized with extras
    const fallbackLine = [...callList]
      .reverse()
      .find((c) => c.dishId === item.id && (!resolvedVariantId || c.variantId === resolvedVariantId));
    if (fallbackLine) {
      onUpdateCallItemQty(fallbackLine.id, -1);
    }
  };

  /** Quantity currently in order for exact dish + optional variant (with no extras) */
  const getVariantQtyInOrder = (itemId: string, variantId?: string): number => {
    const exactId = buildOrderLineId(itemId, variantId, []);
    return callList.find((c) => c.id === exactId)?.qty || 0;
  };

  /** Total quantity of this dish (across all variants/extras) in order */
  const getDishTotalQty = (itemId: string): number =>
    callList
      .filter((c) => c.dishId === itemId)
      .reduce((sum, entry) => sum + entry.qty, 0);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (!item.available) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (q) {
        const hay = `${item.name[locale]} ${item.description[locale]} ${
          item.ingredients?.[locale] || ''
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, locale]);

  const groupedCategories = useMemo(() => {
    return MENU_CATEGORIES.map((cat) => ({
      ...cat,
      items: filteredItems.filter((item) => item.category === cat.id),
    })).filter((group) => group.items.length > 0);
  }, [filteredItems]);

  const callListCount = callList.reduce((sum, entry) => sum + entry.qty, 0);
  const callListTotalCents = calculateOrderTotalCents(callList);

  const resolveCallItemDisplay = (entry: OrderLineItem) => {
    const dish = MENU_ITEMS.find((m) => m.id === entry.dishId);
    const variant = entry.variantId
      ? dish?.variants?.find((v) => v.id === entry.variantId)
      : undefined;
    const extraNames = entry.extraIds
      .map((eid) => MENU_ITEMS.find((m) => m.id === eid)?.name[locale])
      .filter((n): n is string => Boolean(n));
    return {
      name: dish?.name[locale] || entry.dishId,
      variantLabel: variant?.label[locale],
      extraNames,
    };
  };

  const handleCopyCallList = async () => {
    const lines = callList.map((c) => {
      const { name, variantLabel, extraNames } = resolveCallItemDisplay(c);
      const extrasStr = extraNames.length > 0 ? ` + ${extraNames.join(', ')}` : '';
      return `${c.qty}x ${name}${variantLabel ? ` (${variantLabel})` : ''}${extrasStr} — ${formatCents(
        calculateLineTotalCents(c.unitWithExtrasCents, c.qty)
      )}`;
    });
    const summary = `EL SULTAN (${RESTAURANT_INFO.address}):\n${lines.join(
      '\n'
    )}\n${t.menuSection.totalLabel}: ${formatCents(callListTotalCents)}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedList(true);
      window.setTimeout(() => setCopiedList(false), 2200);
    } catch {
      // Clipboard restricted in iframe
    }
  };

  const labels = {
    bestseller: locale === 'ru' ? 'Хит' : locale === 'lt' ? 'Perkamiausias' : 'Popular',
    customize: locale === 'ru' ? 'Настроить' : locale === 'lt' ? 'Pasirinkti' : 'Options',
    addedPrefix: locale === 'ru' ? 'Добавлено:' : locale === 'lt' ? 'Pridėta:' : 'Added:',
    viewOrder: locale === 'ru' ? 'Ваш заказ' : locale === 'lt' ? 'Užsakymas' : 'Your order',
    itemsWord: (n: number) =>
      locale === 'ru'
        ? `${n} поз.`
        : locale === 'lt'
        ? n === 1
          ? '1 prekė'
          : `${n} prekės`
        : n === 1
        ? '1 item'
        : `${n} items`,
    callShort: locale === 'ru' ? 'Позвонить' : locale === 'lt' ? 'Skambinti' : 'Call',
    meatLabel: locale === 'ru' ? 'Мясо' : locale === 'lt' ? 'Mėsa' : 'Meat',
    sizeLabel: locale === 'ru' ? 'Размер' : locale === 'lt' ? 'Dydis' : 'Size',
    regularSize: locale === 'ru' ? 'Стандарт' : locale === 'lt' ? 'Standartinis' : 'Regular',
    largeSize: locale === 'ru' ? 'Большой (+1,50 €)' : locale === 'lt' ? 'Didelis (+1,50 €)' : 'Large (+€1.50)',
    chicken: locale === 'ru' ? 'Курица' : locale === 'lt' ? 'Vištiena' : 'Chicken',
    beef: locale === 'ru' ? 'Говядина' : locale === 'lt' ? 'Jautiena' : 'Beef',
    addBtn: locale === 'ru' ? 'Добавить в заказ' : locale === 'lt' ? 'Pridėti į užsakymą' : 'Add to order',
    dineInNote:
      locale === 'ru'
        ? 'В зале и по телефону'
        : locale === 'lt'
        ? 'Vietoje ir telefonu'
        : 'Dine-in & pickup',
    mostOrderedEyebrow:
      locale === 'ru'
        ? 'Выбор гостей'
        : locale === 'lt'
        ? 'Svečių favoritai'
        : 'Guest favourites',
    mostOrderedTitle:
      locale === 'ru'
        ? 'Чаще всего заказывают'
        : locale === 'lt'
        ? 'Perkamiausi'
        : 'Most Ordered',
    mostOrderedSubtitle:
      locale === 'ru'
        ? 'Блюда, за которыми возвращаются чаще всего — добавьте в один клик.'
        : locale === 'lt'
        ? 'Patiekalai, dėl kurių svečiai sugrįžta — pridėkite vienu paspaudimu.'
        : 'The dishes our guests come back for — ready to add in one tap.',
    charcoalRankTag:
      locale === 'ru'
        ? '01 · На углях'
        : locale === 'lt'
        ? '01 · Ant žarijų'
        : '01 · Over charcoal',
    mostOrderedKebabsHeading:
      locale === 'ru'
        ? 'Самые популярные кебабы в лаваше'
        : locale === 'lt'
        ? 'Perkamiausi kebabai lavaše'
        : 'Most ordered lavash kebabs',
  };

  /** Compact +/- or + quick action pill */
  const renderQuickAction = (
    item: MenuItem,
    variantId?: string,
    dark = false,
    compact = false
  ) => {
    const resolvedVariantId = variantId || item.variants?.[0]?.id;
    const qty = getVariantQtyInOrder(item.id, resolvedVariantId);

    if (qty > 0) {
      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center rounded-full shadow-sm ${
            dark
              ? 'bg-[#C98B54] text-[#191B1A]'
              : 'bg-[#672938] text-[#F3EADA]'
          }`}
        >
          <button
            type="button"
            aria-label={`Remove one ${item.name[locale]}`}
            onClick={(e) => handleQuickDecrement(item, resolvedVariantId, e)}
            className={`${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } rounded-l-full flex items-center justify-center hover:bg-black/15 active:scale-95 transition-all cursor-pointer`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="min-w-[22px] text-center text-xs font-bold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label={`Add one more ${item.name[locale]}`}
            onClick={(e) => handleQuickAdd(item, resolvedVariantId, e)}
            className={`${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } rounded-r-full flex items-center justify-center hover:bg-black/15 active:scale-95 transition-all cursor-pointer`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        aria-label={`Add ${item.name[locale]}`}
        onClick={(e) => handleQuickAdd(item, resolvedVariantId, e)}
        className={`inline-flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
          compact ? 'w-8 h-8' : 'w-9 h-9'
        } ${
          dark
            ? 'bg-[#F3EADA]/12 text-[#F3EADA] hover:bg-[#C98B54] hover:text-[#191B1A]'
            : 'bg-[#672938]/10 text-[#672938] hover:bg-[#672938] hover:text-[#F3EADA]'
        }`}
      >
        <Plus className="w-4 h-4" />
      </button>
    );
  };

  /** Standard Photographed Dish Card (used for Charcoal, Pizzas, Plates, Snacks) */
  const renderPhotoCard = (item: MenuItem, dark = false) => {
    const asset = getProductImage(item.id);
    const displayVariants = getCardDisplayVariants(item);
    const totalInOrder = getDishTotalQty(item.id);
    const hasMultiVariants = displayVariants.length > 1;

    return (
      <article
        key={item.id}
        onClick={() => openDishModal(item)}
        className={`group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
          dark
            ? 'bg-[#222423] border border-[#F3EADA]/10 hover:border-[#C98B54]/45 shadow-lg'
            : 'bg-[#FAF5EB] border border-[#191B1A]/10 hover:border-[#672938]/35 shadow-sm hover:shadow-md'
        }`}
      >
        {asset && (() => {
          const webp = getResponsiveMenuWebp(asset.src);
          return (
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#191B1A]">
              <picture>
                {webp && (
                  <source
                    type="image/webp"
                    srcSet={webp.webpSrcSet}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  />
                )}
                <img
                  src={asset.src}
                  alt={asset.alt[locale]}
                  width={840}
                  height={560}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </picture>
              {item.recommendationMeta.bestseller && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#672938]/92 backdrop-blur-sm text-[#F3EADA] text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm">
                  ★ {labels.bestseller}
                </span>
              )}
              {totalInOrder > 0 && (
                <span
                  className={`absolute top-3 right-3 inline-flex items-center justify-center min-w-[26px] h-[26px] px-2 rounded-full text-xs font-bold tabular-nums shadow-md ${
                    dark ? 'bg-[#C98B54] text-[#191B1A]' : 'bg-[#672938] text-[#F3EADA]'
                  }`}
                >
                  {totalInOrder}
                </span>
              )}
            </div>
          );
        })()}

        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h4
                className={`font-display text-lg sm:text-xl leading-snug ${
                  dark ? 'text-[#F3EADA]' : 'text-[#191B1A]'
                }`}
              >
                {item.name[locale]}
              </h4>
              {!hasMultiVariants && (
                <span
                  className={`font-display text-lg sm:text-xl tabular-nums shrink-0 ${
                    dark ? 'text-[#C98B54]' : 'text-[#672938]'
                  }`}
                >
                  {formatCents(item.basePriceCents)}
                </span>
              )}
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                dark ? 'text-[#F3EADA]/70' : 'text-[#191B1A]/70'
              }`}
            >
              {item.description[locale]}
            </p>
          </div>

          {hasMultiVariants ? (
            <div
              className={`pt-3 border-t space-y-2 ${
                dark ? 'border-[#F3EADA]/10' : 'border-[#191B1A]/10'
              }`}
            >
              {displayVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.1em] ${
                        dark ? 'text-[#F3EADA]/65' : 'text-[#191B1A]/60'
                      }`}
                    >
                      {shortVariantLabel(variant, locale)}
                    </span>
                    <span
                      className={`font-display text-base tabular-nums ${
                        dark ? 'text-[#C98B54]' : 'text-[#672938]'
                      }`}
                    >
                      {formatCents(variant.priceCents)}
                    </span>
                  </div>
                  {renderQuickAction(item, variant.id, dark, true)}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`pt-3 border-t flex items-center justify-between gap-3 ${
                dark ? 'border-[#F3EADA]/10' : 'border-[#191B1A]/10'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDishModal(item);
                }}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                  dark
                    ? 'text-[#F3EADA]/55 hover:text-[#C98B54]'
                    : 'text-[#191B1A]/55 hover:text-[#672938]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{labels.customize}</span>
              </button>
              {renderQuickAction(item, undefined, dark, false)}
            </div>
          )}
        </div>
      </article>
    );
  };

  /** Compact Clean Menu List Row (for Kebabs, text-only Plates/Snacks, Soups, Drinks, Extras) */
  const renderCompactRow = (item: MenuItem, showCustomizeLink = true) => {
    const displayVariants = getCardDisplayVariants(item);
    const hasMultiVariants = displayVariants.length > 1;
    const totalInOrder = getDishTotalQty(item.id);
    const isKebab = item.category === 'kebabs';

    return (
      <div
        key={item.id}
        onClick={() => openDishModal(item)}
        className="group px-5 sm:px-6 py-4 hover:bg-[#672938]/[0.035] transition-colors cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-lg sm:text-xl text-[#191B1A] leading-snug group-hover:text-[#672938] transition-colors">
                {item.name[locale]}
              </h4>
              {item.recommendationMeta.bestseller && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#672938] text-[#F3EADA] text-[10px] font-bold uppercase tracking-[0.1em]">
                  ★ {labels.bestseller}
                </span>
              )}
              {totalInOrder > 0 &&
                (hasMultiVariants ||
                  totalInOrder > getVariantQtyInOrder(item.id, item.variants?.[0]?.id)) && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#C98B54]/25 text-[#672938] text-[11px] font-bold tabular-nums">
                    ×{totalInOrder}
                  </span>
                )}
            </div>
            {item.description[locale] && (
              <p className="text-xs sm:text-sm text-[#191B1A]/65 leading-relaxed">
                {item.description[locale]}
              </p>
            )}
          </div>

          {/* Right Side: Price(s) + Instant Add */}
          {hasMultiVariants ? (
            <div className="flex flex-col gap-2 shrink-0 sm:min-w-[240px]">
              {displayVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between sm:justify-end gap-3"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#191B1A]/55">
                    {shortVariantLabel(variant, locale)}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display text-base sm:text-lg text-[#672938] tabular-nums min-w-[54px] text-right">
                      {formatCents(variant.priceCents)}
                    </span>
                    <div className="w-[82px] flex justify-end shrink-0">
                      {renderQuickAction(item, variant.id, false, true)}
                    </div>
                  </div>
                </div>
              ))}
              {isKebab && showCustomizeLink && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDishModal(item);
                    }}
                    className="text-[11px] font-bold text-[#672938]/80 hover:text-[#672938] underline underline-offset-4 cursor-pointer"
                  >
                    {labels.largeSize} / {labels.customize}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <span className="font-display text-lg sm:text-xl text-[#672938] tabular-nums">
                {formatCents(item.basePriceCents)}
              </span>
              {renderQuickAction(item, item.variants?.[0]?.id, false, false)}
            </div>
          )}
        </div>
      </div>
    );
  };

  /** Opening Editorial Section: MOST ORDERED — Asymmetric Bento (Charcoal #1 + 2×2 Photo Hits + Top Lavash Kebabs) */
  const renderMostOrderedSection = () => {
    const heroItem = MENU_ITEMS.find((m) => m.id === 'brandintos-jautienos-saslikas');
    const photoHitIds = [
      'kebabas-lekstaje',
      'liulia-kebabas',
      'pica-kebabu-jautiena',
      'seimos-lekste',
    ] as const;
    const photoHits = photoHitIds
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((m): m is MenuItem => Boolean(m && m.available));

    const kebabHitIds = ['sultono-kebabas', 'paneriu-kebabas'] as const;
    const kebabHits = kebabHitIds
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((m): m is MenuItem => Boolean(m && m.available));

    if (!heroItem && photoHits.length === 0) return null;

    const heroIsolated = heroItem ? getIsolatedProductImage(heroItem.id) : undefined;
    const heroFallbackAsset = heroItem ? getProductImage(heroItem.id) : undefined;
    const heroQty = heroItem ? getDishTotalQty(heroItem.id) : 0;

    return (
      <div
        id="menu-most-ordered"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-10 sm:pt-14 pb-2"
      >
        {/* Editorial Section Header */}
        <div className="mb-7 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-[#191B1A]/12">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#672938]">
              <Star className="w-3.5 h-3.5 fill-[#C98B54] text-[#C98B54]" aria-hidden="true" />
              <span>{labels.mostOrderedEyebrow}</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[#191B1A] leading-none">
              {labels.mostOrderedTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#191B1A]/65 font-medium max-w-md sm:text-right">
            {labels.mostOrderedSubtitle}
          </p>
        </div>

        {/* Asymmetric 12-Column Bento: #01 Charcoal Feature + #02–#05 Photographed Hits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Left 5 Columns: #01 Signature Charcoal Feature Card */}
          {heroItem && (
            <article
              onClick={() => openDishModal(heroItem)}
              className="lg:col-span-5 group relative flex flex-col justify-between rounded-3xl bg-[#191B1A] text-[#F3EADA] p-6 sm:p-8 overflow-hidden border border-[#F3EADA]/10 hover:border-[#C98B54]/45 shadow-[0_20px_50px_rgba(25,27,26,0.18)] transition-all duration-300 cursor-pointer"
            >
              {/* Subtle Radial Warm Ember Depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#672938]/40 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#C98B54]/15 blur-3xl"
              />

              {/* Top Eyebrow + Quantity Pill */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54]">
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{labels.charcoalRankTag}</span>
                </span>
                {heroQty > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-[#C98B54] text-[#191B1A] text-xs font-bold tabular-nums shadow-sm">
                    ×{heroQty}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#672938] text-[#F3EADA] text-[10px] font-bold uppercase tracking-[0.12em]">
                    ★ {labels.bestseller}
                  </span>
                )}
              </div>

              {/* Isolated Floating Food Stage */}
              <div className="relative z-10 my-5 sm:my-7 flex items-center justify-center">
                <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[74%] h-7 rounded-full bg-black/75 blur-xl"
                  />
                  {heroIsolated ? (
                    <img
                      src={heroIsolated}
                      alt={heroFallbackAsset?.alt[locale] || heroItem.name[locale]}
                      width={800}
                      height={600}
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_22px_26px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : heroFallbackAsset ? (
                    <img
                      src={heroFallbackAsset.src}
                      alt={heroFallbackAsset.alt[locale]}
                      width={840}
                      height={560}
                      loading="eager"
                      fetchPriority="high"
                      className="relative z-10 w-full h-full object-cover rounded-2xl"
                    />
                  ) : null}
                </div>
              </div>

              {/* Bottom Info & Instant 1-Tap Action */}
              <div className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl sm:text-[28px] text-[#F3EADA] leading-tight">
                      {heroItem.name[locale]}
                    </h3>
                    <span className="font-display text-2xl sm:text-[28px] text-[#C98B54] tabular-nums shrink-0">
                      {formatCents(heroItem.basePriceCents)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F3EADA]/72 leading-relaxed">
                    {heroItem.description[locale]}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F3EADA]/12 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDishModal(heroItem);
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F3EADA]/65 hover:text-[#C98B54] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{labels.customize}</span>
                  </button>
                  {renderQuickAction(heroItem, undefined, true, false)}
                </div>
              </div>
            </article>
          )}

          {/* Right 7 Columns: #02–#05 Photographed Crowd Favourites (2×2 Grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {photoHits.map((item, idx) => {
              const asset = getProductImage(item.id);
              const displayVariants = getCardDisplayVariants(item);
              const hasMultiVariants = displayVariants.length > 1;
              const totalInOrder = getDishTotalQty(item.id);
              const rankStr = `0${idx + 2}`;

              return (
                <article
                  key={`most-${item.id}`}
                  onClick={() => openDishModal(item)}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-[#FAF5EB] border border-[#191B1A]/10 hover:border-[#672938]/35 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {asset && (() => {
                    const webp = getResponsiveMenuWebp(asset.src);
                    return (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#191B1A]">
                        <picture>
                          {webp && (
                            <source
                              type="image/webp"
                              srcSet={webp.webpSrcSet}
                              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 46vw, 100vw"
                            />
                          )}
                          <img
                            src={asset.src}
                            alt={asset.alt[locale]}
                            width={840}
                            height={525}
                            loading={idx < 2 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </picture>
                        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-[#191B1A]/80 backdrop-blur-sm text-[#F3EADA] text-[10px] font-bold uppercase tracking-[0.14em] tabular-nums">
                          {rankStr}
                        </span>
                        {totalInOrder > 0 && (
                          <span className="absolute top-3 right-3 inline-flex items-center justify-center min-w-[26px] h-[26px] px-2 rounded-full bg-[#672938] text-[#F3EADA] text-xs font-bold tabular-nums shadow-md">
                            {totalInOrder}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3.5">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2.5">
                        <h3 className="font-display text-lg sm:text-xl text-[#191B1A] leading-snug group-hover:text-[#672938] transition-colors">
                          {item.name[locale]}
                        </h3>
                        {!hasMultiVariants && (
                          <span className="font-display text-lg sm:text-xl text-[#672938] tabular-nums shrink-0">
                            {formatCents(item.basePriceCents)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#191B1A]/65 leading-relaxed line-clamp-2">
                        {item.description[locale]}
                      </p>
                    </div>

                    {hasMultiVariants ? (
                      <div className="pt-3 border-t border-[#191B1A]/10 space-y-2">
                        {displayVariants.map((variant) => (
                          <div
                            key={variant.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-baseline gap-2 min-w-0">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#191B1A]/60">
                                {shortVariantLabel(variant, locale)}
                              </span>
                              <span className="font-display text-base text-[#672938] tabular-nums">
                                {formatCents(variant.priceCents)}
                              </span>
                            </div>
                            {renderQuickAction(item, variant.id, false, true)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-[#191B1A]/10 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDishModal(item);
                          }}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#191B1A]/55 hover:text-[#672938] transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{labels.customize}</span>
                        </button>
                        {renderQuickAction(item, undefined, false, false)}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Editorial Strip: #06 & #07 Bestselling Lavash Kebabs (Honest Text-Forward Presentation) */}
        {kebabHits.length > 0 && (
          <div className="mt-5 lg:mt-6 rounded-3xl bg-[#FAF5EB] border border-[#672938]/18 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-3 bg-[#672938]/[0.05] border-b border-[#672938]/12 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#672938]">
                06 · 07 — {labels.mostOrderedKebabsHeading}
              </span>
              <span className="text-[11px] font-bold text-[#191B1A]/55">
                {KEBAB_SIZE_NOTE[locale]}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#191B1A]/10">
              {kebabHits.map((item) => renderCompactRow(item, true))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /** Category 1: KEBABAI — Shared photo left + clean rounded kebab list right (exact elsultan.lt clarity in our style) */
  const renderKebabsSection = (items: MenuItem[]) => {
    const categoryBanner = getCategoryImage('kebabs');

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {categoryBanner && (() => {
          const webp = getResponsiveMenuWebp(categoryBanner.src);
          return (
            <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-3">
              <div className="aspect-[3/2] rounded-3xl overflow-hidden bg-[#191B1A] shadow-lg">
                <picture>
                  {webp && (
                    <source
                      type="image/webp"
                      srcSet={webp.webpSrcSet}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  )}
                  <img
                    src={categoryBanner.src}
                    alt={categoryBanner.alt[locale]}
                    width={840}
                    height={560}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#672938] px-1">
                {KEBAB_SIZE_NOTE[locale]}
              </p>
            </div>
          );
        })()}

        <div className={categoryBanner ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="rounded-3xl bg-[#FAF5EB] border border-[#191B1A]/10 shadow-sm divide-y divide-[#191B1A]/10 overflow-hidden">
            {items.map((item) => renderCompactRow(item, true))}
          </div>
        </div>
      </div>
    );
  };

  /** Category 2: ŠAŠLIKAI IR GRILIS — Signature Charcoal Chapter, all 6 photographed */
  const renderCharcoalSection = (title: string, subtitle: string, items: MenuItem[]) => (
    <div className="bg-[#191B1A] text-[#F3EADA] py-14 sm:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3EADA]/14 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#C98B54]">
              <Flame className="w-3.5 h-3.5" />
              <span>{labels.dineInNote}</span>
            </span>
            <h3 className="font-display text-3xl sm:text-5xl text-[#F3EADA] leading-none">
              {title}
            </h3>
            <p className="text-sm text-[#F3EADA]/70">{subtitle}</p>
          </div>
          <ChairMark tone="ochre" className="w-20 h-auto shrink-0 hidden sm:block opacity-85" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => renderPhotoCard(item, true))}
        </div>
      </div>
    </div>
  );

  /** Photographed Grid + Compact Text List Below (for Pizzas, Plates, Snacks) */
  const renderMixedPhotoAndTextSection = (items: MenuItem[]) => {
    const withPhotos = items.filter((item) => Boolean(getProductImage(item.id)));
    const withoutPhotos = items.filter((item) => !getProductImage(item.id));

    return (
      <div className="space-y-6">
        {withPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {withPhotos.map((item) => renderPhotoCard(item, false))}
          </div>
        )}

        {withoutPhotos.length > 0 && (
          <div className="rounded-3xl bg-[#FAF5EB] border border-[#191B1A]/10 shadow-sm divide-y divide-[#191B1A]/10 overflow-hidden">
            {withoutPhotos.map((item) => renderCompactRow(item, false))}
          </div>
        )}
      </div>
    );
  };

  // Separate compact bottom categories (Soups, Drinks, Extras) when viewing 'all' so they sit cleanly side-by-side
  const compactCategoryIds = new Set<MenuCategoryId>(['soups', 'drinks', 'extras']);
  const mainGroups = groupedCategories.filter((g) => !compactCategoryIds.has(g.id));
  const compactGroups = groupedCategories.filter((g) => compactCategoryIds.has(g.id));

  // Modal computed values
  const modalActiveVariant = activeModalDish?.variants?.find((v) => v.id === modalVariantId) || activeModalDish?.variants?.[0];
  const modalUnitCents = activeModalDish
    ? calculateUnitWithExtrasCents(activeModalDish, modalActiveVariant?.id, modalExtras)
    : 0;
  const modalLineTotalCents = calculateLineTotalCents(modalUnitCents, modalQty);
  const modalAsset = activeModalDish ? getProductImage(activeModalDish.id) : undefined;
  const modalIsolated = activeModalDish ? getIsolatedProductImage(activeModalDish.id) : undefined;
  const modalSuggestedExtras = useMemo(() => {
    if (!activeModalDish?.suggestedExtraIds?.length) return [];
    return activeModalDish.suggestedExtraIds
      .slice(0, 2)
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((m): m is MenuItem => Boolean(m));
  }, [activeModalDish]);
  const modalReviews = activeModalDish ? getDishReviews(activeModalDish.id) : [];

  // For Kebab modal: split Meat + Size controls for maximum simplicity
  const isModalKebabWithMeat =
    activeModalDish?.category === 'kebabs' &&
    Boolean(activeModalDish.variants?.some((v) => v.id === 'vistiena-reg')) &&
    Boolean(activeModalDish.variants?.some((v) => v.id === 'jautiena-reg'));

  const modalKebabMeat: 'vistiena' | 'jautiena' =
    modalActiveVariant?.id.startsWith('jautiena') ? 'jautiena' : 'vistiena';
  const modalKebabSize: 'reg' | 'lg' =
    modalActiveVariant?.id.endsWith('-lg') ? 'lg' : 'reg';

  return (
    <section
      id="menu"
      className="bg-[#F3EADA] text-[#191B1A] border-b border-[#191B1A]/12 relative"
    >
      {/* Ultra-Clean Single-Purpose Sticky Bar: Category Tabs + Search */}
      <div className="sticky top-16 z-30 bg-[#F3EADA]/96 backdrop-blur-md border-b border-[#191B1A]/12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Scrollable Rounded Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              aria-pressed={selectedCategory === 'all'}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#672938] text-[#F3EADA] shadow-sm'
                  : 'text-[#191B1A]/70 hover:text-[#191B1A] hover:bg-[#191B1A]/[0.06]'
              }`}
            >
              {t.menuSection.allCategories}
            </button>
            {MENU_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#672938] text-[#F3EADA] shadow-sm'
                      : 'text-[#191B1A]/70 hover:text-[#191B1A] hover:bg-[#191B1A]/[0.06]'
                  }`}
                >
                  {cat.label[locale]}
                </button>
              );
            })}
          </div>

          {/* Compact Rounded Search Input */}
          <div className="relative w-full md:w-60 shrink-0">
            <Search
              className="w-4 h-4 text-[#191B1A]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menuSection.searchPlaceholder}
              aria-label={t.menuSection.searchPlaceholder}
              className="w-full pl-9 pr-8 py-1.5 rounded-full bg-[#FAF5EB] border border-[#191B1A]/15 text-xs sm:text-sm text-[#191B1A] placeholder:text-[#191B1A]/45 focus:outline-none focus:border-[#672938] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.menuSection.resetFilters}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#191B1A]/55 hover:text-[#191B1A] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      {filteredItems.length === 0 ? (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-24 text-center space-y-5">
          <p className="text-lg font-bold text-[#191B1A]/75">{t.menuSection.emptyState}</p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
            }}
            className="px-7 py-3 rounded-full bg-[#672938] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#4f1d29] active:scale-[0.97] transition-all cursor-pointer"
          >
            {t.menuSection.resetFilters}
          </button>
        </div>
      ) : (
        <div className={callListCount > 0 ? 'pb-28' : 'pb-16'}>
          {/* Opening Section: Most Ordered (shown first when browsing the full menu) */}
          {selectedCategory === 'all' && !searchQuery.trim() && renderMostOrderedSection()}

          {/* Main Visual Categories: Kebabai, Šašlikai ir grilis, Picos, Lėkštės, Užkandžiai */}
          {mainGroups.map((group) =>
            group.id === 'charcoal' ? (
              <div key={group.id} className="my-12 sm:my-16">
                {renderCharcoalSection(group.label[locale], group.subtitle[locale], group.items)}
              </div>
            ) : (
              <div
                key={group.id}
                className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-12 sm:pt-16"
              >
                <div className="mb-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#191B1A]/12">
                  <h3 className="font-display text-3xl sm:text-5xl text-[#672938] leading-none">
                    {group.label[locale]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#191B1A]/60 font-medium">
                    {group.subtitle[locale]}
                  </p>
                </div>

                {group.id === 'kebabs'
                  ? renderKebabsSection(group.items)
                  : renderMixedPhotoAndTextSection(group.items)}
              </div>
            )
          )}

          {/* Compact Text-Ledger Categories: Sriubos · Gėrimai · Papildomai */}
          {compactGroups.length > 0 && (
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-14 sm:pt-18">
              <div
                className={`grid grid-cols-1 gap-8 ${
                  compactGroups.length === 1
                    ? 'max-w-3xl'
                    : compactGroups.length === 2
                    ? 'lg:grid-cols-2'
                    : 'lg:grid-cols-3'
                }`}
              >
                {compactGroups.map((group) => (
                  <div key={group.id} className="space-y-4">
                    <div className="pb-2 border-b border-[#191B1A]/12">
                      <h3 className="font-display text-2xl sm:text-3xl text-[#672938] leading-none">
                        {group.label[locale]}
                      </h3>
                    </div>
                    <div className="rounded-3xl bg-[#FAF5EB] border border-[#191B1A]/10 shadow-sm divide-y divide-[#191B1A]/10 overflow-hidden">
                      {group.items.map((item) => renderCompactRow(item, false))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtle Added Toast */}
      <AnimatePresence>
        {justAddedToast && (
          <motion.div
            key={justAddedToast}
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-4 py-2 rounded-full bg-[#191B1A]/92 text-[#F3EADA] text-xs font-bold shadow-lg border border-[#C98B54]/30 whitespace-nowrap max-w-[90vw] truncate"
          >
            <span className="text-[#C98B54] mr-1.5">✓</span>
            {labels.addedPrefix} {justAddedToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Order Bar (visible only when ≥1 item is selected) */}
      <AnimatePresence>
        {callListCount > 0 && !callDrawerOpen && (
          <motion.div
            key="floating-order-dock"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.26, ease: EASE_SMOOTH }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md"
          >
            <div className="flex items-center justify-between gap-3 rounded-full bg-[#191B1A] text-[#F3EADA] pl-5 pr-2 py-2 shadow-[0_18px_48px_rgba(25,27,26,0.45)] border border-[#C98B54]/35">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setCallDrawerOpen(true);
                }}
                className="flex-1 flex items-center gap-3 text-left cursor-pointer min-w-0"
              >
                <span className="w-8 h-8 rounded-full bg-[#672938] text-[#F3EADA] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#C98B54] leading-tight">
                    {labels.itemsWord(callListCount)}
                  </span>
                  <span className="block font-display text-lg text-[#F3EADA] tabular-nums leading-tight">
                    {formatCents(callListTotalCents)}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setCallDrawerOpen(true);
                }}
                className="px-4 py-2.5 rounded-full bg-[#672938] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.09em] hover:bg-[#7d3345] active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap"
              >
                {labels.viewOrder}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focused Animated Dish Detail & Customization Modal */}
      <AnimatePresence>
        {activeModalDish && (
          <motion.div
            key="dish-modal-backdrop"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveModalDish(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              key={activeModalDish.id}
              role="dialog"
              aria-modal="true"
              aria-label={activeModalDish.name[locale]}
              initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.26, ease: EASE_SMOOTH }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#F3EADA] text-[#191B1A] shadow-2xl border border-[#191B1A]/15"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalDish(null)}
                aria-label={t.orderModal.close}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#191B1A]/75 text-[#F3EADA] hover:bg-[#672938] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Dish Image Header (Isolated WebP on Burgundy or Authentic 3:2 Photo) */}
              {modalIsolated ? (
                <div className="relative bg-[#672938] px-6 py-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute right-4 bottom-2 opacity-[0.14] pointer-events-none">
                    <ChairMark tone="bone" className="w-36 h-auto" />
                  </div>
                  <div className="relative z-10 w-64 sm:w-72 aspect-[4/3] flex items-center justify-center">
                    <div
                      aria-hidden="true"
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[72%] h-6 rounded-full bg-black/50 blur-xl"
                    />
                    <img
                      src={modalIsolated}
                      alt={modalAsset?.alt[locale] || activeModalDish.name[locale]}
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.48)]"
                    />
                  </div>
                </div>
              ) : modalAsset ? (
                <div className="aspect-[16/10] w-full bg-[#191B1A] overflow-hidden">
                  <img
                    src={modalAsset.src}
                    alt={modalAsset.alt[locale]}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ) : (
                <div className="bg-[#672938] text-[#F3EADA] px-6 pt-7 pb-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C98B54]">
                    {MENU_CATEGORIES.find((c) => c.id === activeModalDish.category)?.label[locale]}
                  </span>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4 pr-6 sm:pr-0">
                    <h3 className="font-display text-2xl sm:text-3xl text-[#191B1A] leading-tight">
                      {activeModalDish.name[locale]}
                    </h3>
                    <span className="font-display text-2xl text-[#672938] tabular-nums shrink-0">
                      {formatCents(modalUnitCents)}
                    </span>
                  </div>
                  <p className="text-sm text-[#191B1A]/75 leading-relaxed">
                    {activeModalDish.description[locale]}
                  </p>
                </div>

                {/* Variants: Split Meat + Size for Kebabs; Clean Chips for other multi-variant dishes */}
                {isModalKebabWithMeat ? (
                  <div className="space-y-4 pt-2 border-t border-[#191B1A]/10">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#191B1A]/60 block">
                        {labels.meatLabel}
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['vistiena', 'jautiena'] as const).map((meat) => {
                          const targetId = `${meat}-${modalKebabSize}`;
                          const vObj = activeModalDish.variants?.find((v) => v.id === targetId);
                          const selected = modalKebabMeat === meat;
                          return (
                            <button
                              key={meat}
                              type="button"
                              onClick={() => {
                                soundManager.playTick();
                                setModalVariantId(targetId);
                              }}
                              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-[#672938] text-[#F3EADA] border-[#672938] shadow-sm'
                                  : 'bg-[#FAF5EB] text-[#191B1A] border-[#191B1A]/15 hover:border-[#672938]/40'
                              }`}
                            >
                              <span>{meat === 'vistiena' ? labels.chicken : labels.beef}</span>
                              {vObj && (
                                <span className="tabular-nums opacity-90">
                                  {formatCents(vObj.priceCents)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#191B1A]/60 block">
                        {labels.sizeLabel}
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['reg', 'lg'] as const).map((sz) => {
                          const targetId = `${modalKebabMeat}-${sz}`;
                          const selected = modalKebabSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                soundManager.playTick();
                                setModalVariantId(targetId);
                              }}
                              className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-center border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-[#191B1A] text-[#F3EADA] border-[#191B1A] shadow-sm'
                                  : 'bg-[#FAF5EB] text-[#191B1A] border-[#191B1A]/15 hover:border-[#191B1A]/40'
                              }`}
                            >
                              {sz === 'reg' ? labels.regularSize : labels.largeSize}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : activeModalDish.variants && activeModalDish.variants.length > 1 ? (
                  <div className="space-y-2 pt-2 border-t border-[#191B1A]/10">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#191B1A]/60 block">
                      {t.menuSection.variantsLabel}
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {activeModalDish.variants.map((variant) => {
                        const selected = variant.id === modalActiveVariant?.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => {
                              soundManager.playTick();
                              setModalVariantId(variant.id);
                            }}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                              selected
                                ? 'bg-[#672938] text-[#F3EADA] border-[#672938] shadow-sm'
                                : 'bg-[#FAF5EB] text-[#191B1A] border-[#191B1A]/15 hover:border-[#672938]/40'
                            }`}
                          >
                            <span className="truncate">{variant.label[locale]}</span>
                            <span className="tabular-nums shrink-0">
                              {formatCents(variant.priceCents)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Optional Extras (max 2, never preselected) */}
                {modalSuggestedExtras.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#191B1A]/10">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#191B1A]/60 block">
                      {t.menuSection.suggestedExtrasLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {modalSuggestedExtras.map((extra) => {
                        const active = modalExtras.includes(extra.id);
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => {
                              soundManager.playTick();
                              setModalExtras((prev) =>
                                prev.includes(extra.id)
                                  ? prev.filter((id) => id !== extra.id)
                                  : [...prev, extra.id].slice(0, 2)
                              );
                            }}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#672938] text-[#F3EADA] border-[#672938] shadow-sm'
                                : 'bg-[#FAF5EB] text-[#191B1A] border-[#191B1A]/15 hover:border-[#672938]/40'
                            }`}
                          >
                            {active ? (
                              <Check className="w-3.5 h-3.5 text-[#F3EADA]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 text-[#672938]" />
                            )}
                            <span>{extra.name[locale]}</span>
                            <span className="tabular-nums opacity-80">
                              +{formatCents(extra.basePriceCents)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity + Primary Add CTA */}
                <div className="pt-3 border-t border-[#191B1A]/12 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-[#FAF5EB] border border-[#191B1A]/15">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => {
                        soundManager.playTick();
                        setModalQty((q) => Math.max(1, q - 1));
                      }}
                      className="w-10 h-11 rounded-l-full flex items-center justify-center hover:text-[#672938] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => {
                        soundManager.playTick();
                        setModalQty((q) => Math.min(20, q + 1));
                      }}
                      className="w-10 h-11 rounded-r-full flex items-center justify-center hover:text-[#672938] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playConfirm();
                      onAddCallItem(
                        activeModalDish,
                        modalActiveVariant?.id,
                        modalExtras,
                        modalQty
                      );
                      showAddedFeedback(activeModalDish.name[locale]);
                      setActiveModalDish(null);
                    }}
                    className="flex-1 h-11 px-5 rounded-full bg-[#672938] text-[#F3EADA] text-xs sm:text-sm font-bold uppercase tracking-[0.09em] hover:bg-[#4f1d29] active:scale-[0.98] transition-all cursor-pointer tabular-nums shadow-md"
                  >
                    {labels.addBtn} · {formatCents(modalLineTotalCents)}
                  </button>
                </div>

                {/* Quiet Verified Details: Review, Allergen Policy, Direct Ordering Links */}
                <div className="pt-3 border-t border-[#191B1A]/10 space-y-3 text-xs text-[#191B1A]/65">
                  {modalReviews.length > 0 && (
                    <div className="rounded-2xl bg-[#FAF5EB] p-3.5 border border-[#191B1A]/8 space-y-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#672938]">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{modalReviews[0].author} · 5.0 ★</span>
                      </span>
                      <p className="italic leading-relaxed line-clamp-3">
                        „{modalReviews[0].text}“
                      </p>
                    </div>
                  )}

                  <p className="leading-relaxed">
                    <strong className="text-[#191B1A]/85">{t.menuSection.allergensLabel}:</strong>{' '}
                    {ALLERGEN_ENQUIRY_POLICY[locale]}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.08em]">
                    <a
                      href={RESTAURANT_INFO.phoneHref}
                      className="text-[#672938] hover:underline tabular-nums"
                    >
                      {RESTAURANT_INFO.phoneDisplay} ↗
                    </a>
                    {activeModalDish.channels.includes('wolt') && (
                      <a
                        href={RESTAURANT_INFO.woltUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#191B1A]/75 hover:text-[#672938]"
                      >
                        Wolt ↗
                      </a>
                    )}
                    {activeModalDish.channels.includes('bolt') && (
                      <a
                        href={RESTAURANT_INFO.boltUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#191B1A]/75 hover:text-[#672938]"
                      >
                        Bolt Food ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable Order Summary Modal / Sheet */}
      <AnimatePresence>
        {callListCount > 0 && callDrawerOpen && (
          <motion.div
            key="order-drawer-backdrop"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCallDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              key="order-drawer-card"
              role="dialog"
              aria-modal="true"
              aria-label={t.menuSection.callListTitle}
              initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: EASE_SMOOTH }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg max-h-[88vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-[#191B1A] text-[#F3EADA] border border-[#C98B54]/30 shadow-2xl"
            >
              <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#F3EADA]/14 px-6 pt-6 pb-4">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl text-[#F3EADA]">
                    {t.menuSection.callListTitle}
                  </h3>
                  <p className="text-xs text-[#F3EADA]/70 leading-relaxed">
                    {t.menuSection.callListNotice}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCallDrawerOpen(false)}
                  aria-label={t.orderModal.close}
                  className="text-[#F3EADA]/70 hover:text-[#C98B54] cursor-pointer p-1.5 rounded-full hover:bg-[#F3EADA]/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 divide-y divide-[#F3EADA]/12">
                {callList.map((entry) => {
                  const { name, variantLabel, extraNames } = resolveCallItemDisplay(entry);
                  const lineTotalCents = calculateLineTotalCents(
                    entry.unitWithExtrasCents,
                    entry.qty
                  );
                  return (
                    <div
                      key={entry.id}
                      className="py-3.5 flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[#F3EADA] block truncate">{name}</span>
                        {variantLabel && (
                          <span className="text-xs text-[#F3EADA]/65 block">
                            {variantLabel}
                          </span>
                        )}
                        {extraNames.length > 0 && (
                          <span className="block text-xs text-[#C98B54] mt-0.5">
                            + {extraNames.join(', ')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="inline-flex items-center rounded-full border border-[#F3EADA]/25">
                          <button
                            type="button"
                            aria-label="Decrease order item quantity"
                            onClick={() => onUpdateCallItemQty(entry.id, -1)}
                            className="w-7 h-7 rounded-l-full flex items-center justify-center hover:text-[#C98B54] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums">
                            {entry.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase order item quantity"
                            onClick={() => onUpdateCallItemQty(entry.id, 1)}
                            className="w-7 h-7 rounded-r-full flex items-center justify-center hover:text-[#C98B54] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-display text-base text-[#C98B54] tabular-nums min-w-[56px] text-right">
                          {formatCents(lineTotalCents)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveCallItem(entry.id)}
                          aria-label={t.menuSection.callListClear}
                          className="text-[#F3EADA]/50 hover:text-[#F3EADA] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 px-6 pb-6 pt-4 border-t border-[#F3EADA]/18 bg-[#191B1A] space-y-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-bold text-[#F3EADA]">
                    {t.menuSection.totalLabel}:
                  </span>
                  <span className="font-display text-2xl text-[#C98B54] tabular-nums">
                    {formatCents(callListTotalCents)}
                  </span>
                </div>
                <p className="text-[11px] text-[#F3EADA]/55">
                  {t.menuSection.platformPriceNote}
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={RESTAURANT_INFO.phoneHref}
                    className="flex-1 justify-center inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#672938] text-[#F3EADA] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#7d3345] active:scale-[0.97] transition-all tabular-nums whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>
                      {labels.callShort} · {RESTAURANT_INFO.phoneDisplay}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyCallList}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-[#F3EADA]/30 text-xs font-bold uppercase tracking-[0.09em] text-[#F3EADA] hover:border-[#C98B54] hover:text-[#C98B54] active:scale-[0.97] transition-all cursor-pointer"
                  >
                    {copiedList ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C98B54]" />
                        <span>{t.menuSection.callListCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.menuSection.callListCopy}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClearCallList();
                      setCallDrawerOpen(false);
                    }}
                    className="text-xs font-bold uppercase tracking-[0.09em] text-[#F3EADA]/60 hover:text-[#F3EADA] cursor-pointer px-2 py-2"
                  >
                    {t.menuSection.callListClear}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
