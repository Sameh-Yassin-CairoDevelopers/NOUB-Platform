/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/data/sportsData.js
 * Version: 3.0.0 (SPORTS ZONES, POSITIONS & TACTICS)
 * Description: Regional geographic zones across Cairo/Egypt, player positions,
 *              tactical formations, and tournament configurations.
 */

export const EGYPTIAN_ZONES = [
    { id: 'fustat_maadi', name_ar: 'الفسطاط والمعادي وطرة', governorate: 'القاهرة' },
    { id: 'nasr_city_heliopolis', name_ar: 'مدينة نصر ومصر الجديدة', governorate: 'القاهرة' },
    { id: 'shubra_rawd', name_ar: 'شبرا وروض الفرج والزاوية', governorate: 'القاهرة' },
    { id: 'dokki_mohandessin', name_ar: 'الدقي والمهندسين والعجوزة', governorate: 'الجيزة' },
    { id: 'haram_faisal', name_ar: 'الهرم وفيصل والعمرانية', governorate: 'الجيزة' },
    { id: 'tagamoa_rehab', name_ar: 'التجمع والرحاب ومدينتي', governorate: 'القاهرة الجديدة' },
    { id: 'october_zayed', name_ar: '6 أكتوبر والشيخ زايد', governorate: 'الجيزة' },
    { id: 'helwan_15may', name_ar: 'حلوان و15 مايو والتبين', governorate: 'القاهرة' },
    { id: 'alex_smoha', name_ar: 'سموحة وسيدي جابر ومحرم بك', governorate: 'الإسكندرية' }
];

export const PLAYER_POSITIONS = {
    GK: { code: 'GK', name_ar: 'حارس مرمى', badge_color: '#eab308', icon: 'fa-hands-clapping' },
    CB: { code: 'CB', name_ar: 'قلب دفاع', badge_color: '#3b82f6', icon: 'fa-shield-halved' },
    LB: { code: 'LB', name_ar: 'ظهير أيسر', badge_color: '#3b82f6', icon: 'fa-arrow-left' },
    RB: { code: 'RB', name_ar: 'ظهير أيمن', badge_color: '#3b82f6', icon: 'fa-arrow-right' },
    CM: { code: 'CM', name_ar: 'صانع ألعاب / وسط', badge_color: '#10b981', icon: 'fa-compass' },
    LW: { code: 'LW', name_ar: 'جناح أيسر مهاجم', badge_color: '#ef4444', icon: 'fa-bolt' },
    RW: { code: 'RW', name_ar: 'جناح أيمن مهاجم', badge_color: '#ef4444', icon: 'fa-bolt' },
    ST: { code: 'ST', name_ar: 'رأس حربة / قناص', badge_color: '#ef4444', icon: 'fa-crosshairs' }
};

export const TACTICAL_FORMATIONS = {
    '2-2-1': {
        name: '2-2-1 (خماسي متوازن)',
        players: 5,
        slots: [
            { id: 'p1', pos: 'GK', x: 50, y: 88, role: 'حارس' },
            { id: 'p2', pos: 'CB', x: 28, y: 65, role: 'مدافع أيسر' },
            { id: 'p3', pos: 'CB', x: 72, y: 65, role: 'مدافع أيمن' },
            { id: 'p4', pos: 'CM', x: 35, y: 40, role: 'وسط' },
            { id: 'p5', pos: 'ST', x: 65, y: 18, role: 'مهاجم' }
        ]
    },
    '1-2-1': {
        name: '1-2-1 (رباعي سريع)',
        players: 4,
        slots: [
            { id: 'p1', pos: 'GK', x: 50, y: 88, role: 'حارس' },
            { id: 'p2', pos: 'CB', x: 50, y: 62, role: 'دفاع' },
            { id: 'p3', pos: 'CM', x: 25, y: 38, role: 'جناح' },
            { id: 'p4', pos: 'ST', x: 75, y: 38, role: 'هجوم' }
        ]
    },
    '3-2-1': {
        name: '3-2-1 (سداسي دفاعي)',
        players: 6,
        slots: [
            { id: 'p1', pos: 'GK', x: 50, y: 88, role: 'حارس' },
            { id: 'p2', pos: 'LB', x: 20, y: 68, role: 'ظهير أيسر' },
            { id: 'p3', pos: 'CB', x: 50, y: 70, role: 'قلب دفاع' },
            { id: 'p4', pos: 'RB', x: 80, y: 68, role: 'ظهير أيمن' },
            { id: 'p5', pos: 'CM', x: 50, y: 42, role: 'صانع ألعاب' },
            { id: 'p6', pos: 'ST', x: 50, y: 16, role: 'قناص' }
        ]
    },
    '2-3-1': {
        name: '2-3-1 (سباعي هجومي)',
        players: 7,
        slots: [
            { id: 'p1', pos: 'GK', x: 50, y: 88, role: 'حارس' },
            { id: 'p2', pos: 'CB', x: 30, y: 68, role: 'دفاع أيسر' },
            { id: 'p3', pos: 'CB', x: 70, y: 68, role: 'دفاع أيمن' },
            { id: 'p4', pos: 'LW', x: 20, y: 42, role: 'جناح أيسر' },
            { id: 'p5', pos: 'CM', x: 50, y: 45, role: 'وسط' },
            { id: 'p6', pos: 'RW', x: 80, y: 42, role: 'جناح أيمن' },
            { id: 'p7', pos: 'ST', x: 50, y: 16, role: 'مهاجم' }
        ]
    }
};
