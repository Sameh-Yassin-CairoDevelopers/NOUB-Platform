/*
 * Project: NOUB SPORTS PLATFORM
 * Filename: js/controllers/sportsCtrl.js
 * Version: 3.5.0 (COMPREHENSIVE INTEGRATED SPORTS SYSTEM)
 * Description: Fully featured Sports Platform including Matches, Ramadan Tournaments,
 *              Team Management, Scout Market, Tactics Board, SOS Emergencies, and 3D Cards.
 */

import { state } from '../core/state.js';
import { SportsService } from '../services/sportsService.js';
import { TeamService } from '../services/teamService.js';
import { MarketService } from '../services/marketService.js';
import { AvatarEngine } from '../utils/avatarEngine.js';
import { TACTICAL_FORMATIONS, PLAYER_POSITIONS, EGYPTIAN_ZONES } from '../data/sportsData.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';

export class SportsController {
    constructor(router) {
        this.router = router;
        this.activeTab = 'matches'; // 'matches' | 'tournaments' | 'tactics' | 'team' | 'scout' | 'emergency' | 'card'
        this.currentFormation = '2-2-1';
        this.myTeam = null;
        this.scoutFilter = 'ALL';
        this.scoutSearch = '';
        this.scoutPlayers = [];
        this.tournaments = [
            {
                id: 'tourn-1',
                title: 'دورة الفسطاط والمعادي الرمضانية الكبرى',
                zone: 'الفسطاط والمعادي',
                teamsCount: 16,
                registeredCount: 12,
                prize: '50,000 ج.م + 100,000 ذهب',
                status: 'ACTIVE',
                startDate: '1 رمضان'
            },
            {
                id: 'tourn-2',
                title: 'كأس درع المنيل ومصر القديمة',
                zone: 'مصر القديمة والمنيل',
                teamsCount: 8,
                registeredCount: 7,
                prize: '25,000 ج.م + 50,000 ذهب',
                status: 'UPCOMING',
                startDate: '5 رمضان'
            }
        ];
        this.matches = [
            {
                id: 'match-1',
                time: 'اليوم • 09:00 م',
                teamA: 'فرسان الفسطاط',
                teamB: 'نسور المعادي',
                stadium: 'ملعب النجوم (خماسي نجيل صناعي)',
                zone: 'الفسطاط',
                slots: 'مكتمل (10/10)',
                needsPlayer: false
            },
            {
                id: 'match-2',
                time: 'اليوم • 10:30 م',
                teamA: 'أبطال مدينة نصر',
                teamB: 'ذئاب مصر الجديدة',
                stadium: 'نادي الشمس (سداسي ترتان)',
                zone: 'مصر الجديدة',
                slots: 'متبقي 1 لاعب',
                needsPlayer: true
            }
        ];
    }

    async init() {
        this.render();
        this.bindEvents();
        try {
            await SportsService.getPlayerCard(state.data.user?.id);
            await SportsService.getActiveEmergencies();
            this.myTeam = await TeamService.getMyTeam();
            this.scoutPlayers = await MarketService.getGlobalMarket({ position: this.scoutFilter, searchQuery: this.scoutSearch });
            this.render();
            this.bindEvents();
        } catch (err) {
            console.warn("SportsController init warning:", err);
        }
    }

