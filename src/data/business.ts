export const RESTAURANT_INFO = {
  brandName: 'EL SULTAN',
  address: 'Ūmėdžių g. 2, Vilnius',
  district: {
    lt: 'Žemieji Paneriai, Vilnius',
    en: 'Žemieji Paneriai, Vilnius',
    ru: 'Жямейи Панеряй, Вильнюс',
  },
  postalCode: '02302',
  phoneDisplay: '+370 628 23001',
  phoneHref: 'tel:+37062823001',
  email: 'elsultankebabai@gmail.com',
  emailHref: 'mailto:elsultankebabai@gmail.com',
  social: {
    instagram: 'https://www.instagram.com/el.sultan.kebabai?gwpx=MTNxMjlmOHB5Zmd2cA%3D%3D&utm_source=qr',
    tiktok: 'https://www.tiktok.com/@el.sultan.kebabai?_r=1&_t=ZS-9BchkGJfNmY',
    facebook: 'https://www.facebook.com/share/1MDydprH2Q/?mibextid=wwXIfr',
  },
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=EL+SULTAN+Umedziu+g+2+Vilnius',
  woltUrl: 'https://wolt.com/en/ltu/vilnius/restaurant/el-sultan-kebabai',
  boltUrl: 'https://food.bolt.eu/lt-LT/9-vilnius/p/133124-el-sultan-(%C5%ABm%C4%97d%C5%BEi%C5%B3-g.)',
  ratings: {
    google: { score: 4.7, count: 107 },
    bolt: { score: 4.7, count: 391 },
    wolt: { score: 9.0 },
  },
  openingHours: {
    monThu: { days: { lt: 'I–IV', en: 'Mon–Thu', ru: 'Пн–Чт' }, hours: '10:00 – 21:00' },
    friSat: { days: { lt: 'V–VI', en: 'Fri–Sat', ru: 'Пт–Сб' }, hours: '10:00 – 22:00' },
    sun: { days: { lt: 'VII', en: 'Sun', ru: 'Вс' }, hours: '10:00 – 21:00' },
  },
} as const;

export interface LunchPromotionConfig {
  enabled: boolean;
  timezone: string;
  /** ISO weekday numbers (1 = Monday ... 7 = Sunday) */
  activeDays: number[];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  /** Optional YYYY-MM-DD expiry date (inclusive in Europe/Vilnius); when passed, campaign expires cleanly */
  expiresAfterDate?: string;
  recommendedDishIds: string[];
}

export const LUNCH_PROMOTION_CONFIG: LunchPromotionConfig = {
  enabled: true,
  timezone: 'Europe/Vilnius',
  activeDays: [1, 2, 3, 4, 5],
  startHour: 11,
  startMinute: 0,
  endHour: 16,
  endMinute: 0,
  recommendedDishIds: [
    'vistienos-saslikas',
    'sultono-kebabas',
    'kebabas-lekstaje',
    'dienos-sriuba',
  ],
};

export interface VilniusClockState {
  isWindowActive: boolean;
  isExpired: boolean;
  vilniusTimeLabel: string;
  windowLabel: string;
}

const WEEKDAY_MAP: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export function getVilniusLunchState(
  now: Date = new Date(),
  config: LunchPromotionConfig = LUNCH_PROMOTION_CONFIG
): VilniusClockState {
  const windowLabel = `${String(config.startHour).padStart(2, '0')}:${String(
    config.startMinute
  ).padStart(2, '0')} – ${String(config.endHour).padStart(2, '0')}:${String(
    config.endMinute
  ).padStart(2, '0')}`;

  if (!config.enabled) {
    return { isWindowActive: false, isExpired: true, vilniusTimeLabel: '', windowLabel };
  }

  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: config.timezone,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const val = (type: string) => parts.find((p) => p.type === type)?.value || '';
    const dateStr = `${val('year')}-${val('month')}-${val('day')}`;
    const weekdayNum = WEEKDAY_MAP[val('weekday')] ?? 1;
    const hour = Number(val('hour')) % 24;
    const minute = Number(val('minute'));
    const vilniusTimeLabel = `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`;

    if (config.expiresAfterDate && dateStr > config.expiresAfterDate) {
      return { isWindowActive: false, isExpired: true, vilniusTimeLabel, windowLabel };
    }

    const totalMin = hour * 60 + minute;
    const startMin = config.startHour * 60 + config.startMinute;
    const endMin = config.endHour * 60 + config.endMinute;
    const inHours = totalMin >= startMin && totalMin < endMin;
    const inDays = config.activeDays.includes(weekdayNum);

    return {
      isWindowActive: inDays && inHours,
      isExpired: false,
      vilniusTimeLabel,
      windowLabel,
    };
  } catch {
    return { isWindowActive: false, isExpired: false, vilniusTimeLabel: '', windowLabel };
  }
}
