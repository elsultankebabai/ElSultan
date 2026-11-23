import { RESTAURANT_INFO } from './business';
import { getProductImage } from './productImages';

export { RESTAURANT_INFO };

export type Locale = 'lt' | 'en' | 'ru';

export type OrderingChannel = 'dine_in' | 'phone' | 'wolt' | 'bolt';

export type MenuCategoryId =
  | 'kebabs'
  | 'charcoal'
  | 'pizza'
  | 'plates'
  | 'snacks'
  | 'soups'
  | 'drinks'
  | 'extras';

export interface LocalizedText {
  lt: string;
  en: string;
  ru: string;
}

export interface MenuVariant {
  id: string;
  label: LocalizedText;
  priceCents: number;
  protein?: 'chicken' | 'beef' | 'vegetarian';
}

export interface VerifiedCustomerReview {
  id: string;
  author: string;
  stars: 5;
  text: string;
  dishIds: string[];
}

export interface MenuItem {
  id: string;
  category: MenuCategoryId;
  available: boolean;
  name: LocalizedText;
  description: LocalizedText;
  ingredients?: LocalizedText;
  portionNote?: LocalizedText;
  basePriceCents: number;
  variants?: MenuVariant[];
  image?: string;
  isolatedImage?: string;
  imageAlt?: LocalizedText;
  channels: OrderingChannel[];
  dietary: {
    vegetarian?: boolean;
    veganAvailable?: boolean;
    noBreadOption?: boolean;
  };
  /** Up to 2 contextual optional extras from Papildomai, never preselected */
  suggestedExtraIds?: string[];
  charcoalAlternativeId?: string;
  recommendationMeta: {
    appetite: Array<'light' | 'satisfying' | 'very_hungry'>;
    occasion: Array<'quick_bite' | 'sit_down' | 'friends'>;
    proteins: Array<'chicken' | 'beef' | 'mixed' | 'vegetarian'>;
    featured?: boolean;
    bestseller?: boolean;
  };
}

export function formatCents(cents: number): string {
  return `€${(Math.round(cents) / 100).toFixed(2)}`;
}

export function calculateUnitWithExtrasCents(
  item: MenuItem,
  variantId?: string,
  extraIds: string[] = []
): number {
  const variant = variantId
    ? item.variants?.find((v) => v.id === variantId)
    : item.variants?.[0];
  const baseCents = variant ? variant.priceCents : item.basePriceCents;
  const extrasCents = extraIds.reduce((sum, extraId) => {
    const extra = RAW_MENU_ITEMS.find((m) => m.id === extraId);
    return sum + (extra ? extra.basePriceCents : 0);
  }, 0);
  return baseCents + extrasCents;
}

export function calculateLineTotalCents(unitWithExtrasCents: number, qty: number): number {
  return Math.round(unitWithExtrasCents) * Math.max(0, Math.round(qty));
}

export function calculateOrderTotalCents(
  lines: Array<{ unitWithExtrasCents: number; qty: number }>
): number {
  return lines.reduce(
    (sum, line) => sum + calculateLineTotalCents(line.unitWithExtrasCents, line.qty),
    0
  );
}

/** Authoritative allergen enquiry statement verbatim from https://elsultan.lt/#faq */
export const ALLERGEN_ENQUIRY_POLICY: LocalizedText = {
  lt: 'Vietoje paklauskite virėjo dėl konkretaus patiekalo. Pasakysime tiksliai, kas jame yra. Arba paskambinkite +370 628 23001 prieš atvykdami.',
  en: "In-store, ask the cook about any specific dish. We'll tell you exactly what's in it. Or call +370 628 23001 before you come.",
  ru: 'На месте спросите повара о конкретном блюде. Скажем точно, что в нём. Или позвоните +370 628 23001 перед приездом.',
};

export const KEBAB_SIZE_NOTE: LocalizedText = {
  lt: 'Didelis kebabas +1,50 €',
  en: 'Large kebab +€1.50',
  ru: 'Большой кебаб +1,50 €',
};

export const HERO_FEATURED_DISH_IDS = [
  'brandintos-jautienos-saslikas',
  'kebabas-lekstaje',
  'pica-kebabu-jautiena',
] as const;

/** Authoritative 5 public Google reviews from https://elsultan.lt/ */
export const VERIFIED_GOOGLE_REVIEWS: VerifiedCustomerReview[] = [
  {
    id: 'rev-armanda',
    author: 'Armanda Vaitkienė',
    stars: 5,
    text: 'Labai skanus maistas ir malonus aptarnavimas! Persikėlė į erdvesnes patalpas, todėl dabar galima patogiai prisėsti ir ramiai pavalgyti ar išgerti kavos! Ragavau naujieną: Jautienos liul kebabą su egiptietiškais ryžiais, tai nuoširdi rekomendacija, jei galvojat ar verta tikrai verta! Jautiena tikrai gera, puikiai parinkti prieskoniai, daržovės šviežios ir traškios, padažiukas kaip visada puikus! 10balu! Būtinai paragaukite ryžių!',
    dishIds: ['liulia-kebabas', 'brandintos-jautienos-saslikas', 'kava'],
  },
  {
    id: 'rev-daniela',
    author: 'Daniela K.',
    stars: 5,
    text: 'Labai skanūs čeburekai ir kebabai! Ilgą laiką čeburekų nebuvo, dabar vėl yra — valgysiu ir valgysiu, o ypač patiko Sultono kebabas – tikrai rekomenduoju!',
    dishIds: ['ceburekai', 'sultono-kebabas'],
  },
  {
    id: 'rev-tomas',
    author: 'Tomas K.',
    stars: 5,
    text: 'Labai skanūs kebabai, traškūs iš išorės, minkšti iš vidaus, mėsytė skani sultinga. Sultano kebabas MVP!',
    dishIds: ['sultono-kebabas', 'kebabas-amerikonas'],
  },
  {
    id: 'rev-judita',
    author: 'Judita L.',
    stars: 5,
    text: 'Jau kelis kart valgiau ir dar noriu ;) česnakinis padažas jogurtinis ir labai skanus, mėsos daug, daržovės skanios. Mano favoritas Panerių kebabas.',
    dishIds: ['paneriu-kebabas', 'padazai-jalapenai'],
  },
  {
    id: 'rev-austeja',
    author: 'Austėja',
    stars: 5,
    text: 'Labai skanūs ir sotūs tiek kebabai, tiek užkandžiai, darbuotojai visados būna malonūs ir draugiški. Taipogi jaučiasi, kad su laiku ši vieta vis tobulėja tiek maistu, tiek aplinka!',
    dishIds: ['kebabas-lekstaje', 'seimos-lekste', 'vistienos-sparneliai'],
  },
];