    switchTab(tabKey) {
        this.activeTab = tabKey;
        this.render();
        this.bindEvents();
        this.router?.setActiveNavButton?.(tabKey);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
        const container = document.getElementById('view-sports');
        if (!container) return;

        const card = state.data.sports.card || {};
        const emergencies = state.data.sports.emergencies || [];

        container.innerHTML = `
            <div class="sports-view-wrapper">
                <!-- TOP HEADER & CONTROLS -->
                <div class="view-header-bar">
                    <button class="btn-back-hub" id="sports-back-hub">
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-futbol text-gold"></i> منصة نوب سبورتس</h2>
                </div>

                <!-- SUB TABS NAVIGATION -->
                <div class="sub-nav-tabs">
                    <button class="sub-tab-btn ${this.activeTab === 'matches' ? 'active' : ''}" data-tab="matches">
                        <i class="fa-solid fa-futbol"></i>
                        <span>المباريات والملاعب</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'tournaments' ? 'active' : ''}" data-tab="tournaments">
                        <i class="fa-solid fa-trophy"></i>
                        <span>بطولات رمضان</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'tactics' ? 'active' : ''}" data-tab="tactics">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span>السبورة التكتيكية</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'team' ? 'active' : ''}" data-tab="team">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>فريقـي</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'scout' ? 'active' : ''}" data-tab="scout">
                        <i class="fa-solid fa-binoculars"></i>
                        <span>سوق الكشافين</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'emergency' ? 'active' : ''}" data-tab="emergency">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>طوارئ الملاعب (${emergencies.length})</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'card' ? 'active' : ''}" data-tab="card">
                        <i class="fa-solid fa-id-card"></i>
                        <span>كارتي 3D</span>
                    </button>
                </div>

                <!-- 1. MATCHES & ARENA TAB -->
                <div id="tab-content-matches" class="tab-pane ${this.activeTab === 'matches' ? 'active' : 'hidden'}">
                    <div class="arena-top-actions">
                        <h3><i class="fa-solid fa-calendar-days text-gold"></i> المباريات وحجوزات الملاعب</h3>
                        <button class="btn-noub-gold" id="btn-open-create-match">
                            <i class="fa-solid fa-plus"></i>
                            <span>تسجيل حجز مباراة / تحدي</span>
                        </button>
                    </div>

                    <div class="matches-list">
                        ${this.matches.map(m => `
                            <div class="match-card">
                                <div class="match-time-badge">${m.time}</div>
                                <div class="match-teams-row">
                                    <div class="team-block">
                                        <i class="fa-solid fa-shield team-logo"></i>
                                        <strong>${m.teamA}</strong>
                                    </div>
                                    <div class="vs-circle">VS</div>
                                    <div class="team-block">
                                        <i class="fa-solid fa-shield-halved team-logo"></i>
                                        <strong>${m.teamB}</strong>
                                    </div>
                                </div>
                                <div class="match-meta">
                                    <span><i class="fa-solid fa-location-dot"></i> ${m.stadium}</span>
                                    <span class="${m.needsPlayer ? 'text-gold' : ''}">
                                        <i class="fa-solid ${m.needsPlayer ? 'fa-triangle-exclamation' : 'fa-user-check'}"></i> ${m.slots}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 2. RAMADAN TOURNAMENTS TAB -->
                <div id="tab-content-tournaments" class="tab-pane ${this.activeTab === 'tournaments' ? 'active' : 'hidden'}">
                    <div class="tournament-hero-banner">
                        <div class="tourn-badge"><i class="fa-solid fa-moon"></i> دوري ليالي رمضان 2026</div>
                        <h3>بطولات ودورات رمضان الشعبية</h3>
                        <p>تنافس مع أفضل فرق منطقتك على الجوائز المالية والذهب وتوثيق اسم فريقك في سجل الشرف.</p>
                        <div class="tourn-cta-row" style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn-noub-gold" id="btn-open-create-tournament">
                                <i class="fa-solid fa-plus-circle"></i>
                                <span>تنظيم بطولة رمضانية جديدة</span>
                            </button>
                            <button class="btn-outline-gold" id="btn-quick-register-team">
                                <i class="fa-solid fa-flag"></i>
                                <span>تسجيل فريقي في البطولة</span>
                            </button>
                        </div>
                    </div>

                    <div class="t-list-section" style="margin-top: 25px;">
                        <h4 style="color:var(--gold-main); margin-bottom:15px; font-family:var(--font-sport);"><i class="fa-solid fa-trophy"></i> الدورات المتاحة للتسجيل</h4>
                        <div class="tournaments-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
                            ${this.tournaments.map(t => `
                                <div class="tourn-card" style="background: rgba(26,28,35,0.85); border: 1px solid rgba(212,175,55,0.25); border-radius: 16px; padding: 20px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                                        <span class="status-badge" style="background: rgba(16,185,129,0.2); color:#10b981; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:bold;">
                                            ${t.status === 'ACTIVE' ? 'متاح التسجيل' : 'قريباً'}
                                        </span>
                                        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-calendar"></i> انطلاق: ${t.startDate}</span>
                                    </div>
                                    <h3 style="font-size:1.1rem; color:#fff; margin-bottom:10px;">${t.title}</h3>
                                    <div style="display:flex; flex-direction:column; gap:6px; font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">
                                        <span><i class="fa-solid fa-location-dot text-gold"></i> المنطقة: ${t.zone}</span>
                                        <span><i class="fa-solid fa-users text-gold"></i> الفرق: ${t.registeredCount} / ${t.teamsCount} فريق</span>
                                        <span><i class="fa-solid fa-sack-dollar text-gold"></i> الجوائز: <strong>${t.prize}</strong></span>
                                    </div>
                                    <button class="btn-noub-gold w-full btn-register-this-tourn" data-title="${t.title}" style="padding:10px; font-size:0.85rem;">
                                        <i class="fa-solid fa-file-signature"></i> تسجيل فريقي في هذه الدورة
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- STANDINGS TABLE -->
                    <div class="tournament-standings-card" style="margin-top: 30px;">
                        <h4><i class="fa-solid fa-ranking-star text-gold"></i> جدول ترتيب مجموعة الصدارة (A)</h4>
                        <table class="noub-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الفريق</th>
                                    <th>لعب</th>
                                    <th>فارق</th>
                                    <th>نقاط</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td><strong>فرسان الفسطاط</strong></td>
                                    <td>3</td>
                                    <td>+6</td>
                                    <td><strong>9</strong></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td><strong>أبطال المعادي</strong></td>
                                    <td>3</td>
                                    <td>+2</td>
                                    <td><strong>6</strong></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td><strong>صقور النيل</strong></td>
                                    <td>3</td>
                                    <td>-1</td>
                                    <td><strong>3</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 3. TACTICS BOARD TAB -->
                <div id="tab-content-tactics" class="tab-pane ${this.activeTab === 'tactics' ? 'active' : 'hidden'}">
                    <div class="tactics-top-bar">
                        <div class="formation-selector">
                            <label>الخطة التكتيكية:</label>
                            <select id="tactics-formation-select" class="noub-select">
                                ${Object.keys(TACTICAL_FORMATIONS).map(fKey => `
                                    <option value="${fKey}" ${this.currentFormation === fKey ? 'selected' : ''}>${TACTICAL_FORMATIONS[fKey].name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <button class="btn-noub-gold" id="btn-export-tactics">
                            <i class="fa-solid fa-download"></i>
                            <span>حفظ الخطة التكتيكية</span>
                        </button>
                    </div>

                    <div class="tactics-pitch-container" id="tactics-pitch">
                        <div class="pitch-lines">
                            <div class="pitch-center-circle"></div>
                            <div class="pitch-center-line"></div>
                            <div class="pitch-penalty-area top"></div>
                            <div class="pitch-penalty-area bottom"></div>
                        </div>
                        <div class="players-slot-layer" id="tactics-players-layer">
                            ${this.renderPitchPlayers()}
                        </div>
                    </div>
                </div>

                <!-- 4. TEAM MANAGEMENT TAB -->
                <div id="tab-content-team" class="tab-pane ${this.activeTab === 'team' ? 'active' : 'hidden'}">
                    ${this.renderTeamSection()}
                </div>

                <!-- 5. SCOUT MARKET TAB -->
                <div id="tab-content-scout" class="tab-pane ${this.activeTab === 'scout' ? 'active' : 'hidden'}">
                    <div class="scout-header-bar" style="margin-bottom: 20px;">
                        <h3><i class="fa-solid fa-binoculars text-gold"></i> سوق الكشافين وانتداب اللاعبين</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">ابحث عن حراس ومدافعين ومهاجمين لتدعيم صفوف فريقك قبل انطلاق بطولات رمضان.</p>
                        
                        <div class="scout-filters-row" style="display:flex; gap:10px; flex-wrap:wrap; margin-top:15px; align-items:center;">
                            <input type="text" id="scout-search-input" placeholder="ابحث باسم اللاعب أو منطقته..." value="${this.scoutSearch}" style="flex:1; min-width:200px; padding:10px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff;">
                            <div class="filter-pills" style="display:flex; gap:6px;">
                                ${['ALL', 'FWD', 'MID', 'DEF', 'GK'].map(p => `
                                    <button class="pill-btn ${this.scoutFilter === p ? 'active' : ''}" data-pos="${p}" style="padding:8px 14px; border-radius:20px; border:1px solid ${this.scoutFilter === p ? 'var(--gold-main)' : 'rgba(255,255,255,0.1)'}; background:${this.scoutFilter === p ? 'var(--gold-main)' : 'transparent'}; color:${this.scoutFilter === p ? '#000' : '#fff'}; cursor:pointer; font-size:0.8rem; font-weight:bold;">
                                        ${p === 'ALL' ? 'الكل' : p}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="scout-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:15px;">
                        ${this.renderScoutCards()}
                    </div>
                </div>

                <!-- 6. EMERGENCY SOS TAB -->
                <div id="tab-content-emergency" class="tab-pane ${this.activeTab === 'emergency' ? 'active' : 'hidden'}">
                    <div class="emergency-header-banner">
                        <div class="emg-text">
                            <h3>🚨 نداءات طوارئ الملاعب (ناقص لاعب)</h3>
                            <p>فريقك ناقص لاعب أو حارس في الملعب الآن؟ أطلق إشارة طوارئ عاجلة بمكافأة ذهب، أو شارك كمنقذ واكسب نقاط وذهب!</p>
                        </div>
                        <button class="btn-emergency-broadcast" id="btn-broadcast-emergency">
                            <i class="fa-solid fa-bullhorn"></i>
                            <span>إطلاق نداء طوارئ جديد</span>
                        </button>
                    </div>

                    <div class="emergencies-grid">
                        ${emergencies.map(emg => `
                            <div class="emergency-ticket">
                                <div class="ticket-badge"><i class="fa-solid fa-circle-exclamation"></i> نداء عاجل</div>
                                <h4>${emg.title}</h4>
                                <div class="ticket-info">
                                    <p><i class="fa-solid fa-location-dot"></i> ${emg.stadium_name} (${emg.zone_name})</p>
                                    <p><i class="fa-solid fa-clock"></i> توقيت الماتش: <strong>${emg.match_time}</strong></p>
                                    <p><i class="fa-solid fa-coins text-gold"></i> مكافأة الحضور: <strong>${emg.reward_gold} ذهب</strong></p>
                                </div>
                                <button class="btn-accept-emergency" data-id="${emg.id}" data-reward="${emg.reward_gold}">
                                    <i class="fa-solid fa-hand-holding-hand"></i>
                                    <span>المشاركة الآن كمنقذ (+${emg.reward_gold} ذهب)</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 7. 3D PLAYER CARD TAB -->
                <div id="tab-content-card" class="tab-pane ${this.activeTab === 'card' ? 'active' : 'hidden'}">
                    <div class="card-showcase-grid">
                        <div class="player-card-3d-wrapper">
                            <div class="fut-card gold-edition" id="my-player-fut-card">
                                <div class="card-inner">
                                    <div class="card-header-stats">
                                        <div class="overall-val">${card.overall_rating || 85}</div>
                                        <div class="pos-val">${card.primary_position || 'CM'}</div>
                                        <div class="zone-icon"><i class="fa-solid fa-shield-halved"></i></div>
                                    </div>
                                    <div class="card-avatar-art">
                                        ${AvatarEngine.generateAvatarHTML(card.visual_dna, card.player_name || 'NOUB')}
                                    </div>
                                    <div class="card-player-title">
                                        <h3>${card.player_name || 'كابتن نوب'}</h3>
                                    </div>
                                    <div class="card-attributes-grid">
                                        <div class="stat-cell"><span>PAC</span><strong>${card.speed || 87}</strong></div>
                                        <div class="stat-cell"><span>SHO</span><strong>${card.shooting || 84}</strong></div>
                                        <div class="stat-cell"><span>PAS</span><strong>${card.passing || 89}</strong></div>
                                        <div class="stat-cell"><span>DRI</span><strong>${card.dribbling || 86}</strong></div>
                                        <div class="stat-cell"><span>DEF</span><strong>${card.defending || 80}</strong></div>
                                        <div class="stat-cell"><span>PHY</span><strong>${card.physicality || 82}</strong></div>
                                    </div>
                                    <div class="card-footer-edition">
                                        <span>NOUB SPORTS 2026 EDITION</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-career-panel">
                            <h3><i class="fa-solid fa-chart-line text-gold"></i> السجل الرياضي المعتمد</h3>
                            <div class="stats-summary-boxes">
                                <div class="stat-box">
                                    <span class="label">المباريات</span>
                                    <strong class="val">${card.matches_played || 14}</strong>
                                </div>
                                <div class="stat-box">
                                    <span class="label">الأهداف</span>
                                    <strong class="val">${card.goals_scored || 9}</strong>
                                </div>
                                <div class="stat-box">
                                    <span class="label">صناعة اللعب</span>
                                    <strong class="val">${card.assists || 12}</strong>
                                </div>
                                <div class="stat-box">
                                    <span class="label">رجل المباراة</span>
                                    <strong class="val">${card.man_of_match_count || 3}</strong>
                                </div>
                            </div>

                            <button class="btn-noub-gold w-full mt-4" id="sports-customize-card-btn">
                                <i class="fa-solid fa-paintbrush"></i>
                                <span>تعديل التيشيرت والمظهر الرياضي</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL: CREATE TOURNAMENT -->
            <div id="modal-create-tournament" class="custom-modal-overlay hidden">
                <div class="custom-modal-box">
                    <div class="modal-header">
                        <h3><i class="fa-solid fa-trophy text-gold"></i> تنظيم بطولة رمضانية جديدة</h3>
                        <button class="close-modal-btn" id="close-tourn-modal"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="form-create-tournament">
                        <div class="form-group" style="margin-bottom:12px;">
                            <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">اسم الدورة الرمضانية</label>
                            <input type="text" id="tourn-name-input" placeholder="مثال: دورة نجوم شبرا الرمضانية" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-group" style="margin-bottom:12px;">
                            <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">المنطقة والملعب</label>
                            <input type="text" id="tourn-zone-input" placeholder="مثال: ملعب الشباب - مصر القديمة" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-row" style="display:flex; gap:10px; margin-bottom:12px;">
                            <div style="flex:1;">
                                <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">عدد الفرق</label>
                                <select id="tourn-teams-select" style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                                    <option value="8">8 فرق</option>
                                    <option value="16" selected>16 فريق</option>
                                    <option value="32">32 فريق</option>
                                </select>
                            </div>
                            <div style="flex:1;">
                                <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">قيمة الجائزة الكبرى</label>
                                <input type="text" id="tourn-prize-input" placeholder="مثال: 30,000 ج.م" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                            </div>
                        </div>
                        <button type="submit" class="btn-noub-gold w-full" style="padding:12px; margin-top:10px;">
                            <i class="fa-solid fa-check"></i> اعتماد ونشر البطولة فوراً
                        </button>
                    </form>
                </div>
            </div>

            <!-- MODAL: CREATE MATCH -->
            <div id="modal-create-match" class="custom-modal-overlay hidden">
                <div class="custom-modal-box">
                    <div class="modal-header">
                        <h3><i class="fa-solid fa-futbol text-gold"></i> حجز موعد مباراة أو تحدي</h3>
                        <button class="close-modal-btn" id="close-match-modal"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="form-create-match">
                        <div class="form-group" style="margin-bottom:12px;">
                            <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">اسم فريقك</label>
                            <input type="text" id="match-teama-input" value="${this.myTeam ? this.myTeam.name : 'فريق الكابتن'}" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-group" style="margin-bottom:12px;">
                            <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">الفريق المنافس أو (تحدي مفتوح)</label>
                            <input type="text" id="match-teamb-input" placeholder="مثال: صقور المعادي أو تحدي مفتوح" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-group" style="margin-bottom:12px;">
                            <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">اسم الملعب</label>
                            <input type="text" id="match-stadium-input" placeholder="مثال: ملاعب النيل الخماسية" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-row" style="display:flex; gap:10px; margin-bottom:12px;">
                            <div style="flex:1;">
                                <label style="display:block; margin-bottom:5px; color:#fff; font-size:0.85rem;">الموعد والتوقيت</label>
                                <input type="text" id="match-time-input" placeholder="مثال: غداً 10:00 م" required style="width:100%; padding:10px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                            </div>
                        </div>
                        <button type="submit" class="btn-noub-gold w-full" style="padding:12px; margin-top:10px;">
                            <i class="fa-solid fa-calendar-check"></i> تأكيد نشر وحجز المباراة
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    renderTeamSection() {
        const team = this.myTeam;
        if (!team) {
            return `
                <div class="team-creation-box" style="background: rgba(26,28,35,0.9); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; padding: 30px; text-align: center; max-width: 600px; margin: 0 auto;">
                    <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(212,175,55,0.15); border: 2px solid var(--gold-main); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                        <i class="fa-solid fa-shield-halved text-gold" style="font-size: 2rem;"></i>
                    </div>
                    <h3 style="color:#fff; font-size:1.4rem; margin-bottom:8px;">تأسيس وإدارة فريقك الرياضي</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">
                        للمشاركة في البطولات الرمضانية وتنظيم التحديات، قم بتأسيس فريقك الآن وستحصل تلقائياً على صلاحية <strong>مدير الفريق (Team Manager)</strong>.
                    </p>

                    <form id="form-create-new-team" style="text-align: right;">
                        <div class="form-group" style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:6px; color:#fff; font-size:0.85rem;">اسم الفريق</label>
                            <input type="text" id="new-team-name-input" placeholder="مثال: أبطال الفسطاط" required minlength="3" style="width:100%; padding:12px; border-radius:10px; background:#111; border:1px solid #444; color:#fff;">
                        </div>
                        <div class="form-group" style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:6px; color:#fff; font-size:0.85rem;">لون التيشيرت الأساسي</label>
                            <input type="color" id="new-team-color-input" value="#D4AF37" style="width:100%; height:45px; border-radius:10px; cursor:pointer; background:#111; border:1px solid #444;">
                        </div>
                        <button type="submit" class="btn-noub-gold w-full" style="padding:14px; font-size:1rem; margin-top:10px;">
                            <i class="fa-solid fa-flag"></i> تأسيس الفريق واكتساب صلاحية المدير
                        </button>
                    </form>
                </div>
            `;
        }

        const roster = team.roster || [];
        return `
            <div class="team-dashboard-view">
                <div class="team-hero-header" style="background: linear-gradient(135deg, ${team.color_primary || '#D4AF37'} 0%, #111 100%); border-radius: 20px; padding: 25px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.15);">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:65px; height:65px; border-radius:50%; background:#111; border:2px solid #fff; display:flex; align-items:center; justify-content:center;">
                            <i class="fa-solid fa-shield-halved" style="font-size:1.8rem; color:#fff;"></i>
                        </div>
                        <div>
                            <h2 style="color:#fff; margin:0; font-size:1.5rem;">${team.name}</h2>
                            <span style="background:rgba(0,0,0,0.4); padding:3px 10px; border-radius:12px; color:#fff; font-size:0.75rem; border:1px solid rgba(255,255,255,0.2);">
                                <i class="fa-solid fa-crown text-gold"></i> صفتك: مدير وقائد الفريق
                            </span>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-noub-gold" id="btn-team-join-tourn">
                            <i class="fa-solid fa-trophy"></i> تسجيل في بطولة رمضانية
                        </button>
                    </div>
                </div>

                <!-- ROSTER SECTION -->
                <div class="roster-panel" style="background: rgba(26,28,35,0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h4 style="color:#fff; margin:0;"><i class="fa-solid fa-users text-gold"></i> تشكيلة الفريق (${roster.length} لاعبين)</h4>
                        <button class="btn-outline-gold" id="btn-invite-player" style="padding:6px 12px; font-size:0.8rem;">
                            <i class="fa-solid fa-user-plus"></i> دعوة لاعب جديد
                        </button>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                        ${roster.map(player => `
                            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <div style="width:36px; height:36px; border-radius:50%; background:rgba(212,175,55,0.15); display:flex; align-items:center; justify-content:center; color:var(--gold-main); font-weight:bold;">
                                        ${player.position || 'MID'}
                                    </div>
                                    <div>
                                        <strong style="color:#fff; font-size:0.9rem; display:block;">${player.username || 'لاعب'}</strong>
                                        <span style="color:var(--text-muted); font-size:0.75rem;">تقييم: ${player.rating || 85}</span>
                                    </div>
                                </div>
                                <span style="font-size:0.75rem; color:var(--gold-main); font-weight:bold;">
                                    ${player.role === 'CAPTAIN' ? 'الكابتن' : 'عضو'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderScoutCards() {
        const mockPlayers = [
            { name: 'كابتن طارق السقا', pos: 'GK', zone: 'المعادي', rating: 88, phone: '01011122233' },
            { name: 'حسام الهداف', pos: 'FWD', zone: 'الفسطاط', rating: 91, phone: '01122233344' },
            { name: 'عمر المايسترو', pos: 'MID', zone: 'مصر القديمة', rating: 86, phone: '01233344455' },
            { name: 'سعد الصخرة', pos: 'DEF', zone: 'حلوان', rating: 89, phone: '01544455566' },
            { name: 'يوسف الجناح', pos: 'FWD', zone: 'المقطم', rating: 85, phone: '01055566677' },
            { name: 'محمود السد', pos: 'GK', zone: 'مدينة نصر', rating: 87, phone: '01166677788' }
        ];

        let filtered = mockPlayers;
        if (this.scoutFilter !== 'ALL') {
            filtered = filtered.filter(p => p.pos === this.scoutFilter);
        }
        if (this.scoutSearch.trim()) {
            const q = this.scoutSearch.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q));
        }

        if (filtered.length === 0) {
            return `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);">لا يوجد لاعبين مطابقين لبحثك حالياً.</div>`;
        }

        return filtered.map(p => `
            <div style="background: rgba(26,28,35,0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div>
                        <strong style="color:#fff; font-size:1rem; display:block;">${p.name}</strong>
                        <span style="color:var(--text-muted); font-size:0.8rem;"><i class="fa-solid fa-location-dot"></i> ${p.zone}</span>
                    </div>
                    <span style="background:rgba(212,175,55,0.15); color:var(--gold-main); padding:4px 8px; border-radius:8px; font-weight:bold; font-size:0.8rem;">
                        ${p.pos} • ${p.rating}
                    </span>
                </div>
                <button class="btn-outline-gold w-full btn-scout-recruit" data-name="${p.name}" style="padding:8px; font-size:0.8rem; margin-top:5px;">
                    <i class="fa-solid fa-user-plus"></i> طلب انضمام للفريق
                </button>
            </div>
        `).join('');
    }

    renderPitchPlayers() {
        const form = TACTICAL_FORMATIONS[this.currentFormation] || TACTICAL_FORMATIONS['2-2-1'];
        return form.slots.map(slot => `
            <div class="pitch-player-node" style="left: ${slot.x}%; top: ${slot.y}%;" data-id="${slot.id}">
                <div class="player-icon-token">
                    <i class="fa-solid fa-shirt"></i>
                    <span>${slot.pos}</span>
                </div>
                <div class="player-label-tag">${slot.role}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        const container = document.getElementById('view-sports');
        if (!container) return;

        // Back to Hub
        container.querySelector('#sports-back-hub')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-hub');
        });

        // Tab buttons
        container.querySelectorAll('.sub-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundManager.click();
                this.switchTab(btn.dataset.tab);
            });
        });

        // Formation change
        container.querySelector('#tactics-formation-select')?.addEventListener('change', (e) => {
            this.currentFormation = e.target.value;
            const layer = container.querySelector('#tactics-players-layer');
            if (layer) {
                layer.innerHTML = this.renderPitchPlayers();
            }
        });

        // Export tactics
        container.querySelector('#btn-export-tactics')?.addEventListener('click', () => {
            NotificationService.showToast('📸 تم حفظ التشكيلة التكتيكية بنجاح!', 'success');
            VisualEffects.triggerConfetti();
        });

        // Modal: Create Tournament
        const tournModal = container.querySelector('#modal-create-tournament');
        container.querySelector('#btn-open-create-tournament')?.addEventListener('click', () => {
            SoundManager.click();
            tournModal?.classList.remove('hidden');
        });
        container.querySelector('#close-tourn-modal')?.addEventListener('click', () => {
            tournModal?.classList.add('hidden');
        });
        container.querySelector('#form-create-tournament')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = container.querySelector('#tourn-name-input')?.value;
            const zone = container.querySelector('#tourn-zone-input')?.value;
            const teamsCount = Number(container.querySelector('#tourn-teams-select')?.value) || 16;
            const prize = container.querySelector('#tourn-prize-input')?.value;

            if (title && zone) {
                const newTourn = {
                    id: 'tourn-' + Date.now(),
                    title,
                    zone,
                    teamsCount,
                    registeredCount: 1,
                    prize,
                    status: 'ACTIVE',
                    startDate: 'رمضان 2026'
                };
                this.tournaments.unshift(newTourn);
                tournModal?.classList.add('hidden');
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                NotificationService.showToast(`🏆 تم اعتماد وتنظيم بطولة "${title}" بنجاح!`, 'gold');
                this.render();
                this.bindEvents();
            }
        });

        // Register team for tournament
        container.querySelectorAll('.btn-register-this-tourn, #btn-quick-register-team, #btn-team-join-tourn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.myTeam) {
                    NotificationService.showToast('يرجى تأسيس فريقك أولاً من تبويب "فريقـي" لتسجيله في البطولة!', 'alert');
                    this.switchTab('team');
                    return;
                }
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                NotificationService.showToast(`✅ تم تسجيل فريق "${this.myTeam.name}" في البطولة رسمياً!`, 'success');
            });
        });

        // Modal: Create Match
        const matchModal = container.querySelector('#modal-create-match');
        container.querySelector('#btn-open-create-match')?.addEventListener('click', () => {
            SoundManager.click();
            matchModal?.classList.remove('hidden');
        });
        container.querySelector('#close-match-modal')?.addEventListener('click', () => {
            matchModal?.classList.add('hidden');
        });
        container.querySelector('#form-create-match')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const teamA = container.querySelector('#match-teama-input')?.value || 'فريقي';
            const teamB = container.querySelector('#match-teamb-input')?.value || 'تحدي مفتوح';
            const stadium = container.querySelector('#match-stadium-input')?.value || 'ملعب عام';
            const time = container.querySelector('#match-time-input')?.value || 'الليلة 10:00 م';

            const newMatch = {
                id: 'match-' + Date.now(),
                time,
                teamA,
                teamB,
                stadium,
                zone: 'القاهرة',
                slots: 'متبقي 2 لاعبين',
                needsPlayer: true
            };
            this.matches.unshift(newMatch);
            matchModal?.classList.add('hidden');
            SoundManager.playGoldChime();
            VisualEffects.triggerConfetti();
            NotificationService.showToast('⚽ تم حجز ونشر المباراة في جدول المباريات بنجاح!', 'success');
            this.render();
            this.bindEvents();
        });

        // Form: Create New Team
        container.querySelector('#form-create-new-team')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = container.querySelector('#new-team-name-input')?.value;
            const color = container.querySelector('#new-team-color-input')?.value || '#D4AF37';
            if (name) {
                const user = state.getUser() || {};
                this.myTeam = {
                    id: 'team_' + Date.now(),
                    name,
                    color_primary: color,
                    captain_id: user.id || 'local_user',
                    myRole: 'CAPTAIN',
                    roster: [
                        { id: user.id || 'usr_1', username: user.full_name || 'الكابتن', role: 'CAPTAIN', position: 'MID', rating: 88 }
                    ]
                };
                state.data.sports.myTeam = this.myTeam;
                state.persistLocalState();
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                NotificationService.showToast(`🛡️ تم تأسيس فريق "${name}" بنجاح وتعيينك كمدير للفريق!`, 'gold');
                this.render();
                this.bindEvents();
            }
        });

        // Invite player
        container.querySelector('#btn-invite-player')?.addEventListener('click', () => {
            const playerName = prompt('أدخل اسم أو رقم هاتف اللاعب المراد إضافته للفريق:');
            if (playerName && this.myTeam) {
                this.myTeam.roster.push({
                    id: 'member_' + Date.now(),
                    username: playerName,
                    role: 'MEMBER',
                    position: 'FWD',
                    rating: 85
                });
                NotificationService.showToast(`تم إرسال دعوة انضمام إلى ${playerName}!`, 'success');
                this.render();
                this.bindEvents();
            }
        });

        // Scout filters and search
        container.querySelectorAll('.pill-btn').forEach(pill => {
            pill.addEventListener('click', () => {
                this.scoutFilter = pill.dataset.pos;
                SoundManager.click();
                this.render();
                this.bindEvents();
            });
        });
        container.querySelector('#scout-search-input')?.addEventListener('input', (e) => {
            this.scoutSearch = e.target.value;
            const grid = container.querySelector('.scout-grid');
            if (grid) grid.innerHTML = this.renderScoutCards();
        });

        // Scout recruit button
        container.querySelectorAll('.btn-scout-recruit').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                SoundManager.click();
                NotificationService.showToast(`📩 تم إرسال طلب انضمام رسمي إلى اللاعب ${name}!`, 'info');
                btn.disabled = true;
                btn.innerText = 'تم إرسال الطلب';
            });
        });

        // Accept emergency
        container.querySelectorAll('.btn-accept-emergency').forEach(btn => {
            btn.addEventListener('click', () => {
                const reward = Number(btn.dataset.reward) || 500;
                state.updateGold(reward);
                state.addXP(100);
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                NotificationService.showToast(`🏆 تم تسجيل انضمامك للمباراة كمنقذ وإيداع ${reward} ذهب!`, 'gold');
                btn.disabled = true;
                btn.innerHTML = `<i class="fa-solid fa-check"></i> تم قبول النداء`;
            });
        });

        // Broadcast emergency
        container.querySelector('#btn-broadcast-emergency')?.addEventListener('click', async () => {
            const title = prompt('أدخل تفاصيل النداء (مثال: مطلوب حارس مرمى لملعب الفسطاط):');
            if (!title) return;
            await SportsService.broadcastEmergency({
                title,
                stadium_name: 'ملعب الفسطاط الخماسي',
                zone_name: 'الفسطاط والمعادي',
                missing_role: 'GK',
                match_time: 'الليلة 10:00 م',
                reward_gold: 500
            });
            this.render();
            this.bindEvents();
            NotificationService.showToast('تم بث نداء الطوارئ لكافة اللاعبين في المنطقة بنجاح!', 'success');
        });

        // Customize card
        container.querySelector('#sports-customize-card-btn')?.addEventListener('click', () => {
            this.router.navigate('view-profile', 'edit');
        });
    }
}
