/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/data/pharaohsData.js
 * Version: 3.0.0 (PHARAONIC CRAFTING, TOMBS & MARKET DATA)
 * Description: Data catalog for Workshop production lines, 62 KV Tombs with academic
 *              historic metadata, P2P Swap albums, and Monumental Projects.
 */

export const PHARAONIC_RESOURCES = {
    LIMESTONE: { id: 'LIMESTONE', name_ar: 'الحجر الجيري الملكي', icon: '🧱', base_value: 10 },
    CLAY: { id: 'CLAY', name_ar: 'طمي النيل الخصيب', icon: '🏺', base_value: 8 },
    PAPYRUS: { id: 'PAPYRUS', name_ar: 'ألياف البردي المقدس', icon: '📜', base_value: 15 },
    BRONZE: { id: 'BRONZE', name_ar: 'البرونز المصهور', icon: '🪙', base_value: 25 },
    GOLD_LEAF: { id: 'GOLD_LEAF', name_ar: 'رقائق الذهب النوبي', icon: '✨', base_value: 50 },
    LAPIS_LAZULI: { id: 'LAPIS_LAZULI', name_ar: 'اللازورد الفرعوني', icon: '💎', base_value: 100 }
};

export const PHARAONIC_WORKSHOPS = [
    {
        id: 'ws_stone',
        name_ar: 'ورشة نحت الأحجار والصروح',
        output_item: 'LIMESTONE',
        rate_per_min: 12,
        cost_to_upgrade: 500,
        icon: 'fa-cubes-stacked',
        color: '#d4af37'
    },
    {
        id: 'ws_pottery',
        name_ar: 'فخار وأواني الطمي الملكية',
        output_item: 'CLAY',
        rate_per_min: 15,
        cost_to_upgrade: 400,
        icon: 'fa-jar',
        color: '#e07a5f'
    },
    {
        id: 'ws_papyrus',
        name_ar: 'مخطوطات ولفائف البردي',
        output_item: 'PAPYRUS',
        rate_per_min: 8,
        cost_to_upgrade: 650,
        icon: 'fa-scroll',
        color: '#81b29a'
    },
    {
        id: 'ws_foundry',
        name_ar: 'سباكة البرونز والأدوات',
        output_item: 'BRONZE',
        rate_per_min: 5,
        cost_to_upgrade: 900,
        icon: 'fa-fire-burner',
        color: '#f2cc8f'
    }
];

export const PHARAONIC_EXPERTS = [
    {
        id: 'exp_imhotep',
        name_ar: 'المهندس الأعظم إيمحوتب',
        title_ar: 'مستشار العمارة الملكية',
        bonus_desc: '+50% تسريع إنتاج الأحجار والبناء',
        boost_type: 'LIMESTONE',
        multiplier: 1.5,
        cost: 2500,
        icon: 'fa-compass-drafting'
    },
    {
        id: 'exp_ptah',
        name_ar: 'الحكيم بتاح حتب',
        title_ar: 'كبير الحرفيين والنقاشين',
        bonus_desc: '+40% جودة وإنتاج البردي والفخار',
        boost_type: 'PAPYRUS',
        multiplier: 1.4,
        cost: 2000,
        icon: 'fa-feather'
    },
    {
        id: 'exp_senenmut',
        name_ar: 'المعماري سننموت',
        title_ar: 'مهندس الدير البحري',
        bonus_desc: '+60% كفاءة سباكة البرونز والصروح',
        boost_type: 'BRONZE',
        multiplier: 1.6,
        cost: 3200,
        icon: 'fa-monument'
    }
];

