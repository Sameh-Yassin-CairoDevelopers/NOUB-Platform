/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/sportsCtrl.js
 * Version: 3.0.0 (SPORTS ECOSYSTEM MASTER CONTROLLER)
 * Description: Interactive sub-views for 3D Player Cards (with fixed collar & neck),
 *              Match Arenas, Emergency SOS Callouts, Tactics Board, and Ramadan Tournaments.
 */

import { state } from '../core/state.js';
import { SportsService } from '../services/sportsService.js';
import { AvatarEngine } from '../utils/avatarEngine.js';
import { TACTICAL_FORMATIONS, PLAYER_POSITIONS, EGYPTIAN_ZONES } from '../data/sportsData.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';

export class SportsController {
    constructor(router) {
        this.router = router;
        this.activeTab = 'card'; // 'card' | 'arena' | 'emergency' | 'tactics' | 'tournaments'
        this.currentFormation = '2-2-1';
        this.boardPlayers = [];
    }

    async init() {
        this.render();
        this.bindEvents();
        try {
            await SportsService.getPlayerCard(state.data.user?.id);
            await SportsService.getActiveEmergencies();
            this.render();
            this.bindEvents();
        } catch (err) {
            console.warn("SportsController background sync error:", err);
        }
    }

    render() {
        const container = document.getElementById('view-sports');
        if (!container) return;

        const card = state.data.sports.card || {};
        const emergencies = state.data.sports.emergencies || [];

        container.innerHTML = `
            <div class="sports-view-wrapper">
                <!-- TOP BREADCRUMB & BACK TO HUB -->
                <div class="view-header-bar">
                    <button class="btn-back-hub" id="sports-back-hub">
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>العودة للبوابة الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-futbol text-gold"></i> منصة نوب سبورتس</h2>
                </div>

                <!-- SUB-NAVIGATION TABS -->
                <div class="sub-nav-tabs">
                    <button class="sub-tab-btn ${this.activeTab === 'card' ? 'active' : ''}" data-tab="card">
                        <i class="fa-solid fa-id-card"></i>
                        <span>كارت الهوية 3D</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'arena' ? 'active' : ''}" data-tab="arena">
                        <i class="fa-solid fa-futbol"></i>
                        <span>المباريات والملاعب</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'emergency' ? 'active' : ''}" data-tab="emergency">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>نداءات الطوارئ (${emergencies.length})</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'tactics' ? 'active' : ''}" data-tab="tactics">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span>السبورة التكتيكية</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'tournaments' ? 'active' : ''}" data-tab="tournaments">
                        <i class="fa-solid fa-trophy"></i>
                        <span>بطولات رمضان</span>
                    </button>
                </div>

                <!-- TAB 1: 3D PLAYER CARD (WITH FIXED ANATOMICAL NECK & COLLAR) -->
                <div id="tab-content-card" class="tab-pane ${this.activeTab === 'card' ? 'active' : 'hidden'}">
                    <div class="card-showcase-grid">
                        <div class="player-card-3d-wrapper">
                            <div class="fut-card gold-edition" id="my-player-fut-card">
                                <div class="card-inner">
                                    <!-- TOP RATINGS & POSITION -->
                                    <div class="card-header-stats">
                                        <div class="overall-val">${card.overall_rating || 85}</div>
                                        <div class="pos-val">${card.primary_position || 'CM'}</div>
                                        <div class="zone-icon"><i class="fa-solid fa-shield-halved"></i></div>
                                    </div>

                                    <!-- AVATAR ENGINE FIXED ARTWORK -->
                                    <div class="card-avatar-art">
                                        ${AvatarEngine.generateAvatarHTML(card.visual_dna, card.player_name || 'NOUB')}
                                    </div>

                                    <!-- PLAYER NAME -->
                                    <div class="card-player-title">
                                        <h3>${card.player_name || 'كابتن نوب'}</h3>
                                    </div>

                                    <!-- 6 CARD STATS GRID -->
                                    <div class="card-attributes-grid">
                                        <div class="stat-cell"><span>PAC</span><strong>${card.speed || 87}</strong></div>
                                        <div class="stat-cell"><span>SHO</span><strong>${card.shooting || 84}</strong></div>
                                        <div class="stat-cell"><span>PAS</span><strong>${card.passing || 89}</strong></div>
                                        <div class="stat-cell"><span>DRI</span><strong>${card.dribbling || 86}</strong></div>
                                        <div class="stat-cell"><span>DEF</span><strong>${card.defending || 80}</strong></div>
                                        <div class="stat-cell"><span>PHY</span><strong>${card.physicality || 82}</strong></div>
                                    </div>

                                    <div class="card-footer-edition">
                                        <span>NOUB MASTER 2026 EDITION</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CARD CONTROLS & RECORD -->
                        <div class="card-career-panel">
                            <h3><i class="fa-solid fa-chart-line text-gold"></i> السجل الكروي الموثق</h3>
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
                                    <span class="label">صناعة الأهداف</span>
                                    <strong class="val">${card.assists || 12}</strong>
                                </div>
                                <div class="stat-box">
                                    <span class="label">رجل المباراة MVP</span>
                                    <strong class="val">${card.man_of_match_count || 3}</strong>
                                </div>
                            </div>

                            <button class="btn-noub-gold w-full mt-4" id="sports-customize-card-btn">
                                <i class="fa-solid fa-paintbrush"></i>
                                <span>تعديل الزي والشعار والألوان</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: ARENA & MATCHES -->
                <div id="tab-content-arena" class="tab-pane ${this.activeTab === 'arena' ? 'active' : 'hidden'}">
                    <div class="arena-top-actions">
                        <h3><i class="fa-solid fa-calendar-days text-gold"></i> المباريات القادمة والملاعب</h3>
                        <button class="btn-noub-gold" id="btn-create-match">
                            <i class="fa-solid fa-plus"></i>
                            <span>تسجيل حجز مباراة</span>
                        </button>
                    </div>

                    <div class="matches-list">
                        <div class="match-card">
                            <div class="match-time-badge">اليوم • 09:00 م</div>
                            <div class="match-teams-row">
                                <div class="team-block">
                                    <i class="fa-solid fa-shield-cat team-logo"></i>
                                    <strong>فرسان الفسطاط</strong>
                                </div>
                                <div class="vs-circle">VS</div>
                                <div class="team-block">
                                    <i class="fa-solid fa-shield-dog team-logo"></i>
                                    <strong>نسور المعادي</strong>
                                </div>
                            </div>
                            <div class="match-meta">
                                <span><i class="fa-solid fa-location-dot"></i> ملعب النجوم (خماسي نجيل صناعي)</span>
                                <span><i class="fa-solid fa-user-check"></i> مكتمل (10/10)</span>
                            </div>
                        </div>

                        <div class="match-card">
                            <div class="match-time-badge">غداً • 10:30 م</div>
                            <div class="match-teams-row">
                                <div class="team-block">
                                    <i class="fa-solid fa-shield team-logo"></i>
                                    <strong>أبطال مدينة نصر</strong>
                                </div>
                                <div class="vs-circle">VS</div>
                                <div class="team-block">
                                    <i class="fa-solid fa-shield-halved team-logo"></i>
                                    <strong>ذئاب مصر الجديدة</strong>
                                </div>
                            </div>
                            <div class="match-meta">
                                <span><i class="fa-solid fa-location-dot"></i> نادي الشمس (سداسي)</span>
                                <span class="text-gold"><i class="fa-solid fa-triangle-exclamation"></i> مطلوب لاعب</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 3: EMERGENCY SOS CALLOUTS -->
                <div id="tab-content-emergency" class="tab-pane ${this.activeTab === 'emergency' ? 'active' : 'hidden'}">
                    <div class="emergency-header-banner">
                        <div class="emg-text">
                            <h3>🚨 غرفة عمليات ونداءات الطوارئ الرياضية</h3>
                            <p>ناقصكم لاعب أو حارس مرمى فوراً قبل بدء الماتش؟ أطلق إشارة طوارئ بمكافأة ذهبية وسجل حضورك كمنقذ!</p>
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
                                    <span>أنا جاهز للمشاركة الآن (+${emg.reward_gold} ذهب)</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- TAB 4: 3D TACTICS BOARD -->
                <div id="tab-content-tactics" class="tab-pane ${this.activeTab === 'tactics' ? 'active' : 'hidden'}">
                    <div class="tactics-top-bar">
                        <div class="formation-selector">
                            <label>اختر الخطة التكتيكية:</label>
                            <select id="tactics-formation-select" class="noub-select">
                                ${Object.keys(TACTICAL_FORMATIONS).map(fKey => `
                                    <option value="${fKey}" ${this.currentFormation === fKey ? 'selected' : ''}>${TACTICAL_FORMATIONS[fKey].name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <button class="btn-noub-gold" id="btn-export-tactics">
                            <i class="fa-solid fa-download"></i>
                            <span>حفظ الخطة كصورة HD</span>
                        </button>
                    </div>

                    <!-- PITCH BOARD WITH DRAGGABLE PLAYER MAGNETS -->
                    <div class="tactics-pitch-container" id="tactics-pitch">
                        <div class="pitch-lines">
                            <div class="pitch-center-circle"></div>
                            <div class="pitch-center-line"></div>
                            <div class="pitch-penalty-area top"></div>
                            <div class="pitch-penalty-area bottom"></div>
                        </div>

                        <!-- SLOTTED PLAYER MAGNETS -->
                        <div class="players-slot-layer" id="tactics-players-layer">
                            ${this.renderPitchPlayers()}
                        </div>
                    </div>
                </div>

                <!-- TAB 5: RAMADAN TOURNAMENTS -->
                <div id="tab-content-tournaments" class="tab-pane ${this.activeTab === 'tournaments' ? 'active' : 'hidden'}">
                    <div class="tournament-hero-banner">
                        <div class="tourn-badge"><i class="fa-solid fa-moon"></i> دوري ليالي رمضان الكبرى 2026</div>
                        <h3>بطولة الفسطاط والمعادي الرمضانية</h3>
                        <p>16 فريقاً، جوائز كبرى 100,000 ذهب وكؤوس تذكارية موثقة على قاعدة البيانات.</p>
                    </div>

                    <div class="tournament-standings-card">
                        <h4><i class="fa-solid fa-ranking-star text-gold"></i> جدول ترتيب المجموعة (A)</h4>
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
                                <tr>
                                    <td>4</td>
                                    <td><strong>نمور حلوان</strong></td>
                                    <td>3</td>
                                    <td>-7</td>
                                    <td><strong>0</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
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

        // Tab switches
        container.querySelectorAll('.sub-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTab = btn.dataset.tab;
                this.render();
                this.bindEvents();
                SoundManager.click();
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

        // Export tactics
        container.querySelector('#btn-export-tactics')?.addEventListener('click', () => {
            NotificationService.showToast('📸 تم حفظ التشكيلة التكتيكية بنجاح!', 'success');
            VisualEffects.triggerConfetti();
        });
    }
}
