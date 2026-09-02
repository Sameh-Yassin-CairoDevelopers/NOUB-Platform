/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/data/seedData.js
 * Description: Fallback seed data for matches, market, and teams when Supabase is offline or not responding.
 */

export const SEED_PLAYERS = [
    {
        id: 'card_demo_1',
        owner_id: 'user_demo_1',
        display_name: 'أحمد زيزو',
        position: 'FWD',
        activity_type: 'FOOTBALL',
        stats: { rating: 91, matches: 28, goals: 34, pace: 92, shooting: 90, passing: 86, dribbling: 93, defending: 45, physical: 78 },
        visual_dna: { skin: 2, kit: '#D4AF37', hair: 3, logo: 1, face: 1 },
        is_verified: true,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        users: { username: 'زيزو_الملكي', current_zone_id: 1, reputation_score: 99 }
    },
    {
        id: 'card_demo_2',
        owner_id: 'user_demo_2',
        display_name: 'محمد الشناوي',
        position: 'GK',
        activity_type: 'FOOTBALL',
        stats: { rating: 88, matches: 35, goals: 0, diving: 89, handling: 87, kicking: 82, reflex: 91, speed: 50, position: 88 },
        visual_dna: { skin: 1, kit: '#10b981', hair: 1, logo: 2, face: 2 },
        is_verified: true,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        users: { username: 'سد_المعادي', current_zone_id: 1, reputation_score: 96 }
    },
    {
        id: 'card_demo_3',
        owner_id: 'user_demo_3',
        display_name: 'إمام عاشور',
        position: 'MID',
        activity_type: 'FOOTBALL',
        stats: { rating: 89, matches: 22, goals: 14, pace: 85, shooting: 88, passing: 89, dribbling: 87, defending: 76, physical: 84 },
        visual_dna: { skin: 2, kit: '#3b82f6', hair: 4, logo: 3, face: 3 },
        is_verified: true,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        users: { username: 'إمام_الفسطاط', current_zone_id: 1, reputation_score: 94 }
    },
    {
        id: 'card_demo_4',
        owner_id: 'user_demo_4',
        display_name: 'محمد عبد المنعم',
        position: 'DEF',
        activity_type: 'FOOTBALL',
        stats: { rating: 87, matches: 19, goals: 4, pace: 82, shooting: 55, passing: 78, dribbling: 74, defending: 90, physical: 88 },
        visual_dna: { skin: 3, kit: '#ef4444', hair: 2, logo: 1, face: 4 },
        is_verified: true,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        users: { username: 'صخرة_الدفاع', current_zone_id: 2, reputation_score: 95 }
    },
    {
        id: 'card_demo_5',
        owner_id: 'user_demo_5',
        display_name: 'محمود تريزيجيه',
        position: 'FWD',
        activity_type: 'FOOTBALL',
        stats: { rating: 86, matches: 15, goals: 11, pace: 89, shooting: 84, passing: 80, dribbling: 88, defending: 52, physical: 77 },
        visual_dna: { skin: 1, kit: '#8b5cf6', hair: 1, logo: 4, face: 2 },
        is_verified: false,
        created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
        users: { username: 'تريزي_الأهرام', current_zone_id: 3, reputation_score: 91 }
    }
];

export const SEED_TEAMS = [
    {
        id: 'team_demo_1',
        name: 'ملوك الفسطاط',
        zone_id: 1,
        color_primary: '#D4AF37',
        color_secondary: '#111827',
        logo_url: 'fa-crown',
        captain: { username: 'زيزو_الملكي' },
        team_members: [{ count: 8 }]
    },
    {
        id: 'team_demo_2',
        name: 'نسور المعادي',
        zone_id: 1,
        color_primary: '#3b82f6',
        color_secondary: '#1e293b',
        logo_url: 'fa-shield-halved',
        captain: { username: 'سد_المعادي' },
        team_members: [{ count: 7 }]
    },
    {
        id: 'team_demo_3',
        name: 'فرسان الأهرام',
        zone_id: 3,
        color_primary: '#10b981',
        color_secondary: '#064e3b',
        logo_url: 'fa-trophy',
        captain: { username: 'تريزي_الأهرام' },
        team_members: [{ count: 6 }]
    },
    {
        id: 'team_demo_4',
        name: 'ذئاب مدينة نصر',
        zone_id: 4,
        color_primary: '#ef4444',
        color_secondary: '#450a0a',
        logo_url: 'fa-bolt',
        captain: { username: 'صخرة_الدفاع' },
        team_members: [{ count: 8 }]
    }
];

export const SEED_MATCHES = [
    {
        id: 'match_demo_1',
        score_a: 5,
        score_b: 3,
        status: 'FINISHED',
        played_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        zone_id: 1,
        team_a: { id: 'team_demo_1', name: 'ملوك الفسطاط', logo_url: 'fa-crown', color_primary: '#D4AF37' },
        team_b: { id: 'team_demo_2', name: 'نسور المعادي', logo_url: 'fa-shield-halved', color_primary: '#3b82f6' },
        match_players: [
            { player_id: 'user_demo_1', goals: 3, assists: 1, is_mvp: true, users: { username: 'زيزو_الملكي' } },
            { player_id: 'user_demo_3', goals: 2, assists: 2, is_mvp: false, users: { username: 'إمام_الفسطاط' } }
        ]
    },
    {
        id: 'match_demo_2',
        score_a: 2,
        score_b: 2,
        status: 'FINISHED',
        played_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        zone_id: 3,
        team_a: { id: 'team_demo_3', name: 'فرسان الأهرام', logo_url: 'fa-trophy', color_primary: '#10b981' },
        team_b: { id: 'team_demo_4', name: 'ذئاب مدينة نصر', logo_url: 'fa-bolt', color_primary: '#ef4444' },
        match_players: [
            { player_id: 'user_demo_5', goals: 2, assists: 0, is_mvp: true, users: { username: 'تريزي_الأهرام' } }
        ]
    }
];

export const SEED_ALERTS = [
    {
        id: 'alert_demo_1',
        sender_id: 'user_demo_1',
        type: 'GK',
        zone_id: 1,
        notes: 'مباراة 7 ضد 7 بملعب الفسطاط الرئيسي الساعة 9:00 مساءً - ناقص حارس مرمى فوراً!',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        sender: { username: 'زيزو_الملكي', current_zone_id: 1 }
    },
    {
        id: 'alert_demo_2',
        sender_id: 'user_demo_4',
        type: 'PLAYER',
        zone_id: 1,
        notes: 'مباراة خماسية في المعادي - مطلوب لاعب وسط أو جناح جاهز',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 5400000).toISOString(),
        sender: { username: 'صخرة_الدفاع', current_zone_id: 1 }
    }
];
