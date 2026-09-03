import { Creature, ExportContract, PlayerEmpire, ResourceItem, Tournament, Workshop, WorkshopRecipe } from '../types';

export const INITIAL_EMPIRE: PlayerEmpire = {
  name: 'إمبراطورية سلالات الفراعنة والورش الكبرى',
  dynastyTitle: 'حاكم صروح وادي الملوك ومحمية الأنساب',
  gold: 25000,
  stars: 120,
  fameLevel: 3,
  fameXp: 350,
  fameXpMax: 800,
  gameSpeed: 89,
  isSpeedActive: true,
  soundEnabled: true,
  activeTab: 'tombs',
  lastTickTimestamp: Date.now(),
  unlockedTombs: [1, 2]
};

export const INITIAL_CREATURES: Creature[] = [
  {
    id: 'dog_va1_kaiser',
    name: 'كايزر فون در رويال (Kaiser)',
    species: 'dog',
    breedName: 'الراعي الألماني خطوط العمل IGP 3',
    gender: 'M',
    birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    ageDaysCalculated: 920,
    stage: 'prime',
    imageIcon: '🐕‍🦺',
    avatarBg: 'from-amber-900/40 to-slate-900',
    rarity: 'Legendary',
    dna: {
      drive: 94,
      stature: 92,
      temperament: 96,
      coatQuality: 88,
      stamina: 91,
      geneticPurity: 97,
      mutations: ['طفرة الأليلات الذهبية (نقاء نسب استثنائي)', 'ألياف عضلية سريعة الانقباض'],
      genotype: {
        alleles: 'VA1-BSZS-SV',
        lineName: 'سلالة فون ترومبترسبورغ الملكية',
        isCHICVerified: true,
        isFCICertified: true
      }
    },
    harvest: {
      resourceId: 'dna_hair_sample',
      resourceName: 'عينات DNA نقية',
      icon: '🧬',
      intervalSec: 15,
      lastHarvestTimestamp: 0,
      yieldAmount: 2
    },
    titles: ['بطل ألمانيا العالمي (VA1)', 'شهادة حماية IGP 3', 'KKL1 فحص التزاوج الممتاز'],
    lineage: {
      sire: 'بطل العالم باليشتار 2019',
      dam: 'كليوباترا دي لومبارديا',
      generation: 4
    },
    stats: {
      wins: 14,
      podiums: 18,
      totalEarnings: 8400
    },
    priceEstimate: 14500
  },
  {
    id: 'dog_fem_sheba',
    name: 'شهباء فخر الصحراء (Sheba)',
    species: 'dog',
    breedName: 'السلوقي العربي الحر (Saluki Desert Hound)',
    gender: 'F',
    birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 18,
    ageDaysCalculated: 640,
    stage: 'prime',
    imageIcon: '🐕',
    avatarBg: 'from-amber-800/30 to-slate-900',
    rarity: 'Epic',
    dna: {
      drive: 89,
      stature: 86,
      temperament: 92,
      coatQuality: 85,
      stamina: 95,
      geneticPurity: 92,
      mutations: ['رياح نجد (سرعة جري قصوى +14)'],
      genotype: {
        alleles: 'SLK-ARAB-09',
        lineName: 'سلالة الهدد الصافية',
        isCHICVerified: true,
        isFCICertified: true
      }
    },
    harvest: {
      resourceId: 'dna_hair_sample',
      resourceName: 'عينات DNA نقية',
      icon: '🧬',
      intervalSec: 18,
      lastHarvestTimestamp: 0,
      yieldAmount: 2
    },
    titles: ['وصيفة كأس الظفرة للسلوقي', 'شهادة السرعة القصوى 65 كم/س'],
    lineage: {
      sire: 'صخر الوادي',
      dam: 'نجلاء الصمان',
      generation: 3
    },
    stats: {
      wins: 7,
      podiums: 11,
      totalEarnings: 4200
    },
    priceEstimate: 7800
  },
  {
    id: 'horse_kahil_desert',
    name: 'كحيلان الشقب (Kahilan)',
    species: 'horse',
    breedName: 'الخيل العربي الأصيل (الكحيلة العجوز)',
    gender: 'M',
    birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 48,
    ageDaysCalculated: 1450,
    stage: 'prime',
    imageIcon: '🐎',
    avatarBg: 'from-emerald-900/40 to-slate-900',
    rarity: 'Royal Masterpiece',
    dna: {
      drive: 98,
      stature: 97,
      temperament: 95,
      coatQuality: 96,
      stamina: 99,
      geneticPurity: 99,
      mutations: ['التاج الملكي الأموي', 'رئة البادية ذات السعة الفائقة'],
      genotype: {
        alleles: 'WAHO-KHL-001',
        lineName: 'سلالة صقلاوي جدران الشقب',
        isCHICVerified: true,
        isFCICertified: true
      }
    },
    harvest: {
      resourceId: 'pure_manure',
      resourceName: 'سماد عضوي ملكي',
      icon: '🌱',
      intervalSec: 12,
      lastHarvestTimestamp: 0,
      yieldAmount: 3
    },
    titles: ['بطل صالون دو شيفال باريس', 'الميدالية الذهبية للجمال والسرعة WAHO'],
    lineage: {
      sire: 'مروان الشقب الأسطوري',
      dam: 'غزالة البادية الحرة',
      generation: 6
    },
    stats: {
      wins: 22,
      podiums: 26,
      totalEarnings: 29000
    },
    priceEstimate: 32000
  },
  {
    id: 'plant_matsu_bonsai',
    name: 'صنوبر ماتسو الأسود الإمبراطوري',
    species: 'plant',
    breedName: 'بونساي ياباني معتق (Pinus thunbergii)',
    gender: 'asexual',
    birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 72,
    ageDaysCalculated: 8400,
    stage: 'veteran',
    imageIcon: '🌲',
    avatarBg: 'from-emerald-950/60 to-slate-900',
    rarity: 'Legendary',
    dna: {
      drive: 75,
      stature: 98,
      temperament: 99,
      coatQuality: 96,
      stamina: 90,
      geneticPurity: 98,
      mutations: ['خشب جين أثري متحجر (تناغم بونساي +20)'],
      genotype: {
        alleles: 'BNS-OMYA-JP',
        lineName: 'حديقة القصر الإمبراطوري بطوكيو',
        isCHICVerified: true,
        isFCICertified: true
      }
    },
    harvest: {
      resourceId: 'lavender_extract',
      resourceName: 'أزهار لافندر جبلية',
      icon: '🪻',
      intervalSec: 8,
      lastHarvestTimestamp: 0,
      yieldAmount: 4
    },
    titles: ['جائزة رئيس الوزراء لمعرض كوكوفو-تن', 'تحفة تراثية وطنية مصنفة'],
    lineage: {
      generation: 8
    },
    stats: {
      wins: 9,
      podiums: 10,
      totalEarnings: 11000
    },
    priceEstimate: 18500
  },
  {
    id: 'pigeon_olympic_bolt',
    name: 'صقر السماء الأسرع (Bolt Olympic)',
    species: 'pigeon',
    breedName: 'الزاجل البلجيكي جان آردن (Jan Aarden)',
    gender: 'M',
    birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 12,
    ageDaysCalculated: 340,
    stage: 'juvenile',
    imageIcon: '🕊️',
    avatarBg: 'from-cyan-900/30 to-slate-900',
    rarity: 'Rare',
    dna: {
      drive: 84,
      stature: 78,
      temperament: 88,
      coatQuality: 82,
      stamina: 87,
      geneticPurity: 86,
      mutations: ['ريش مقاوم للرياح العاتية'],
      genotype: {
        alleles: 'BELG-ARDN-24',
        lineName: 'خطوط برشلونة لمسافات 1000 كم',
        isCHICVerified: false,
        isFCICertified: true
      }
    },
    harvest: {
      resourceId: 'aerodynamic_feather',
      resourceName: 'ريش ملاحة عالي الكثافة',
      icon: '🪶',
      intervalSec: 10,
      lastHarvestTimestamp: 0,
      yieldAmount: 2
    },
    titles: ['المركز الأول في سباق الديربي 350 كم'],
    lineage: {
      sire: 'بولت الذهبي',
      dam: 'سيدة السماء الزرقاء',
      generation: 2
    },
    stats: {
      wins: 3,
      podiums: 5,
      totalEarnings: 1900
    },
    priceEstimate: 3400
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  // Raw items collected from sanctuary
  {
    id: 'dna_hair_sample',
    name: 'عينات DNA نقية',
    category: 'raw',
    icon: '🧬',
    rarity: 'Rare',
    count: 14,
    basePrice: 65,
    description: 'بصيلات شعر وجذور جينية عالية النقاء تؤخذ من كبار أبطال المحمية لفحص السلالة.'
  },
  {
    id: 'pure_manure',
    name: 'سماد عضوي ملكي',
    category: 'raw',
    icon: '🌱',
    rarity: 'Common',
    count: 28,
    basePrice: 25,
    description: 'مخلفات الخيول العربية الصافية الغنية بالنيتروجين والمفيدة جداً للمشاتل والتحضين.'
  },
  {
    id: 'lavender_extract',
    name: 'أزهار لافندر جبلية',
    category: 'raw',
    icon: '🪻',
    rarity: 'Common',
    count: 32,
    basePrice: 30,
    description: 'أزهار معطرة مقطوفة طازجة من أطراف مشتل البونساي لإنتاج الزيوت المهدئة.'
  },
  {
    id: 'aerodynamic_feather',
    name: 'ريش ملاحة عالي الكثافة',
    category: 'raw',
    icon: '🪶',
    rarity: 'Rare',
    count: 10,
    basePrice: 45,
    description: 'ريش فائق الخفة والمقاومة للاحتكاك يسقط طبيعياً من أجنحة حمام الزاجل الأولمبي.'
  },

  // Processed items (Elixirs, Feeds, Tack, Genomic)
  {
    id: 'calming_elixir',
    name: 'إكسير الهدوء والتركيز (Bio-Apothecary)',
    category: 'elixir',
    icon: '🧪',
    rarity: 'Rare',
    count: 4,
    basePrice: 220,
    description: 'مستخلص عشبي يمنح الكائن ثباتاً ذهنياً ومزاجاً مستقراً قبل مباريات البطولة (+10 مزاج).',
    boostEffect: {
      stat: 'temperament',
      value: 10,
      label: '+10 للمزاج والثبات'
    }
  },
  {
    id: 'fertility_tonic',
    name: 'منشط الخصوبة والطفرات الوراثية',
    category: 'elixir',
    icon: '✨',
    rarity: 'Epic',
    count: 2,
    basePrice: 450,
    description: 'مركب كيميائي طبيعي يضاعف احتمالية ظهور الطفرات الأسطورية عند التزاوج في المحمية.'
  },
  {
    id: 'high_drive_feed',
    name: 'علف الأبطال فائق البروتين (High-Drive)',
    category: 'feed',
    icon: '🥩',
    rarity: 'Rare',
    count: 8,
    basePrice: 160,
    description: 'خلطة غذائية ترفع عضلات واندفاع كلاب الرعاة وخيول السباق (+12 للدافع والشغف).',
    boostEffect: {
      stat: 'drive',
      value: 12,
      label: '+12 للدافع والشغف'
    }
  },
  {
    id: 'endurance_grain',
    name: 'حبوب الطاقة القصوى للخيول والزاجل',
    category: 'feed',
    icon: '🌾',
    rarity: 'Common',
    count: 12,
    basePrice: 90,
    description: 'غذاء مركز مدعوم بالفيتامينات يرفع القدرة على التحمل لمسافات طويلة (+8 للتحمل).',
    boostEffect: {
      stat: 'stamina',
      value: 8,
      label: '+8 للتحمل البدني'
    }
  },
  {
    id: 'champion_leather_collar',
    name: 'طوق الجلد الإمبراطوري المرصع',
    category: 'tack',
    icon: '📿',
    rarity: 'Epic',
    count: 3,
    basePrice: 580,
    description: 'طوق جلدي فاخر مصنوع يدوياً من أفخر الجلود يعزز هيئة الكائن في عروض الجمال (+15 للبنية).',
    boostEffect: {
      stat: 'stature',
      value: 15,
      label: '+15 للهيئة والتشريح'
    }
  },
  {
    id: 'arabian_gold_saddle',
    name: 'سرج الشقب التراثي المطرز بالذهب',
    category: 'tack',
    icon: '🛡️',
    rarity: 'Legendary',
    count: 1,
    basePrice: 1850,
    description: 'سرج خيل عربي فاخر يضاعف رونق الخيل ودرجات التحكيم في بطولات جمال الخيل (+20 فراء وهيئة).',
    boostEffect: {
      stat: 'coatQuality',
      value: 20,
      label: '+20 لجمال الفراء والمظهر'
    }
  },
  {
    id: 'dna_test_kit',
    name: 'أنبوب فحص الـ DNA المعتمد (FCI/AKC)',
    category: 'genomic',
    icon: '🔬',
    rarity: 'Epic',
    count: 5,
    basePrice: 380,
    description: 'عدة فحص جينومي رسمية لازمة لتوثيق شهادات الأنساب وتصدير السلالات للخارج.'
  },
  {
    id: 'royal_pedigree_certificate',
    name: 'وثيقة النسب الذهبية الملكية (Studbook)',
    category: 'genomic',
    icon: '📜',
    rarity: 'Royal Masterpiece',
    count: 2,
    basePrice: 1250,
    description: 'شهادة نسب ملكية معتمدة ترفع القيمة السوقية لأي كائن بمقدار 40% وتفتح عقود التصدير الملكية.'
  }
];

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'ws_apothecary',
    type: 'apothecary',
    name: 'معمل الصيدلة الحيوية والمستخلصات',
    arabicTitle: 'معمل الصيدلة واستخلاص الزيوت العشبية',
    level: 1,
    description: 'استخلاص الزهور والأعشاب الطبيعية لإنتاج مقويات الأداء ومهدئات الأعصاب ومنشطات الخصوبة.',
    icon: '🧪',
    activeProduction: null,
    upgradeCostGold: 850,
    upgradeCostStars: 10,
    speedMultiplier: 1.0,
    masterworkChance: 0.1
  },
  {
    id: 'ws_feed_mill',
    type: 'feed_mill',
    name: 'مصنع الأعلاف التخصصية الملكية',
    arabicTitle: 'مطحنة الأعلاف فائقة البروتين والطاقة',
    level: 2,
    description: 'إنتاج أغذية مخصصة لرفع الكتلة العضلية ومستويات الدافع العالي (High-Drive) والتحمل.',
    icon: '🌾',
    activeProduction: null,
    upgradeCostGold: 1200,
    upgradeCostStars: 15,
    speedMultiplier: 1.25,
    masterworkChance: 0.15
  },
  {
    id: 'ws_leather_tack',
    type: 'leather_tack',
    name: 'ورشة الجلود والسروج التراثية',
    arabicTitle: 'دار الحرفة وصناعة أطواق وسروج الأبطال',
    level: 1,
    description: 'حياكة السروج العربية المطرزة وأطواق العرض الفاخرة التي تبهر حكام البطولات.',
    icon: '🧵',
    activeProduction: null,
    upgradeCostGold: 1500,
    upgradeCostStars: 20,
    speedMultiplier: 1.0,
    masterworkChance: 0.12
  },
  {
    id: 'ws_genomics_lab',
    type: 'genomics_lab',
    name: 'مختبر فحص الجينوم وسجلات الأنساب',
    arabicTitle: 'مركز توثيق الـ DNA والشهادات الرسمية',
    level: 1,
    description: 'تحليل البصمات الوراثية وإصدار جوازات الأنساب وشهادات خلو التشوهات CHIC.',
    icon: '🧬',
    activeProduction: null,
    upgradeCostGold: 2200,
    upgradeCostStars: 30,
    speedMultiplier: 1.0,
    masterworkChance: 0.2
  }
];

