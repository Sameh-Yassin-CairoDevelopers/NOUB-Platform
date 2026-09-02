/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/industryCtrl.js
 * Version: 3.0.0 (PHARAONIC CRAFTING, TOMBS & SOUL CARD CONTROLLER)
 * Description: Real-time Workshop harvesting, KV 1-62 Codebreaker, Collatz #9999 Soul Card,
 *              Great Monumental Projects, and Master Albums & P2P Swaps.
 */

import { state } from '../core/state.js';
import { IndustryService } from '../services/industryService.js';
import { PHARAONIC_RESOURCES, PHARAONIC_WORKSHOPS, KV_TOMBS_CATALOG, MASTER_ALBUMS, GREAT_PROJECTS } from '../data/pharaohsData.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';

export class IndustryController {
    constructor(router) {
        this.router = router;
        this.activeTab = 'workshops'; // 'workshops' | 'tombs' | 'soul' | 'projects' | 'albums'
        this.selectedTomb = null;
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById('view-industry');
        if (!container) return;

        const resources = state.data.industry.resources || {};
        const unlockedTombs = state.data.industry.unlockedTombs || [];
        const soulCard = state.data.industry.soulCard;

        container.innerHTML = `
            <div class="industry-view-wrapper">
                <!-- TOP BREADCRUMB -->
                <div class="view-header-bar">
                    <button class="btn-back-hub" id="industry-back-hub">
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>العودة للبوابة الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-landmark text-gold"></i> نوب إندستري وورش الفراعنة</h2>
                </div>

                <!-- SUB-NAVIGATION TABS -->
                <div class="sub-nav-tabs">
                    <button class="sub-tab-btn ${this.activeTab === 'workshops' ? 'active' : ''}" data-tab="workshops">
                        <i class="fa-solid fa-fire-burner"></i>
                        <span>الورش والمخزن</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'tombs' ? 'active' : ''}" data-tab="tombs">
                        <i class="fa-solid fa-key"></i>
                        <span>شفرات وادي الملوك (${unlockedTombs.length}/62)</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'soul' ? 'active' : ''}" data-tab="soul">
                        <i class="fa-solid fa-sun"></i>
                        <span>كارت الروح (#9999)</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
                        <i class="fa-solid fa-monument"></i>
                        <span>الصروح العظيمة</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'albums' ? 'active' : ''}" data-tab="albums">
                        <i class="fa-solid fa-book-bookmark"></i>
                        <span>ألبومات الكروت والمقايضة</span>
                    </button>
                </div>

                <!-- TAB 1: WORKSHOPS & INVENTORY -->
                <div id="tab-ind-workshops" class="tab-pane ${this.activeTab === 'workshops' ? 'active' : 'hidden'}">
                    <!-- RAW RESOURCES STRIP -->
                    <div class="resources-warehouse-card">
                        <h4><i class="fa-solid fa-warehouse text-gold"></i> مخزن الموارد الخام الملكي</h4>
                        <div class="resources-pills-row">
                            <div class="res-pill">
                                <span class="icon">🧱</span>
                                <div class="det">
                                    <span class="label">حجر جيري</span>
                                    <strong>${resources.LIMESTONE || 0}</strong>
                                </div>
                            </div>
                            <div class="res-pill">
                                <span class="icon">🏺</span>
                                <div class="det">
                                    <span class="label">طمي النيل</span>
                                    <strong>${resources.CLAY || 0}</strong>
                                </div>
                            </div>
                            <div class="res-pill">
                                <span class="icon">📜</span>
                                <div class="det">
                                    <span class="label">بردي</span>
                                    <strong>${resources.PAPYRUS || 0}</strong>
                                </div>
                            </div>
                            <div class="res-pill">
                                <span class="icon">🪙</span>
                                <div class="det">
                                    <span class="label">برونز</span>
                                    <strong>${resources.BRONZE || 0}</strong>
                                </div>
                            </div>
                            <div class="res-pill highlight">
                                <span class="icon">✨</span>
                                <div class="det">
                                    <span class="label">رقائق ذهب</span>
                                    <strong>${resources.GOLD_LEAF || 0}</strong>
                                </div>
                            </div>
                            <div class="res-pill highlight">
                                <span class="icon">💎</span>
                                <div class="det">
                                    <span class="label">لازورد</span>
                                    <strong>${resources.LAPIS_LAZULI || 0}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WORKSHOP PRODUCTION LINES -->
                    <div class="workshops-grid mt-4">
                        ${PHARAONIC_WORKSHOPS.map(ws => {
                            const current = state.data.industry.workshops.find(w => w.id === ws.id) || { level: 1 };
                            const cost = ws.cost_to_upgrade * current.level;
                            return `
                                <div class="workshop-card">
                                    <div class="ws-header">
                                        <div class="ws-icon" style="color: ${ws.color}">
                                            <i class="fa-solid ${ws.icon}"></i>
                                        </div>
                                        <div class="ws-info">
                                            <h4>${ws.name_ar}</h4>
                                            <span>المستوى الحالي: <strong>Lv.${current.level}</strong></span>
                                        </div>
                                    </div>
                                    <div class="ws-body">
                                        <p>معدل الإنتاج: <strong>${ws.rate_per_min * current.level} وحدة / دقيقة</strong></p>
                                    </div>
                                    <div class="ws-actions">
                                        <button class="btn-upgrade-ws" data-ws-id="${ws.id}">
                                            <i class="fa-solid fa-circle-arrow-up"></i>
                                            <span>ترقية الورشة (${cost} ذهب)</span>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- TAB 2: 62 KV TOMBS CODEBREAKER -->
                <div id="tab-ind-tombs" class="tab-pane ${this.activeTab === 'tombs' ? 'active' : 'hidden'}">
                    <div class="tombs-header-banner">
                        <h3>🏺 لغز مقابر وادي الملوك الـ 62 الخالدة</h3>
                        <p>فك شفرات مقابر ملوك الفراعنة (من KV1 حتى KV62) باستخدام التلميحات الفلكية والحسابية لفتح الكنوز والذهب!</p>
                    </div>

                    <div class="tombs-grid">
                        ${KV_TOMBS_CATALOG.map(tomb => {
                            const isUnlocked = unlockedTombs.includes(tomb.kv_number);
                            return `
                                <div class="tomb-card ${isUnlocked ? 'unlocked' : 'locked'}" data-kv="${tomb.kv_number}">
                                    <div class="tomb-top">
                                        <span class="kv-tag">KV${tomb.kv_number}</span>
                                        <span class="dynasty-tag">${tomb.dynasty}</span>
                                    </div>
                                    <h4>${tomb.name_ar}</h4>
                                    <p class="hint-text"><i class="fa-solid fa-lightbulb text-gold"></i> ${tomb.hint}</p>
                                    <div class="tomb-status">
                                        ${isUnlocked ? `
                                            <span class="status-badge opened"><i class="fa-solid fa-lock-open"></i> تم الفتح والحصد</span>
                                        ` : `
                                            <button class="btn-open-cipher" data-kv="${tomb.kv_number}">
                                                <i class="fa-solid fa-key"></i>
                                                <span>فك الشفرة السرية</span>
                                            </button>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- TAB 3: SOUL CARD #9999 (COLLATZ POWER) -->
                <div id="tab-ind-soul" class="tab-pane ${this.activeTab === 'soul' ? 'active' : 'hidden'}">
                    <div class="soul-hero-banner">
                        <div class="soul-badge"><i class="fa-solid fa-infinity"></i> الطاقة الكونية (3n+1)</div>
                        <h3>كارت الروح الفرعونية الأبدي (#9999)</h3>
                        <p>توليد حسابي رياضي دقيق لطاقة الروح باستخدام متتالية كولاتز الأسطورية لحساب مسار التوقف وقوة الهيمنة.</p>
                        
                        <button class="btn-noub-gold mt-3" id="btn-mint-soul-card">
                            <i class="fa-solid fa-bolt"></i>
                            <span>${soulCard ? 'إعادة انبعاث وحساب طاقة الروح' : 'تفعيل وانبعاث كارت الروح الأبدي'}</span>
                        </button>
                    </div>

                    ${soulCard ? `
                        <div class="soul-card-display mt-4">
                            <div class="soul-artifact">
                                <div class="soul-glow-ring"></div>
                                <div class="soul-badge-number">#9999</div>
                                <div class="soul-affinity-icon">${soulCard.affinity.icon}</div>
                                <h3>${soulCard.title_ar}</h3>
                                <p class="owner-tag">المستحوذ: <strong>${soulCard.owner_name}</strong></p>
                                
                                <div class="soul-metrics-grid">
                                    <div class="s-metric">
                                        <span>قوة الكارت الإجمالية</span>
                                        <strong class="power-val">${soulCard.power_score} / 9999</strong>
                                    </div>
                                    <div class="s-metric">
                                        <span>خطوات كولاتز (Stopping Time)</span>
                                        <strong>${soulCard.total_stopping_time} خطوة</strong>
                                    </div>
                                    <div class="s-metric">
                                        <span>ذروة المسار الفلكي (Peak)</span>
                                        <strong>${soulCard.peak_trajectory}</strong>
                                    </div>
                                    <div class="s-metric">
                                        <span>العنصر الإلهي الحاكم</span>
                                        <strong style="color: ${soulCard.affinity.color}">${soulCard.affinity.name}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="empty-state-hint mt-4">اضغط على زر التفعيل أعلاه لتوليد كارت الروح الخاص بك.</div>
                    `}
                </div>

                <!-- TAB 4: GREAT PROJECTS -->
                <div id="tab-ind-projects" class="tab-pane ${this.activeTab === 'projects' ? 'active' : 'hidden'}">
                    <div class="projects-grid">
                        ${GREAT_PROJECTS.map(proj => `
                            <div class="project-card">
                                <div class="proj-header">
                                    <i class="fa-solid ${proj.icon} proj-icon"></i>
                                    <h4>${proj.name_ar}</h4>
                                </div>
                                <p>${proj.desc}</p>
                                <div class="reqs-list">
                                    <span><i class="fa-solid fa-coins text-gold"></i> ${proj.required_gold.toLocaleString()} ذهب</span>
                                    ${proj.required_limestone ? `<span>🧱 ${proj.required_limestone} حجر جيري</span>` : ''}
                                    ${proj.required_bronze ? `<span>🪙 ${proj.required_bronze} برونز</span>` : ''}
                                    ${proj.required_papyrus ? `<span>📜 ${proj.required_papyrus} بردي</span>` : ''}
                                </div>
                                <button class="btn-construct-proj" data-proj-id="${proj.id}">
                                    <i class="fa-solid fa-hammer"></i>
                                    <span>تشييد الصرح الآن</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- TAB 5: MASTER ALBUMS -->
                <div id="tab-ind-albums" class="tab-pane ${this.activeTab === 'albums' ? 'active' : 'hidden'}">
                    <div class="albums-grid">
                        ${MASTER_ALBUMS.map(alb => `
                            <div class="album-book-card">
                                <div class="album-top">
                                    <span class="category-tag">${alb.category}</span>
                                    <span class="reward-tag"><i class="fa-solid fa-coins text-gold"></i> ${alb.reward_gold.toLocaleString()} ذهب</span>
                                </div>
                                <h4>${alb.name_ar}</h4>
                                <div class="album-cards-pills">
                                    ${alb.cards.map(cName => `
                                        <div class="card-slot-pill locked">
                                            <i class="fa-solid fa-shield"></i>
                                            <span>${cName}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.getElementById('view-industry');
        if (!container) return;

        // Back to Hub
        container.querySelector('#industry-back-hub')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-hub');
        });

        // Tab changes
        container.querySelectorAll('.sub-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTab = btn.dataset.tab;
                this.render();
                this.bindEvents();
                SoundManager.click();
            });
        });

        // Upgrade Workshop
        container.querySelectorAll('.btn-upgrade-ws').forEach(btn => {
            btn.addEventListener('click', () => {
                const wsId = btn.dataset.wsId;
                const result = IndustryService.upgradeWorkshop(wsId);
                if (result.success) {
                    SoundManager.playGoldChime();
                    VisualEffects.triggerConfetti();
                    NotificationService.showToast(`✨ تمت ترقية الورشة بنجاح إلى المستوى ${result.newLevel}!`, 'success');
                    this.render();
                    this.bindEvents();
                } else {
                    NotificationService.showToast(result.message, 'alert');
                }
            });
        });

        // Open Tomb Cipher
        container.querySelectorAll('.btn-open-cipher').forEach(btn => {
            btn.addEventListener('click', () => {
                const kv = Number(btn.dataset.kv);
                const code = prompt(`أدخل الرمز السري لفك شفرة المقبرة KV${kv}:`);
                if (!code) return;

                const res = IndustryService.tryUnlockTomb(kv, code);
                if (res.success) {
                    SoundManager.playGoldChime();
                    VisualEffects.triggerConfetti();
                    this.render();
                    this.bindEvents();
                } else {
                    NotificationService.showToast(res.message, 'alert');
                }
            });
        });

        // Mint Soul Card
        container.querySelector('#btn-mint-soul-card')?.addEventListener('click', () => {
            IndustryService.mintSoulCard();
            SoundManager.playGoldChime();
            VisualEffects.triggerConfetti();
            this.render();
            this.bindEvents();
        });

        // Construct Project
        container.querySelectorAll('.btn-construct-proj').forEach(btn => {
            btn.addEventListener('click', () => {
                const projId = btn.dataset.projId;
                const res = IndustryService.constructProject(projId);
                if (res.success) {
                    SoundManager.playGoldChime();
                    VisualEffects.triggerConfetti();
                    this.render();
                    this.bindEvents();
                } else {
                    NotificationService.showToast(res.message, 'alert');
                }
            });
        });
    }
}
