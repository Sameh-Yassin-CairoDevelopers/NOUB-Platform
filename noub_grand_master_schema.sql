-- ==============================================================================
-- 🏛️ NOUB ECOSYSTEM — GRAND MASTER DATABASE SCHEMA (نظام نوب-بر الموحد)
-- ==============================================================================
-- Version: 3.0.0 (Production-Grade / Academic Architecture / Pure In-Game Economy)
-- Target Engine: PostgreSQL 15+ / Supabase Cloud Infrastructure
-- Security Model: Strict Row Level Security (RLS) + Security Definer Stored Procedures
-- Ecosystem Pillars:
--   1. Core Unified Auth & Economy (المستخدم الموحد • 10,000 ذهب ترحيبي • إشعارات ذكية)
--   2. NOUB Sports (النشاط الميداني • كروت اللاعبين • غرف العمليات • الدورات)
--   3. NOUB Pharaohs & Industry (المصانع والورش • المقايضة P2P • 62 مقبرة • كارت الروح)
--   4. NOUB Bio-Sanctuary 89x (الوراثة الحقيقية • سلالات الكلاب والقطط والخيول والبونساي)
-- ==============================================================================

-- تفعيل ملحقات توليد المعرفات الفريدة والتشفير
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- SECTION 1: CORE UNIFIED USERS & CENTRAL ECONOMY (النواة والمحفظة الموحدة)
-- ==============================================================================

-- 1.1 جدول المستخدم الموحد لجميع العوالم (Profiles / Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    telegram_id BIGINT UNIQUE,
    username TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    avatar_dna JSONB DEFAULT '{"skin": 1, "kit": "#D4AF37", "hair": 1, "logo": 1, "face": 1, "collar_offset_y": 0}'::jsonb,
    current_zone_id INT DEFAULT 1,
    noub_coins BIGINT DEFAULT 10000 CHECK (noub_coins >= 0), -- 10,000 ذهب مجاني عند البداية
    prestige BIGINT DEFAULT 0 CHECK (prestige >= 0),
    xp BIGINT DEFAULT 0 CHECK (xp >= 0),
    level INT DEFAULT 1 CHECK (level >= 1),
    xp_to_next_level BIGINT DEFAULT 100 CHECK (xp_to_next_level > 0),
    reputation_score INT DEFAULT 100 CHECK (reputation_score BETWEEN 0 AND 100),
    completed_contracts_count INT DEFAULT 0,
    dna_edu_level INT DEFAULT 50,
    dna_lang_count INT DEFAULT 1,
    dna_sport_type INT DEFAULT 40,
    dna_eve_code TEXT DEFAULT '00000',
    soul_card_serial TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'الملف الشخصي والحساب المالي والخبراتي الموحد للاعب عبر جميع قطاعات نوب';

-- 1.2 المناطق الجغرافية والقطاعات الحضرية
CREATE TABLE IF NOT EXISTS public.zones (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id INT REFERENCES public.zones(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true
);

-- 1.3 الملاعب ومراكز التدريب والمواقع
CREATE TABLE IF NOT EXISTS public.venues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    zone_id INT REFERENCES public.zones(id) ON DELETE SET NULL,
    gps_coords TEXT,
    type TEXT DEFAULT 'OUTDOOR_5A_SIDE',
    is_verified BOOLEAN DEFAULT false
);

-- 1.4 مركز الإشعارات والتوجيه الذكي (Universal Action & Deep-Link Dispatcher)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'SPORTS_MATCH', 'SANCTUARY_BIRTH', 'INDUSTRY_READY', 'SYSTEM'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_realm TEXT NOT NULL, -- 'sports', 'sanctuary', 'industry'
    target_route TEXT NOT NULL, -- المسار الدقيق للشاشة
    is_read BOOLEAN DEFAULT false,
    meta_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5 سجل الأنشطة والعمليات المالية والترقيات الموحد (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'STARTER_BONUS', 'MATCH_WIN', 'FACTORY_UPGRADE', 'BREEDING_EVENT', 'SWAP_COMPLETE'
    realm TEXT NOT NULL, -- 'core', 'sports', 'industry', 'sanctuary'
    description TEXT NOT NULL,
    noub_change BIGINT DEFAULT 0,
    xp_change INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.6 قواعد احتساب النقاط والسمعة
CREATE TABLE IF NOT EXISTS public.scoring_rules (
    id SERIAL PRIMARY KEY,
    event_key TEXT UNIQUE NOT NULL,
    xp_reward INT DEFAULT 0,
    coins_reward INT DEFAULT 0,
    reputation_impact INT DEFAULT 0,
    description TEXT
);

-- ==============================================================================
-- SECTION 2: NOUB SPORTS SECTOR (قطاع نوب الرياضي والميداني)
-- ==============================================================================

-- 2.1 كروت هوية اللاعبين الرياضية
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    activity_type TEXT DEFAULT 'FOOTBALL',
    position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
    visual_dna JSONB NOT NULL DEFAULT '{"skin": 1, "kit": "#3b82f6", "hair": 1, "logo": 1, "face": 1, "collar_offset_y": 0}'::jsonb,
    stats JSONB NOT NULL DEFAULT '{"rating": 70, "pace": 70, "shooting": 70, "passing": 70, "dribbling": 70, "defending": 70, "physical": 70}'::jsonb,
    serial_number INT,
    type TEXT DEFAULT 'GENESIS' CHECK (type IN ('GENESIS', 'SEASONAL', 'GIFT', 'PRO_PLAYER')),
    minted_by UUID REFERENCES public.profiles(id),
    is_verified BOOLEAN DEFAULT false,
    mint_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 طلبات صك الكروت والاعتماد الرياضي
CREATE TABLE IF NOT EXISTS public.mint_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 الفرق الرياضية والأندية الشعبية
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    zone_id INT REFERENCES public.zones(id),
    captain_id UUID NOT NULL REFERENCES public.profiles(id),
    vice_captain_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    logo_dna JSONB DEFAULT '{"primary": "#3b82f6", "secondary": "#000000", "icon": "shield"}'::jsonb,
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    last_match_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 أعضاء وتشكيلات الفرق
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER' CHECK (role IN ('CAPTAIN', 'VICE_CAPTAIN', 'MEMBER')),
    jersey_number INT CHECK (jersey_number BETWEEN 1 AND 99),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 2.5 المواسم الرياضية الرسمية
CREATE TABLE IF NOT EXISTS public.seasons (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 2.6 البطولات والدورات (مثل دورات رمضان)
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'GROUP_STAGE', 'KNOCKOUT', 'COMPLETED')),
    config JSONB DEFAULT '{"max_teams": 8, "groups": 2, "teams_per_group": 4}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 الفرق المشاركة في البطولة وجداول النقاط
CREATE TABLE IF NOT EXISTS public.tournament_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    group_name TEXT DEFAULT 'A',
    points INT DEFAULT 0,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    drawn INT DEFAULT 0,
    lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    goal_diff INT DEFAULT 0,
    UNIQUE(tournament_id, team_id)
);