export const WORKSHOP_RECIPES: WorkshopRecipe[] = [
  // Apothecary Recipes
  {
    id: 'rcp_calming',
    name: 'إكسير الهدوء والتركيز الميداني',
    workshopType: 'apothecary',
    outputResourceId: 'calming_elixir',
    outputCount: 2,
    durationSec: 10,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'lavender_extract', amount: 3 }
    ],
    description: 'تركيبة عشبية سريعة المفعول تمنح الكلاب والخيول استقراراً ذهنياً فائقاً.',
    icon: '🧪'
  },
  {
    id: 'rcp_fertility',
    name: 'منشط الطفرات والخصوبة الأسطورية',
    workshopType: 'apothecary',
    outputResourceId: 'fertility_tonic',
    outputCount: 1,
    durationSec: 25,
    requiredLevel: 2,
    inputs: [
      { resourceId: 'lavender_extract', amount: 5 },
      { resourceId: 'pure_manure', amount: 3 }
    ],
    description: 'يزيد فرصة توارث الطفرات الملكية النادرة عند إجراء التزاوج بنسبة 50%.',
    icon: '✨'
  },

  // Feed Mill Recipes
  {
    id: 'rcp_endurance_grain',
    name: 'حبوب الطاقة القصوى للخيول والزاجل',
    workshopType: 'feed_mill',
    outputResourceId: 'endurance_grain',
    outputCount: 3,
    durationSec: 8,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'pure_manure', amount: 2 }
    ],
    description: 'علف خفيف عالي الكفاءة يرفع سرعة التعافي ونقاط التحمل.',
    icon: '🌾'
  },
  {
    id: 'rcp_high_drive_feed',
    name: 'علف الأبطال فائق البروتين (High-Drive)',
    workshopType: 'feed_mill',
    outputResourceId: 'high_drive_feed',
    outputCount: 2,
    durationSec: 16,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'pure_manure', amount: 4 },
      { resourceId: 'aerodynamic_feather', amount: 1 }
    ],
    description: 'غذاء العمالقة لبناء عضلات الكلاب والخيول المشاركة في بطولات الشغل والـ IGP.',
    icon: '🥩'
  },

  // Leather & Tack Recipes
  {
    id: 'rcp_collar',
    name: 'طوق الجلد الإمبراطوري المرصع',
    workshopType: 'leather_tack',
    outputResourceId: 'champion_leather_collar',
    outputCount: 1,
    durationSec: 20,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'aerodynamic_feather', amount: 2 },
      { resourceId: 'dna_hair_sample', amount: 2 }
    ],
    description: 'يزيد درجات الهيئة والوقوف أمام حكام المسابقات الرسمية.',
    icon: '📿'
  },
  {
    id: 'rcp_saddle',
    name: 'سرج الشقب التراثي المطرز بالذهب',
    workshopType: 'leather_tack',
    outputResourceId: 'arabian_gold_saddle',
    outputCount: 1,
    durationSec: 40,
    requiredLevel: 2,
    inputs: [
      { resourceId: 'aerodynamic_feather', amount: 4 },
      { resourceId: 'lavender_extract', amount: 6 },
      { resourceId: 'dna_hair_sample', amount: 3 }
    ],
    description: 'تحفة تراثية ترفع بريق الخيول وتمنح نقاط جمال مضاعفة في عروض المظهر.',
    icon: '🛡️'
  },

  // Genomics Lab Recipes
  {
    id: 'rcp_dna_kit',
    name: 'أنبوب فحص الـ DNA المعتمد',
    workshopType: 'genomics_lab',
    outputResourceId: 'dna_test_kit',
    outputCount: 2,
    durationSec: 15,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'dna_hair_sample', amount: 3 }
    ],
    description: 'عدة مطابقة الجينوم الأساسية لإصدار شهادات الـ FCI و CHIC.',
    icon: '🔬'
  },
  {
    id: 'rcp_pedigree_cert',
    name: 'وثيقة النسب الذهبية الملكية (Studbook)',
    workshopType: 'genomics_lab',
    outputResourceId: 'royal_pedigree_certificate',
    outputCount: 1,
    durationSec: 35,
    requiredLevel: 1,
    inputs: [
      { resourceId: 'dna_hair_sample', amount: 5 },
      { resourceId: 'lavender_extract', amount: 4 }
    ],
    description: 'وثيقة رسمية تسجل الكائن في السجل التاريخي وتؤهله لعقود التصدير الدولية.',
    icon: '📜'
  }
];