export const MASTER_ALBUMS = [
    {
        id: 'album_ennead',
        name_ar: 'تاسوع هليوبوليس المقدس',
        category: 'MYTHOLOGY',
        total_cards: 9,
        reward_gold: 50000,
        cards: ['رع', 'شو', 'تفنوت', 'جب', 'نوت', 'أوزوريس', 'إيزيس', 'ست', 'نفتيس']
    },
    {
        id: 'album_kings',
        name_ar: 'ملوك الفراعنة العِظام',
        category: 'HISTORY',
        total_cards: 10,
        reward_gold: 60000,
        cards: ['مينا موحد القطرين', 'خوفو', 'خفرع', 'منكاورع', 'حتشبسوت', 'تحتمس الثالث', 'أخناتون', 'توت عنخ آمون', 'رمسيس الثاني', 'رمسيس الثالث']
    },
    {
        id: 'album_beasts',
        name_ar: 'وحوش وحراس المعابد الأسطورية',
        category: 'BEASTS',
        total_cards: 8,
        reward_gold: 45000,
        cards: ['أبو الهول', 'أنوبيس الحارس', 'سخمت اللبوءة', 'سوبك التمساح', 'حورس الصقر', 'باستت القطة', 'أبيس الثور', 'عميمت المفترس']
    },
    {
        id: 'album_dendera',
        name_ar: 'أسرار فلك معبد دندرة',
        category: 'ASTRONOMY',
        total_cards: 6,
        reward_gold: 40000,
        cards: ['دائرة بروج دندرة', 'الشعري اليمانية', 'سقف قاعة الأعمدة', 'عين حورس الفلكية', 'بوابة الشفق', 'عرش حتحور']
    },
    {
        id: 'album_arsenal',
        name_ar: 'الترسانة والعتاد الحربي النوبي',
        category: 'WARFARE',
        total_cards: 7,
        reward_gold: 48000,
        cards: ['العجلة الحربية الذهبية', 'القوس المركب', 'السيف المنجلي الخبيش', 'درع جلد التمساح', 'رمح الكنانة', 'خوذة النمس الحربية', 'فأس المعركة الملكي']
    }
];

export const GREAT_PROJECTS = [
    {
        id: 'proj_khufu',
        name_ar: 'الهرم الأكبر (صرح خوفو الخالد)',
        required_limestone: 500,
        required_gold: 25000,
        reward_passive_per_hour: 1200,
        icon: 'fa-landmark',
        desc: 'أعظم صرح معماري في العالم القديم يمنح عائداً ملكياً مستمراً للذهب.'
    },
    {
        id: 'proj_karnak',
        name_ar: 'بهو أعمدة معبد الكرنك',
        required_limestone: 350,
        required_bronze: 150,
        required_gold: 18000,
        reward_passive_per_hour: 850,
        icon: 'fa-monument',
        desc: '134 عموداً أسطورياً يعززون سرعة المقايضة وتخفيض رسوم السوق.'
    },
    {
        id: 'proj_philae',
        name_ar: 'معبد فيلة ومحراب إيزيس النوبي',
        required_limestone: 300,
        required_papyrus: 200,
        required_gold: 20000,
        reward_passive_per_hour: 950,
        icon: 'fa-place-of-worship',
        desc: 'جوهرة النيل تمنح مكافأة مضاعفة للخبرة في كافة الأنشطة.'
    }
];

/**
 * All 62 Historical Tombs in the Valley of the Kings (KV1 to KV62).
 */
