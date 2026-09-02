/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/data/sanctuaryData.js
 * Version: 3.0.0 (ACADEMIC BIOLOGY & GENETICS DATABASE)
 * Description: Canonical biological standards, genuine loci genomes, gestation time
 *              parameters, and realistic attributes for all supported species.
 */

export const SANCTUARY_SPECIES = {
    CANINE: {
        id: 'CANINE',
        name_ar: 'الكلبيات الأصيلة',
        name_en: 'Canine',
        icon: '🐕',
        gestation_days_bio: 63, // 63 biological days = ~17 real hours at 89x
        lifespan_years_bio: 14,
        speed_factor: 89.0,
        description: 'سلالات معتمدة دولياً من الـ FCI مع فحص صحي CHIC وسجل أنساب موثق.'
    },
    FELINE: {
        id: 'FELINE',
        name_ar: 'السنوريات والقطط',
        name_en: 'Feline',
        icon: '🐈',
        gestation_days_bio: 65, // ~17.5 real hours
        lifespan_years_bio: 15,
        speed_factor: 89.0,
        description: 'سلالات القطط الأصيلة والماو المصري والشيرازي مع جينات الفراء النادر.'
    },
    EQUINE: {
        id: 'EQUINE',
        name_ar: 'الخيول العربية الأصيلة',
        name_en: 'Equine',
        icon: '🐎',
        gestation_days_bio: 330, // 11 months = ~89 real hours (3.7 days)
        lifespan_years_bio: 28,
        speed_factor: 89.0,
        description: 'مرابط الخيل العربية الأصيلة بالأرسان الخمسة التاريخية المعتمدة من WAHO.'
    },
    AVIAN: {
        id: 'AVIAN',
        name_ar: 'حمام الغُواة والزاجل',
        name_en: 'Avian (Pigeons)',
        icon: '🕊️',
        gestation_days_bio: 18, // 18 biological days = ~4.8 real hours
        lifespan_years_bio: 10,
        speed_factor: 89.0,
        description: 'غية الحمام المصرية والزاجل الأصيل بنظام تزاوج سريع وفحص ألوان الريش.'
    },
    CAMELID: {
        id: 'CAMELID',
        name_ar: 'أطايب الإبل والمزايين',
        name_en: 'Camelid',
        icon: '🐪',
        gestation_days_bio: 365, // 12 months = ~4.1 real days
        lifespan_years_bio: 35,
        speed_factor: 89.0,
        description: 'سلالات الإبل والمجاهيم والوضح ومضامير الهجن المعتمدة.'
    },
    FLORA_BONSAI: {
        id: 'FLORA_BONSAI',
        name_ar: 'أشجار البونساي المعمرة',
        name_en: 'Bonsai Flora',
        icon: '🌳',
        gestation_days_bio: 14, // إنبات البذور في ~3.7 ساعات
        lifespan_years_bio: 80, // أصول تراثية معمرة
        speed_factor: 89.0,
        description: 'مشتل جُذور التراثي: محاكاة حقيقية لجفاف التربة، التقليم، وتركيب الأكاداما.'
    }
};