-- 2.8 جدول المباريات وتأكيد النتائج
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id INT REFERENCES public.seasons(id),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
    team_a_id UUID NOT NULL REFERENCES public.teams(id),
    team_b_id UUID NOT NULL REFERENCES public.teams(id),
    venue_id INT REFERENCES public.venues(id),
    score_a INT DEFAULT 0,
    score_b INT DEFAULT 0,
    creator_id UUID NOT NULL REFERENCES public.profiles(id),
    verifier_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'PENDING_CONFIRMATION' CHECK (status IN ('PENDING_CONFIRMATION', 'CONFIRMED', 'DISPUTED', 'CANCELLED')),
    match_data JSONB DEFAULT '{}'::jsonb,
    stage TEXT DEFAULT 'REGULAR',
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 أحداث المباراة التفصيلية
CREATE TABLE IF NOT EXISTS public.match_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profiles(id),
    event_type TEXT NOT NULL CHECK (event_type IN ('GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD', 'SAVE', 'MVP')),
    minute INT CHECK (minute >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.10 التشكيل وتقييم أداء اللاعبين في المباراة
CREATE TABLE IF NOT EXISTS public.match_lineups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profiles(id),
    is_starter BOOLEAN DEFAULT true,
    performance_rating NUMERIC(3, 1) DEFAULT 6.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, player_id)
);

-- 2.11 سجلات توثيق واعتماد نتائج المباريات
CREATE TABLE IF NOT EXISTS public.match_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL CHECK (action IN ('APPROVED', 'DISPUTED', 'AMENDED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.12 غرفة العمليات وإشارات الطوارئ (جوكر / حارس / حكم / طيار)
CREATE TABLE IF NOT EXISTS public.match_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    responder_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    zone_id BIGINT NOT NULL DEFAULT 1,
    type TEXT NOT NULL CHECK (type IN ('WANTED_JOKER', 'WANTED_GK', 'WANTED_REF', 'I_AM_AVAILABLE')),
    match_time TIMESTAMP WITH TIME ZONE,
    venue_name TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'LOCKED', 'RESOLVED', 'EXPIRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.13 سجل لقطات إحصائيات اللاعبين التاريخية
CREATE TABLE IF NOT EXISTS public.player_stats_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    season_id INT REFERENCES public.seasons(id),
    stats_snapshot JSONB NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.14 أصول وتصميمات الأطقم والشعارات
CREATE TABLE IF NOT EXISTS public.assets (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'KIT_PATTERN', 'BADGE', 'TEXTURE'
    name TEXT,
    resource_url TEXT,
    is_premium BOOLEAN DEFAULT false
);

-- ==============================================================================
-- SECTION 3: PHARAOHS & INDUSTRY SECTOR (قطاع كروت الفراعنة والمصانع والورش)
-- ==============================================================================

-- 3.1 الكروت الماستر الحرفية وكروت الخبراء
CREATE TABLE IF NOT EXISTS public.cards_master (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    rarity_level SMALLINT DEFAULT 0 NOT NULL,
    power_score INT DEFAULT 1 NOT NULL,
    lore TEXT,
    last_serial_number INT DEFAULT 0 NOT NULL
);

-- 3.2 مستويات وتكاليف ترقية الكروت
CREATE TABLE IF NOT EXISTS public.card_levels (
    card_id BIGINT NOT NULL,
    upgrade_level SMALLINT NOT NULL,
    cost_noub BIGINT DEFAULT 0 NOT NULL,
    cost_prestige INT DEFAULT 0 NOT NULL,
    cost_item_id BIGINT,
    cost_item_qty INT DEFAULT 0 NOT NULL,
    power_increase INT DEFAULT 1 NOT NULL,
    PRIMARY KEY (card_id, upgrade_level)
);

-- 3.3 الكروت المملوكة للاعبين في قطاع المصانع
CREATE TABLE IF NOT EXISTS public.player_cards (
    instance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_id BIGINT NOT NULL,
    level SMALLINT DEFAULT 1 NOT NULL,
    power_score INT DEFAULT 1 NOT NULL,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_locked BOOLEAN DEFAULT false NOT NULL,
    serial_id INT
);

-- 3.4 المواد والسلع المصنعة (Items Master)
CREATE TABLE IF NOT EXISTS public.items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('RESOURCE', 'MATERIAL', 'GOOD')),
    image_url TEXT,
    base_value INT DEFAULT 0 NOT NULL
);

