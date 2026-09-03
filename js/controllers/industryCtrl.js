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
        this.tombSearch = '';
        this.tombFilter = 'all'; // 'all' | 'unlocked' | 'locked'
        this.currentCipherTomb = null;
        this.enteredCipherCode = '';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    switchTab(tabKey) {
        const mapping = {
            'workshops': 'workshops',
            'contracts': 'tombs',
            'auctions': 'albums',
            'craft': 'projects'
        };
        this.activeTab = mapping[tabKey] || tabKey;
        this.render();
        this.bindEvents();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        <span>الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-landmark text-gold"></i> ورش التصنيع ومقايضة الكروت</h2>
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
                        <i class="fa-solid fa-certificate"></i>
                        <span>كارت الصانع المعتمد (#9999)</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
                        <i class="fa-solid fa-monument"></i>
                        <span>المشروعات الكبرى</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'albums' ? 'active' : ''}" data-tab="albums">
                        <i class="fa-solid fa-book-bookmark"></i>
                        <span>سوق الكروت والمقايضة</span>
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
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                            <div>
                                <h3 style="font-size: 20px; font-weight: 900; margin: 0 0 6px 0;"><i class="fa-solid fa-gem text-gold"></i> لغز مقابر وادي الملوك الـ 62 الخالدة</h3>
                                <p style="margin: 0; font-size: 13px; color: var(--text-muted);">فك شفرات مقابر ملوك الفراعنة (من KV1 حتى KV62) بحل الألغاز والحسابات لفتح الكنوز والذهب والمقتنيات الأسطورية!</p>
                            </div>
                            <div style="background: rgba(212, 175, 55, 0.2); border: 1px solid var(--gold-main); padding: 8px 16px; border-radius: var(--radius-md); text-align: center;">
                                <span style="font-size: 11px; color: var(--gold-light); display: block;">إجمالي المقابر المستكشفة</span>
                                <strong style="font-size: 18px; color: #fff;">${unlockedTombs.length} / 62</strong>
                            </div>
                        </div>
                    </div>

                    <!-- SEARCH & FILTER CONTROLS -->
                    <div class="tombs-controls-bar">
                        <div class="tombs-search-box">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" id="tombs-search-input" class="tombs-search-input" placeholder="ابحث برقم المقبرة (مثل 62) أو اسم الفرعون..." value="${this.tombSearch || ''}">
                        </div>
                        <div class="tombs-filter-tabs">
                            <button class="filter-chip-btn ${this.tombFilter === 'all' ? 'active' : ''}" data-filter="all">
                                الكل (62)
                            </button>
                            <button class="filter-chip-btn ${this.tombFilter === 'unlocked' ? 'active' : ''}" data-filter="unlocked">
                                <i class="fa-solid fa-lock-open text-gold"></i> المفتوحة (${unlockedTombs.length})
                            </button>
                            <button class="filter-chip-btn ${this.tombFilter === 'locked' ? 'active' : ''}" data-filter="locked">
                                <i class="fa-solid fa-lock"></i> المغلقة (${62 - unlockedTombs.length})
                            </button>
                        </div>
                    </div>

                    <div class="tombs-grid">
                        ${this.getFilteredTombs(unlockedTombs).map(tomb => {
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
                                            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                                <span class="status-badge opened"><i class="fa-solid fa-circle-check"></i> مفتوحة</span>
                                                <button class="btn-inspect-tomb" data-kv="${tomb.kv_number}" style="background: rgba(212,175,55,0.15); border: 1px solid var(--gold-main); color: var(--gold-light); font-size: 11px; padding: 4px 10px; border-radius: 8px; cursor: pointer;">
                                                    <i class="fa-solid fa-eye"></i> الكنز الملكي
                                                </button>
                                            </div>
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

    getFilteredTombs(unlockedTombs) {
        let tombs = [...KV_TOMBS_CATALOG];
        if (this.tombFilter === 'unlocked') {
            tombs = tombs.filter(t => unlockedTombs.includes(t.kv_number));
        } else if (this.tombFilter === 'locked') {
            tombs = tombs.filter(t => !unlockedTombs.includes(t.kv_number));
        }

        if (this.tombSearch && this.tombSearch.trim()) {
            const query = this.tombSearch.trim().toLowerCase();
            tombs = tombs.filter(t => 
                t.kv_number.toString().includes(query) ||
                (t.name_ar && t.name_ar.toLowerCase().includes(query)) ||
                (t.dynasty && t.dynasty.toLowerCase().includes(query)) ||
                (t.hint && t.hint.toLowerCase().includes(query))
            );
        }
        return tombs;
    }

    openCipherModal(tomb) {
        this.currentCipherTomb = tomb;
        this.enteredCipherCode = '';

        // Remove any existing cipher modal
        document.getElementById('tomb-cipher-modal-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'tomb-cipher-modal-overlay';
        overlay.className = 'cipher-modal-backdrop';

        overlay.innerHTML = `
            <div class="cipher-modal-card">
                <button class="cipher-modal-close" id="btn-cipher-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="cipher-tomb-header">
                    <span class="cipher-kv-pill">KV${tomb.kv_number} • ${tomb.dynasty}</span>
                    <h3>${tomb.name_ar}</h3>
                    <span class="cipher-dynasty">الرمز الأثري المفقود (${tomb.code_length} أرقام)</span>
                </div>

                <div class="cipher-hint-box">
                    <strong><i class="fa-solid fa-lightbulb text-gold"></i> لغز فتح المقبرة:</strong>
                    ${tomb.hint}
                </div>

                <div class="cipher-display-box">
                    <div class="cipher-display-digits" id="cipher-digits-display">
                        ${'_ '.repeat(tomb.code_length).trim()}
                    </div>
                </div>

                <div class="cipher-keypad">
                    <button class="cipher-key" data-digit="1">1</button>
                    <button class="cipher-key" data-digit="2">2</button>
                    <button class="cipher-key" data-digit="3">3</button>
                    <button class="cipher-key" data-digit="4">4</button>
                    <button class="cipher-key" data-digit="5">5</button>
                    <button class="cipher-key" data-digit="6">6</button>
                    <button class="cipher-key" data-digit="7">7</button>
                    <button class="cipher-key" data-digit="8">8</button>
                    <button class="cipher-key" data-digit="9">9</button>
                    <button class="cipher-key key-action" id="btn-cipher-backspace"><i class="fa-solid fa-delete-left"></i></button>
                    <button class="cipher-key" data-digit="0">0</button>
                    <button class="cipher-key key-action" id="btn-cipher-clear"><i class="fa-solid fa-rotate-left"></i></button>
                </div>

                <div class="cipher-actions-row">
                    <button class="btn-cipher-hint" id="btn-cipher-reveal">
                        <i class="fa-solid fa-wand-magic-sparkles text-gold"></i> مساعدة الحكيم
                    </button>
                    <button class="btn-cipher-unlock" id="btn-cipher-submit">
                        <i class="fa-solid fa-unlock-keyhole"></i> فك الشفرة وحصد الكنز
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const updateDisplay = () => {
            const disp = document.getElementById('cipher-digits-display');
            if (!disp) return;
            if (this.enteredCipherCode.length === 0) {
                disp.innerText = '_ '.repeat(tomb.code_length).trim();
            } else {
                let text = this.enteredCipherCode;
                const remaining = tomb.code_length - text.length;
                if (remaining > 0) {
                    text += ' _'.repeat(remaining);
                }
                disp.innerText = text;
            }
        };

        // Keypad buttons
        overlay.querySelectorAll('.cipher-key[data-digit]').forEach(k => {
            k.addEventListener('click', () => {
                if (this.enteredCipherCode.length < tomb.code_length) {
                    this.enteredCipherCode += k.dataset.digit;
                    SoundManager.click();
                    updateDisplay();
                }
            });
        });

        // Backspace
        overlay.querySelector('#btn-cipher-backspace')?.addEventListener('click', () => {
            this.enteredCipherCode = this.enteredCipherCode.slice(0, -1);
            SoundManager.click();
            updateDisplay();
        });

        // Clear
        overlay.querySelector('#btn-cipher-clear')?.addEventListener('click', () => {
            this.enteredCipherCode = '';
            SoundManager.click();
            updateDisplay();
        });

        // Close
        const closeModal = () => {
            overlay.remove();
        };

        overlay.querySelector('#btn-cipher-close')?.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Reveal hint / Sage assistant
        overlay.querySelector('#btn-cipher-reveal')?.addEventListener('click', () => {
            this.enteredCipherCode = tomb.secret_code.toString();
            updateDisplay();
            NotificationService.showToast(`✨ همس لك حكيم المعبد: الشفرة التاريخية هي (${tomb.secret_code})!`, 'info');
        });

        // Submit unlock
        overlay.querySelector('#btn-cipher-submit')?.addEventListener('click', () => {
            if (!this.enteredCipherCode) {
                NotificationService.showToast('يرجى إدخال الرمز السري أولاً', 'alert');
                return;
            }

            const res = IndustryService.tryUnlockTomb(tomb.kv_number, this.enteredCipherCode);
            if (res.success) {
                closeModal();
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                NotificationService.showToast(`🎉 مبروك! فتحت ${tomb.name_ar} (KV${tomb.kv_number}) وحصلت على ${res.rewardGold} ذهب وكنوز نادرة!`, 'success');
                this.render();
                this.bindEvents();
            } else {
                NotificationService.showToast(res.message, 'alert');
                const dispBox = overlay.querySelector('.cipher-display-box');
                if (dispBox) {
                    dispBox.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        dispBox.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    }, 800);
                }
            }
        });
    }

    openTombDetailsModal(tomb) {
        document.getElementById('tomb-cipher-modal-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'tomb-cipher-modal-overlay';
        overlay.className = 'cipher-modal-backdrop';

        const rewardGold = 1500 + (tomb.kv_number * 100);

        overlay.innerHTML = `
            <div class="cipher-modal-card">
                <button class="cipher-modal-close" id="btn-tomb-detail-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="cipher-tomb-header">
                    <span class="cipher-kv-pill" style="background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;">
                        <i class="fa-solid fa-circle-check"></i> مقبرة مستكشفة ومفتوحة
                    </span>
                    <h3>${tomb.name_ar} (KV${tomb.kv_number})</h3>
                    <span class="cipher-dynasty">${tomb.dynasty} • الشفرة: ${tomb.secret_code}</span>
                </div>

                <div class="cipher-hint-box" style="border-style: solid; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08);">
                    <strong><i class="fa-solid fa-scroll text-gold"></i> الحقيقة التاريخية واللغز:</strong>
                    ${tomb.hint}
                </div>

                <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
                    <h4 style="font-size: 14px; color: var(--gold-light); margin: 0 0 10px 0;"><i class="fa-solid fa-sack-dollar"></i> الكنوز والمكافآت المحصودة:</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div style="background: rgba(212, 175, 55, 0.1); padding: 8px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="font-size: 11px; color: var(--text-muted); display: block;">الذهب</span>
                            <strong style="color: var(--gold-light); font-size: 14px;">+${rewardGold}</strong>
                        </div>
                        <div style="background: rgba(212, 175, 55, 0.1); padding: 8px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="font-size: 11px; color: var(--text-muted); display: block;">رقائق ذهب</span>
                            <strong style="color: #fff; font-size: 14px;">+3</strong>
                        </div>
                        <div style="background: rgba(212, 175, 55, 0.1); padding: 8px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="font-size: 11px; color: var(--text-muted); display: block;">حجر لازورد</span>
                            <strong style="color: #60a5fa; font-size: 14px;">+1</strong>
                        </div>
                    </div>
                </div>

                <button class="btn-cipher-unlock" id="btn-tomb-detail-ok" style="width: 100%;">
                    <i class="fa-solid fa-check"></i> إغلاق سجل المقبرة
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeDetail = () => overlay.remove();
        overlay.querySelector('#btn-tomb-detail-close')?.addEventListener('click', closeDetail);
        overlay.querySelector('#btn-tomb-detail-ok')?.addEventListener('click', closeDetail);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDetail();
        });
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

        // Search Input in Tombs
        const searchInput = container.querySelector('#tombs-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.tombSearch = e.target.value;
                const grid = container.querySelector('.tombs-grid');
                const unlockedTombs = state.data.industry.unlockedTombs || [];
                if (grid) {
                    grid.innerHTML = this.getFilteredTombs(unlockedTombs).map(tomb => {
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
                                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                            <span class="status-badge opened"><i class="fa-solid fa-circle-check"></i> مفتوحة</span>
                                            <button class="btn-inspect-tomb" data-kv="${tomb.kv_number}" style="background: rgba(212,175,55,0.15); border: 1px solid var(--gold-main); color: var(--gold-light); font-size: 11px; padding: 4px 10px; border-radius: 8px; cursor: pointer;">
                                                <i class="fa-solid fa-eye"></i> الكنز الملكي
                                            </button>
                                        </div>
                                    ` : `
                                        <button class="btn-open-cipher" data-kv="${tomb.kv_number}">
                                            <i class="fa-solid fa-key"></i>
                                            <span>فك الشفرة السرية</span>
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('');
                    this.bindTombCards(container);
                }
            });
        }

        // Filter chips in Tombs
        container.querySelectorAll('.filter-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.tombFilter = btn.dataset.filter;
                this.render();
                this.bindEvents();
                SoundManager.click();
            });
        });

        this.bindTombCards(container);

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

    bindTombCards(container) {
        // Open Tomb Cipher Modal
        container.querySelectorAll('.btn-open-cipher').forEach(btn => {
            btn.addEventListener('click', () => {
                const kv = Number(btn.dataset.kv);
                const tomb = KV_TOMBS_CATALOG.find(t => t.kv_number === kv);
                if (tomb) {
                    this.openCipherModal(tomb);
                }
            });
        });

        // Inspect unlocked tomb
        container.querySelectorAll('.btn-inspect-tomb').forEach(btn => {
            btn.addEventListener('click', () => {
                const kv = Number(btn.dataset.kv);
                const tomb = KV_TOMBS_CATALOG.find(t => t.kv_number === kv);
                if (tomb) {
                    this.openTombDetailsModal(tomb);
                }
            });
        });
    }
}