export const SANCTUARY_BREEDS = {
    // 🐕 CANINE BREEDS
    gsd_working: {
        id: 'gsd_working',
        species_id: 'CANINE',
        name_ar: 'الراعي الألماني (DDR Line)',
        name_en: 'German Shepherd (Working Line)',
        origin_country: 'ألمانيا',
        official_registry: 'FCI Group 1 — Working Trial',
        standards: {
            coat: 'Double Coat (Dense undercoat)',
            temperament: 'شجاع، يقظ، عالي التركيز والقدرة على التدريب',
            health_screening: 'HD-A / ED-0 / Degenerative Myelopathy Clear'
        },
        loci: [
            { locus: 'MC1R (E)', name: 'القناع الأسود واللون الأساسي', allele: 'Em/E', note: 'يحمل القناع الأسود القياسي' },
            { locus: 'ASIP (A)', name: 'نمط الفراء والسرج', allele: 'as/a', note: 'أسود مع تان وسرج كلاسيكي' },
            { locus: 'TYRP1 (B)', name: 'الصبغة البنية/الشوكولاتة', allele: 'B/B', note: 'سليم ولا يحمل البني المتنحي' },
            { locus: 'MLPH (D)', name: 'عامل تخفيف اللون الأزرق', allele: 'D/D', note: 'كثافة صبغة كاملة' },
            { locus: 'FGF5', name: 'طول الشعر والفراء', allele: 'S/S', note: 'شعر قصير مزدوج قياسي' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <path d="M45,115 C40,80 65,48 95,48 Q125,48 145,72 Q160,92 150,118 Z" fill="#9a6a43"/>
            <path d="M85,52 L95,18 L110,42 Z M125,62 L140,28 L150,58 Z" fill="#543725"/>
            <path d="M75,78 Q105,62 135,82 Q105,112 75,78 Z" fill="#15171a"/>
            <circle cx="132" cy="70" r="3.5" fill="#fff"/><circle cx="132" cy="70" r="1.8" fill="#000"/>
            <path d="M65,118 v28 M90,118 v28 M120,118 v28 M140,118 v28" stroke="#5c3c26" stroke-width="5" stroke-linecap="round"/>
        </svg>`
    },
    saluki_smooth: {
        id: 'saluki_smooth',
        species_id: 'CANINE',
        name_ar: 'السلوقي العربي الأصيل',
        name_en: 'Saluki (Arabian Sighthound)',
        origin_country: 'الشرق الأوسط',
        official_registry: 'FCI Group 10 — Sighthounds',
        standards: {
            coat: 'Smooth / Fringed',
            temperament: 'سريع، وفيّ، صبور، مستقل وذو بصيرة حادة',
            health_screening: 'Cardiac Clear / Thyroid Sighthound Specific'
        },
        loci: [
            { locus: 'MC1R (E)', name: 'سلسلة أليلات الجريزل', allele: 'Eg/E', note: 'يحمل صفة التوشيح (Grizzle)' },
            { locus: 'ASIP (A)', name: 'توزيع الصبغات', allele: 'ay/at', note: 'ذهبي / فاون مميز' },
            { locus: 'CBD103 (K)', name: 'السيادة اللونية', allele: 'ky/ky', note: 'يسمح بتعبير كامل للنمط' },
            { locus: 'MLPH (D)', name: 'التخفيف', allele: 'D/D', note: 'نقي' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <path d="M35,110 Q55,60 85,45 Q115,35 145,50 Q160,65 150,90 Q125,100 95,110 Z" fill="#d4af37"/>
            <path d="M125,48 L138,20 L146,45 Z" fill="#b59020"/>
            <path d="M142,50 Q155,75 148,95" stroke="#9a7515" stroke-width="3" fill="none"/>
            <circle cx="138" cy="55" r="3" fill="#000"/>
            <path d="M55,110 L50,145 M80,110 L78,145 M115,110 L118,145 M140,105 L143,145" stroke="#a68020" stroke-width="3.5" stroke-linecap="round"/>
        </svg>`
    },
    border_collie: {
        id: 'border_collie',
        species_id: 'CANINE',
        name_ar: 'البوردر كولي (الراعي الذكي)',
        name_en: 'Border Collie (Intelligence Elite)',
        origin_country: 'بريطانيا العظمى',
        official_registry: 'FCI Group 1 — Sheepdogs',
        standards: {
            coat: 'Rough / Double Coat',
            temperament: 'قمة الذكاء والتركيز، استجابة فورية، طاقة عمل متقدة',
            health_screening: 'OFA Hip / CEA DNA Clear / MDR1 Clear'
        },
        loci: [
            { locus: 'MITF (S)', name: 'البقع البيضاء (Piebald)', allele: 'N/S', note: 'طوق أبيض كلاسيكي على الصدر' },
            { locus: 'TYRP1 (B)', name: 'اللون البني', allele: 'B/b', note: 'أسود مع إمكانية توارث الشوكولاتة' },
            { locus: 'PMEL (M)', name: 'جين الميرل', allele: 'm/m', note: 'خالي من طفرة الدبل ميرل' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <path d="M40,115 C35,75 65,45 100,45 Q130,45 155,75 Q165,100 150,120 Z" fill="#111111"/>
            <path d="M85,52 L95,18 L108,45 Z M130,65 L145,28 L152,60 Z" fill="#111111"/>
            <ellipse cx="110" cy="95" rx="25" ry="32" fill="#ffffff"/>
            <path d="M125,75 L150,85 L140,95 Z" fill="#ffffff"/>
            <circle cx="135" cy="68" r="3" fill="#3b82f6"/>
            <path d="M60,115 v28 M85,115 v28 M120,115 v28 M140,115 v28" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
        </svg>`
    },

    // 🐈 FELINE BREEDS
    egyptian_mau: {
        id: 'egyptian_mau',
        species_id: 'FELINE',
        name_ar: 'الماو المصري (القط الفرعوني المرقط)',
        name_en: 'Egyptian Mau (Natural Spotted)',
        origin_country: 'مصر',
        official_registry: 'CFA / TICA Championship',
        standards: {
            coat: 'Silvery Smoke with Natural Spots',
            temperament: 'أسرع قط أليف (48 كم/ساعة)، حنون، فائق الذكاء',
            health_screening: 'Pyruvate Kinase Deficiency Clear'
        },
        loci: [
            { locus: 'Tabby (Ta)', name: 'التنقيط الطبيعي', allele: 'Ta/Ta', note: 'نقاط برونزية وفضية نقية' },
            { locus: 'Orange (O)', name: 'جين البرتقالي المرتبط بالجنس', allele: 'o/o', note: 'فضي/برونزي متناسق' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <ellipse cx="100" cy="85" rx="48" ry="32" fill="#94a3b8"/>
            <circle cx="145" cy="60" r="18" fill="#94a3b8"/>
            <polygon points="135,48 142,25 152,45" fill="#64748b"/>
            <polygon points="148,46 158,25 165,48" fill="#64748b"/>
            <circle cx="152" cy="58" r="3.5" fill="#10b981"/><circle cx="152" cy="58" r="1.5" fill="#000"/>
            <circle cx="90" cy="75" r="4" fill="#334155"/><circle cx="110" cy="85" r="3.5" fill="#334155"/><circle cx="80" cy="95" r="3" fill="#334155"/>
            <path d="M60,110 L55,140 M80,110 L78,140 M120,110 L122,140 M140,110 L142,140" stroke="#64748b" stroke-width="3.5" stroke-linecap="round"/>
        </svg>`
    },

    // 🐎 EQUINE BREEDS
    arabian_saklawi: {
        id: 'arabian_saklawi',
        species_id: 'EQUINE',
        name_ar: 'الخيل العربي الأصيل (رسن الصقلاوي)',
        name_en: 'Pure Arabian (Saklawi Strain)',
        origin_country: 'الجزيرة العربية ومصر (زهراء المعادي)',
        official_registry: 'WAHO / Egyptian Agricultural Organization',
        standards: {
            strain: 'الصقلاوية (رمز الجمال والرشاقة الفائقة)',
            temperament: 'شجاعة، عزة نفس، سرعة خاطفة، ارتباط بالخيال',
            health_screening: 'SCID Clear / CA Clear / LFS Clear'
        },
        loci: [
            { locus: 'Extension (E)', name: 'اللون الأساسي (أشقر/أسود)', allele: 'E/e', note: 'يحمل الأشقر الملكي' },
            { locus: 'Agouti (A)', name: 'توزيع السواد', allele: 'A/a', note: 'كميت نقي' },
            { locus: 'Grey (G)', name: 'الشيب والتحول للرمادي الفضي', allele: 'G/g', note: 'يتحول لأبيض ساطع مع العمر' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <path d="M35,115 Q60,55 95,35 Q125,20 155,30 Q175,38 170,60 Q155,80 130,85 Q110,80 90,110 Z" fill="#D4AF37"/>
            <path d="M145,28 Q130,5 110,20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="152" cy="45" r="3.5" fill="#000"/>
            <path d="M125,85 L135,145 M100,95 L105,145 M75,110 L70,145 M50,115 L45,145" stroke="#9a7b20" stroke-width="4.5" stroke-linecap="round"/>
        </svg>`
    },

    // 🕊️ AVIAN BREEDS
    pigeon_safi: {
        id: 'pigeon_safi',
        species_id: 'AVIAN',
        name_ar: 'الصافي خليل (توب نوادر الغية المصرية)',
        name_en: 'Egyptian Safi Pigeon',
        origin_country: 'مصر',
        official_registry: 'الاتحاد العام لغواة الحمام المصري',
        standards: {
            features: 'استدارة الرأس، قصر المنقار وعظمة الأنف، صفاء اللون الياقوتي بالعين',
            flight_power: 'ثبات هوائي شاهق، وذكاء البوصلة الملاحية'
        },
        loci: [
            { locus: 'Ash-Red (Bᴬ)', name: 'الريش الأحمر والقرنفلي', allele: 'Bᴬ/b', note: 'أحمر قرنفلي سائد' },
            { locus: 'Pattern (C)', name: 'نمط الصافي بلا خطوط', allele: 'C/C', note: 'صافي نقي كالثلج' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <ellipse cx="95" cy="85" rx="45" ry="28" fill="#f8fafc"/>
            <circle cx="140" cy="60" r="16" fill="#f8fafc"/>
            <polygon points="152,58 168,62 152,68" fill="#f59e0b"/>
            <circle cx="142" cy="56" r="3.5" fill="#f43f5e"/><circle cx="142" cy="56" r="1.5" fill="#000"/>
            <path d="M60,85 Q30,70 15,90 Q40,105 60,98 Z" fill="#cbd5e1"/>
            <path d="M90,112 L85,138 M105,112 L110,138" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
        </svg>`
    },

    // 🐪 CAMELID BREEDS
    camel_majahim: {
        id: 'camel_majahim',
        species_id: 'CAMELID',
        name_ar: 'المجاهيم (سود العرنون الأصيلة)',
        name_en: 'Al-Majahim Desert Camel',
        origin_country: 'شبه الجزيرة العربية',
        official_registry: 'نادي الإبل ومهرجانات المزاين الكبرى',
        standards: {
            features: 'كِبر الرأس، سواد الوبر الفاحم، تأخر موقع السنام، عِظم الألواح والخف'
        },
        loci: [
            { locus: 'MC1R (Ed)', name: 'السواد الفاحم الحالك', allele: 'Ed/Ed', note: 'أسود داكن نقي' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <ellipse cx="100" cy="90" rx="55" ry="30" fill="#1e1e1e"/>
            <path d="M85,60 Q100,32 115,60 Z" fill="#171717"/>
            <path d="M140,90 Q165,75 170,45 Q175,30 185,35 Q175,60 155,100 Z" fill="#1e1e1e"/>
            <circle cx="178" cy="35" r="2.5" fill="#f59e0b"/>
            <path d="M68,115 L62,145 M88,115 L85,145 M118,115 L120,145 M142,115 L145,145" stroke="#171717" stroke-width="5" stroke-linecap="round"/>
        </svg>`
    },

    // 🌳 FLORA BONSAI
    bonsai_kuromatsu: {
        id: 'bonsai_kuromatsu',
        species_id: 'FLORA_BONSAI',
        name_ar: 'الصنوبر الأسود المعمر (Kuromatsu)',
        name_en: 'Japanese Black Pine Bonsai',
        origin_country: 'اليابان',
        official_registry: 'Nippon Bonsai Association Heritage',
        standards: {
            features: 'صلابة اللحاء وحراشفه، قصر الإبر وكثافتها، انحناء الجذع التراثي (Shakan)'
        },
        loci: [
            { locus: 'Needle Density', name: 'كثافة وتفرع الإبر القزمية', allele: 'ND-Short', note: 'إبر مصغرة نادرة' }
        ],
        svg: `<svg viewBox="0 0 200 160" width="100%" height="100%">
            <path d="M95,135 Q105,95 85,75 Q100,50 95,30" stroke="#5c4033" stroke-width="10" fill="none" stroke-linecap="round"/>
            <circle cx="70" cy="65" r="24" fill="#047857" opacity="0.9"/>
            <circle cx="120" cy="55" r="28" fill="#065f46" opacity="0.92"/>
            <circle cx="95" cy="28" r="20" fill="#10b981"/>
            <rect x="65" y="135" width="70" height="14" rx="4" fill="#2d1e18"/>
        </svg>`
    }
};