-- 3.5 مخزون اللاعب من السلع والمواد
CREATE TABLE IF NOT EXISTS public.player_inventory (
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id BIGINT NOT NULL REFERENCES public.items(id) ON DELETE RESTRICT,
    quantity INT DEFAULT 0 CHECK (quantity >= 0) NOT NULL,
    PRIMARY KEY (player_id, item_id)
);

-- 3.6 مسارات التخصص والنقابات الحرفية (Guilds)
CREATE TABLE IF NOT EXISTS public.specialization_paths (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    unlock_level INT DEFAULT 15 NOT NULL,
    cost_noub_initial_unlock BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3.7 تخصصات اللاعب المفتوحة
CREATE TABLE IF NOT EXISTS public.player_specializations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialization_path_id BIGINT NOT NULL REFERENCES public.specialization_paths(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    UNIQUE(player_id, specialization_path_id)
);

-- 3.8 المصانع والورش الماستر
CREATE TABLE IF NOT EXISTS public.factories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    output_item_id BIGINT NOT NULL REFERENCES public.items(id) ON DELETE RESTRICT,
    base_production_time INT NOT NULL, -- بالدقائق
    type TEXT DEFAULT 'WORKSHOP',
    image_url TEXT,
    specialization_path_id BIGINT REFERENCES public.specialization_paths(id) ON DELETE SET NULL,
    required_level BIGINT DEFAULT 1 NOT NULL,
    build_cost_noub BIGINT DEFAULT 1000 NOT NULL
);

-- 3.9 وصفات ومدخلات المصانع
CREATE TABLE IF NOT EXISTS public.factory_recipes (
    factory_id BIGINT NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
    input_item_id BIGINT NOT NULL REFERENCES public.items(id) ON DELETE RESTRICT,
    input_quantity INT NOT NULL CHECK (input_quantity > 0),
    PRIMARY KEY (factory_id, input_item_id)
);

-- 3.10 مصانع وورش اللاعب
CREATE TABLE IF NOT EXISTS public.player_factories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    factory_id BIGINT NOT NULL REFERENCES public.factories(id) ON DELETE RESTRICT,
    level SMALLINT DEFAULT 1 NOT NULL,
    production_start_time TIMESTAMP WITH TIME ZONE,
    assigned_card_instance_id UUID REFERENCES public.player_cards(instance_id) ON DELETE SET NULL,
    UNIQUE(player_id, factory_id)
);

-- 3.11 العقود والمراسيم الملكية
CREATE TABLE IF NOT EXISTS public.contracts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    reward_score BIGINT DEFAULT 0 NOT NULL,
    reward_prestige BIGINT DEFAULT 0 NOT NULL
);

-- 3.12 متطلبات العقود
CREATE TABLE IF NOT EXISTS public.contract_requirements (
    contract_id BIGINT NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    item_id BIGINT NOT NULL REFERENCES public.items(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (contract_id, item_id)
);

-- 3.13 عقود اللاعب النشطة والمكتملة
CREATE TABLE IF NOT EXISTS public.player_contracts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contract_id BIGINT NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3.14 المشاريع الكبرى (Great Projects)
CREATE TABLE IF NOT EXISTS public.master_great_projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_days BIGINT NOT NULL,
    min_player_level BIGINT NOT NULL,
    required_specialization_id BIGINT,
    cost_noub BIGINT NOT NULL,
    cost_prestige BIGINT NOT NULL,
    requirements JSONB NOT NULL,
    rewards JSONB NOT NULL
);

-- 3.15 مشاريع اللاعب الكبرى
CREATE TABLE IF NOT EXISTS public.player_great_projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID DEFAULT gen_random_uuid() REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id BIGINT REFERENCES public.master_great_projects(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    progress JSONB DEFAULT '{}'::jsonb
);

-- 3.16 ألبومات التجميع الماستر الخمسة
CREATE TABLE IF NOT EXISTS public.master_albums (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    card_ids JSONB NOT NULL,
    reward_noub BIGINT DEFAULT 0 NOT NULL,
    reward_prestige BIGINT DEFAULT 0 NOT NULL
);