export function getDishReviews(dishId: string): VerifiedCustomerReview[] {
  return VERIFIED_GOOGLE_REVIEWS.filter((r) => r.dishIds.includes(dishId));
}

export const MENU_CATEGORIES: Array<{
  id: MenuCategoryId;
  label: LocalizedText;
  subtitle: LocalizedText;
}> = [
  {
    id: 'kebabs',
    label: { lt: 'Kebabai', en: 'Kebabs', ru: 'Кебабы' },
    subtitle: {
      lt: 'Didelis kebabas +1,50 € · Užsakyti vietoje, telefonu arba per Wolt / Bolt Food',
      en: 'Large kebab +€1.50 · Dine-in, phone pickup, or Wolt / Bolt Food',
      ru: 'Большой кебаб +1,50 € · В зале, по телефону или Wolt / Bolt Food',
    },
  },
  {
    id: 'charcoal',
    label: { lt: 'Šašlikai ir grilis', en: 'Shashlik & grill', ru: 'Шашлык и гриль' },
    subtitle: {
      lt: 'Kepama ant žarijų · Patiekiama su ryžiais arba bulvytėmis — tik vietoje ir telefonu',
      en: 'Off the coals · Served with rice or fries — dine-in & phone pickup only',
      ru: 'На углях · Подаётся с рисом или картофелем фри — только в зале и по телефону',
    },
  },
  {
    id: 'pizza',
    label: { lt: 'Picos', en: 'Pizzas', ru: 'Пиццы' },
    subtitle: {
      lt: 'Vidutinė €11.00 ir Didelė €16.00 — tik vietoje ir atsiėmimui telefonu',
      en: 'Medium €11.00 and Large €16.00 — dine-in & phone pickup only',
      ru: 'Средняя €11.00 и Большая €16.00 — только в зале и по телефону',
    },
  },
  {
    id: 'plates',
    label: { lt: 'Lėkštės', en: 'Plates', ru: 'Тарелки' },
    subtitle: {
      lt: 'Kebabas lėkštėje, šeimos lėkštė, pita, vištienos filė ir aštrūs sparneliai',
      en: 'Kebab plate, family plate, pita, chicken fillet, and spicy chicken wings',
      ru: 'Кебаб на тарелке, семейная тарелка, пита, куриное филе и острые крылышки',
    },
  },
  {
    id: 'snacks',
    label: { lt: 'Užkandžiai', en: 'Snacks', ru: 'Закуски' },
    subtitle: {
      lt: 'Sparneliai, krevetės, čeburekai, nuggets, žiedai, koldūnai ir bulvytės fri',
      en: 'Wings, prawns, cheburekai, nuggets, rings, dumplings, and fries',
      ru: 'Крылышки, креветки, чебуреки, наггетсы, кольца, колдуны и картофель фри',
    },
  },
  {
    id: 'soups',
    label: { lt: 'Sriubos', en: 'Soups', ru: 'Супы' },
    subtitle: {
      lt: 'Šilta dienos ir soti sriuba — tik restorane ir telefonu atsiėmimui',
      en: 'Fresh soup of the day and hearty soup — dine-in & phone pickup only',
      ru: 'Горячий суп дня и сытный суп — только в зале и по телефону',
    },
  },
  {
    id: 'drinks',
    label: { lt: 'Gėrimai', en: 'Drinks', ru: 'Напитки' },
    subtitle: {
      lt: 'Kava, gaivieji gėrimai, arbata ir šiltas sultinys',
      en: 'Coffee, soft drinks, tea, and warm broth',
      ru: 'Кофе, безалкогольные напитки, чай и бульон',
    },
  },
  {
    id: 'extras',
    label: { lt: 'Papildomai', en: 'Extras', ru: 'Дополнительно' },
    subtitle: {
      lt: 'Papildomas sūris, mėsa, padažai ir jelapenai',
      en: 'Extra cheese, meat, house sauces, and jalapeños',
      ru: 'Дополнительный сыр, мясо, соусы и халапеньо',
    },
  },
];

const KEBAB_VARIANTS = (cReg: number, bReg: number): MenuVariant[] => [
  {
    id: 'vistiena-reg',
    label: { lt: 'Vištiena · Standartinis', en: 'Chicken · Regular', ru: 'Курица · Стандарт' },
    priceCents: cReg,
    protein: 'chicken',
  },
  {
    id: 'vistiena-lg',
    label: { lt: 'Vištiena · Didelis (+1,50 €)', en: 'Chicken · Large (+€1.50)', ru: 'Курица · Большой (+1,50 €)' },
    priceCents: cReg + 150,
    protein: 'chicken',
  },
  {
    id: 'jautiena-reg',
    label: { lt: 'Jautiena · Standartinis', en: 'Beef · Regular', ru: 'Говядина · Стандарт' },
    priceCents: bReg,
    protein: 'beef',
  },
  {
    id: 'jautiena-lg',
    label: { lt: 'Jautiena · Didelis (+1,50 €)', en: 'Beef · Large (+€1.50)', ru: 'Говядина · Большой (+1,50 €)' },
    priceCents: bReg + 150,
    protein: 'beef',
  },
];

const PIZZA_VARIANTS = (protein?: 'chicken' | 'beef' | 'vegetarian'): MenuVariant[] => [
  {
    id: 'vidutine',
    label: { lt: 'Vidutinė', en: 'Medium', ru: 'Средняя' },
    priceCents: 1100,
    protein,
  },
  {
    id: 'didele',
    label: { lt: 'Didelė', en: 'Large', ru: 'Большая' },
    priceCents: 1600,
    protein,
  },
];

