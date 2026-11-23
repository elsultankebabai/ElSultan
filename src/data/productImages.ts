import type { LocalizedText, MenuCategoryId } from './menu';

export interface ProductImageAsset {
  src: string;
  isolatedSrc?: string;
  isolatedHorizontalSrc?: string;
  alt: LocalizedText;
}

/**
 * Shared category-level photograph from https://elsultan.lt/menu/
 * Strictly represents the Kebabs category as a whole — never misattributed as a unique individual variant photo.
 */
export const CATEGORY_IMAGE_MAP: Partial<Record<MenuCategoryId, ProductImageAsset>> = {
  kebabs: {
    src: '/images/menu/kebabas-lavase.jpg',
    isolatedSrc: '/images/isolated/kebabas-lavase.webp',
    isolatedHorizontalSrc: '/images/isolated/kebabas-lavase-horizontal.webp',
    alt: {
      lt: 'EL SULTAN kebabai lavaše — bendra kategorijos nuotrauka',
      en: 'EL SULTAN lavash kebabs — shared category photograph',
      ru: 'Кебабы EL SULTAN в лаваше — общая фотография категории',
    },
  },
};

/**
 * Centralized 1:1 original product-to-image mapping keyed by authoritative product ID.
 * Transparent-background WebP derivatives in `/images/isolated/` are derived strictly from the untouched masters.
 * Products without an entry here render in clean text-only presentation.
 */
export const PRODUCT_IMAGE_MAP: Record<string, ProductImageAsset> = {
  // CHARCOAL GRILL (6 / 6 photographed)
  'brandintos-jautienos-saslikas': {
    src: '/images/menu/brandintos-jautienos-saslikas.jpg',
    isolatedSrc: '/images/isolated/brandintos-jautienos-saslikas.webp',
    alt: {
      lt: 'Brandintos jautienos nugarinės šašlikas su ryžiais, salotomis ir padažais',
      en: 'Aged beef sirloin shashlik served with rice, fresh salad, and sauces',
      ru: 'Шашлык из выдержанной говяжьей вырезки с рисом, салатом и соусами',
    },
  },
  'liulia-kebabas': {
    src: '/images/menu/liulia-kebabas.jpg',
    isolatedSrc: '/images/isolated/liulia-kebabas.webp',
    alt: {
      lt: 'Liulia kebabas (jautienos) ant žarijų su ryžiais ir daržovėmis',
      en: 'Lula kebab (beef) grilled over charcoal with rice and fresh vegetables',
      ru: 'Люля-кебаб из говядины на углях с рисом и свежими овощами',
    },
  },
  'vistienos-file-saslikas': {
    src: '/images/menu/vistienos-file-saslikas.jpg',
    alt: {
      lt: 'Vištienos filė šašlikas su ryžiais arba bulvytėmis ir daržovėmis',
      en: 'Chicken fillet shashlik served with rice or fries and fresh vegetables',
      ru: 'Шашлык из куриного филе с рисом или картофелем фри и овощами',
    },
  },
  'vistienos-saslikas': {
    src: '/images/menu/vistienos-saslikas.jpg',
    alt: {
      lt: 'Vištienos šašlikas ant žarijų su ryžiais ir šviežiomis daržovėmis',
      en: 'Chicken shashlik off the coals with rice and fresh salad',
      ru: 'Куриный шашлык на углях с рисом и свежим салатом',
    },
  },
  'vistienos-ketvirtis': {
    src: '/images/menu/vistienos-ketvirtis.jpg',
    alt: {
      lt: 'Vištienos ketvirtis ant žarijų su ryžiais arba bulvytėmis',
      en: 'Grilled chicken quarter served with rice or fries',
      ru: 'Куриная четверть на углях с рисом или картофелем фри',
    },
  },
  'vistienos-sparneliai-grilis': {
    src: '/images/menu/vistienos-sparneliai-grilis.jpg',
    alt: {
      lt: 'Vištienos sparneliai ant žarijų su ryžiais ir salotomis',
      en: 'Grilled chicken wings off the coals with rice and fresh vegetables',
      ru: 'Куриные крылышки на углях с рисом и свежими овощами',
    },
  },

  // PIZZAS (5 / 5 photographed)
  'pica-kebabu-vistiena': {
    src: '/images/menu/pica-kebabu-vistiena.jpg',
    isolatedSrc: '/images/isolated/pica-kebabu-vistiena.webp',
    alt: {
      lt: 'Pica su kebabo mėsa (vištiena), sūriu ir daržovėmis',
      en: 'Chicken kebab pizza with cheese, red onion, and peppers',
      ru: 'Пицца с мясом кебаба (курица), сыром и овощами',
    },
  },
  'pica-kebabu-jautiena': {
    src: '/images/menu/pica-kebabu-jautiena.jpg',
    isolatedSrc: '/images/isolated/pica-kebabu-jautiena.webp',
    alt: {
      lt: 'Pica su kebabo mėsa (jautiena), raudonaisiais svogūnais ir paprika',
      en: 'Beef kebab pizza with red onion, peppers, and garlic sauce',
      ru: 'Пицца с мясом кебаба (говядина), красным луком и перцем',
    },
  },
  'pica-vegetariska': {
    src: '/images/menu/pica-vegetariska.jpg',
    alt: {
      lt: 'Vegetariška pica su daržovėmis, alyvuogėmis ir pievagrybiais',
      en: 'Vegetarian pizza with tomato, cucumber, peppers, olives, and mushrooms',
      ru: 'Вегетарианская пицца с овощами, оливками и грибами',
    },
  },
  'pica-vistienos-desreles': {
    src: '/images/menu/pica-vistienos-desreles.jpg',
    alt: {
      lt: 'Pica su vištienos dešrelėmis, sūriu ir raudonaisiais svogūnais',
      en: 'Chicken sausage pizza with cheese and red onion',
      ru: 'Пицца с куриными колбасками, сыром и красным луком',
    },
  },
  'pica-jautienos-desra': {
    src: '/images/menu/pica-jautienos-desra.jpg',
    alt: {
      lt: 'Pica su jautienos dešra, raudonaisiais svogūnais ir paprikomis',
      en: 'Beef sausage pizza with red onion and peppers',
      ru: 'Пицца с говяжьей колбасой, красным луком и перцем',
    },
  },

  // PLATES (3 / 6 photographed — Pita, Vištienos filė, Aštrūs sparneliai are text-only)
  'kebabas-lekstaje': {
    src: '/images/menu/kebabas-lekstaje.jpg',
    isolatedSrc: '/images/isolated/kebabas-lekstaje.webp',
    alt: {
      lt: 'Kebabas lėkštėje su mėsa, bulvytėmis fri, salotomis ir padažais',
      en: 'Kebab on a plate with meat, fries, fresh salad, and sauces',
      ru: 'Кебаб на тарелке с мясом, картофелем фри, салатом и соусами',
    },
  },
  'seimos-lekste': {
    src: '/images/menu/seimos-lekste.jpg',
    isolatedSrc: '/images/isolated/seimos-lekste.webp',
    alt: {
      lt: 'Šeimos lėkštė su vištiena, jautiena, filė, spring rolls, ryžiais ir bulvytėmis',
      en: 'Family plate with chicken, beef, chicken fillet, spring rolls, rice, fries, and sauces',
      ru: 'Семейная тарелка с курицей, говядиной, филе, спринг-роллами, рисом и фри',
    },
  },
  'vegetariska-lekste': {
    src: '/images/menu/vegetariska-lekste.jpg',
    alt: {
      lt: 'Vegetariška lėkštė su šviežiomis daržovėmis ir garnyru',
      en: 'Vegetarian plate with fresh vegetables and sides',
      ru: 'Вегетарианская тарелка со свежими овощами и гарниром',
    },
  },

  // SOUPS (1 / 2 photographed — from official /gallery/12.jpg "Dienos sriuba su citrina")
  'dienos-sriuba': {
    src: '/images/menu/dienos-sriuba.jpg',
    alt: {
      lt: 'Dienos sriuba su citrina — EL SULTAN virtuvės nuotrauka',
      en: 'Soup of the day served with fresh lemon',
      ru: 'Суп дня с долькой лимона',
    },
  },

  // SNACKS (7 / 9 photographed — Čeburekai and Bulvytės fri are text-only)
  'vistienos-sparneliai': {
    src: '/images/menu/vistienos-sparneliai.jpg',
    alt: {
      lt: 'Vištienos sparneliai',
      en: 'Chicken wings',
      ru: 'Куриные крылышки',
    },
  },
  krevetes: {
    src: '/images/menu/krevetes.jpg',
    alt: {
      lt: 'Krevetės traškioje paniruotėje',
      en: 'Crispy prawns',
      ru: 'Креветки',
    },
  },
  'vistienos-nuggets': {
    src: '/images/menu/vistienos-nuggets.jpg',
    alt: {
      lt: 'Vištienos nuggets',
      en: 'Chicken nuggets',
      ru: 'Куриные наггетсы',
    },
  },
  'kalmaru-ziedai': {
    src: '/images/menu/kalmaru-ziedai.jpg',
    alt: {
      lt: 'Kalmarų žiedai',
      en: 'Calamari rings',
      ru: 'Кольца кальмара',
    },
  },
  'svogunu-ziedai': {
    src: '/images/menu/svogunu-ziedai.jpg',
    alt: {
      lt: 'Svogūnų žiedai',
      en: 'Onion rings',
      ru: 'Луковые кольца',
    },
  },
  'spring-rolls': {
    src: '/images/menu/spring-rolls.jpg',
    alt: {
      lt: 'Spring rolls',
      en: 'Spring rolls',
      ru: 'Спринг-роллы',
    },
  },
  koldunai: {
    src: '/images/menu/koldunai.jpg',
    alt: {
      lt: 'Koldūnai su mėsos įdaru',
      en: 'Dumplings with meat filling',
      ru: 'Колдуны с мясной начинкой',
    },
  },
};