export const INITIAL_EXPORT_CONTRACTS: ExportContract[] = [
  {
    id: 'contract_sieger_germany',
    clientName: 'نادي الرعاة الألماني SV (أوغسبورغ)',
    clientTitle: 'المشرف العام على بطولات Sieger الدولية',
    clientAvatar: '🇩🇪',
    organization: 'German Shepherd Breed Council',
    requirements: [
      {
        type: 'resource',
        resourceId: 'high_drive_feed',
        amount: 4,
        label: 'أكياس علف فائق البروتين',
        icon: '🥩'
      },
      {
        type: 'resource',
        resourceId: 'dna_test_kit',
        amount: 2,
        label: 'أنابيب فحص الـ DNA',
        icon: '🔬'
      }
    ],
    rewardGold: 1650,
    rewardStars: 18,
    rewardXp: 120,
    expiresInSec: 900,
    isCompleted: false
  },
  {
    id: 'contract_royal_stables',
    clientName: 'إسطبلات الشقب الملكية',
    clientTitle: 'رئيس وفد بطولات الخيول العربية بالدوحة',
    clientAvatar: '🇶🇦',
    organization: 'Royal Arabian Studbook Committee',
    requirements: [
      {
        type: 'resource',
        resourceId: 'arabian_gold_saddle',
        amount: 1,
        label: 'سرج الشقب التراثي المطرز',
        icon: '🛡️'
      },
      {
        type: 'resource',
        resourceId: 'calming_elixir',
        amount: 3,
        label: 'إكسير الهدوء والتركيز',
        icon: '🧪'
      }
    ],
    rewardGold: 3400,
    rewardStars: 35,
    rewardXp: 280,
    expiresInSec: 1200,
    isCompleted: false
  },
  {
    id: 'contract_tokyo_botanical',
    clientName: 'جمعية البونساي الإمبراطورية بطوكيو',
    clientTitle: 'كبير حكام معرض كوكوفو-تن',
    clientAvatar: '🇯🇵',
    organization: 'Nippon Bonsai Association',
    requirements: [
      {
        type: 'resource',
        resourceId: 'lavender_extract',
        amount: 15,
        label: 'أزهار لافندر جبلية طازجة',
        icon: '🪻'
      },
      {
        type: 'resource',
        resourceId: 'fertility_tonic',
        amount: 2,
        label: 'منشط الخصوبة والطفرات',
        icon: '✨'
      }
    ],
    rewardGold: 2100,
    rewardStars: 22,
    rewardXp: 160,
    expiresInSec: 800,
    isCompleted: false
  },
  {
    id: 'contract_brussels_pigeon_federation',
    clientName: 'الاتحاد الملكي لسباقات الزاجل ببلجيكا',
    clientTitle: 'رئيس حكام سباق برشلونة الدولي',
    clientAvatar: '🇧🇪',
    organization: 'Royal Belgian Flying Pigeon Club',
    requirements: [
      {
        type: 'resource',
        resourceId: 'endurance_grain',
        amount: 6,
        label: 'حبوب الطاقة القصوى',
        icon: '🌾'
      },
      {
        type: 'resource',
        resourceId: 'royal_pedigree_certificate',
        amount: 1,
        label: 'وثيقة النسب الذهبية',
        icon: '📜'
      }
    ],
    rewardGold: 2800,
    rewardStars: 28,
    rewardXp: 210,
    expiresInSec: 1100,
    isCompleted: false
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney_bszs_sieger',
    category: 'sieger_igp',
    title: 'بطولة سيجر الألمانية الكبرى (BSZS Sieger & IGP Trial)',
    subtitle: 'اختبارات الشجاعة الميدانية، الهجوم المضاد، والتشريح المثالي للرعاة',
    icon: '🏆',
    requiredSpecies: 'dog',
    minGeneticScore: 75,
    entryFeeGold: 400,
    prizeGold: 2600,
    prizeStars: 20,
    championshipTitleAward: 'لقب النخبة الألمانية (VA1 World Champion)',
    difficulty: 'بطولة ملكية',
    statFocus: ['drive', 'temperament', 'stature'],
    description: 'الحلبة الأرفع مكانة في العالم لكلاب الرعاة الألمان والسلوقي. يخضع الكائن لاختبار شجاعة الحماية والتشريح الميداني تحت إشراف حكام SV الألمان.'
  },
  {
    id: 'tourney_qatar_arabian_cup',
    category: 'arabian_cup',
    title: 'كأس الشقب الذهبي لجمال الخيول والسرعة',
    subtitle: 'مسابقة الرشاقة، الخطو الملكي، وعروض الرأس والرقبة الأصيلة',
    icon: '👑',
    requiredSpecies: 'horse',
    minGeneticScore: 80,
    entryFeeGold: 600,
    prizeGold: 4500,
    prizeStars: 35,
    championshipTitleAward: 'التاج الذهبي للفروسية (WAHO Gold Cup)',
    difficulty: 'بطولة ملكية',
    statFocus: ['stature', 'coatQuality', 'stamina'],
    description: 'أرفع بطولات الخيل العربية في الشرق الأوسط. تتنافس الخيول على خفة الحركة، تقعر الوجه النبيل، ونقاء خطوط النسب المعتقة.'
  },
  {
    id: 'tourney_imperial_bonsai_expo',
    category: 'bonsai_expo',
    title: 'المعرض الإمبراطوري لروائع البونساي والنباتات النادرة',
    subtitle: 'تحكيم التوازن، أثر الزمن (Jin/Shari)، وتناسق الجذع والأغصان',
    icon: '🌲',
    requiredSpecies: 'plant',
    minGeneticScore: 65,
    entryFeeGold: 250,
    prizeGold: 1800,
    prizeStars: 15,
    championshipTitleAward: 'جائزة الإمبراطور الخضراء (Kokufu Masterpiece)',
    difficulty: 'محترف',
    statFocus: ['stature', 'coatQuality', 'temperament'],
    description: 'مسابقة فنية رفيعة تقام لتقييم الشتلات النادرة وأشجار البونساي المعمرة وفق التقاليد الإمبراطورية القديمة.'
  },
  {
    id: 'tourney_grand_pigeon_derby',
    category: 'pigeon_derby',
    title: 'ديربي برشلونة الدولي لسباقات الزاجل 600 كم',
    subtitle: 'تحدي الملاحة الجوية، مقاومة التيارات الهوائية، وسرعة العودة للبرج',
    icon: '🕊️',
    requiredSpecies: 'pigeon',
    minGeneticScore: 60,
    entryFeeGold: 200,
    prizeGold: 1400,
    prizeStars: 12,
    championshipTitleAward: 'نسر الرياح الأولمبي (Olympic Air Ace)',
    difficulty: 'مبتدئ',
    statFocus: ['stamina', 'drive', 'geneticPurity'],
    description: 'سباق جوي قارس ينطلق فيه مئات الحمام الزاجل لمسافة تتجاوز 600 كيلومتر، الفائز هو الأسرع وصولاً والأعلى قدرة على الملاحة.'
  }
];