const RAW_MENU_ITEMS: MenuItem[] = [
  // 1. KEBABAI (4 items — shared category photo strictly at category level; text-only per item)
  {
    id: 'sultono-kebabas',
    category: 'kebabs',
    available: true,
    name: {
      lt: 'Sultono kebabas',
      en: "Sultan's kebab",
      ru: 'Кебаб Султана',
    },
    description: {
      lt: 'Lavašas, mėsa, bulvytės fri, marinuoti agurkai, pomidorai, svogūnai, petražolės, padažas',
      en: 'Lavash, meat, fries, pickles, tomato, onion, parsley, sauce',
      ru: 'Лаваш, мясо, картофель фри, маринованные огурцы, помидор, лук, петрушка, соус',
    },
    ingredients: {
      lt: 'Lavašas, mėsa, bulvytės fri, marinuoti agurkai, pomidorai, svogūnai, petražolės, padažas',
      en: 'Lavash, meat, fries, pickles, tomato, onion, parsley, sauce',
      ru: 'Лаваш, мясо, картофель фри, маринованные огурцы, помидор, лук, петрушка, соус',
    },
    portionNote: KEBAB_SIZE_NOTE,
    basePriceCents: 690,
    variants: KEBAB_VARIANTS(690, 790),
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['suris', 'padazai-jalapenai'],
    charcoalAlternativeId: 'brandintos-jautienos-saslikas',
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['quick_bite', 'sit_down'],
      proteins: ['chicken', 'beef'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'kebabas-amerikonas',
    category: 'kebabs',
    available: true,
    name: {
      lt: 'Kebabas Amerikonas',
      en: 'Amerikonas kebab',
      ru: 'Кебаб Американо',
    },
    description: {
      lt: 'Lavašas, mėsa, stiksai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, meat, potato sticks, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, мясо, картофельные палочки, помидор, огурец, лук, соус',
    },
    ingredients: {
      lt: 'Lavašas, mėsa, stiksai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, meat, potato sticks, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, мясо, картофельные палочки, помидор, огурец, лук, соус',
    },
    portionNote: KEBAB_SIZE_NOTE,
    basePriceCents: 690,
    variants: KEBAB_VARIANTS(690, 790),
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['mesa', 'padazai-jalapenai'],
    charcoalAlternativeId: 'liulia-kebabas',
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['quick_bite', 'friends'],
      proteins: ['chicken', 'beef'],
    },
  },
  {
    id: 'paneriu-kebabas',
    category: 'kebabs',
    available: true,
    name: {
      lt: 'Panerių kebabas',
      en: 'Paneriai kebab',
      ru: 'Кебаб Панеряй',
    },
    description: {
      lt: 'Lavašas, mėsa, kopūstai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, meat, cabbage, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, мясо, капуста, помидор, огурец, лук, соус',
    },
    ingredients: {
      lt: 'Lavašas, mėsa, kopūstai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, meat, cabbage, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, мясо, капуста, помидор, огурец, лук, соус',
    },
    portionNote: KEBAB_SIZE_NOTE,
    basePriceCents: 650,
    variants: KEBAB_VARIANTS(650, 750),
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['suris', 'mesa'],
    charcoalAlternativeId: 'vistienos-saslikas',
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['quick_bite'],
      proteins: ['chicken', 'beef'],
      bestseller: true,
    },
  },
  {
    id: 'veganiskas-kebabas',
    category: 'kebabs',
    available: true,
    name: {
      lt: 'Veganiškas kebabas',
      en: 'Vegan kebab',
      ru: 'Веганский кебаб',
    },
    description: {
      lt: 'Lavašas, daržovės, kopūstai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, vegetables, cabbage, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, овощи, капуста, помидор, огурец, лук, соус',
    },
    ingredients: {
      lt: 'Lavašas, daržovės, kopūstai, pomidorai, agurkai, svogūnai, padažas',
      en: 'Lavash, vegetables, cabbage, tomato, cucumber, onion, sauce',
      ru: 'Лаваш, овощи, капуста, помидор, огурец, лук, соус',
    },
    portionNote: KEBAB_SIZE_NOTE,
    basePriceCents: 650,
    variants: [
      { id: 'veg-reg', label: { lt: 'Standartinis', en: 'Regular', ru: 'Стандарт' }, priceCents: 650, protein: 'vegetarian' },
      { id: 'veg-lg', label: { lt: 'Didelis (+1,50 €)', en: 'Large (+€1.50)', ru: 'Большой (+1,50 €)' }, priceCents: 800, protein: 'vegetarian' },
    ],
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true },
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['quick_bite', 'sit_down'],
      proteins: ['vegetarian'],
    },
  },

  // 2. ŠAŠLIKAI IR GRILIS (6 items — all 6 photographed; dine-in & phone pickup only)
  {
    id: 'brandintos-jautienos-saslikas',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Brandintos jautienos nugarinės šašlikas',
      en: 'Aged beef sirloin shashlik',
      ru: 'Шашлык из выдержанной говяжьей вырезки',
    },
    description: {
      lt: 'Brandinta jautienos nugarinė ant žarijų. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Aged beef sirloin off the coals. Served with rice or fries',
      ru: 'Выдержанная говяжья вырезка на углях. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Brandinta jautienos nugarinė, ryžiai arba bulvytės, šviežios daržovės, padažai',
      en: 'Aged beef sirloin, rice or fries, fresh salad, sauces',
      ru: 'Выдержанная говяжья вырезка, рис или картофель фри, свежие овощи, соусы',
    },
    basePriceCents: 1600,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    recommendationMeta: {
      appetite: ['very_hungry', 'satisfying'],
      occasion: ['sit_down', 'friends'],
      proteins: ['beef'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'liulia-kebabas',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Liulia kebabas (jautienos)',
      en: 'Lula kebab (beef)',
      ru: 'Люля-кебаб (говядина)',
    },
    description: {
      lt: 'Maltos jautienos kebabas ant žarijų. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Minced beef kebab off the coals. Served with rice or fries',
      ru: 'Кебаб из рубленой говядины на углях. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Malta jautiena, ryžiai arba bulvytės, šviežios daržovės, padažai',
      en: 'Minced beef, rice or fries, fresh vegetables, sauces',
      ru: 'Рубленая говядина, рис или картофель фри, свежие овощи, соусы',
    },
    basePriceCents: 1400,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['sit_down', 'friends'],
      proteins: ['beef'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'vistienos-file-saslikas',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Vištienos filė šašlikas',
      en: 'Chicken fillet shashlik',
      ru: 'Шашлык из куриного филе',
    },
    description: {
      lt: 'Marinuota vištienos filė ant iešmo. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Marinated chicken fillet on a skewer. Served with rice or fries',
      ru: 'Маринованное куриное филе на шампуре. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Marinuota vištienos filė, ryžiai arba bulvytės, salotos, padažai',
      en: 'Marinated chicken fillet, rice or fries, salad, sauces',
      ru: 'Маринованное куриное филе, рис или картофель фри, салат, соусы',
    },
    basePriceCents: 1200,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['sit_down'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'vistienos-saslikas',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Vištienos šašlikas',
      en: 'Chicken shashlik',
      ru: 'Куриный шашлык',
    },
    description: {
      lt: 'Sultinga vištiena ant žarijų. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Juicy chicken off the coals. Served with rice or fries',
      ru: 'Сочная курица на углях. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Marinuota vištiena, ryžiai arba bulvytės, šviežios daržovės, padažai',
      en: 'Marinated chicken, rice or fries, fresh salad, sauces',
      ru: 'Маринованная курица, рис или картофель фри, свежие овощи, соусы',
    },
    basePriceCents: 1200,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['sit_down', 'friends'],
      proteins: ['chicken'],
      featured: true,
    },
  },
  {
    id: 'vistienos-ketvirtis',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Vištienos ketvirtis ant žarijų',
      en: 'Grilled chicken quarter',
      ru: 'Куриная четверть на углях',
    },
    description: {
      lt: 'Ant žarijų keptas vištienos ketvirtis. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Chicken quarter off the coals. Served with rice or fries',
      ru: 'Куриная четверть на углях. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Vištienos ketvirtis, ryžiai arba bulvytės, šviežios daržovės',
      en: 'Chicken quarter, rice or fries, fresh vegetables',
      ru: 'Куриная четверть, рис или картофель фри, овощи',
    },
    basePriceCents: 1000,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['sit_down'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'vistienos-sparneliai-grilis',
    category: 'charcoal',
    available: true,
    name: {
      lt: 'Vištienos sparneliai ant žarijų',
      en: 'Grilled chicken wings',
      ru: 'Куриные крылышки на углях',
    },
    description: {
      lt: 'Ant žarijų kepti vištienos sparneliai. Patiekiama su ryžiais arba bulvytėmis',
      en: 'Chicken wings off the coals. Served with rice or fries',
      ru: 'Куриные крылышки на углях. Подаётся с рисом или картофелем фри',
    },
    ingredients: {
      lt: 'Vištienos sparneliai, ryžiai arba bulvytės, šviežios daržovės, padažas',
      en: 'Chicken wings, rice or fries, fresh vegetables, sauce',
      ru: 'Куриные крылышки, рис или картофель фри, свежие овощи, соус',
    },
    basePriceCents: 1000,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['friends', 'sit_down'],
      proteins: ['chicken'],
    },
  },

  // 3. PICOS (5 items — all 5 photographed; Vidutinė €11.00 / Didelė €16.00; dine-in & phone only)
  {
    id: 'pica-kebabu-vistiena',
    category: 'pizza',
    available: true,
    name: {
      lt: 'Pica su kebabo mėsa (vištiena)',
      en: 'Chicken kebab pizza',
      ru: 'Пицца с мясом кебаба (курица)',
    },
    description: {
      lt: 'Pomidorų padažas, sūris, vištienos kebabo mėsa, raudonieji svogūnai, paprikos, česnakų padažas',
      en: 'Tomato sauce, cheese, chicken kebab meat, red onion, peppers, garlic sauce',
      ru: 'Томатный соус, сыр, куриное мясо кебаба, красный лук, перец, чесночный соус',
    },
    ingredients: {
      lt: 'Pomidorų padažas, sūris, vištienos kebabo mėsa, raudonieji svogūnai, paprikos, česnakų padažas',
      en: 'Tomato sauce, cheese, chicken kebab meat, red onion, peppers, garlic sauce',
      ru: 'Томатный соус, сыр, куриное мясо кебаба, красный лук, перец, чесночный соус',
    },
    basePriceCents: 1100,
    variants: PIZZA_VARIANTS('chicken'),
    channels: ['dine_in', 'phone'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['chicken'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'pica-kebabu-jautiena',
    category: 'pizza',
    available: true,
    name: {
      lt: 'Pica su kebabo mėsa (jautiena)',
      en: 'Beef kebab pizza',
      ru: 'Пицца с мясом кебаба (говядина)',
    },
    description: {
      lt: 'Pomidorų padažas, sūris, jautienos kebabo mėsa, raudonieji svogūnai, paprikos, česnakų padažas',
      en: 'Tomato sauce, cheese, beef kebab meat, red onion, peppers, garlic sauce',
      ru: 'Томатный соус, сыр, говяжье мясо кебаба, красный лук, перец, чесночный соус',
    },
    ingredients: {
      lt: 'Pomidorų padažas, sūris, jautienos kebabo mėsa, raudonieji svogūnai, paprikos, česnakų padažas',
      en: 'Tomato sauce, cheese, beef kebab meat, red onion, peppers, garlic sauce',
      ru: 'Томатный соус, сыр, говяжье мясо кебаба, красный лук, перец, чесночный соус',
    },
    basePriceCents: 1100,
    variants: PIZZA_VARIANTS('beef'),
    channels: ['dine_in', 'phone'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['beef'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'pica-vegetariska',
    category: 'pizza',
    available: true,
    name: {
      lt: 'Vegetariška pica',
      en: 'Vegetarian pizza',
      ru: 'Вегетарианская пицца',
    },
    description: {
      lt: 'Pomidorų padažas, sūris, pomidorai, agurkai, paprikos, raudonieji svogūnai, juodosios alyvuogės, pievagrybiai',
      en: 'Tomato sauce, cheese, tomato, cucumber, peppers, red onion, black olives, mushrooms',
      ru: 'Томатный соус, сыр, помидор, огурец, перец, красный лук, чёрные оливки, грибы',
    },
    ingredients: {
      lt: 'Pomidorų padažas, sūris, pomidorai, agurkai, paprikos, raudonieji svogūnai, juodosios alyvuogės, pievagrybiai',
      en: 'Tomato sauce, cheese, tomato, cucumber, peppers, red onion, black olives, mushrooms',
      ru: 'Томатный соус, сыр, помидор, огурец, перец, красный лук, чёрные оливки, грибы',
    },
    basePriceCents: 1100,
    variants: PIZZA_VARIANTS('vegetarian'),
    channels: ['dine_in', 'phone'],
    dietary: { vegetarian: true },
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['vegetarian'],
    },
  },
  {
    id: 'pica-vistienos-desreles',
    category: 'pizza',
    available: true,
    name: {
      lt: 'Pica su vištienos dešrelėmis',
      en: 'Chicken sausage pizza',
      ru: 'Пицца с куриными колбасками',
    },
    description: {
      lt: 'Pomidorų padažas, sūris, vištienos dešrelės, raudonieji svogūnai',
      en: 'Tomato sauce, cheese, chicken sausages, red onion',
      ru: 'Томатный соус, сыр, куриные колбаски, красный лук',
    },
    ingredients: {
      lt: 'Pomidorų padažas, sūris, vištienos dešrelės, raudonieji svogūnai',
      en: 'Tomato sauce, cheese, chicken sausages, red onion',
      ru: 'Томатный соус, сыр, куриные колбаски, красный лук',
    },
    basePriceCents: 1100,
    variants: PIZZA_VARIANTS('chicken'),
    channels: ['dine_in', 'phone'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'pica-jautienos-desra',
    category: 'pizza',
    available: true,
    name: {
      lt: 'Pica su jautienos dešra',
      en: 'Beef sausage pizza',
      ru: 'Пицца с говяжьей колбасой',
    },
    description: {
      lt: 'Pomidorų padažas, sūris, jautienos dešra, raudonieji svogūnai, paprikos',
      en: 'Tomato sauce, cheese, beef sausage, red onion, peppers',
      ru: 'Томатный соус, сыр, говяжья колбаса, красный лук, перец',
    },
    ingredients: {
      lt: 'Pomidorų padažas, sūris, jautienos dešra, raudonieji svogūnai, paprikos',
      en: 'Tomato sauce, cheese, beef sausage, red onion, peppers',
      ru: 'Томатный соус, сыр, говяжья колбаса, красный лук, перец',
    },
    basePriceCents: 1100,
    variants: PIZZA_VARIANTS('beef'),
    channels: ['dine_in', 'phone'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['beef'],
    },
  },

  // 4. LĖKŠTĖS (6 items — 3 photographed, 3 text-only)
  {
    id: 'kebabas-lekstaje',
    category: 'plates',
    available: true,
    name: {
      lt: 'Kebabas lėkštėje',
      en: 'Kebab on a plate',
      ru: 'Кебаб на тарелке',
    },
    description: {
      lt: 'Kebabo mėsa patiekiama lėkštėje su bulvytėmis fri, šviežiomis salotomis ir padažais.',
      en: 'Kebab meat served on a plate with fries, fresh salad, and sauces.',
      ru: 'Мясо кебаба на тарелке с картофелем фри, свежим салатом и соусами.',
    },
    basePriceCents: 850,
    variants: [
      { id: 'vistiena', label: { lt: 'Vištiena', en: 'Chicken', ru: 'Курица' }, priceCents: 850, protein: 'chicken' },
      { id: 'jautiena', label: { lt: 'Jautiena', en: 'Beef', ru: 'Говядина' }, priceCents: 950, protein: 'beef' },
    ],
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    charcoalAlternativeId: 'liulia-kebabas',
    recommendationMeta: {
      appetite: ['satisfying', 'very_hungry'],
      occasion: ['sit_down', 'quick_bite'],
      proteins: ['chicken', 'beef'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'seimos-lekste',
    category: 'plates',
    available: true,
    name: {
      lt: 'Šeimos lėkštė',
      en: 'Family plate',
      ru: 'Семейная тарелка',
    },
    description: {
      lt: 'Vištiena, jautiena, vištienos filė, spring rolls, ryžiai, bulvytės fri, salotos, padažai',
      en: 'Chicken, beef, chicken fillet, spring rolls, rice, fries, salad, sauces',
      ru: 'Курица, говядина, куриное филе, спринг-роллы, рис, картофель фри, салат, соусы',
    },
    ingredients: {
      lt: 'Vištiena, jautiena, vištienos filė, spring rolls, ryžiai, bulvytės fri, salotos, padažai',
      en: 'Chicken, beef, chicken fillet, spring rolls, rice, fries, salad, sauces',
      ru: 'Курица, говядина, куриное филе, спринг-роллы, рис, картофель фри, салат, соусы',
    },
    basePriceCents: 1600,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai', 'mesa'],
    charcoalAlternativeId: 'brandintos-jautienos-saslikas',
    recommendationMeta: {
      appetite: ['very_hungry'],
      occasion: ['friends', 'sit_down'],
      proteins: ['mixed'],
      featured: true,
      bestseller: true,
    },
  },
  {
    id: 'vegetariska-lekste',
    category: 'plates',
    available: true,
    name: {
      lt: 'Vegetariška lėkštė',
      en: 'Vegetarian plate',
      ru: 'Вегетарианская тарелка',
    },
    description: {
      lt: 'Šviežių daržovių ir garnyro lėkštė su padažais.',
      en: 'Fresh vegetables and sides served on a plate with sauces.',
      ru: 'Свежие овощи с гарниром и соусами на тарелке.',
    },
    basePriceCents: 850,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['sit_down', 'quick_bite'],
      proteins: ['vegetarian'],
    },
  },
  {
    id: 'pita',
    category: 'plates',
    available: true,
    name: { lt: 'Pita', en: 'Pita', ru: 'Пита' },
    description: {
      lt: 'Pita su pasirinkta mėsa, šviežiomis daržovėmis ir padažu.',
      en: 'Pita filled with your choice of meat, fresh vegetables, and sauce.',
      ru: 'Пита с мясом на выбор, свежими овощами и соусом.',
    },
    basePriceCents: 700,
    variants: [
      { id: 'vistiena', label: { lt: 'Vištiena', en: 'Chicken', ru: 'Курица' }, priceCents: 700, protein: 'chicken' },
      { id: 'jautiena', label: { lt: 'Jautiena', en: 'Beef', ru: 'Говядина' }, priceCents: 800, protein: 'beef' },
    ],
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['suris', 'padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['quick_bite', 'sit_down'],
      proteins: ['chicken', 'beef'],
    },
  },
  {
    id: 'vistienos-file',
    category: 'plates',
    available: true,
    name: {
      lt: 'Vištienos filė',
      en: 'Chicken fillet',
      ru: 'Куриное филе',
    },
    description: {
      lt: 'Traškiai keptos vištienos filė juostelės.',
      en: 'Crispy tender chicken fillet strips.',
      ru: 'Хрустящее куриное филе.',
    },
    basePriceCents: 800,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['quick_bite', 'sit_down'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'astrus-vistienos-sparneliai',
    category: 'plates',
    available: true,
    name: {
      lt: 'Aštrūs vištienos sparneliai',
      en: 'Spicy chicken wings',
      ru: 'Острые куриные крылышки',
    },
    description: {
      lt: 'Aštriai marinuoti traškūs vištienos sparneliai.',
      en: 'Spicy crispy chicken wings.',
      ru: 'Острые хрустящие куриные крылышки.',
    },
    basePriceCents: 800,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['chicken'],
    },
  },

  // 5. UŽKANDŽIAI (9 items — 7 photographed, 2 text-only)
  {
    id: 'vistienos-sparneliai',
    category: 'snacks',
    available: true,
    name: { lt: 'Vištienos sparneliai', en: 'Chicken wings', ru: 'Куриные крылышки' },
    description: {
      lt: 'Traškūs kepti vištienos sparneliai.',
      en: 'Crispy fried chicken wings.',
      ru: 'Хрустящие куриные крылышки.',
    },
    basePriceCents: 800,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'krevetes',
    category: 'snacks',
    available: true,
    name: { lt: 'Krevetės', en: 'Prawns', ru: 'Креветки' },
    description: {
      lt: 'Traškioje paniruotėje keptos krevetės.',
      en: 'Golden breaded prawns.',
      ru: 'Хрустящие креветки в панировке.',
    },
    basePriceCents: 800,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['mixed'],
    },
  },
  {
    id: 'vistienos-nuggets',
    category: 'snacks',
    available: true,
    name: { lt: 'Vištienos nuggets', en: 'Chicken nuggets', ru: 'Куриные наггетсы' },
    description: {
      lt: 'Traškūs vištienos gabaliukai.',
      en: 'Crispy chicken nuggets.',
      ru: 'Хрустящие куриные наггетсы.',
    },
    basePriceCents: 500,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['quick_bite', 'friends'],
      proteins: ['chicken'],
    },
  },
  {
    id: 'kalmaru-ziedai',
    category: 'snacks',
    available: true,
    name: { lt: 'Kalmarų žiedai', en: 'Calamari rings', ru: 'Кольца кальмара' },
    description: {
      lt: 'Auksiniai traškūs kalmarų žiedai.',
      en: 'Crispy calamari rings.',
      ru: 'Хрустящие кольца кальмара.',
    },
    basePriceCents: 500,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['mixed'],
    },
  },
  {
    id: 'svogunu-ziedai',
    category: 'snacks',
    available: true,
    name: { lt: 'Svogūnų žiedai', en: 'Onion rings', ru: 'Луковые кольца' },
    description: {
      lt: 'Traškūs svogūnų žiedai.',
      en: 'Crispy onion rings.',
      ru: 'Хрустящие луковые кольца.',
    },
    basePriceCents: 500,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['vegetarian'],
    },
  },
  {
    id: 'spring-rolls',
    category: 'snacks',
    available: true,
    name: { lt: 'Spring rolls', en: 'Spring rolls', ru: 'Спринг-роллы' },
    description: {
      lt: 'Traškūs suktinukai su daržovių įdaru.',
      en: 'Crispy vegetable spring rolls.',
      ru: 'Хрустящие овощные спринг-роллы.',
    },
    basePriceCents: 500,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['friends', 'quick_bite'],
      proteins: ['vegetarian'],
    },
  },
  {
    id: 'koldunai',
    category: 'snacks',
    available: true,
    name: { lt: 'Koldūnai', en: 'Dumplings', ru: 'Колдуны' },
    description: { lt: 'Su mėsos įdaru', en: 'With meat filling', ru: 'С мясной начинкой' },
    ingredients: { lt: 'Su mėsos įdaru', en: 'With meat filling', ru: 'С мясной начинкой' },
    basePriceCents: 500,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['quick_bite', 'friends'],
      proteins: ['beef', 'chicken'],
    },
  },
  {
    id: 'ceburekai',
    category: 'snacks',
    available: true,
    name: { lt: 'Čeburekai', en: 'Cheburekai', ru: 'Чебуреки' },
    description: {
      lt: 'Šviežiai iškepti traškūs čeburekai su vištiena arba jautiena.',
      en: 'Freshly fried crispy pastry with minced chicken or beef.',
      ru: 'Свежие хрустящие чебуреки с курицей или говядиной.',
    },
    basePriceCents: 450,
    variants: [
      { id: 'vistiena', label: { lt: 'Vištiena', en: 'Chicken', ru: 'Курица' }, priceCents: 450, protein: 'chicken' },
      { id: 'jautiena', label: { lt: 'Jautiena', en: 'Beef', ru: 'Говядина' }, priceCents: 550, protein: 'beef' },
    ],
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: {},
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['quick_bite'],
      proteins: ['chicken', 'beef'],
    },
  },
  {
    id: 'bulvytes-fri',
    category: 'snacks',
    available: true,
    name: { lt: 'Bulvytės fri', en: 'Fries', ru: 'Картофель фри' },
    description: {
      lt: 'Karštos traškios bulvytės fri.',
      en: 'Crispy golden fries.',
      ru: 'Хрустящий картофель фри.',
    },
    basePriceCents: 400,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai', 'suris'],
    recommendationMeta: {
      appetite: ['light'],
      occasion: ['quick_bite', 'friends'],
      proteins: ['vegetarian'],
    },
  },

  // 6. SRIUBOS (2 items — dienos-sriuba photographed via official gallery/12.jpg; soti-sriuba text-only)
  {
    id: 'dienos-sriuba',
    category: 'soups',
    available: true,
    name: { lt: 'Dienos sriuba', en: 'Soup of the day', ru: 'Суп дня' },
    description: {
      lt: 'Karšta šviežiai virta dienos sriuba su citrina.',
      en: 'Freshly prepared soup of the day served with lemon.',
      ru: 'Горячий свежий суп дня с долькой лимона.',
    },
    basePriceCents: 400,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    suggestedExtraIds: ['padazai-jalapenai'],
    recommendationMeta: {
      appetite: ['light', 'satisfying'],
      occasion: ['sit_down'],
      proteins: ['chicken', 'beef'],
    },
  },
  {
    id: 'soti-sriuba',
    category: 'soups',
    available: true,
    name: { lt: 'Soti sriuba', en: 'Hearty soup', ru: 'Сытный суп' },
    description: {
      lt: 'Makaronai, kebabo mėsa, padažas',
      en: 'Pasta, kebab meat, sauce',
      ru: 'Макароны, мясо кебаба, соус',
    },
    ingredients: {
      lt: 'Makaronai, kebabo mėsa, padažas',
      en: 'Pasta, kebab meat, sauce',
      ru: 'Макароны, мясо кебаба, соус',
    },
    basePriceCents: 450,
    channels: ['dine_in', 'phone'],
    dietary: {},
    suggestedExtraIds: ['mesa'],
    recommendationMeta: {
      appetite: ['satisfying'],
      occasion: ['sit_down'],
      proteins: ['chicken', 'beef'],
    },
  },

  // 7. GĖRIMAI (4 individual items separated per official catalog, text-only)
  {
    id: 'kava',
    category: 'drinks',
    available: true,
    name: { lt: 'Kava', en: 'Coffee', ru: 'Кофе' },
    description: { lt: 'Šviežia karšta kava vietoje ar išsinešimui.', en: 'Fresh hot coffee.', ru: 'Свежий горячий кофе.' },
    basePriceCents: 200,
    channels: ['dine_in', 'phone'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['sit_down'], proteins: ['vegetarian'] },
  },
  {
    id: 'gaivieji',
    category: 'drinks',
    available: true,
    name: { lt: 'Gaivieji gėrimai', en: 'Soft drinks', ru: 'Безалкогольные напитки' },
    description: { lt: 'Cola, Pepsi, Seven Up, Sprite', en: 'Cola, Pepsi, Seven Up, Sprite', ru: 'Cola, Pepsi, Seven Up, Sprite' },
    ingredients: { lt: 'Cola, Pepsi, Seven Up, Sprite', en: 'Cola, Pepsi, Seven Up, Sprite', ru: 'Cola, Pepsi, Seven Up, Sprite' },
    basePriceCents: 150,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['quick_bite'], proteins: ['vegetarian'] },
  },
  {
    id: 'arbata',
    category: 'drinks',
    available: true,
    name: { lt: 'Arbata', en: 'Tea', ru: 'Чай' },
    description: { lt: 'Šilta arbata.', en: 'Hot tea.', ru: 'Горячий чай.' },
    basePriceCents: 150,
    channels: ['dine_in', 'phone'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['sit_down'], proteins: ['vegetarian'] },
  },
  {
    id: 'sultinys',
    category: 'drinks',
    available: true,
    name: { lt: 'Sultinys', en: 'Broth', ru: 'Бульон' },
    description: { lt: 'Karštas aromatingas sultinys.', en: 'Warm savory broth.', ru: 'Горячий ароматный бульон.' },
    basePriceCents: 150,
    channels: ['dine_in', 'phone'],
    dietary: { noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['sit_down'], proteins: ['chicken', 'beef'] },
  },

  // 8. PAPILDOMAI (3 individual items separated per official catalog, text-only)
  {
    id: 'suris',
    category: 'extras',
    available: true,
    name: { lt: 'Sūris', en: 'Cheese', ru: 'Сыр' },
    description: { lt: 'Papildoma sūrio porcija patiekalui.', en: 'Extra cheese portion.', ru: 'Дополнительная порция сыра.' },
    basePriceCents: 100,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['quick_bite'], proteins: ['vegetarian'] },
  },
  {
    id: 'mesa',
    category: 'extras',
    available: true,
    name: { lt: 'Mėsa', en: 'Meat', ru: 'Мясо' },
    description: { lt: 'Papildoma kebabo mėsos porcija.', en: 'Extra kebab meat portion.', ru: 'Дополнительная порция мяса.' },
    basePriceCents: 100,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['quick_bite'], proteins: ['chicken', 'beef'] },
  },
  {
    id: 'padazai-jalapenai',
    category: 'extras',
    available: true,
    name: { lt: 'Padažai, jelapenai', en: 'Sauces, jalapeños', ru: 'Соусы, халапеньо' },
    description: {
      lt: 'Papildomas padažas arba jelapeno pipirai.',
      en: 'Extra sauce or jalapeños.',
      ru: 'Дополнительный соус или халапеньо.',
    },
    basePriceCents: 70,
    channels: ['dine_in', 'phone', 'wolt', 'bolt'],
    dietary: { vegetarian: true, veganAvailable: true, noBreadOption: true },
    recommendationMeta: { appetite: ['light'], occasion: ['quick_bite'], proteins: ['vegetarian'] },
  },
];