-- 3.17 ألبومات اللاعب
CREATE TABLE IF NOT EXISTS public.player_albums (
    id SERIAL PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    album_id INT NOT NULL REFERENCES public.master_albums(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    reward_claimed BOOLEAN DEFAULT false NOT NULL,
    UNIQUE(player_id, album_id)
);

-- 3.18 سوق التبادل والمقايضة المفتوح P2P
CREATE TABLE IF NOT EXISTS public.swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id_offering UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id_offer INT NOT NULL,
    item_id_request INT NOT NULL,
    card_instance_id_offer UUID NOT NULL REFERENCES public.player_cards(instance_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')) NOT NULL,
    price_noub INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3.19 سجل عمليات المقايضة التاريخية
CREATE TABLE IF NOT EXISTS public.swap_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.swap_requests(id) ON DELETE CASCADE,
    player_offering_id UUID NOT NULL REFERENCES public.profiles(id),
    player_accepting_id UUID NOT NULL REFERENCES public.profiles(id),
    card_instance_offered_instance UUID NOT NULL REFERENCES public.player_cards(instance_id),
    card_instance_received_instance UUID NOT NULL REFERENCES public.player_cards(instance_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3.20 كهف فك شفرات مقابر وادي الملوك (KV1 -> KV62)
CREATE TABLE IF NOT EXISTS public.kv_game_progress (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_kv_level INT DEFAULT 1 NOT NULL,
    last_game_result TEXT,
    unlocked_levels_json JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- 3.21 سجل حملات وادي الملوك
CREATE TABLE IF NOT EXISTS public.game_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_type TEXT DEFAULT 'KV Game' NOT NULL,
    result_status TEXT NOT NULL,
    level_kv INT NOT NULL,
    time_taken INT,
    code TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3.22 تمائم وأدوات مساعدة الكهف
CREATE TABLE IF NOT EXISTS public.game_consumables (
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_key TEXT NOT NULL,
    quantity INT DEFAULT 0 CHECK (quantity >= 0) NOT NULL,
    PRIMARY KEY(player_id, item_key)
);

-- 3.23 موسوعة المعرفة المفتوحة
CREATE TABLE IF NOT EXISTS public.player_library (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_key TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(player_id, entry_key)
);

-- 3.24 بيانات بروتوكول UCP-LLM (إيفي وهيباتيا)
CREATE TABLE IF NOT EXISTS public.player_protocol_data (
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    section_key TEXT NOT NULL,
    section_data JSONB NOT NULL,
    PRIMARY KEY (player_id, section_key)
);

-- 3.25 المقابر المعمارية المولدة جينياً
CREATE TABLE IF NOT EXISTS public.player_tombs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    root_id TEXT NOT NULL,
    location_type TEXT NOT NULL,
    construction_progress INT DEFAULT 0,
    maat_score INT DEFAULT 0,
    is_activated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- SECTION 4: NOUB BIO-SANCTUARY 89x SECTOR (قطاع المحمية والأنساب والوراثة 89x)
-- ==============================================================================

-- 4.1 الفصائل والأنواع الماستر (Species Master)
CREATE TABLE IF NOT EXISTS public.species_master (
    id TEXT PRIMARY KEY, -- 'CANINE', 'FELINE', 'EQUINE', 'AVIAN', 'CAMELID', 'FLORA_BONSAI'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    gestation_days_bio INT NOT NULL, -- مدة الحمل البيولوجي
    lifespan_years_bio INT NOT NULL, -- متوسط العمر البيولوجي
    speed_factor NUMERIC(5, 2) DEFAULT 89.00 NOT NULL -- معامل تسريع الزمن 89x
);

-- 4.2 السلالات المعيارية المعتمدة علمياً (FCI / AKC / WAH / Pigeons)
CREATE TABLE IF NOT EXISTS public.breeds_master (
    id TEXT PRIMARY KEY, -- 'gsd', 'saluki', 'border_collie', 'egyptian_mau', 'arabian_saklawi'...
    species_id TEXT NOT NULL REFERENCES public.species_master(id) ON DELETE RESTRICT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    origin_country TEXT,
    official_registry TEXT, -- 'FCI Group 1', 'WAHO', 'Egyptian Pigeon Union'
    standards JSONB NOT NULL DEFAULT '{}'::jsonb,
    traits_baseline JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 4.3 سجل الكائنات الحية بالمحمية (Sanctuary Specimens)
CREATE TABLE IF NOT EXISTS public.sanctuary_specimens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    species_id TEXT NOT NULL REFERENCES public.species_master(id),
    breed_id TEXT NOT NULL REFERENCES public.breeds_master(id),
    name TEXT NOT NULL,
    sex TEXT NOT NULL CHECK (sex IN ('MALE', 'FEMALE', 'HERMAPHRODITE_PLANT')),
    birth_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    generation INT DEFAULT 1 NOT NULL,
    genome JSONB NOT NULL DEFAULT '{}'::jsonb, -- خريطة الأليلات: E, A, K, B, D, S, M, FGF5...
    pedigree JSONB NOT NULL DEFAULT '{"sire": null, "dam": null, "coi": 0.0}'::jsonb,
    phenotype JSONB NOT NULL DEFAULT '{"coat_color": "Standard", "structure": "Balanced"}'::jsonb,
    stats JSONB NOT NULL DEFAULT '{"intelligence": 75, "speed": 70, "endurance": 70, "health": 100}'::jsonb,
    health_status JSONB NOT NULL DEFAULT '{"hip": "HD-A", "elbow": "ED-0", "chic_verified": true}'::jsonb,
    hydration_level INT DEFAULT 100 CHECK (hydration_level BETWEEN 0 AND 100), -- خاص بالبونساي
    pruning_stage TEXT DEFAULT 'VIGOROUS', -- خاص بالبونساي
    is_breeding_listed BOOLEAN DEFAULT false,
    breeding_fee_noub BIGINT DEFAULT 0 CHECK (breeding_fee_noub >= 0),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PREGNANT', 'RESTING', 'HERITAGE_ARCHIVE')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4.4 أحداث التزاوج والحمل النشط بمعدل 89x (Breeding Events)
CREATE TABLE IF NOT EXISTS public.breeding_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_id TEXT NOT NULL REFERENCES public.species_master(id),
    sire_id UUID NOT NULL REFERENCES public.sanctuary_specimens(id),
    dam_id UUID NOT NULL REFERENCES public.sanctuary_specimens(id),
    sire_owner_id UUID NOT NULL REFERENCES public.profiles(id),
    dam_owner_id UUID NOT NULL REFERENCES public.profiles(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expected_whelping_at TIMESTAMP WITH TIME ZONE NOT NULL, -- محسوبة بـ 89x (مثل ~17 ساعة للكلاب)
    litter_size INT DEFAULT 4 CHECK (litter_size >= 1),
    status TEXT DEFAULT 'GESTATING' CHECK (status IN ('GESTATING', 'DELIVERED', 'FAILED')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4.5 جدول التطعيمات المعتمدة (WSAVA 2024 Protocols)
CREATE TABLE IF NOT EXISTS public.specimen_vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specimen_id UUID NOT NULL REFERENCES public.sanctuary_specimens(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL, -- 'Core_CDV_CPV_8W', 'Core_12W', 'Core_16W', 'Rabies'
    administered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT false
);

-- 4.6 سوق ومعرض الكائنات الحية والشتلات المعتمدة
CREATE TABLE IF NOT EXISTS public.specimen_market (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    specimen_id UUID NOT NULL REFERENCES public.sanctuary_specimens(id) ON DELETE CASCADE,
    price_noub BIGINT NOT NULL CHECK (price_noub > 0),
    status TEXT DEFAULT 'LISTED' CHECK (status IN ('LISTED', 'SOLD', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- SECTION 5: STRICT ROW LEVEL SECURITY (منظومة الأمان الصارمة 100%)
-- ==============================================================================

-- تفعيل RLS على جميع الجداول بلا استثناء
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mint_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialization_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factory_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_great_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_great_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kv_game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_protocol_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_tombs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeds_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctuary_specimens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specimen_vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specimen_market ENABLE ROW LEVEL SECURITY;

-- 5.1 سياسات القراءة العامة للبيانات المشتركة والماستر
CREATE POLICY "Public read zones" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public read scoring" ON public.scoring_rules FOR SELECT USING (true);
CREATE POLICY "Public read seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public read assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Public read cards_master" ON public.cards_master FOR SELECT USING (true);
CREATE POLICY "Public read card_levels" ON public.card_levels FOR SELECT USING (true);
CREATE POLICY "Public read items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public read specialization_paths" ON public.specialization_paths FOR SELECT USING (true);
CREATE POLICY "Public read factories" ON public.factories FOR SELECT USING (true);
CREATE POLICY "Public read factory_recipes" ON public.factory_recipes FOR SELECT USING (true);
CREATE POLICY "Public read contracts" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Public read contract_requirements" ON public.contract_requirements FOR SELECT USING (true);
CREATE POLICY "Public read master_great_projects" ON public.master_great_projects FOR SELECT USING (true);
CREATE POLICY "Public read master_albums" ON public.master_albums FOR SELECT USING (true);
CREATE POLICY "Public read species_master" ON public.species_master FOR SELECT USING (true);
CREATE POLICY "Public read breeds_master" ON public.breeds_master FOR SELECT USING (true);
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read sports_cards" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read tournament_teams" ON public.tournament_teams FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public read match_events" ON public.match_events FOR SELECT USING (true);
CREATE POLICY "Public read match_lineups" ON public.match_lineups FOR SELECT USING (true);
CREATE POLICY "Public read match_requests" ON public.match_requests FOR SELECT USING (true);
CREATE POLICY "Public read swap_requests" ON public.swap_requests FOR SELECT USING (true);
CREATE POLICY "Public read sanctuary_specimens" ON public.sanctuary_specimens FOR SELECT USING (true);
CREATE POLICY "Public read specimen_market" ON public.specimen_market FOR SELECT USING (true);

-- 5.2 سياسات الأمان الخاصة ببيانات اللاعب الخاصة (قراءة وكتابة محددة بالـ UID)
CREATE POLICY "User manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "User read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User read own activity" ON public.activity_log FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "User manage own inventory" ON public.player_inventory FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_factories" ON public.player_factories FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_cards" ON public.player_cards FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_contracts" ON public.player_contracts FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_great_projects" ON public.player_great_projects FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_albums" ON public.player_albums FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own kv_progress" ON public.kv_game_progress FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own game_consumables" ON public.game_consumables FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own player_library" ON public.player_library FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own protocol_data" ON public.player_protocol_data FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own specializations" ON public.player_specializations FOR ALL USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);
CREATE POLICY "User manage own specimens" ON public.sanctuary_specimens FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- ==============================================================================
-- SECTION 6: STORED PROCEDURES & SECURE RPC FUNCTIONS (الدوال المحمية السيادية)
-- ==============================================================================

-- 6.1 تريجر إنشاء الحساب التلقائي مع منحة الـ 10,000 ذهب الترحيبية
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    v_username TEXT;
BEGIN
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'Explorer');
    
    INSERT INTO public.profiles (
        id, email, username, noub_coins, xp, level, reputation_score
    ) VALUES (
        NEW.id, NEW.email, v_username, 10000, 0, 1, 100
    ) ON CONFLICT (id) DO NOTHING;

    -- تسجيل المنحة الترحيبية
    INSERT INTO public.activity_log (
        player_id, activity_type, realm, description, noub_change, xp_change
    ) VALUES (
        NEW.id, 'STARTER_BONUS', 'core', 'مرحباً بك في نوب! تم إيداع 10,000 ذهب ترحيبي في خزنتك', 10000, 0
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- 6.2 دالة حساب حدسية كولاتز الرياضية لقوة كارت الروح (3n + 1)
CREATE OR REPLACE FUNCTION public.calculate_collatz_steps(p_number NUMERIC)
RETURNS INT AS $$
DECLARE
    v_steps INT := 0;
    v_current NUMERIC := p_number;
BEGIN
    IF v_current <= 1 THEN RETURN 1; END IF;
    WHILE v_current > 1 AND v_steps < 15000 LOOP
        IF MOD(v_current, 2) = 0 THEN
            v_current := v_current / 2;
        ELSE
            v_current := (3 * v_current) + 1;
        END IF;
        v_steps := v_steps + 1;
    END LOOP;
    RETURN v_steps;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6.3 دالة صك كارت الروح المربوط بالـ UCP وخوارزمية كولاتز
CREATE OR REPLACE FUNCTION public.mint_soul_card(p_player_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_profile RECORD;
    v_dob_str TEXT;
    v_passkey_str TEXT;
    v_passkey_num NUMERIC;
    v_collatz_power INT;
    v_exists BOOLEAN;
BEGIN
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_player_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'المستخدم غير موجود');
    END IF;

    IF v_profile.dna_eve_code = '00000' OR v_profile.dna_eve_code IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'بروتوكول الوعي غير مكتمل بعد');
    END IF;

    SELECT EXISTS(SELECT 1 FROM public.player_cards WHERE player_id = p_player_id AND card_id = 9999) INTO v_exists;
    IF v_exists THEN
        RETURN jsonb_build_object('success', false, 'message', 'تم صك كارت الروح بالفعل');
    END IF;

    v_dob_str := '19781018';
    v_passkey_str := v_dob_str || v_profile.dna_edu_level::TEXT || v_profile.dna_lang_count::TEXT || v_profile.dna_sport_type::TEXT || v_profile.dna_eve_code;
    v_passkey_num := v_passkey_str::NUMERIC;
    v_collatz_power := public.calculate_collatz_steps(v_passkey_num);

    INSERT INTO public.player_cards (
        player_id, card_id, level, power_score, is_locked
    ) VALUES (
        p_player_id, 9999, 1, v_collatz_power, true
    );

    UPDATE public.profiles SET soul_card_serial = v_passkey_str WHERE id = p_player_id;

    RETURN jsonb_build_object(
        'success', true,
        'power_score', v_collatz_power,
        'dna_string', v_passkey_str
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.4 دالة تنفيذ التبادل والمقايضة الذرية P2P
CREATE OR REPLACE FUNCTION public.execute_swap_transaction(
    p_request_id UUID,
    p_player_accepting_id UUID,
    p_counter_offer_instance_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_request RECORD;
BEGIN
    SELECT * INTO v_request FROM public.swap_requests WHERE id = p_request_id AND status = 'active' FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'عرض التبادل غير متاح');
    END IF;

    -- التحقق من ملكية الكارت المقابل وعدم قفله
    PERFORM 1 FROM public.player_cards
    WHERE instance_id = p_counter_offer_instance_id AND player_id = p_player_accepting_id AND is_locked = false;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'الكارت المقابل غير صالح أو مقفل');
    END IF;

    -- نقل كارت العارض إلى الطرف المقبول
    UPDATE public.player_cards
    SET player_id = p_player_accepting_id, is_locked = false, acquired_at = NOW()
    WHERE instance_id = v_request.card_instance_id_offer;

    -- نقل كارت الطرف المقبول إلى العارض
    UPDATE public.player_cards
    SET player_id = v_request.player_id_offering, is_locked = false, acquired_at = NOW()
    WHERE instance_id = p_counter_offer_instance_id;

    -- إغلاق الطلب وتسجيل العملية
    UPDATE public.swap_requests SET status = 'completed' WHERE id = p_request_id;

    INSERT INTO public.swap_transactions (
        request_id, player_offering_id, player_accepting_id,
        card_instance_offered_instance, card_instance_received_instance
    ) VALUES (
        p_request_id, v_request.player_id_offering, p_player_accepting_id,
        v_request.card_instance_id_offer, p_counter_offer_instance_id
    );

    RETURN jsonb_build_object('success', true, 'message', 'تمت صفقة المقايضة بنجاح');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.5 دالة صك كارت هوية لاعب رياضي (مع ضبط هندسة الرقبة والكتف)
CREATE OR REPLACE FUNCTION public.mint_genesis_sports_card(
    p_display_name TEXT,
    p_position TEXT,
    p_visual_dna JSONB
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_card_id UUID;
    v_existing_count INT;
    v_adjusted_dna JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'غير مصرح'; END IF;

    SELECT COUNT(*) INTO v_existing_count FROM public.cards WHERE owner_id = v_user_id;
    IF v_existing_count > 0 THEN RAISE EXCEPTION 'لديك كارت هوية بالفعل'; END IF;

    -- دمج إحداثيات محاذاة الرقبة والكتفين تلقائياً
    v_adjusted_dna := p_visual_dna || '{"collar_offset_y": 0, "neck_seamless": true}'::jsonb;

    INSERT INTO public.cards (
        owner_id, display_name, position, visual_dna, stats, is_verified, type
    ) VALUES (
        v_user_id, p_display_name, p_position, v_adjusted_dna,
        '{"rating": 75, "pace": 78, "shooting": 74, "passing": 76, "dribbling": 79, "defending": 62, "physical": 72}'::jsonb,
        true, 'GENESIS'
    ) RETURNING id INTO v_card_id;

    RETURN v_card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.6 دالة إنشاء حدث تزاوج وراثي بيولوجي بمعدل 89x (Bio-Breeding Dispatcher)
CREATE OR REPLACE FUNCTION public.initiate_biological_breeding(
    p_species_id TEXT,
    p_sire_id UUID,
    p_dam_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_species RECORD;
    v_sire RECORD;
    v_dam RECORD;
    v_real_gestation_interval INTERVAL;
    v_expected_time TIMESTAMP WITH TIME ZONE;
    v_event_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'غير مصرح'; END IF;

    SELECT * INTO v_species FROM public.species_master WHERE id = p_species_id;
    SELECT * INTO v_sire FROM public.sanctuary_specimens WHERE id = p_sire_id AND sex = 'MALE' AND status = 'ACTIVE';
    SELECT * INTO v_dam FROM public.sanctuary_specimens WHERE id = p_dam_id AND sex = 'FEMALE' AND status = 'ACTIVE';

    IF v_sire IS NULL OR v_dam IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'أحد الأبوين غير مؤهل للتزاوج أو في فترة راحة');
    END IF;

    -- حساب الزمن الحقيقي بدقة بمعدل 89x: (أيام الحمل البيولوجي * 24 ساعة / 89)
    v_real_gestation_interval := ((v_species.gestation_days_bio * 24.0 / 89.0) || ' hours')::interval;
    v_expected_time := NOW() + v_real_gestation_interval;

    UPDATE public.sanctuary_specimens SET status = 'PREGNANT' WHERE id = p_dam_id;

    INSERT INTO public.breeding_events (
        species_id, sire_id, dam_id, sire_owner_id, dam_owner_id, expected_whelping_at, status
    ) VALUES (
        p_species_id, p_sire_id, p_dam_id, v_sire.owner_id, v_dam.owner_id, v_expected_time, 'GESTATING'
    ) RETURNING id INTO v_event_id;

    -- إرسال إشعار للمالك بموعد الولادة الفعلي
    INSERT INTO public.notifications (
        user_id, type, title, message, target_realm, target_route
    ) VALUES (
        v_user_id, 'SANCTUARY_BIRTH', '🧬 بدأت فترة الحمل الوراثي!',
        'تم التزاوج بنجاح. موعد الولادة المتوقع خلال ' || to_char(v_real_gestation_interval, 'HH24:MI:SS'),
        'sanctuary', 'sanctuary/specimen'
    );

    RETURN jsonb_build_object(
        'success', true,
        'breeding_event_id', v_event_id,
        'expected_whelping_at', v_expected_time,
        'duration_hours', (v_species.gestation_days_bio * 24.0 / 89.0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SECTION 7: CANONICAL SEED DATA (البيانات الحقيقية المعتمدة)
-- ==============================================================================

-- 7.1 الفصائل والأنواع البيولوجية الأساسية بمعدل 89x
INSERT INTO public.species_master (id, name_ar, name_en, gestation_days_bio, lifespan_years_bio, speed_factor) VALUES
('CANINE', 'الكلبيات الأصيلة', 'Canine', 63, 14, 89.00),
('FELINE', 'السنوريات والقطط', 'Feline', 65, 15, 89.00),
('EQUINE', 'الخيول العربية', 'Equine', 330, 28, 89.00),
('AVIAN', 'حمام الغواة والزاجل', 'Avian (Pigeons)', 18, 10, 89.00),
('CAMELID', 'الإبل والمزايين', 'Camelid', 365, 35, 89.00),
('FLORA_BONSAI', 'أشجار البونساي المعمرة', 'Bonsai Flora', 14, 80, 89.00)
ON CONFLICT (id) DO NOTHING;

-- 7.2 السلالات الحقيقية المعتمدة (FCI, AKC, Pigeon Strains)
INSERT INTO public.breeds_master (id, species_id, name_ar, name_en, origin_country, official_registry, standards) VALUES
('gsd_working', 'CANINE', 'الراعي الألماني (خط عمل DDR)', 'German Shepherd (Working Line)', 'Germany', 'FCI Group 1', '{"coat": "Double", "hip_standard": "HD-A", "elbow_standard": "ED-0"}'::jsonb),
('saluki_desert', 'CANINE', 'السلوقي العربي الأصيل', 'Saluki Sighthound', 'Middle East', 'FCI Group 10', '{"varieties": ["Smooth", "Fringed"], "mc1r_grizzle": true}'::jsonb),
('border_collie', 'CANINE', 'البوردر كولي', 'Border Collie', 'Great Britain', 'FCI Group 1', '{"drive": "High", "intelligence_index": 98}'::jsonb),
('egyptian_mau', 'FELINE', 'الماو المصري الأصيل', 'Egyptian Mau', 'Egypt', 'CFA / TICA', '{"speed_kmh": 48, "pattern": "Natural Spotted"}'::jsonb),
('persian_shirazi', 'FELINE', 'القط الشيرازي الأصيل', 'Persian Cat', 'Iran/Egypt', 'FIFe', '{"coat_length": "Long", "temperament": "Calm"}'::jsonb),
('arabian_saklawi', 'EQUINE', 'الصقلاوي جدران', 'Saklawi Strain', 'Arabian Peninsula', 'WAHO', '{"type": "Beauty & Endurance", "purity": "100% Asil"}'::jsonb),
('pigeon_safi', 'AVIAN', 'الصافي خليل قرنفلي', 'Egyptian Safi Pigeon', 'Egypt', 'Egyptian Pigeon Union', '{"crest": "Plain", "eye": "Ruby", "beak": "Short"}'::jsonb),
('bonsai_juniper', 'FLORA_BONSAI', 'العرعر الصيني', 'Juniperus Procumbens', 'Japan', 'Nippon Bonsai Association', '{"style": "Semi-Cascade", "soil": "Akadama", "humidity_req": 80}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7.3 الموارد والسلع الأساسية (Items Master)
INSERT INTO public.items (name, type, base_value) VALUES
('Limestone (Raw)', 'RESOURCE', 5),
('Papyrus Reeds', 'RESOURCE', 8),
('Nile Clay', 'RESOURCE', 6),
('Limestone Block', 'MATERIAL', 15),
('Papyrus Scroll', 'MATERIAL', 20),
('Clay Jar', 'MATERIAL', 18),
('Hieroglyphic Text', 'GOOD', 50),
('Small Statue', 'GOOD', 75),
('Bread & Beer Rations', 'GOOD', 150),
('Sealed Jars (Pottery)', 'GOOD', 200),
('Treated Leather', 'MATERIAL', 100),
('Bronze Bar', 'MATERIAL', 150),
('Khopesh Sword', 'GOOD', 2500),
('War Chariot', 'GOOD', 5000)
ON CONFLICT (name) DO NOTHING;

-- 7.4 ألبومات مصر الفرعونية الخمسة الماستر
INSERT INTO public.master_albums (id, name, icon, description, card_ids, reward_noub, reward_prestige) VALUES
(1, 'The Sacred Ennead', '☀️', 'اجمع كروت التاسوع المقدس التسعة', '[1, 2, 3, 4, 5, 6, 7, 8, 9]'::jsonb, 25000, 50),
(2, 'Pharaonic Rulers', '👑', 'اجمع كروت أعظم ملوك وملكات مصر', '[10, 11, 12, 13, 14, 15, 16, 17, 18]'::jsonb, 40000, 100),
(3, 'Mythological Beasts', '🐉', 'اجمع حراس العالم السفلي ومخلوقات الدوات', '[19, 20, 21, 22, 23, 24, 25, 26, 27]'::jsonb, 15000, 30),
(4, 'Dendera Temple', '🌌', 'أسرار الفلك ومعبد دندرة والزودياك', '[28, 29, 30, 31, 32, 33, 34, 35, 36]'::jsonb, 60000, 50),
(5, 'Royal Arsenal', '⚔️', 'ترسانة الجيوش والأسلحة الفرعونية', '[37, 38, 39, 40, 41, 42, 43, 44, 45]'::jsonb, 80000, 100)
ON CONFLICT (id) DO NOTHING;

-- 7.5 مسارات النقابات الحرفية الماستر
INSERT INTO public.specialization_paths (name, description, unlock_level, cost_noub_initial_unlock) VALUES
('بيت بتاح للحرفيين', 'مسار الصناعات الدقيقة والسلع الفاخرة والتماثيل الملكية', 15, 5000),
('بيت أوزوريس للمؤن', 'مسار إنتاج الغذاء والمؤن والسلع الأساسية والمزارع', 15, 3000),
('بيت أنوبيس للتحنيط والطقوس', 'مسار الصناعات المقدسة وأدوات المقابر والتمائم', 20, 10000)
ON CONFLICT (name) DO NOTHING;

-- 7.6 المناطق الجغرافية الأساسية
INSERT INTO public.zones (id, name, is_active) VALUES
(1, 'الفسطاط ومصر القديمة', true),
(2, 'المعادي وطرة', true),
(3, 'الأهرامات والجيزة', true),
(4, 'مدينة نصر ومصر الجديدة', true)
ON CONFLICT (id) DO NOTHING;