export function getProductImage(productId: string): ProductImageAsset | undefined {
  return PRODUCT_IMAGE_MAP[productId];
}

export function getResponsiveMenuWebp(src: string): { webpSrc: string; webpSrcSet: string } | undefined {
  const match = src.match(/^\/images\/menu\/([^/]+)\.jpg$/);
  if (!match) return undefined;
  const slug = match[1];
  return {
    webpSrc: `/images/menu-webp/${slug}.webp`,
    webpSrcSet: `/images/menu-webp/${slug}-480.webp 480w, /images/menu-webp/${slug}.webp 840w`,
  };
}

export function getIsolatedProductImage(productId: string): string | undefined {
  return PRODUCT_IMAGE_MAP[productId]?.isolatedSrc;
}

export function getCategoryImage(categoryId: MenuCategoryId): ProductImageAsset | undefined {
  return CATEGORY_IMAGE_MAP[categoryId];
}

export function getIsolatedCategoryImage(categoryId: MenuCategoryId): string | undefined {
  return CATEGORY_IMAGE_MAP[categoryId]?.isolatedSrc;
}

export function getIsolatedHorizontalCategoryImage(
  categoryId: MenuCategoryId
): string | undefined {
  return (
    CATEGORY_IMAGE_MAP[categoryId]?.isolatedHorizontalSrc ||
    CATEGORY_IMAGE_MAP[categoryId]?.isolatedSrc
  );
}