// Attach verified local photography strictly by unique product ID (unphotographed -> text-only)
export const MENU_ITEMS: MenuItem[] = RAW_MENU_ITEMS.map((item) => {
  const mapped = getProductImage(item.id);
  return mapped
    ? {
        ...item,
        image: mapped.src,
        isolatedImage: mapped.isolatedSrc,
        imageAlt: mapped.alt,
      }
    : item;
});

/* ============================================================================
   DETERMINISTIC CHOOSE-FOR-ME RECOMMENDATION ENGINE
   ============================================================================ */

export type BudgetChoice = 'up_to_8' | 'up_to_10' | 'up_to_12' | 'flexible' | 'skip';
export type OccasionChoice = 'quick_bite' | 'proper_lunch' | 'with_friends' | 'skip';
export type PreferenceChoice = 'chicken' | 'beef' | 'vegetarian' | 'vegan' | 'surprise' | 'skip';
export type OrderingMethodChoice = 'dine_in' | 'pickup' | 'delivery' | 'skip';

export interface RecommendationInput {
  budget: BudgetChoice;
  occasion: OccasionChoice;
  preference: PreferenceChoice;
  orderingMethod: OrderingMethodChoice;
}

export type RecommendationReasonKey =
  | 'charcoal_lunch'
  | 'charcoal_friends'
  | 'quick_kebab'
  | 'vegetarian_choice'
  | 'vegan_choice'
  | 'budget_fit'
  | 'friends_feast';