export const KV_TOMBS_CATALOG = [
    { kv_number: 1, name_ar: 'مقبرة رمسيس السابع', dynasty: 'الأسرة 20', code_length: 3, secret_code: 358, hint: 'المجموع = 16، كل الأرقام فردية ما عدا الأخير' },
    { kv_number: 2, name_ar: 'مقبرة رمسيس الرابع', dynasty: 'الأسرة 20', code_length: 3, secret_code: 426, hint: 'المجموع = 12، أرقام زوجية تصاعدية وتنازلية' },
    { kv_number: 3, name_ar: 'مقبرة أحد أبناء رمسيس الثالث', dynasty: 'الأسرة 20', code_length: 3, secret_code: 147, hint: 'متتالية حسابية بفارق 3' },
    { kv_number: 4, name_ar: 'مقبرة رمسيس الحادي عشر', dynasty: 'الأسرة 20', code_length: 3, secret_code: 911, hint: 'رقم النجدة الفرعوني، المجموع = 11' },
    { kv_number: 5, name_ar: 'أضخم مقابر وادي الملوك (أبناء رمسيس الثاني)', dynasty: 'الأسرة 19', code_length: 4, secret_code: 1210, hint: '121 غرفة، المجموع = 4' },
    { kv_number: 6, name_ar: 'مقبرة رمسيس التاسع', dynasty: 'الأسرة 20', code_length: 3, secret_code: 999, hint: 'ثلاث تسعات مقدسة' },
    { kv_number: 7, name_ar: 'مقبرة رمسيس الثاني (الأعظم)', dynasty: 'الأسرة 19', code_length: 4, secret_code: 1279, hint: 'سنة اعتلاء رمسيس الثاني للعرش ق.م' },
    { kv_number: 8, name_ar: 'مقبرة مرنبتاح', dynasty: 'الأسرة 19', code_length: 3, secret_code: 524, hint: 'حاصل ضرب الأول في الثاني يعطي 10' },
    { kv_number: 9, name_ar: 'مقبرة رمسيس الخامس والسادس', dynasty: 'الأسرة 20', code_length: 3, secret_code: 569, hint: 'الأرقام الثلاثة متتالية ومجموعهم 20' },
    { kv_number: 10, name_ar: 'مقبرة أمنمسس', dynasty: 'الأسرة 19', code_length: 3, secret_code: 333, hint: 'ثلث الرقم 999' },
    { kv_number: 11, name_ar: 'مقبرة رمسيس الثالث (مقبرة العازفين)', dynasty: 'الأسرة 20', code_length: 4, secret_code: 1184, hint: 'سنة بداية الحملات الكبرى' },
    { kv_number: 12, name_ar: 'مقبرة جماعية أسرية', dynasty: 'الأسرة 18/19', code_length: 3, secret_code: 120, hint: 'حاصل ضرب 1 × 2 × 0 = 0، المجموع = 3' },
    { kv_number: 13, name_ar: 'مقبرة المستشار باي', dynasty: 'الأسرة 19', code_length: 3, secret_code: 314, hint: 'النسبة التقريبية ط (Pi)' },
    { kv_number: 14, name_ar: 'مقبرة الملكة توسرت وست نخت', dynasty: 'الأسرة 19/20', code_length: 3, secret_code: 248, hint: 'متتالية قوى العدد 2' },
    { kv_number: 15, name_ar: 'مقبرة سيتي الثاني', dynasty: 'الأسرة 19', code_length: 3, secret_code: 150, hint: 'عشر الرقم 1500' },
    { kv_number: 16, name_ar: 'مقبرة رمسيس الأول', dynasty: 'الأسرة 19', code_length: 3, secret_code: 129, hint: 'الخانة الوسطى ضعف الأولى والأخيرة مكعب الأولى' },
    { kv_number: 17, name_ar: 'مقبرة سيتي الأول (أجمل مقابر الوادي)', dynasty: 'الأسرة 19', code_length: 4, secret_code: 1370, hint: 'أرقام مجموعها 11' },
    { kv_number: 18, name_ar: 'مقبرة رمسيس العاشر', dynasty: 'الأسرة 20', code_length: 3, secret_code: 100, hint: 'مربع الرقم 10' },
    { kv_number: 19, name_ar: 'مقبرة منتوحرخبشف', dynasty: 'الأسرة 20', code_length: 3, secret_code: 719, hint: 'الأول 7 والأخير 9 والوسط 1' },
    { kv_number: 20, name_ar: 'مقبرة حتشبسوت وتحتمس الأول', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1479, hint: 'بداية حكم حتشبسوت' },
    { kv_number: 21, name_ar: 'مقبرة ملكات مجهولات', dynasty: 'الأسرة 18', code_length: 3, secret_code: 212, hint: 'رقم متماثل يبدأ وينتهي بـ 2' },
    { kv_number: 22, name_ar: 'مقبرة أمنحتب الثالث (الوادي الغربي)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1386, hint: 'العصر الذهبي للأسرة 18' },
    { kv_number: 23, name_ar: 'مقبرة الملك آي (خليفة توت عنخ آمون)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 132, hint: 'مجموع أرقامه 6' },
    { kv_number: 24, name_ar: 'مقبرة غير مكتملة (الوادي الغربي)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 240, hint: 'الرقم 24 وبجواره صفر' },
    { kv_number: 25, name_ar: 'مقبرة مخصصة لإخناتون قبل تل العمارنة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 525, hint: 'مربع 5 هو 25' },
    { kv_number: 26, name_ar: 'مقبرة مجهولة بالوادي الشرقي', dynasty: 'الأسرة 18', code_length: 3, secret_code: 260, hint: 'الرقم 26 مضروب في 10' },
    { kv_number: 27, name_ar: 'مقبرة مجهولة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 279, hint: 'أرقام تصاعدية مجموعها 18' },
    { kv_number: 28, name_ar: 'مقبرة أمراء الأسرة 18', dynasty: 'الأسرة 18', code_length: 3, secret_code: 284, hint: 'أول رقمين 28 والأخير نصف 8' },
    { kv_number: 29, name_ar: 'مقبرة غير مستكشفة بالكامل', dynasty: 'الأسرة 18', code_length: 3, secret_code: 290, hint: '29 بجواره صفر' },
    { kv_number: 30, name_ar: 'مقبرة اللورد بيلفور', dynasty: 'الأسرة 18', code_length: 3, secret_code: 303, hint: 'متناظر حول الصفر' },
    { kv_number: 31, name_ar: 'مقبرة أمراء مجهولين', dynasty: 'الأسرة 18', code_length: 3, secret_code: 313, hint: 'رقم متناظر مجموع أرقامه 7' },
    { kv_number: 32, name_ar: 'مقبرة الملكة تيا (أم تحتمس الرابع)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 324, hint: 'مربع الرقم 18' },
    { kv_number: 33, name_ar: 'مقبرة غير منقوشة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 330, hint: 'الرقم 33 مع صفر' },
    { kv_number: 34, name_ar: 'مقبرة تحتمس الثالث (نابليون الشرق القديم)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1425, hint: 'سنة تتويج تحتمس الثالث' },
    { kv_number: 35, name_ar: 'مقبرة أمنحتب الثاني (خبيئة المومياوات الملكية)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1400, hint: 'عام 1400 ق.م' },
    { kv_number: 36, name_ar: 'مقبرة مايحربري (حامل المروحة الملكي)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 369, hint: 'مفتاح تسلا الكوني 3-6-9' },
    { kv_number: 37, name_ar: 'مقبرة أواني ولقى أثرية', dynasty: 'الأسرة 18', code_length: 3, secret_code: 371, hint: 'مجموع مكعبات أرقامه يساويه (Armstrong Number)' },
    { kv_number: 38, name_ar: 'مقبرة تحتمس الأول المعاد دفنه', dynasty: 'الأسرة 18', code_length: 3, secret_code: 380, hint: '38 مع صفر' },
    { kv_number: 39, name_ar: 'مقبرة أمنحتب الأول المحتملة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 399, hint: 'أكبر عدد ثلاثي بدايته 3' },
    { kv_number: 40, name_ar: 'مقبرة سيدات البلاط الملكي', dynasty: 'الأسرة 18', code_length: 3, secret_code: 400, hint: 'مربع الرقم 20' },
    { kv_number: 41, name_ar: 'حفرة دفن غير مستخدمة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 414, hint: 'متناظر ومجموعه 9' },
    { kv_number: 42, name_ar: 'مقبرة حتشبسوت مريت رع', dynasty: 'الأسرة 18', code_length: 3, secret_code: 420, hint: 'ضعف 210' },
    { kv_number: 43, name_ar: 'مقبرة تحتمس الرابع', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1397, hint: 'صاحب لوحة الحلم عند أبو الهول' },
    { kv_number: 44, name_ar: 'مقبرة غير ملكية', dynasty: 'الأسرة 18', code_length: 3, secret_code: 444, hint: 'ثلاث أربعات' },
    { kv_number: 45, name_ar: 'مقبرة أوسرحات (المشرف على حقول آمون)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 450, hint: 'نصف الـ 900' },
    { kv_number: 46, name_ar: 'مقبرة يويا وتويا (أجداد إخناتون وتوت)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1905, hint: 'سنة اكتشاف المقبرة سليمة تماماً' },
    { kv_number: 47, name_ar: 'مقبرة الملك سبتاح', dynasty: 'الأسرة 19', code_length: 3, secret_code: 470, hint: '47 مع صفر' },
    { kv_number: 48, name_ar: 'مقبرة الوزير أمنمحات (سريا)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 482, hint: 'أرقام زوجية 4 ثم 8 ثم 2' },
    { kv_number: 49, name_ar: 'مقبرة الكُتّاب', dynasty: 'الأسرة 18', code_length: 3, secret_code: 490, hint: '49 مضروبة في 10' },
    { kv_number: 50, name_ar: 'مقبرة الحيوانات الأليفة الملكية (الكلاب والقرود)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 505, hint: 'متناظر يحيطه الرقم 5' },
    { kv_number: 51, name_ar: 'مقبرة الحيوانات المقدسة الثانية', dynasty: 'الأسرة 18', code_length: 3, secret_code: 512, hint: 'مكعب الرقم 8 (2⁹)' },
    { kv_number: 52, name_ar: 'مقبرة القرد الملكي المحنط', dynasty: 'الأسرة 18', code_length: 3, secret_code: 520, hint: '52 مع صفر' },
    { kv_number: 53, name_ar: 'حفرة دفن مجهولة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 531, hint: 'أرقام فردية تنازلية' },
    { kv_number: 54, name_ar: 'خبيئة تحنيط توت عنخ آمون (أواني ومواد التحنيط)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1907, hint: 'سنة العثور على خبيئة التحنيط' },
    { kv_number: 55, name_ar: 'مقبرة عمارنة الغامضة (مومياء إخناتون أو سمنخكارع)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 555, hint: 'ثلاث خمسات مقدسة' },
    { kv_number: 56, name_ar: 'مقبرة الذهب (كنز الأمراء الذهبي)', dynasty: 'الأسرة 19', code_length: 4, secret_code: 5600, hint: 'رقم المقبرة 56 ومعه صفران' },
    { kv_number: 57, name_ar: 'مقبرة حورمحب (القائد ومؤسس الاستقرار)', dynasty: 'الأسرة 18/19', code_length: 4, secret_code: 1319, hint: 'سنة اعتلاء حورمحب العرش' },
    { kv_number: 58, name_ar: 'مقبرة الرقائق الذهبية الملكية', dynasty: 'الأسرة 18', code_length: 3, secret_code: 580, hint: '58 مع صفر' },
    { kv_number: 59, name_ar: 'حفرة مجهولة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 599, hint: '5 يتبعها تسعتان' },
    { kv_number: 60, name_ar: 'مقبرة المرضعة الملكية سات رع (مومياء حتشبسوت)', dynasty: 'الأسرة 18', code_length: 3, secret_code: 600, hint: 'ستة مئة ناصعة' },
    { kv_number: 61, name_ar: 'مقبرة غير مستخدمة', dynasty: 'الأسرة 18', code_length: 3, secret_code: 610, hint: 'متتالية فيبوناتشي: 610' },
    { kv_number: 62, name_ar: 'مقبرة الفرعون الذهبي توت عنخ آمون (الكنز الأسطوري الأكمل)', dynasty: 'الأسرة 18', code_length: 4, secret_code: 1922, hint: 'العام الخالد لاكتشاف هاوارد كارتر لمقبرة توت عنخ آمون' }
];
