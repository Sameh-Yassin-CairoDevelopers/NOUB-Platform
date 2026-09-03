/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/hubCtrl.js
 * Version: 3.0.0 (MASTER UNIFIED HUB & REALM PORTAL CONTROLLER)
 * Description: The grand master portal coordinating unified treasury, live activity feed,
 *              1-click multi-realm navigation, and quick cross-domain widgets.
 */

import { state } from '../core/state.js';
import { IndustryService } from '../services/industryService.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';
import { TimeEngine } from '../utils/timeEngine.js';

export class HubController {
    constructor(router) {
        this.router = router;
        this.unsubscribe = null;
    }

    init() {
        this.render();
        this.bindEvents();
        if (!this.unsubscribe) {
            this.unsubscribe = state.subscribe(() => {
                this.updateLiveStats();
            });
        }
    }

    switchTab(tabKey) {
        if (tabKey === 'ads') {
            const act = document.querySelector('.hub-activity-card');
            act?.scrollIntoView({ behavior: 'smooth' });
        } else if (tabKey === 'emergencies') {
            this.router.navigate('view-arena');
        } else if (tabKey === 'rank') {
            this.router.navigate('view-tournaments');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    render() {
        const container = document.getElementById('view-hub');
        if (!container) return;

        const user = state.data.user || { full_name: 'كابتن نوب', gold_balance: 10000, level: 1, xp: 0 };
        const level = user.level || 1;
        const xp = user.xp || 0;
        const nextLevelXP = level * 1000;
        const xpPercent = Math.min(100, Math.floor((xp % 1000) / 10));

        const activeGestation = state.data.sanctuary.activeGestation || [];
        const emergencies = state.data.sports.emergencies || [];

        container.innerHTML = `
            <div class="hub-container">
                <!-- MASTER TREASURY & HERO HUD -->
                <div class="master-hud-banner">
                    <div class="hud-top-row">
                        <div class="user-welcome">
                            <span class="greeting-tag"><i class="fa-solid fa-layer-group"></i> منظومة نوب الموحدة</span>
                            <h2>أهلاً بك، ${user.full_name}</h2>
                        </div>
                        <div class="gold-treasury-badge" id="hub-gold-badge">
                            <i class="fa-solid fa-coins gold-coin-icon"></i>
                            <div class="gold-info">
                                <span class="gold-label">الخزنة المركزية</span>
                                <strong class="gold-val" id="hub-gold-val">${(user.gold_balance || 0).toLocaleString('ar-EG')} نوب</strong>
                            </div>
                        </div>
                    </div>

                    <!-- LEVEL & XP BAR -->
                    <div class="level-progress-wrapper">
                        <div class="level-badge">
                            <span>المستوى</span>
                            <strong>${level}</strong>
                        </div>
                        <div class="xp-bar-container">
                            <div class="xp-bar-fill" style="width: ${xpPercent}%"></div>
                            <span class="xp-text">${xp % 1000} / 1000 XP</span>
                        </div>
                    </div>
                </div>

                <!-- FAST ACTION STRIP -->
                <div class="hub-quick-strip">
                    <button class="quick-action-pill" id="hub-harvest-btn">
                        <i class="fa-solid fa-wheat-awn"></i>
                        <span>جمع إنتاج الورش (+موارِد)</span>
                    </button>
                    ${activeGestation.length > 0 ? `
                    <button class="quick-action-pill highlight" id="hub-gestation-btn">
                        <i class="fa-solid fa-dna"></i>
                        <span>حضانات نشطة (${activeGestation.length})</span>
                    </button>
                    ` : ''}
                    ${emergencies.length > 0 ? `
                    <button class="quick-action-pill emergency" id="hub-emergency-btn">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>نداءات طوارئ بالملاعب (${emergencies.length})</span>
                    </button>
                    ` : ''}
                </div>

                <!-- 3 GRAND REALM PORTALS -->
                <div class="realms-heading">
                    <h3><i class="fa-solid fa-layer-group"></i> قطاعات منظومة نوب</h3>
                    <p>اختر القسم الرياضي أو الإنتاجي أو الوراثي للبدء</p>
                </div>

                <div class="realms-grid">
                    <!-- REALM 1: SPORTS -->
                    <div class="realm-card realm-sports" id="portal-sports">
                        <div class="realm-glow-bg"></div>
                        <div class="realm-icon-top">
                            <i class="fa-solid fa-futbol"></i>
                        </div>
                        <div class="realm-content">
                            <span class="realm-badge sports">قطاع الرياضة</span>
                            <h4>منصة نوب سبورتس</h4>
                            <p>كروت اللاعبين الرقمية 3D، حجز الملاعب والمباريات، رادار الكشافة، السبورة التكتيكية، وبطولات رمضان الشعبية.</p>
                            <div class="realm-footer">
                                <span>دخول منصة الرياضة</span>
                                <i class="fa-solid fa-arrow-left"></i>
                            </div>
                        </div>
                    </div>

                    <!-- REALM 2: PHARAOHS INDUSTRY -->
                    <div class="realm-card realm-industry" id="portal-industry">
                        <div class="realm-glow-bg"></div>
                        <div class="realm-icon-top">
                            <i class="fa-solid fa-landmark"></i>
                        </div>
                        <div class="realm-content">
                            <span class="realm-badge industry">قطاع التصنيع والتجارة</span>
                            <h4>ورش التصنيع ومقايضة الكروت</h4>
                            <p>ورش إنتاج الموارد، كشوفات وادي الملوك الأثرية (1-62)، كارت المصنع المعتمد، وسوق التبادل والمقايضة P2P.</p>
                            <div class="realm-footer">
                                <span>دخول ورش التصنيع</span>
                                <i class="fa-solid fa-arrow-left"></i>
                            </div>
                        </div>
                    </div>

                    <!-- REALM 3: BIO-SANCTUARY -->
                    <div class="realm-card realm-sanctuary" id="portal-sanctuary">
                        <div class="realm-glow-bg"></div>
                        <div class="realm-icon-top">
                            <i class="fa-solid fa-paw"></i>
                        </div>
                        <div class="realm-content">
                            <span class="realm-badge sanctuary">قطاع الأنساب والوراثة</span>
                            <h4>محمية الأنساب والوراثة (89x)</h4>
                            <p>سجلات أنساب الخيل العربي، الإبل، الحمام، الكلاب، القطط، وأشجار البونساي، مع الحضانة المتسارعة 89x.</p>
                            <div class="realm-footer">
                                <span>دخول محمية الأنساب</span>
                                <i class="fa-solid fa-arrow-left"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RECENT LIVE ACTIVITY LOG -->
                <div class="hub-activity-card">
                    <div class="card-header-flex">
                        <h4><i class="fa-solid fa-clock-rotate-left"></i> سجل الأنشطة الموحدة</h4>
                        <span class="pulse-dot">مباشر</span>
                    </div>
                    <div class="activity-feed-list" id="hub-activity-list">
                        ${this.renderActivityList()}
                    </div>
                </div>
            </div>
        `;
    }

    renderActivityList() {
        const notifications = state.data.notifications || [];
        if (notifications.length === 0) {
            return `<div class="empty-state-hint">لا توجد أنشطة سابقة حتى الآن. ابدأ باللعب أو الإنتاج!</div>`;
        }

        return notifications.slice(0, 5).map(n => `
            <div class="activity-item">
                <div class="act-icon ${n.type}">
                    <i class="fa-solid ${n.type === 'gold' ? 'fa-coins' : n.type === 'alert' ? 'fa-triangle-exclamation' : 'fa-check'}"></i>
                </div>
                <div class="act-details">
                    <strong>${n.title}</strong>
                    <p>${n.message}</p>
                    <time>${TimeEngine.formatArabicDateTime(n.timestamp)}</time>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        const container = document.getElementById('view-hub');
        if (!container) return;

        // Portal clicks
        container.querySelector('#portal-sports')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-home');
        });

        container.querySelector('#portal-industry')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-industry');
        });

        container.querySelector('#portal-sanctuary')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-sanctuary');
        });

        // 1-Click Harvest
        container.querySelector('#hub-harvest-btn')?.addEventListener('click', () => {
            const harvested = IndustryService.harvestWorkshops();
            SoundManager.playGoldChime();
            VisualEffects.triggerConfetti();
            NotificationService.showToast('🌾 تم حصد موارد الورش بنجاح وإيداعها في مخزنك!', 'success');
        });

        // Gestation shortcut
        container.querySelector('#hub-gestation-btn')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-sanctuary');
        });

        // Emergency shortcut
        container.querySelector('#hub-emergency-btn')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-arena');
        });
    }

    updateLiveStats() {
        const user = state.data.user;
        const goldVal = document.getElementById('hub-gold-val');
        if (goldVal && user) {
            goldVal.innerText = `${(user.gold_balance || 0).toLocaleString('ar-EG')} نوب`;
        }
        const activityList = document.getElementById('hub-activity-list');
        if (activityList) {
            activityList.innerHTML = this.renderActivityList();
        }
    }
}