export interface RecommendationMatchResult {
  status: 'match';
  primary: MenuItem;
  primaryPriceCents: number;
  alternatives: MenuItem[];
  reasonKey: RecommendationReasonKey;
  charcoalUpgradeNote?: MenuItem;
}

export interface RecommendationNoMatchResult {
  status: 'no_match';
  relaxBudgetHelpful: boolean;
  relaxDeliveryHelpful: boolean;
  relaxDietaryHelpful: boolean;
}

export type RecommendationOutcome =
  | RecommendationMatchResult
  | RecommendationNoMatchResult;

function maxBudgetCents(budget: BudgetChoice): number {
  if (budget === 'up_to_8') return 800;
  if (budget === 'up_to_10') return 1000;
  if (budget === 'up_to_12') return 1200;
  return Infinity;
}

export function getLowestQualifyingPriceCents(
  item: MenuItem,
  preference: PreferenceChoice
): number {
  if (!item.variants?.length) return item.basePriceCents;

  const matchingVariants = item.variants.filter((v) => {
    if (preference === 'chicken') return !v.protein || v.protein === 'chicken';
    if (preference === 'beef') return !v.protein || v.protein === 'beef';
    if (preference === 'vegetarian' || preference === 'vegan') {
      return !v.protein || v.protein === 'vegetarian';
    }
    return true;
  });

  const pool = matchingVariants.length > 0 ? matchingVariants : item.variants;
  return Math.min(...pool.map((v) => v.priceCents));
}

