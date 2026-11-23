import { Locale } from '../data/menu';

export interface TranslationBundle {
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    menu: string;
    chooseForMe: string;
    visit: string;
    order: string;
    directionsShort: string;
    openMenuLabel: string;
    languageLabel: string;
    yourPlace: string;
    beyondUsual: string;
    ourPlace: string;
  };
  hero: {
    locationTag: string;
    tableEyebrow: string;
    headline: string;
    headlineLine1: string;
    headlineLine2: string;
    subline: string;
    ctaMenu: string;
    ctaChoose: string;
    ctaCall: string;
    scrollHint: string;
    featuredCaption: string;
    selectDishLabel: string;
    pickupOnlyTag: string;
    deliveryAvailableTag: string;
    experiences: {
      familiar: { index: string; kicker: string; shortLabel: string };
      discovery: { index: string; kicker: string; shortLabel: string };
      shared: { index: string; kicker: string; shortLabel: string };
    };
    subtleCharcoalNudge: string;
    scrollCampaignKicker: string;
    scrollCampaignTitle: string;
    scrollCampaignLine1: string;
    scrollCampaignLine2: string;
    scrollCampaignSub: string;
    scrollCampaignCtaGrill: string;
    scrollCampaignCtaChoose: string;
    tableAltDesktop: string;
    tableAltOverhead: string;
    tableAltMobile: string;
  };
  chooseForMe: {
    eyebrow: string;
    headline: string;
    intro: string;
    stepOf: string;
    q1Title: string;
    q1Options: {
      up_to_8: string;
      up_to_10: string;
      up_to_12: string;
      flexible: string;
    };
    q2Title: string;
    q2Options: {
      quick_bite: string;
      proper_lunch: string;
      with_friends: string;
    };
    q3Title: string;
    q3Options: {
      chicken: string;
      beef: string;
      vegetarian: string;
      vegan: string;
      surprise: string;
    };
    q4Title: string;
    q4Options: {
      dine_in: string;
      pickup: string;
      delivery: string;
    };
    skipBtn: string;
    backBtn: string;
    skipTag: string;
    editFiltersLabel: string;
    resultEyebrow: string;
    reasons: {
      charcoal_lunch: string;
      charcoal_friends: string;
      quick_kebab: string;
      vegetarian_choice: string;
      vegan_choice: string;
      budget_fit: string;
      friends_feast: string;
    };
    ingredientsLabel: string;
    allergensLabel: string;
    channelsLabel: string;
    alternativesTitle: string;
    charcoalDiscoveryTitle: string;
    addToCallListBtn: string;
    addedToCallListBtn: string;
    exploreMenuBtn: string;
    chooseAgainBtn: string;
    callToOrder: string;
    noMatchTitle: string;
    noMatchBody: string;
    relaxBudgetBtn: string;
    relaxDeliveryBtn: string;
    relaxDietaryBtn: string;
  };
  menuSection: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    allCategories: string;
    searchPlaceholder: string;
    filters: {
      all: string;
      bestsellers: string;
      vegetarian: string;
      noBread: string;
      dineInOnly: string;
    };
    charcoalSpotlightTitle: string;
    charcoalSpotlightBody: string;
    variantsLabel: string;
    ingredientsLabel: string;
    allergensLabel: string;
    channelsLabel: string;
    showDetails: string;
    hideDetails: string;
    emptyState: string;
    resetFilters: string;
    fromPrice: string;
    explorerModeLabel: string;
    listModeLabel: string;
    prevDish: string;
    nextDish: string;
    completeMealTitle: string;
    beyondUsualLabel: string;
    compareCharcoalCta: string;
    addToCallList: string;
    addedToCallList: string;
    callListToggle: string;
    callListTitle: string;
    callListNotice: string;
    callListCopy: string;
    callListCopied: string;
    callListClear: string;
    callListCallNow: string;
    totalLabel: string;
    dineInOnlyBadge: string;
    suggestedExtrasLabel: string;
    qtyLabel: string;
    unitTotalLabel: string;
    platformPriceNote: string;
    reviewsForDishLabel: string;
    textOnlyNotice: string;
  };
  channels: {
    dine_in: string;
    phone: string;
    wolt: string;
    bolt: string;
  };
  beyondUsual: {
    lunchActiveEyebrow: string;
    lunchScheduleEyebrow: string;
    lunchHeadline: string;
    lunchSubActive: string;
    lunchSubSchedule: string;
    lunchDishesTitle: string;
    lunchTimeLabel: string;
    eyebrow: string;
    headline: string;
    lead: string;
    steps: Array<{
      index: string;
      title: string;
      body: string;
      dishHighlight?: string;
    }>;
    ctaGrill: string;
    ctaVisit: string;
    dineInOnlyBadge: string;
  };
  ourPlace: {
    usualEyebrow: string;
    usualHeadline: string;
    usualBody: string;
    usualCta: string;
    placeEyebrow: string;
    placeHeadline: string;
    placeParagraphs: string[];
    placeDetails: Array<{ label: string; value: string }>;
    reviewsEyebrow: string;
    reviewsHeadline: string;
    reviewsNote: string;
    highlights: Array<{ title: string; detail: string; source: string }>;
    googleLinkLabel: string;
  };
  ordering: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    cards: {
      dineInTitle: string;
      dineInDesc: string;
      dineInAction: string;
      phoneTitle: string;
      phoneDesc: string;
      phoneAction: string;
      woltTitle: string;
      woltDesc: string;
      woltAction: string;
      boltTitle: string;
      boltDesc: string;
      boltAction: string;
    };
    platformNote: string;
  };
  location: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    directionsBtn: string;
    callBtn: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Array<{ q: string; a: string }>;
  };
  orderModal: {
    title: string;
    subtitle: string;
    charcoalWarning: string;
    close: string;
  };
  footer: {
    tagline: string;
    privacyLink: string;
    rights: string;
  };
  privacyModal: {
    title: string;
    body: string[];
    close: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationBundle> = {
  lt: {
    seo: {
      title: 'EL SULTAN — Kebabai ir patiekalai ant žarijų | Vilnius',
      description:
        'EL SULTAN Vilniuje (Ūmėdžių g. 2). Švieži kebabai lavaše, brandintos jautienos ir vištienos šašlikai ant žarijų, picos, valgyti vietoje ir užsakymai telefonu.',
      ogTitle: 'EL SULTAN — Čia Tavo Vieta | Vilnius',
      ogDescription:
        'Kebabai, šašlikai ant žarijų ir rami pietų pertrauka. Užsukite į EL SULTAN Vilniuje (Ūmėdžių g. 2).',
    },
    nav: {
      menu: 'Meniu',
      chooseForMe: 'Išrink man',
      visit: 'Atvyk',
      order: 'Užsakyti',
      directionsShort: 'Maršrutas',
      openMenuLabel: 'Atidaryti navigaciją',
      languageLabel: 'Kalba',
      yourPlace: 'Čia tavo vieta',
      beyondUsual: 'Ant žarijų',
      ourPlace: 'Mūsų vieta',
    },
    hero: {
      locationTag: 'Žemieji Paneriai, Vilnius',
      tableEyebrow: '01 · Tavo stalas restorane',
      headline: 'ČIA TAVO VIETA.',
      headlineLine1: 'ČIA TAVO',
      headlineLine2: 'VIETA.',
      subline: 'Kebabai. Šašlikai ant žarijų. Akimirka sau.',
      ctaMenu: 'Atrask meniu',
      ctaChoose: 'Išrink man',
      ctaCall: 'Užsakyti atsiėmimui',
      scrollHint: 'Slinkite prie stalo',
      featuredCaption: 'Ūmėdžių g. 2 · Vilnius',
      selectDishLabel: 'Pasirinkite patiekalą ant stalo',
      pickupOnlyTag: 'Restorane arba telefonu atsiėmimui',
      deliveryAvailableTag: 'Restorane · Telefonu · Wolt · Bolt Food',
      experiences: {
        familiar: { index: '01', kicker: 'Pažįstamas skonis', shortLabel: 'Kebabas' },
        discovery: { index: '02', kicker: 'Atradimas ant žarijų', shortLabel: 'Ant žarijų' },
        shared: { index: '03', kicker: 'Dalijimosi akimirka', shortLabel: 'Pica' },
      },
      subtleCharcoalNudge: 'Norisi atrasti ką nors nuo žarijų?',
      scrollCampaignKicker: '02 · Atradimas ant žarijų',
      scrollCampaignTitle: 'TAVO KEBABAS NESUPYKS.',
      scrollCampaignLine1: 'TAVO KEBABAS',
      scrollCampaignLine2: 'NESUPYKS.',
      scrollCampaignSub:
        'Įprastas kebabas lavaše visada liks klasika. Bet kai prisėdi prie stalo — paragauk brandintos jautienos nuo tikrų žarijų.',
      scrollCampaignCtaGrill: 'Žiūrėti grilio patiekalus',
      scrollCampaignCtaChoose: 'Paleisti „Išrink man“',
      tableAltDesktop:
        'EL SULTAN juodas valgomasis stalas su bordo kėdėmis, kebabu lavaše, ant žarijų keptu jautienos šašliku ir kebabo pica',
      tableAltOverhead:
        'EL SULTAN stalo vaizdas iš viršaus — centre karštas brandintos jautienos šašlikas ant žarijų su kebabu ir pica',
      tableAltMobile:
        'EL SULTAN stalas Vilniuje — šviežias kebabas lavaše, jautienos šašlikas ant žarijų ir pica',
    },
    chooseForMe: {
      eyebrow: '02 · Asmeninis pasirinkimas',
      headline: 'IŠRINK MAN.',
      intro:
        'Keturi trumpi filtrai — kiekvieną žingsnį galite praleisti arba koreguoti vėliau. Parinksime tikrą patiekalą pagal jūsų biudžetą, laiką ir skonį.',
      stepOf: 'Klausimas',
      q1Title: 'Koks jūsų biudžetas?',
      q1Options: {
        up_to_8: 'Iki €8.00',
        up_to_10: 'Iki €10.00',
        up_to_12: 'Iki €12.00',
        flexible: 'Nesvarbu',
      },
      q2Title: 'Kokia šiandien proga?',
      q2Options: {
        quick_bite: 'Greitas užkandis',
        proper_lunch: 'Ramūs pietūs prie stalo',
        with_friends: 'Su draugais ar šeima',
      },
      q3Title: 'Ko labiausiai norisi?',
      q3Options: {
        chicken: 'Vištiena',
        beef: 'Jautiena',
        vegetarian: 'Vegetariška',
        vegan: 'Veganiška',
        surprise: 'Nustebinkite',
      },
      q4Title: 'Kaip planuojate valgyti?',
      q4Options: {
        dine_in: 'Restorane vietoje',
        pickup: 'Telefonu atsiėmimui',
        delivery: 'Pristatymas (Wolt / Bolt)',
      },
      skipBtn: 'Praleisti',
      backBtn: 'Atgal',
      skipTag: 'Praleista',
      editFiltersLabel: 'Keisti pasirinkimus tiesiogiai:',
      resultEyebrow: 'Tikslus jūsų derinys',
      reasons: {
        charcoal_lunch:
          'Ramiems pietums restorane ar atsiėmimui šašlikas nuo tikrų žarijų suteiks tikrą vidurdienio pertraukos pojūtį.',
        charcoal_friends:
          'Susėdus su draugais geriausiai tinka ant žarijų keptos lėkštės su ryžiais, salotomis ir šiltu lavašu.',
        quick_kebab:
          'Greitam ir patikimam sustojimui — mūsų populiariausias šviežiai susuktas kebabas lavaše.',
        vegetarian_choice:
          'Šviežios daržovės, traškūs kopūstai ar vegetariška pica be mėsos pagal jūsų nurodytą biudžetą.',
        vegan_choice:
          'Augalinis pasirinkimas su šviežiomis daržovėmis ir veganišku padažu be pieno produktų.',
        budget_fit:
          'Tiksliausiai atitinka jūsų nurodytą kainos ribą ir palieka vietos gėrimui ar užkandžiui.',
        friends_feast:
          'Didelė porcija ar pica dalijimuisi prie bendro stalo arba greitam paėmimui.',
      },
      ingredientsLabel: 'Sudėtis',
      allergensLabel: 'Alergenai',
      channelsLabel: 'Kaip užsisakyti',
      alternativesTitle: 'Kiti tinkantys variantai',
      charcoalDiscoveryTitle: 'Norite išbandyti ką nors nuo žarijų?',
      addToCallListBtn: '+ Pridėti į atsiėmimo sąrašą',
      addedToCallListBtn: '✓ Pridėta prie sąrašo',
      exploreMenuBtn: 'Rodyti meniu',
      chooseAgainBtn: 'Pradėti iš naujo',
      callToOrder: 'Skambinti +370 628 23001',
      noMatchTitle: 'Pagal šį derinį tikslaus patiekalo nėra.',
      noMatchBody:
        'Patiekalai ant žarijų ir picos netiekiami per programėles, arba pasirinkta kainos riba siauresnė nei tam tikrų lėkščių kaina.',
      relaxBudgetBtn: 'Rodyti virš biudžeto',
      relaxDeliveryBtn: 'Leisti atsiėmimą restorane',
      relaxDietaryBtn: 'Rodyti visus skonius',
    },
    menuSection: {
      eyebrow: '03 · Visas restorano meniu',
      headline: 'MENIU.',
      subcopy:
        'Klasikiniai kebabai lavaše, ant tikrų žarijų kepti šašlikai, picos ir užkandžiai. Kainos nurodytos užsakant restorane ar telefonu.',
      allCategories: 'Visi',
      searchPlaceholder: 'Ieškoti patiekalo ar ingrediento...',
      filters: {
        all: 'Visi',
        bestsellers: 'Perkamiausi ★',
        vegetarian: 'Vegetariška',
        noBread: 'Be lavašo',
        dineInOnly: 'Ant žarijų / Tik vietoje',
      },
      charcoalSpotlightTitle: 'Mūsų virtuvės stiprybė: ant žarijų',
      charcoalSpotlightBody:
        'Šašlikai, liulia kebabai ir vištiena kepami ant tikros medžio anglių kaitros — tik valgant vietoje arba užsakius telefonu atsiėmimui.',
      variantsLabel: 'Variantas ir kaina',
      ingredientsLabel: 'Ingredientai',
      allergensLabel: 'Alergenai',
      channelsLabel: 'Užsakymo būdai',
      showDetails: 'Sudėtis ir atsiėmimas',
      hideDetails: 'Slėpti detales',
      emptyState: 'Pagal šiuos filtrus patiekalų nerasta.',
      resetFilters: 'Atstatyti filtrus',
      fromPrice: 'nuo',
      explorerModeLabel: 'Apžvalga',
      listModeLabel: 'Visas sąrašas',
      prevDish: 'Ankstesnis',
      nextDish: 'Kitas',
      completeMealTitle: 'Papildykite užsakymą',
      beyondUsualLabel: 'Daugiau nei įprastai · ant žarijų',
      compareCharcoalCta: 'Žiūrėti vietoj kebabo',
      addToCallList: '+ Į sąrašą',
      addedToCallList: '✓ Sąraše',
      callListToggle: 'Atsiėmimo sąrašas',
      callListTitle: 'Sąrašas skambučiui atsiėmimui',
      callListNotice:
        'Tai nėra mokėjimas internetu — paruoškite savo patiekalų sąrašą ir padiktuokite jį paskambinę į virtuvę.',
      callListCopy: 'Kopijuoti sąrašą',
      callListCopied: 'Nukopijuota',
      callListClear: 'Išvalyti',
      callListCallNow: 'Skambinti ir užsakyti',
      totalLabel: 'Orientacinė suma restorane',
      dineInOnlyBadge: 'Tik restorane ir telefonu',
      suggestedExtrasLabel: 'Papildomai (pasirinktinai)',
      qtyLabel: 'Kiekis',
      unitTotalLabel: 'Vnt. su priedais',
      platformPriceNote: 'Wolt / Bolt Food kainos programėlėse gali skirtis nuo restorano kainų.',
      reviewsForDishLabel: 'Svečių atsiliepimai Google',
      textOnlyNotice: 'Patiekalas pateikiamas tekstiniu formatu — be individualios nuotraukos.',
    },
    channels: {
      dine_in: 'Restorane (Ūmėdžių g. 2)',
      phone: 'Telefonu atsiėmimui',
      wolt: 'Wolt',
      bolt: 'Bolt Food',
    },
    beyondUsual: {
      lunchActiveEyebrow: '04 · Pietų pertrauka Vilniuje vyksta dabar',
      lunchScheduleEyebrow: '04 · Darbo dienų pietų laikas (I–V · 11:00–16:00)',
      lunchHeadline: 'DARBŲ BUS IR RYTOJ. PIETŪS – DABAR.',
      lunchSubActive:
        'Dabar Vilniuje tinkamiausias metas tikrai pertraukai. Užsukite prie stalo arba paskambinkite iš anksto — šašlikai ir kebabai paruošiami šviežiai.',
      lunchSubSchedule:
        'Tarp 11:00 ir 16:00 darbo dienomis salėje ramiau nei vakarais — užsukite ramiai pavalgyti prie stalo be skubėjimo.',
      lunchDishesTitle: 'Rekomenduojami pietų patiekalai',
      lunchTimeLabel: 'Vilniaus laikas',
      eyebrow: 'Nuo marinuoto iešmo iki lėkštės',
      headline: 'TAVO KEBABAS NESUPYKS.',
      lead: 'Įprastas kebabas lavaše visada liks klasika. Bet kai turite laiko prisėsti — išbandykite patiekalus nuo tikrų medžio anglių žarijų.',
      steps: [
        {
          index: '01',
          title: 'Šviežias paruošimas',
          body: 'Traškios daržovės, petražolės, marinuoti raudonieji kopūstai ir atrinkta mėsa kiekvieną dieną ruošiama vietoje.',
        },
        {
          index: '02',
          title: 'Iešmai prieš kaitrą',
          body: 'Brandinta jautienos nugarinė, vištienos gabaliukai ir prieskoniuotas liulia kebabas suveriami ant plieninių iešmų.',
        },
        {
          index: '03',
          title: 'Kepimas ant žarijų',
          body: 'Tikra medžio anglių kaitra užrakina sultis viduje ir suteikia švarų dūmo aromatą be jokios skubos.',
        },
        {
          index: '04',
          title: 'Karštas prisilietimas',
          body: 'Lengvai apskrudęs paviršius, keptas pomidoras ir šviežiai apkeptas lavašas tiesiai iš griliaus zonos.',
        },
        {
          index: '05',
          title: 'Lėkštė ant stalo',
          body: 'Patiekiame su biriais ryžiais arba bulvytėmis fri ir traškiomis daržovėmis — skirta valgyti vietoje arba pasiimti šiltai.',
          dishHighlight: 'Brandintos jautienos nugarinės šašlikas · €16.00',
        },
      ],
      ctaGrill: 'Žiūrėti grilio meniu',
      ctaVisit: 'Atvykti prie stalo',
      dineInOnlyBadge: 'Tik restorane ir telefonu',
    },
    ourPlace: {
      usualEyebrow: '05 · Atmosfera ir svečiai',
      usualHeadline: 'JAUKI SALĖ ŽEMUOSIUOSE PANERIUOSE.',
      usualBody:
        'Lenktos juodos kėdės su bordo pagalvėlėmis, šiltos medinių tašelių sienos ir pažįstamas kvapas. Užsukite vienam kebabui, pietums su kolegomis ar vakarui su šeima.',
      usualCta: 'Išbandyti grilio meniu',
      placeEyebrow: 'Tikra erdvė · Ūmėdžių g. 2',
      placeHeadline: 'PAŽĮSTAMA VIETA BE FORMALUMŲ.',
      placeParagraphs: [
        'EL SULTAN įsikūręs Vilniuje, Ūmėdžių g. 2. Čia nereikia ypatingos progos, kad ramiai prisėstumėte prie šviežiai iškepto maisto.',
        'Greitas paėmimas prieš kelią arba lėtesnė vakarienė su šašlikais ant žarijų — virtuvė ruošia abiem ritmais.',
      ],
      placeDetails: [
        { label: 'Virtuvė', value: 'Kebabai, šašlikai ant žarijų, picos' },
        { label: 'Valgomasis', value: 'Vieta greitiems pietums ir kompanijoms' },
        { label: 'Užsakymai', value: 'Vietoje, +370 628 23001, Wolt / Bolt Food' },
      ],
      reviewsEyebrow: 'Lankytojų įspūdžiai',
      reviewsHeadline: 'KĄ VERTINA SVEČIAI.',
      reviewsNote: 'Apibendrintos temos iš viešų Google atsiliepimų apie EL SULTAN (Ūmėdžių g. 2).',
      highlights: [
        {
          title: 'Šiltas ir greitas priėmimas',
          detail:
            'Lankytojai dažnai išskiria malonų bendravimą prie prekystalio ir tai, kad nereikia ilgai laukti.',
          source: 'Google atsiliepimų tema',
        },
        {
          title: 'Švieži produktai ir gausios porcijos',
          detail:
            'Vertinamos traškios daržovės, naminiai padažai ir sotus kebabų bei lėkščių dydis.',
          source: 'Google atsiliepimų tema',
        },
        {
          title: 'Ant žarijų keptas pasirinkimas',
          detail:
            'Prisėdę restorane svečiai rekomenduoja atrasti jautienos, vištienos šašlikus ir liulia kebabą.',
          source: 'Google atsiliepimų tema',
        },
      ],
      googleLinkLabel: 'Peržiūrėti atsiliepimus Google Maps',
    },
    ordering: {
      eyebrow: '06 · Užsakymas ir atvykimas',
      headline: 'TAVO MAISTAS. TAVO BŪDAS.',
      subcopy:
        'Pasirinkite tai, kas patogiausia dabar. Šašlikai ant žarijų ir picos ruošiami tik valgant restorane arba užsakant telefonu.',
      cards: {
        dineInTitle: 'Valgyti vietoje',
        dineInDesc: 'Visas meniu, įskaitant karštus šašlikus tiesiai nuo žarijų ir picas. Ūmėdžių g. 2.',
        dineInAction: 'Rasti kelią',
        phoneTitle: 'Užsakyti telefonu',
        phoneDesc: 'Paskambinkite iš anksto ir atsiimkite karštą maistą be laukimo eilėje.',
        phoneAction: 'Skambinti +370 628 23001',
        woltTitle: 'Wolt pristatymas',
        woltDesc: 'Kebabai lavaše, lėkštės, užkandžiai ir gėrimai į namus ar biurą.',
        woltAction: 'Atidaryti Wolt',
        boltTitle: 'Bolt Food pristatymas',
        boltDesc: 'Populiariausi kebabai, užkandžiai ir gėrimai per Bolt Food.',
        boltAction: 'Atidaryti Bolt Food',
      },
      platformNote:
        'Patiekalai ant žarijų, picos ir sriubos per Wolt bei Bolt Food neužsakomi — juos ruošiame vietoje ir atsiėmimui telefonu. Pristatymo programėlių kainos gali skirtis nuo kainų restorane.',
    },
    location: {
      eyebrow: 'Atvykite',
      headline: 'TAVO VIETA LAUKIA.',
      subcopy: 'Ūmėdžių g. 2, Žemieji Paneriai, Vilnius.',
      addressLabel: 'Adresas',
      hoursLabel: 'Darbo laikas',
      phoneLabel: 'Telefonas užsakymams',
      directionsBtn: 'Nuorodos Google Maps',
      callBtn: 'Skambinti +370 628 23001',
    },
    faq: {
      eyebrow: '07 · Atsakymai prieš atvykstant',
      title: 'Dažni klausimai',
      lead: 'Trumpai apie vegetariškus patiekalus, alergenus, užsakymus išsinešimui ir atsiskaitymą vietoje.',
      items: [
        {
          q: 'Ar yra vegetariškų variantų?',
          a: 'Taip. Vegetaras kebabas, bulvytės fri, spring rolls. Visą meniu su kainomis rasite čia, svetainėje.',
        },
        {
          q: 'Ar žymite alergenus?',
          a: 'Vietoje paklauskite virėjo dėl konkretaus patiekalo. Pasakysime tiksliai, kas jame yra. Arba paskambinkite +370 628 23001 prieš atvykdami.',
        },
        {
          q: 'Ar galima užsisakyti išsinešimui?',
          a: 'Taip, paskambinkite +370 628 23001 ir paruošime, kol atvažiuosite. Atsiimkite Ūmėdžių g. 2.',
        },
        {
          q: 'Ar priimate grynaisiais vietoje?',
          a: 'Taip, vietoje priimame ir grynuosius, ir korteles.',
        },
      ],
    },
    orderModal: {
      title: 'Kaip norite užsisakyti?',
      subtitle: 'Pasirinkite kanalą pagal tai, ką norite valgyti.',
      charcoalWarning:
        'Šašlikai ant žarijų, picos ir sriubos ruošiami tik valgant vietoje arba užsakant telefonu +370 628 23001.',
      close: 'Uždaryti',
    },
    footer: {
      tagline: 'Čia tavo vieta. Ūmėdžių g. 2, Vilnius.',
      privacyLink: 'Privatumo informacija',
      rights: 'EL SULTAN · Vilnius, Lietuva',
    },
    privacyModal: {
      title: 'Privatumas be slapukų ir sekimo',
      body: [
        'Šioje svetainėje nenaudojami jokie reklaminiai slapukai, sekimo scenarijai ar trečiųjų šalių analitika.',
        'Šriftai ir vaizdai įkeliami tiesiogiai iš svetainės serverio be išorinių šriftų užklausų.',
        'Jūsų kalbos pasirinkimas ir laikinas atsiėmimo sąrašas laikomi tik aktyviame naršyklės lange ir neišsaugomi serveriuose. Užsakymai vykdomi vietoje, telefonu +370 628 23001 arba Wolt / Bolt Food platformose.',
      ],
      close: 'Uždaryti',
    },
  },

  en: {
    seo: {
      title: 'EL SULTAN — Kebabs & Charcoal Grill | Vilnius',
      description:
        'EL SULTAN in Vilnius (Ūmėdžių g. 2). Fresh lavash kebabs, aged beef & chicken charcoal shashliks, pizzas, dine-in and phone pickup.',
      ogTitle: 'EL SULTAN — This Is Your Place | Vilnius',
      ogDescription:
        'Kebabs. Charcoal-grilled skewers. A quiet lunch break. Visit EL SULTAN in Vilnius (Ūmėdžių g. 2).',
    },
    nav: {
      menu: 'Menu',
      chooseForMe: 'Choose for Me',
      visit: 'Visit',
      order: 'Order',
      directionsShort: 'Directions',
      openMenuLabel: 'Open navigation menu',
      languageLabel: 'Language',
      yourPlace: 'Your Place',
      beyondUsual: 'Charcoal Grill',
      ourPlace: 'Our Place',
    },
    hero: {
      locationTag: 'Žemieji Paneriai, Vilnius',
      tableEyebrow: '01 · At the Sultan’s Table',
      headline: 'THIS IS YOUR PLACE.',
      headlineLine1: 'THIS IS YOUR',
      headlineLine2: 'PLACE.',
      subline: 'Kebabs. Charcoal-grilled skewers. A moment for yourself.',
      ctaMenu: 'Explore Menu',
      ctaChoose: 'Choose for Me',
      ctaCall: 'Call for Pickup',
      scrollHint: 'Approach the table',
      featuredCaption: 'Ūmėdžių g. 2 · Vilnius',
      selectDishLabel: 'Select an experience on the table',
      pickupOnlyTag: 'Dine-in & Phone Pickup Only',
      deliveryAvailableTag: 'Dine-in · Phone Pickup · Wolt · Bolt Food',
      experiences: {
        familiar: { index: '01', kicker: 'The Familiar', shortLabel: 'Kebab' },
        discovery: { index: '02', kicker: 'The Discovery', shortLabel: 'Charcoal Grill' },
        shared: { index: '03', kicker: 'The Shared Moment', shortLabel: 'Pizza' },
      },
      subtleCharcoalNudge: 'Curious to try live charcoal today?',
      scrollCampaignKicker: '02 · The Discovery',
      scrollCampaignTitle: 'YOUR KEBAB WON’T BE OFFENDED.',
      scrollCampaignLine1: 'YOUR KEBAB WON’T',
      scrollCampaignLine2: 'BE OFFENDED.',
      scrollCampaignSub:
        'Your usual lavash wrap is always waiting. Yet when you pull up a chair here, aged beef off glowing embers changes lunch completely.',
      scrollCampaignCtaGrill: 'Explore Charcoal Grill',
      scrollCampaignCtaChoose: 'Try Choose for Me',
      tableAltDesktop:
        'EL SULTAN black dining table with burgundy seating displaying a lavash kebab wrap, charcoal-grilled beef shashlik plate, and kebab meat pizza',
      tableAltOverhead:
        'Overhead view of the EL SULTAN table bringing charcoal-grilled beef shashlik into focus alongside kebab wrap and pizza',
      tableAltMobile:
        'EL SULTAN dining table in Vilnius with signature kebab, charcoal grill skewers, and pizza',
    },
    chooseForMe: {
      eyebrow: '02 · Guided Match',
      headline: 'CHOOSE FOR ME.',
      intro:
        'Four quick filters — skip any step or adjust answers live on the result. We match real dishes from our kitchen to your budget, timing, and taste.',
      stepOf: 'Question',
      q1Title: 'What is your budget?',
      q1Options: {
        up_to_8: 'Up to €8.00',
        up_to_10: 'Up to €10.00',
        up_to_12: 'Up to €12.00',
        flexible: 'Flexible',
      },
      q2Title: 'What is the occasion?',
      q2Options: {
        quick_bite: 'Quick bite',
        proper_lunch: 'Proper sit-down lunch',
        with_friends: 'With friends or family',
      },
      q3Title: 'What do you prefer today?',
      q3Options: {
        chicken: 'Chicken',
        beef: 'Beef',
        vegetarian: 'Vegetarian',
        vegan: 'Vegan',
        surprise: 'Surprise me',
      },
      q4Title: 'How do you plan to order?',
      q4Options: {
        dine_in: 'Dine in at the restaurant',
        pickup: 'Phone pickup',
        delivery: 'Delivery (Wolt / Bolt)',
      },
      skipBtn: 'Skip',
      backBtn: 'Back',
      skipTag: 'Any',
      editFiltersLabel: 'Adjust any filter inline:',
      resultEyebrow: 'Matched for your order',
      reasons: {
        charcoal_lunch:
          'When you have time for a real break in-house or by pickup, live charcoal skewers bring full grilled depth.',
        charcoal_friends:
          'Dining together calls for shared charcoal platters with basmati rice, fresh salad, and warm flatbread.',
        quick_kebab:
          'Built for speed without cutting corners — our bestselling fresh lavash wrap keeps every bite crisp.',
        vegetarian_choice:
          'Crisp garden vegetables, fresh herbs, or meat-free pizza matched cleanly inside your budget.',
        vegan_choice:
          'Prepared plant-forward with crisp vegetables and dairy-free sauce upon request.',
        budget_fit:
          'Hits your selected budget ceiling cleanly while leaving room for a cold drink or sauce.',
        friends_feast:
          'Generous baked pizza or large platter built to share around the table or pick up hot.',
      },
      ingredientsLabel: 'Ingredients',
      allergensLabel: 'Allergens',
      channelsLabel: 'Available via',
      alternativesTitle: 'Other matching options',
      charcoalDiscoveryTitle: 'Feel like trying live charcoal instead?',
      addToCallListBtn: '+ Add to Pickup List',
      addedToCallListBtn: '✓ In Pickup List',
      exploreMenuBtn: 'Open in Menu',
      chooseAgainBtn: 'Start Over',
      callToOrder: 'Call +370 628 23001',
      noMatchTitle: 'Nothing fits every constraint simultaneously.',
      noMatchBody:
        'Charcoal grill items and pizza are unavailable on delivery apps, or your current price ceiling excludes this combination.',
      relaxBudgetBtn: 'Allow higher budget',
      relaxDeliveryBtn: 'Switch to pickup / dine-in',
      relaxDietaryBtn: 'Show all preferences',
    },
    menuSection: {
      eyebrow: '03 · Complete Kitchen Ledger',
      headline: 'MENU.',
      subcopy:
        'Bestselling lavash kebabs, live charcoal shashliks, baked pizzas, plates, and sides. Listed prices apply for dine-in and phone pickup.',
      allCategories: 'All',
      searchPlaceholder: 'Search dish or ingredient...',
      filters: {
        all: 'All',
        bestsellers: 'Most Ordered ★',
        vegetarian: 'Vegetarian',
        noBread: 'No Lavash',
        dineInOnly: 'Charcoal / Dine-in',
      },
      charcoalSpotlightTitle: 'From our glowing embers',
      charcoalSpotlightBody:
        'Shashliks, minced beef lula kebabs, and chicken quarters are roasted over real wood charcoal — served dine-in or hot via phone pickup.',
      variantsLabel: 'Select option',
      ingredientsLabel: 'Ingredients',
      allergensLabel: 'Allergens',
      channelsLabel: 'Ordering options',
      showDetails: 'Ingredients & order',
      hideDetails: 'Hide details',
      emptyState: 'No dishes match those filters.',
      resetFilters: 'Reset filters',
      fromPrice: 'from',
      explorerModeLabel: 'Featured Explorer',
      listModeLabel: 'Full List',
      prevDish: 'Previous',
      nextDish: 'Next',
      completeMealTitle: 'Complete your meal',
      beyondUsualLabel: 'Beyond your usual · Charcoal alternative',
      compareCharcoalCta: 'View charcoal alternative',
      addToCallList: '+ Add',
      addedToCallList: '✓ Added',
      callListToggle: 'Pickup Call List',
      callListTitle: 'Pickup Phone Call List',
      callListNotice:
        'Not an online checkout — assemble your items cleanly, then call our kitchen directly to order for pickup.',
      callListCopy: 'Copy list',
      callListCopied: 'Copied',
      callListClear: 'Clear',
      callListCallNow: 'Call to Place Order',
      totalLabel: 'Estimated dine-in / pickup total',
      dineInOnlyBadge: 'Dine-in & Phone Only',
      suggestedExtrasLabel: 'Optional extras',
      qtyLabel: 'Qty',
      unitTotalLabel: 'Each with extras',
      platformPriceNote: 'Wolt / Bolt Food platform prices may differ from restaurant dine-in & pickup prices.',
      reviewsForDishLabel: 'Verified Google reviews',
      textOnlyNotice: 'Presented in clean text-only specification — no separate individual photograph is published.',
    },
    channels: {
      dine_in: 'Dine in (Ūmėdžių g. 2)',
      phone: 'Phone pickup',
      wolt: 'Wolt',
      bolt: 'Bolt Food',
    },
    beyondUsual: {
      lunchActiveEyebrow: '04 · Weekday Lunch Break Is Open Now',
      lunchScheduleEyebrow: '04 · Weekday Lunch Hours (Mon–Fri · 11:00–16:00)',
      lunchHeadline: 'THERE’S WORK TOMORROW. LUNCH IS NOW.',
      lunchSubActive:
        'It’s quieter in Vilnius between 11:00 and 16:00 — step in for a real table seat or call ahead so your charcoal plate is ready on arrival.',
      lunchSubSchedule:
        'Between 11:00 and 16:00 on weekdays the dining room moves at a calmer pace — ideal for stepping away from work for warm charcoal skewers or a wrap.',
      lunchDishesTitle: 'Popular midday choices',
      lunchTimeLabel: 'Vilnius time',
      eyebrow: 'From raw skewer to table plate',
      headline: 'YOUR KEBAB WON’T BE OFFENDED.',
      lead: 'Your regular wrap is always waiting. Yet once you try skewers lifted straight off glowing wood charcoal, lunch takes on a whole different pace.',
      steps: [
        {
          index: '01',
          title: 'Daily preparation',
          body: 'Freshly sliced cabbage, parsley, tomatoes, and marinated meats prepared ahead of each service.',
        },
        {
          index: '02',
          title: 'Onto steel skewers',
          body: 'Aged beef tenderloin, chicken breast pieces, and hand-spiced beef lula threaded cleanly.',
        },
        {
          index: '03',
          title: 'Glowing charcoal heat',
          body: 'Cooked slowly over live wood embers so the surface chars while every cut stays juicy.',
        },
        {
          index: '04',
          title: 'Straight from the grill',
          body: 'Natural wood-smoke aroma, blistered tomato, and toasted flatbread lifted hot off the grates.',
        },
        {
          index: '05',
          title: 'Plated for your break',
          body: 'Served with basmati rice or crispy fries and crisp garden greens — dine-in or phone pickup.',
          dishHighlight: 'Aged Beef Tenderloin Charcoal Shashlik · €16.00',
        },
      ],
      ctaGrill: 'Explore Charcoal Grill',
      ctaVisit: 'Visit the Dining Room',
      dineInOnlyBadge: 'Dine-in & Phone Pickup Only',
    },
    ourPlace: {
      usualEyebrow: '05 · Dining Room & Guests',
      usualHeadline: 'CURVED CHAIRS. TIMBER SLATS. WARM TABLE.',
      usualBody:
        'Black curved chairs with burgundy cushions, vertical timber walls, and an open counter on Ūmėdžių g. 2. Come alone on lunch break or gather around charcoal platters after hours.',
      usualCta: 'See Charcoal Dishes',
      placeEyebrow: 'Real Space · Ūmėdžių g. 2, Vilnius',
      placeHeadline: 'A NEIGHBORHOOD ROOM WITHOUT PRETENSE.',
      placeParagraphs: [
        'EL SULTAN sits in Žemieji Paneriai with straightforward access, honest cooking, and seating built for an unhurried meal.',
        'Whether grabbing a hot lavash wrap before heading across Vilnius or ordering skewers over live coals, both rhythms belong here.',
      ],
      placeDetails: [
        { label: 'Kitchen', value: 'Kebabs, Charcoal Grill, Pizza' },
        { label: 'Seating', value: 'Solo weekday lunches & small groups' },
        { label: 'Ways to Order', value: 'In-house, +370 628 23001, Wolt & Bolt' },
      ],
      reviewsEyebrow: 'Guest Themes',
      reviewsHeadline: 'WHAT REGULARS VALUE.',
      reviewsNote: 'Verified recurring themes from public Google Reviews for EL SULTAN (Ūmėdžių g. 2).',
      highlights: [
        {
          title: 'Welcoming counter service',
          detail:
            'Visitors consistently mention friendly hospitality at the counter and steady, quick turnaround.',
          source: 'Google Reviews theme',
        },
        {
          title: 'Crisp produce & hearty portions',
          detail:
            'Guests note fresh vegetables, balanced house sauces, and generous sizing on both wraps and plates.',
          source: 'Google Reviews theme',
        },
        {
          title: 'Worthwhile charcoal grill',
          detail:
            'Dine-in reviewers frequently urge first-timers to explore the beef shashlik and chicken skewers.',
          source: 'Google Reviews theme',
        },
      ],
      googleLinkLabel: 'View all reviews on Google Maps',
    },
    ordering: {
      eyebrow: '06 · Visit & Order',
      headline: 'YOUR FOOD. YOUR WAY.',
      subcopy:
        'Choose the channel that matches what you want to eat. Charcoal grill skewers and baked pizzas are prepared exclusively in-house or by phone pickup.',
      cards: {
        dineInTitle: 'Dine In',
        dineInDesc: 'Full menu including live-fire shashliks and fresh pizzas at Ūmėdžių g. 2.',
        dineInAction: 'Get Directions',
        phoneTitle: 'Phone Pickup',
        phoneDesc: 'Call ahead and pick up wraps, pizza, or charcoal grill fresh without waiting in line.',
        phoneAction: 'Call +370 628 23001',
        woltTitle: 'Wolt Delivery',
        woltDesc: 'Lavash kebabs, plates, crispy sides, and chilled drinks across Vilnius.',
        woltAction: 'Open Wolt',
        boltTitle: 'Bolt Food Delivery',
        boltDesc: 'Popular kebabs, snacks, and cold drinks through Bolt Food.',
        boltAction: 'Open Bolt Food',
      },
      platformNote:
        'Charcoal-grilled dishes, pizzas, and soups are not offered on delivery apps — order them dining in or by calling +370 628 23001. Delivery-platform prices may differ from restaurant prices.',
    },
    location: {
      eyebrow: 'Come by',
      headline: 'YOUR PLACE IS WAITING.',
      subcopy: 'Ūmėdžių g. 2, Žemieji Paneriai, Vilnius.',
      addressLabel: 'Address',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Order Phone',
      directionsBtn: 'Directions in Google Maps',
      callBtn: 'Call +370 628 23001',
    },
    faq: {
      eyebrow: '07 · Practical Answers',
      title: 'FAQ',
      lead: 'Quick answers on vegetarian choices, allergen enquiries, takeaway pickup, and payment on site.',
      items: [
        {
          q: 'Are there vegetarian options?',
          a: 'Yes. Vegetarian kebab, fries, spring rolls. The full menu with prices is right here on the site.',
        },
        {
          q: 'Do you label allergens?',
          a: "In-store, ask the cook about any specific dish. We'll tell you exactly what's in it. Or call +370 628 23001 before you come.",
        },
        {
          q: 'Can I order takeaway?',
          a: "Yes, call +370 628 23001 and we'll have it ready by the time you arrive. Pick up at Ūmėdžių g. 2.",
        },
        {
          q: 'Do you accept cash on site?',
          a: 'Yes, we accept both cash and cards in-store.',
        },
      ],
    },
    orderModal: {
      title: 'How would you like to order?',
      subtitle: 'Pick the right channel for what you want today.',
      charcoalWarning:
        'Charcoal grill platters, pizzas, and soups are available exclusively dine-in or via phone pickup (+370 628 23001).',
      close: 'Close',
    },
    footer: {
      tagline: 'This is your place. Ūmėdžių g. 2, Vilnius.',
      privacyLink: 'Privacy Notice',
      rights: 'EL SULTAN · Vilnius, Lithuania',
    },
    privacyModal: {
      title: 'Zero-Tracking Privacy Notice',
      body: [
        'This website uses no advertising cookies, behavioral analytics, or third-party tracking scripts.',
        'All typography and food photography load directly from the application without external font CDN pings.',
        'Language choices and temporary pickup list selections stay strictly in memory for your current view. Orders are fulfilled in person, by phone at +370 628 23001, or via Wolt / Bolt Food under their privacy terms.',
      ],
      close: 'Close',
    },
  },

  ru: {
    seo: {
      title: 'EL SULTAN — Кебабы и блюда на углях | Вильнюс',
      description:
        'EL SULTAN в Вильнюсе (Ūmėdžių g. 2). Свежие кебабы в лаваше, шашлык из выдержанной говядины и курицы на углях, пицца и заказ по телефону.',
      ogTitle: 'EL SULTAN — Это Твоё Место | Вильнюс',
      ogDescription:
        'Кебабы. Шашлык на углях. Спокойный обеденный перерыв. Заходите в EL SULTAN в Вильнюсе (Ūmėdžių g. 2).',
    },
    nav: {
      menu: 'Меню',
      chooseForMe: 'Помоги выбрать',
      visit: 'Как добраться',
      order: 'Заказать',
      directionsShort: 'Маршрут',
      openMenuLabel: 'Открыть навигацию',
      languageLabel: 'Язык',
      yourPlace: 'Твоё место',
      beyondUsual: 'На углях',
      ourPlace: 'О зале',
    },
    hero: {
      locationTag: 'Жямейи Панеряй, Вильнюс',
      tableEyebrow: '01 · Твой стол в EL SULTAN',
      headline: 'ЭТО ТВОЁ МЕСТО.',
      headlineLine1: 'ЭТО ТВОЁ',
      headlineLine2: 'МЕСТО.',
      subline: 'Кебабы. Шашлык на углях. Время для себя.',
      ctaMenu: 'Смотреть меню',
      ctaChoose: 'Помоги выбрать',
      ctaCall: 'Заказать с собой',
      scrollHint: 'Ближе к столу',
      featuredCaption: 'Ūmėdžių g. 2 · Вильнюс',
      selectDishLabel: 'Выберите блюдо на столе',
      pickupOnlyTag: 'Только в зале или по телефону',
      deliveryAvailableTag: 'Зал · Телефон · Wolt · Bolt Food',
      experiences: {
        familiar: { index: '01', kicker: 'Привычный выбор', shortLabel: 'Кебаб' },
        discovery: { index: '02', kicker: 'Открытие на углях', shortLabel: 'На углях' },
        shared: { index: '03', kicker: 'Для компании', shortLabel: 'Пицца' },
      },
      subtleCharcoalNudge: 'Заглянуть в меню на углях?',
      scrollCampaignKicker: '02 · Открытие на углях',
      scrollCampaignTitle: 'ТВОЙ КЕБАБ НЕ ОБИДИТСЯ.',
      scrollCampaignLine1: 'ТВОЙ КЕБАБ',
      scrollCampaignLine2: 'НЕ ОБИДИТСЯ.',
      scrollCampaignSub:
        'Привычный кебаб в лаваше всегда ждёт. Но когда вы за столом — попробуйте выдержанную говядину с живых древесных углей.',
      scrollCampaignCtaGrill: 'Блюда на углях',
      scrollCampaignCtaChoose: 'Запустить подбор',
      tableAltDesktop:
        'Чёрный стол EL SULTAN с бордовыми стульями, кебабом в лаваше, говяжьим шашлыком на углях и пиццей',
      tableAltOverhead:
        'Вид сверху на стол EL SULTAN с акцентом на говяжий шашлык на углях, кебаб и пиццу',
      tableAltMobile:
        'Стол EL SULTAN в Вильнюсе: кебаб в лаваше, шашлык на углях и пицца',
    },
    chooseForMe: {
      eyebrow: '02 · Умный подбор',
      headline: 'ПОМОГИ ВЫБРАТЬ.',
      intro:
        'Четыре коротких фильтра — любой шаг можно пропустить или поменять позже. Подберём реальное блюдо под бюджет, повод и вкус.',
      stepOf: 'Вопрос',
      q1Title: 'Какой у вас бюджет?',
      q1Options: {
        up_to_8: 'До €8.00',
        up_to_10: 'До €10.00',
        up_to_12: 'До €12.00',
        flexible: 'Не принципиально',
      },
      q2Title: 'Какой сегодня формат?',
      q2Options: {
        quick_bite: 'Быстрый перекус',
        proper_lunch: 'Спокойный обед за столом',
        with_friends: 'С друзьями или семьёй',
      },
      q3Title: 'Чего хочется больше?',
      q3Options: {
        chicken: 'Курица',
        beef: 'Говядина',
        vegetarian: 'Вегетарианское',
        vegan: 'Веганское',
        surprise: 'Удивите меня',
      },
      q4Title: 'Как удобно получить заказ?',
      q4Options: {
        dine_in: 'Поесть в ресторане',
        pickup: 'Самовывоз по звонку',
        delivery: 'Доставка (Wolt / Bolt)',
      },
      skipBtn: 'Пропустить',
      backBtn: 'Назад',
      skipTag: 'Любой',
      editFiltersLabel: 'Изменить фильтры:',
      resultEyebrow: 'Ваш точный выбор',
      reasons: {
        charcoal_lunch:
          'Когда есть время на полноценный обед, шашлык с живых углей дарит вкус настоящего отдыха среди дня.',
        charcoal_friends:
          'Для компании идеально подходят блюда на углях — ароматные шампуры, рис, свежий салат и тёплый лаваш.',
        quick_kebab:
          'Надёжный и быстрый вариант — наш популярный свежескрученный кебаб в хрустящем лаваше.',
        vegetarian_choice:
          'Свежие овощи и соус или вегетарианская пицца без мяса строго в рамках выбранного бюджета.',
        vegan_choice:
          'Растительное блюдо со свежими овощами и веганским соусом без молочных продуктов.',
        budget_fit:
          'Точно укладывается в указанный бюджет и оставляет запас под напиток или соус.',
        friends_feast:
          'Большая порция или пицца, которую удобно разделить за одним столом.',
      },
      ingredientsLabel: 'Состав',
      allergensLabel: 'Аллергены',
      channelsLabel: 'Способы заказа',
      alternativesTitle: 'Другие подходящие варианты',
      charcoalDiscoveryTitle: 'Попробуйте вместо привычного — на углях:',
      addToCallListBtn: '+ В список на самовывоз',
      addedToCallListBtn: '✓ В списке',
      exploreMenuBtn: 'Открыть в меню',
      chooseAgainBtn: 'Начать заново',
      callToOrder: 'Позвонить +370 628 23001',
      noMatchTitle: 'Под эти параметры нет точного совпадения.',
      noMatchBody:
        'Блюда на углях и пицца не доставляются через приложения, либо выбранный бюджет ограничивает эту комбинацию.',
      relaxBudgetBtn: 'Убрать лимит цены',
      relaxDeliveryBtn: 'Разрешить самовывоз / зал',
      relaxDietaryBtn: 'Показать все вкусы',
    },
    menuSection: {
      eyebrow: '03 · Актуальное меню кухни',
      headline: 'МЕНЮ.',
      subcopy:
        'Популярные кебабы в лаваше, шашлык на живых углях, пицца, тарелки и закуски. Цены указаны для зала и заказа по телефону.',
      allCategories: 'Все',
      searchPlaceholder: 'Поиск блюда или ингредиента...',
      filters: {
        all: 'Все',
        bestsellers: 'Хиты ★',
        vegetarian: 'Вегетарианское',
        noBread: 'Без лаваша',
        dineInOnly: 'На углях / В зале',
      },
      charcoalSpotlightTitle: 'Гордость кухни: на живых углях',
      charcoalSpotlightBody:
        'Шашлыки, люля-кебаб и курица готовятся на настоящем древесном угле — доступны только в зале или по предварительному звонку.',
      variantsLabel: 'Вариант и цена',
      ingredientsLabel: 'Ингредиенты',
      allergensLabel: 'Аллергены',
      channelsLabel: 'Как заказать',
      showDetails: 'Состав и заказ',
      hideDetails: 'Скрыть детали',
      emptyState: 'По выбранным фильтрам ничего не найдено.',
      resetFilters: 'Сбросить фильтры',
      fromPrice: 'от',
      explorerModeLabel: 'Обзор',
      listModeLabel: 'Весь список',
      prevDish: 'Назад',
      nextDish: 'Дальше',
      completeMealTitle: 'Дополнить заказ',
      beyondUsualLabel: 'Вместо привычного · на углях',
      compareCharcoalCta: 'Посмотреть на углях',
      addToCallList: '+ В список',
      addedToCallList: '✓ В списке',
      callListToggle: 'Список на вынос',
      callListTitle: 'Список для звонка на самовывоз',
      callListNotice:
        'Это не онлайн-оплата — соберите нужные позиции и просто продиктуйте их по телефону кухни.',
      callListCopy: 'Копировать',
      callListCopied: 'Скопировано',
      callListClear: 'Очистить',
      callListCallNow: 'Позвонить и заказать',
      totalLabel: 'Примерная сумма в зале',
      dineInOnlyBadge: 'В зале и по телефону',
      suggestedExtrasLabel: 'Дополнительно (по желанию)',
      qtyLabel: 'Кол-во',
      unitTotalLabel: 'За шт. с добавками',
      platformPriceNote: 'Цены в приложениях Wolt / Bolt Food могут отличаться от цен в ресторане.',
      reviewsForDishLabel: 'Отзывы гостей в Google',
      textOnlyNotice: 'Блюдо представлено в текстовом формате — без отдельного фото.',
    },
    channels: {
      dine_in: 'В зале (Ūmėdžių g. 2)',
      phone: 'По телефону с собой',
      wolt: 'Wolt',
      bolt: 'Bolt Food',
    },
    beyondUsual: {
      lunchActiveEyebrow: '04 · Сейчас открыто обеденное время в Вильнюсе',
      lunchScheduleEyebrow: '04 · Будний обед (Пн–Пт · 11:00–16:00)',
      lunchHeadline: 'РАБОТА БУДЕТ И ЗАВТРА. ОБЕД — СЕЙЧАС.',
      lunchSubActive:
        'Между 11:00 и 16:00 в Вильнюсе сейчас самое спокойное время для горячего обеда за столом или по звонку.',
      lunchSubSchedule:
        'По будням с 11:00 до 16:00 в зале меньше очередей, чем вечером — заходите спокойно поесть за столом без спешки.',
      lunchDishesTitle: 'Рекомендуем к обеду',
      lunchTimeLabel: 'Время в Вильнюсе',
      eyebrow: 'От свежего маринада до тарелки на столе',
      headline: 'ТВОЙ КЕБАБ НЕ ОБИДИТСЯ.',
      lead: 'Привычный кебаб в лаваше всегда хорош. Но когда хочется полноценной паузы — закажите сочный шашлык прямо с горячих углей.',
      steps: [
        {
          index: '01',
          title: 'Ежедневная заготовка',
          body: 'Свежая капуста, зелень, помидоры и маринованное мясо подготавливаются на кухне каждый день.',
        },
        {
          index: '02',
          title: 'На шампурах',
          body: 'Выдержанная говяжья вырезка, куриное филе и рубленый люля-кебаб со специями.',
        },
        {
          index: '03',
          title: 'Жар древесных углей',
          body: 'Готовим над раскалёнными углями без спешки, чтобы мясо сохранило сочность и лёгкий дымок.',
        },
        {
          index: '04',
          title: 'С огня на тарелку',
          body: 'Аппетитная корочка, запечённый томат и поджаренный тёплый лаваш.',
        },
        {
          index: '05',
          title: 'Полноценная подача',
          body: 'Подаётся с рассыпчатым рисом или фри и свежим салатом — в ресторане и на вынос.',
          dishHighlight: 'Шашлык из выдержанной говяжьей вырезки · €16.00',
        },
      ],
      ctaGrill: 'Смотреть блюда на углях',
      ctaVisit: 'Прийти в ресторан',
      dineInOnlyBadge: 'Только в ресторане и по телефону',
    },
    ourPlace: {
      usualEyebrow: '05 · Зал и атмосфера',
      usualHeadline: 'УЮТНЫЙ ЗАЛ В ЖЯМЕЙИ ПАНЕРЯЙ.',
      usualBody:
        'Изогнутые чёрные стулья с бордовыми подушками, деревянные стены и живой аромат гриля. Сюда удобно зайти и одному в обед, и вечером с друзьями.',
      usualCta: 'Посмотреть блюда на углях',
      placeEyebrow: 'Реальное место · Ūmėdžių g. 2',
      placeHeadline: 'ПРОСТОЕ И ЧЕСТНОЕ МЕСТО БЕЗ ПАФОСА.',
      placeParagraphs: [
        'EL SULTAN работает на Ūmėdžių g. 2 в Вильнюсе — сюда не нужен особый повод, чтобы спокойно и вкусно поесть.',
        'Быстрый кебаб в дорогу или неспешный ужин с шампурами — кухня одинаково внимательна к обоим форматам.',
      ],
      placeDetails: [
        { label: 'Кухня', value: 'Кебабы, шашлык на углях, пицца' },
        { label: 'Зал', value: 'Удобно для обедов и компаний' },
        { label: 'Заказ', value: 'В зале, +370 628 23001, Wolt / Bolt Food' },
      ],
      reviewsEyebrow: 'Отзывы посетителей',
      reviewsHeadline: 'ЧТО ОТМЕЧАЮТ ГОСТИ.',
      reviewsNote: 'Ключевые темы из публичных отзывов в Google о ресторане EL SULTAN (Ūmėdžių g. 2).',
      highlights: [
        {
          title: 'Радушный приём',
          detail:
            'Гости часто отмечают дружелюбный персонал за стойкой и оперативное приготовление заказов.',
          source: 'Тема отзывов Google',
        },
        {
          title: 'Свежие ингредиенты и объём',
          detail:
            'Посетителям нравятся хрустящие овощи, сбалансированные соусы и сытные порции.',
          source: 'Тема отзывов Google',
        },
        {
          title: 'Блюда с мангала',
          detail:
            'Гости зала советуют обязательно попробовать шашлык из говядины, куриные шампуры и люля-кебаб.',
          source: 'Тема отзывов Google',
        },
      ],
      googleLinkLabel: 'Смотреть все отзывы на Google Картах',
    },
    ordering: {
      eyebrow: '06 · Как добраться и заказать',
      headline: 'ТВОЯ ЕДА. ТВОЙ СПОСОБ.',
      subcopy:
        'Выберите удобный способ. Напоминаем: блюда на углях и пицца готовятся только при заказе в зале или по телефону.',
      cards: {
        dineInTitle: 'В ресторане',
        dineInDesc: 'Полное меню, включая свежий шашлык на углях и пиццу. Ūmėdžių g. 2.',
        dineInAction: 'Построить маршрут',
        phoneTitle: 'Самовывоз по телефону',
        phoneDesc: 'Позвоните заранее — подготовим горячий заказ точно к вашему приезду.',
        phoneAction: 'Позвонить +370 628 23001',
        woltTitle: 'Доставка Wolt',
        woltDesc: 'Кебабы в лаваше, тарелки, закуски и напитки по Вильнюсу.',
        woltAction: 'Открыть Wolt',
        boltTitle: 'Доставка Bolt Food',
        boltDesc: 'Популярные кебабы, закуски и напитки через Bolt Food.',
        boltAction: 'Открыть Bolt Food',
      },
      platformNote:
        'Шашлыки на углях, пицца и супы недоступны в приложениях доставки — их всегда можно заказать в зале или по телефону +370 628 23001. Цены на платформах доставки могут отличаться от цен ресторана.',
    },
    location: {
      eyebrow: 'Ждём в гости',
      headline: 'ТВОЁ МЕСТО ЖДЁТ.',
      subcopy: 'Ūmėdžių g. 2, Жямейи Панеряй, Вильнюс.',
      addressLabel: 'Адрес',
      hoursLabel: 'Часы работы',
      phoneLabel: 'Телефон для заказов',
      directionsBtn: 'Открыть на Google Картах',
      callBtn: 'Позвонить +370 628 23001',
    },
    faq: {
      eyebrow: '07 · Полезная информация',
      title: 'Частые вопросы',
      lead: 'Коротко о вегетарианских позициях, аллергенах, заказе навынос и оплате на месте.',
      items: [
        {
          q: 'Есть ли вегетарианские варианты?',
          a: 'Да. Вегетарианский кебаб, картофель фри, спринг-роллы. Полное меню с ценами: здесь, на сайте.',
        },
        {
          q: 'Указываете ли вы аллергены?',
          a: 'На месте спросите повара о конкретном блюде. Скажем точно, что в нём. Или позвоните +370 628 23001 перед приездом.',
        },
        {
          q: 'Можно ли заказать навынос?',
          a: 'Да, позвоните +370 628 23001, и всё будет готово к вашему приходу. Забрать: Ūmėdžių g. 2.',
        },
        {
          q: 'Принимаете ли наличные на месте?',
          a: 'Да, на месте принимаем и наличные, и карты.',
        },
      ],
    },
    orderModal: {
      title: 'Как хотите оформить заказ?',
      subtitle: 'Выберите удобный канал под выбранные блюда.',
      charcoalWarning:
        'Блюда на углях, пицца и супы готовятся только в ресторане или по телефону +370 628 23001.',
      close: 'Закрыть',
    },
    footer: {
      tagline: 'Это твоё место. Ūmėdžių g. 2, Вильнюс.',
      privacyLink: 'Конфиденциальность',
      rights: 'EL SULTAN · Вильнюс, Литва',
    },
    privacyModal: {
      title: 'Приватность без cookies и слежки',
      body: [
        'Этот сайт не использует рекламные cookies, скрипты отслеживания или стороннюю аналитику.',
        'Все шрифты и фотографии загружаются напрямую с сервера приложения без запросов к внешним CDN-шрифтам.',
        'Выбор языка и временный список на самовывоз хранятся только в памяти текущей вкладки. Заказы принимаются в ресторане, по телефону +370 628 23001 или через Wolt и Bolt Food.',
      ],
      close: 'Закрыть',
    },
  },
};