export function recommendDish(input: RecommendationInput): RecommendationOutcome {
  const mealCandidates = MENU_ITEMS.filter(
    (item) => item.available && item.category !== 'extras' && item.category !== 'drinks'
  );

  const afterDietary = mealCandidates.filter((item) => {
    if (input.preference === 'vegan') return Boolean(item.dietary.veganAvailable);
    if (input.preference === 'vegetarian') return Boolean(item.dietary.vegetarian);
    if (input.preference === 'chicken') return item.recommendationMeta.proteins.includes('chicken');
    if (input.preference === 'beef') return item.recommendationMeta.proteins.includes('beef');
    return true;
  });

  const afterMethod = afterDietary.filter((item) => {
    if (input.orderingMethod === 'dine_in') return item.channels.includes('dine_in');
    if (input.orderingMethod === 'pickup') return item.channels.includes('phone');
    if (input.orderingMethod === 'delivery') {
      return item.channels.includes('wolt') || item.channels.includes('bolt');
    }
    return true;
  });

  const limitCents = maxBudgetCents(input.budget);
  const surviving = afterMethod.filter(
    (item) => getLowestQualifyingPriceCents(item, input.preference) <= limitCents
  );

  if (surviving.length === 0) {
    return {
      status: 'no_match',
      relaxBudgetHelpful: afterMethod.length > 0,
      relaxDeliveryHelpful:
        input.orderingMethod === 'delivery' &&
        afterDietary.some(
          (item) => getLowestQualifyingPriceCents(item, input.preference) <= limitCents
        ),
      relaxDietaryHelpful: input.preference === 'vegan' || input.preference === 'vegetarian',
    };
  }

  const snackDeprioritizeIds = new Set([
    'bulvytes-fri',
    'svogunu-ziedai',
    'kalmaru-ziedai',
    'spring-rolls',
    'koldunai',
    'vistienos-nuggets',
  ]);

  const scored = surviving.map((item) => {
    let score = 0;
    if (item.recommendationMeta.featured) score += 2;

    if (input.occasion === 'quick_bite') {
      if (item.recommendationMeta.occasion.includes('quick_bite')) score += 5;
      if (item.category === 'kebabs') score += 3;
    } else if (input.occasion === 'proper_lunch') {
      if (item.recommendationMeta.occasion.includes('sit_down')) score += 5;
      if (item.category === 'charcoal' || item.category === 'plates' || item.category === 'soups') {
        score += 3;
      }
    } else if (input.occasion === 'with_friends') {
      if (item.recommendationMeta.occasion.includes('friends')) score += 5;
      if (item.category === 'charcoal' || item.category === 'pizza' || item.id === 'seimos-lekste') {
        score += 3;
      }
    } else {
      if (item.category === 'kebabs' || item.category === 'charcoal') score += 3;
    }

    if (
      item.category === 'charcoal' &&
      input.occasion !== 'quick_bite' &&
      input.preference !== 'vegetarian' &&
      input.preference !== 'vegan'
    ) {
      score += 4;
    }

    if (snackDeprioritizeIds.has(item.id)) {
      score -= 3;
    }

    return { item, score, priceCents: getLowestQualifyingPriceCents(item, input.preference) };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.priceCents - b.priceCents;
  });

  const primary = scored[0].item;
  const primaryPriceCents = scored[0].priceCents;
  const alternatives = scored.slice(1, 3).map((s) => s.item);

  let reasonKey: RecommendationReasonKey = 'quick_kebab';
  if (input.preference === 'vegan') {
    reasonKey = 'vegan_choice';
  } else if (input.preference === 'vegetarian') {
    reasonKey = 'vegetarian_choice';
  } else if (primary.category === 'charcoal' && input.occasion === 'with_friends') {
    reasonKey = 'charcoal_friends';
  } else if (primary.category === 'charcoal') {
    reasonKey = 'charcoal_lunch';
  } else if (
    primary.category === 'pizza' ||
    primary.id === 'seimos-lekste' ||
    input.occasion === 'with_friends'
  ) {
    reasonKey = 'friends_feast';
  } else if (input.budget === 'up_to_8') {
    reasonKey = 'budget_fit';
  }

  let charcoalUpgradeNote: MenuItem | undefined;
  if (
    primary.category !== 'charcoal' &&
    primary.charcoalAlternativeId &&
    input.preference !== 'vegetarian' &&
    input.preference !== 'vegan' &&
    input.orderingMethod !== 'delivery'
  ) {
    charcoalUpgradeNote = MENU_ITEMS.find((m) => m.id === primary.charcoalAlternativeId);
  }

  return {
    status: 'match',
    primary,
    primaryPriceCents,
    alternatives,
    reasonKey,
    charcoalUpgradeNote,
  };
}
