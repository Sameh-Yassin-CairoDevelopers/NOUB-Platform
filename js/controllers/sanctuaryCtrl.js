/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/sanctuaryCtrl.js
 * Version: 3.0.0 (BIO-SANCTUARY 89x CONTROLLER)
 * Description: High-fidelity 3D flippable biological cards, accelerated 89x gestation tickers,
 *              Mendelian cross-breeding laboratory, WSAVA vaccinations, and Bonsai care.
 */

import { state } from '../core/state.js';
import { SanctuaryService } from '../services/sanctuaryService.js';
import { SANCTUARY_SPECIES, SANCTUARY_BREEDS } from '../data/sanctuaryData.js';
import { TimeEngine } from '../utils/timeEngine.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';

export class SanctuaryController {
    constructor(router) {
        this.router = router;
        this.activeTab = 'specimens'; // 'specimens' | 'breeding' | 'passport' | 'bonsai'
        this.selectedSire = null;
        this.selectedDam = null;
        this.timerInterval = null;
    }

    init() {
        SanctuaryService.initDefaultSpecimens();
        this.render();
        this.bindEvents();
        this.startLiveTick();
    }

    startLiveTick() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.updateLiveGestationTimers();
        }, 1000);
    }

    switchTab(tabKey) {
        const mapping = {
            'specimens': 'specimens',
            'breeding': 'breeding',
            'market': 'passport',
            'bonsai': 'bonsai'
        };
        this.activeTab = mapping[tabKey] || tabKey;
        this.render();
        this.bindEvents();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
        const container = document.getElementById('view-sanctuary');
        if (!container) return;

        const specimens = state.data.sanctuary.specimens || [];
        const gestations = state.data.sanctuary.activeGestation || [];
        const bonsaiList = specimens.filter(s => s.species_id === 'FLORA_BONSAI');

        container.innerHTML = `
            <div class="sanctuary-view-wrapper">
                <!-- TOP BREADCRUMB -->
                <div class="view-header-bar">
                    <button class="btn-back-hub" id="sanctuary-back-hub">
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-paw text-gold"></i> محمية الأنساب والوراثة (89x)</h2>
                </div>

                <!-- SUB-NAVIGATION TABS -->
                <div class="sub-nav-tabs">
                    <button class="sub-tab-btn ${this.activeTab === 'specimens' ? 'active' : ''}" data-tab="specimens">
                        <i class="fa-solid fa-paw"></i>
                        <span>الكائنات والأنساب (${specimens.length})</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'breeding' ? 'active' : ''}" data-tab="breeding">
                        <i class="fa-solid fa-dna"></i>
                        <span>مختبر التزاوج والحمل (${gestations.length})</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'passport' ? 'active' : ''}" data-tab="passport">
                        <i class="fa-solid fa-passport"></i>
                        <span>جواز السفر الجيني (Loci)</span>
                    </button>
                    <button class="sub-tab-btn ${this.activeTab === 'bonsai' ? 'active' : ''}" data-tab="bonsai">
                        <i class="fa-solid fa-tree"></i>
                        <span>مشتل البونساي (${bonsaiList.length})</span>
                    </button>
                </div>

                <!-- TAB 1: SPECIMENS 3D FLIPPABLE HOLOGRAPHIC CARDS -->
                <div id="tab-sanc-specimens" class="tab-pane ${this.activeTab === 'specimens' ? 'active' : 'hidden'}">
                    <div class="specimens-filter-bar">
                        <span class="hint-text"><i class="fa-solid fa-rotate text-gold"></i> اضغط على أي كارت لقلبه واستعراض الجينوم الطبي وسجل التطعيمات</span>
                    </div>

                    <div class="specimens-grid">
                        ${specimens.map(spec => {
                            const breed = SANCTUARY_BREEDS[spec.breed_id] || {};
                            const species = SANCTUARY_SPECIES[spec.species_id] || {};
                            return `
                                <div class="bio-card-3d-scene" data-spec-id="${spec.id}">
                                    <div class="bio-card-3d">
                                        <!-- FRONT OF CARD -->
                                        <div class="bio-card-face bio-front ${spec.rarity ? spec.rarity.toLowerCase() : 'epic'}">
                                            <div class="card-glass-glow"></div>
                                            <div class="bio-top-tags">
                                                <span class="species-icon">${species.icon || '🐾'}</span>
                                                <span class="rarity-badge">${spec.rarity || 'ELITE'}</span>
                                                <span class="gender-tag ${spec.gender ? spec.gender.toLowerCase() : ''}">
                                                    ${spec.gender === 'MALE' ? '♂ ذكر' : spec.gender === 'FEMALE' ? '♀ أنثى' : '🌱 نبتة'}
                                                </span>
                                            </div>

                                            <div class="bio-artwork-frame">
                                                ${breed.svg || `<div class="placeholder-icon">${species.icon}</div>`}
                                            </div>

                                            <div class="bio-info-block">
                                                <h4>${spec.name}</h4>
                                                <span class="breed-name">${breed.name_ar || spec.breed_id}</span>
                                            </div>

                                            <div class="bio-stats-grid">
                                                <div class="b-stat">
                                                    <span>الصحة</span>
                                                    <strong>${spec.health_score || 95}%</strong>
                                                </div>
                                                <div class="b-stat">
                                                    <span>التحمل</span>
                                                    <strong>${spec.stamina || 90}%</strong>
                                                </div>
                                                <div class="b-stat">
                                                    <span>الجمال</span>
                                                    <strong>${spec.beauty || 92}%</strong>
                                                </div>
                                                <div class="b-stat">
                                                    <span>الجيل</span>
                                                    <strong>G${spec.generation || 1}</strong>
                                                </div>
                                            </div>

                                            <div class="bio-card-flip-prompt">
                                                <i class="fa-solid fa-arrows-rotate"></i>
                                                <span>انقر لفحص الجينات والتطعيمات</span>
                                            </div>
                                        </div>

                                        <!-- BACK OF CARD (LOCI & VACCINATIONS) -->
                                        <div class="bio-card-face bio-back">
                                            <div class="passport-header">
                                                <i class="fa-solid fa-dna text-gold"></i>
                                                <h5>الجينوم الطبي المعتمد</h5>
                                            </div>

                                            <div class="loci-table-wrapper">
                                                <table class="loci-mini-table">
                                                    <thead>
                                                        <tr>
                                                            <th>المورثة (Locus)</th>
                                                            <th>الأليل</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${(spec.loci || []).map(l => `
                                                            <tr>
                                                                <td>${l.locus}</td>
                                                                <td><strong class="allele-tag">${l.allele}</strong></td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div class="vaccines-section">
                                                <h6><i class="fa-solid fa-syringe text-gold"></i> جدول تطعيمات WSAVA</h6>
                                                <div class="vaccines-list">
                                                    ${(spec.vaccinations || []).map(v => `
                                                        <div class="vacc-pill">
                                                            <i class="fa-solid fa-check text-green"></i>
                                                            <span>${v.name}</span>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>

                                            <div class="bio-card-flip-prompt back">
                                                <i class="fa-solid fa-rotate-left"></i>
                                                <span>انقر للعودة للوجه الرئيسي</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- TAB 2: MENDELIAN BREEDING LABORATORY (89x ACCELERATED) -->
                <div id="tab-sanc-breeding" class="tab-pane ${this.activeTab === 'breeding' ? 'active' : 'hidden'}">
                    <!-- ACTIVE GESTATION TICKERS -->
                    <div class="gestation-active-section">
                        <h4><i class="fa-solid fa-dna text-gold"></i> دورات الحمل والولادة المتسارعة (89x)</h4>
                        <div class="gestations-grid" id="gestation-cards-container">
                            ${this.renderGestationCards()}
                        </div>
                    </div>

                    <!-- MATING MATCHER -->
                    <div class="breeding-lab-card mt-4">
                        <h4><i class="fa-solid fa-heart-pulse text-gold"></i> تهجين وتزاوج جديد (وراثة مندلية نقية)</h4>
                        
                        <div class="parents-selector-grid">
                            <!-- SIRE SELECTOR -->
                            <div class="parent-box">
                                <label><i class="fa-solid fa-mars text-blue"></i> اختر الأب (الذكر)</label>
                                <select id="sire-select" class="noub-select">
                                    <option value="">-- اختر الفحل أو الأب --</option>
                                    ${specimens.filter(s => s.gender === 'MALE').map(s => `
                                        <option value="${s.id}">${s.name} (${s.breed_id} - G${s.generation})</option>
                                    `).join('')}
                                </select>
                            </div>

                            <!-- DAM SELECTOR -->
                            <div class="parent-box">
                                <label><i class="fa-solid fa-venus text-pink"></i> اختر الأم (الأنثى)</label>
                                <select id="dam-select" class="noub-select">
                                    <option value="">-- اختر الأم المتوافقة --</option>
                                    ${specimens.filter(s => s.gender === 'FEMALE').map(s => `
                                        <option value="${s.id}">${s.name} (${s.breed_id} - G${s.generation})</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <button class="btn-noub-gold w-full mt-4" id="btn-start-mating">
                            <i class="fa-solid fa-dna"></i>
                            <span>بدء دورة الحمل البيولوجية (سريعة 89x)</span>
                        </button>
                    </div>
                </div>

                <!-- TAB 3: LOCI GENETIC PASSPORT -->
                <div id="tab-sanc-passport" class="tab-pane ${this.activeTab === 'passport' ? 'active' : 'hidden'}">
                    <div class="passport-catalog-card">
                        <h4><i class="fa-solid fa-book-atlas text-gold"></i> الدليل المرجعي للأليلات والجينات</h4>
                        <p>شرح أكاديمي دقيق لكافة مورثات الفراء والألوان المعتمدة دولياً:</p>
                        
                        <div class="loci-definitions-grid mt-3">
                            <div class="loci-def-item">
                                <strong>MC1R (Extension Locus)</strong>
                                <p>يتحكم في إنتاج صبغة الإيوميلانين (الأسود) أو الفيوميلانين (الأحمر/الأصفر). الأليل Em يمنح القناع الأسود الشهير للراعي الألماني.</p>
                            </div>
                            <div class="loci-def-item">
                                <strong>ASIP (Agouti Locus)</strong>
                                <p>يحدد توزيع الصبغة على الشعرة الواحدة لإنتاج نمط السرج أو اللون الفاون أو الأسود الصريح.</p>
                            </div>
                            <div class="loci-def-item">
                                <strong>CBD103 (K Locus)</strong>
                                <p>يحدد السيادة اللونية وتعبير الأنماط المخططة أو الموشحة في السلوقي والكلبيات.</p>
                            </div>
                            <div class="loci-def-item">
                                <strong>MLPH (Dilution Locus)</strong>
                                <p>يتحكم في كثافة الصبغة، والأليل d المتنحي يسبب اللون الأزرق الملكي والفضي.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 4: BONSAI NURSERY -->
                <div id="tab-sanc-bonsai" class="tab-pane ${this.activeTab === 'bonsai' ? 'active' : 'hidden'}">
                    <div class="bonsai-grid">
                        ${bonsaiList.map(b => `
                            <div class="bonsai-care-card">
                                <div class="b-head">
                                    <i class="fa-solid fa-tree text-green"></i>
                                    <h4>${b.name}</h4>
                                </div>
                                <div class="b-vital-bars">
                                    <div class="vital-row">
                                        <span>رطوبة تربة الأكاداما:</span>
                                        <strong>${b.soil_moisture || 75}%</strong>
                                    </div>
                                    <div class="vital-row">
                                        <span>صحة التقليم والتنسيق:</span>
                                        <strong>${b.pruning_health || 90}%</strong>
                                    </div>
                                </div>
                                <div class="b-actions mt-3">
                                    <button class="btn-bonsai-action" data-action="WATER" data-id="${b.id}">
                                        <i class="fa-solid fa-droplet text-blue"></i>
                                        <span>ري بالأكاداما</span>
                                    </button>
                                    <button class="btn-bonsai-action" data-action="PRUNE" data-id="${b.id}">
                                        <i class="fa-solid fa-scissors text-gold"></i>
                                        <span>تقليم الفروع</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderGestationCards() {
        const gestations = state.data.sanctuary.activeGestation || [];
        if (gestations.length === 0) {
            return `<div class="empty-state-hint">لا توجد دورات حمل جارية حالياً. اختر أباً وأماً لبدء التزاوج!</div>`;
        }

        return gestations.map(event => {
            const timeData = TimeEngine.getRemainingTime(event.completion_time, event.start_time);
            return `
                <div class="gestation-ticket ${timeData.isComplete ? 'ready-to-deliver' : ''}" data-event-id="${event.id}">
                    <div class="gest-head">
                        <span class="pulse-dot"></span>
                        <h5>حمل متسارع: ${event.sire_name} × ${event.dam_name}</h5>
                    </div>
                    <div class="gest-coi">معامل القرابة COI: <strong>${event.coi_percent}%</strong> | الجيل: <strong>G${event.generation}</strong></div>
                    <div class="gest-progress-bar">
                        <div class="gest-progress-fill" style="width: ${timeData.progressPercent}%"></div>
                    </div>
                    <div class="gest-timer-row">
                        <span>${timeData.isComplete ? 'اكتمل الحمل والنمو!' : 'الوقت المتبقي:'}</span>
                        <strong class="timer-digits">${timeData.isComplete ? 'جاهز للولادة 🎉' : timeData.formatted}</strong>
                    </div>
                    ${timeData.isComplete ? `
                        <button class="btn-deliver-offspring" data-event-id="${event.id}">
                            <i class="fa-solid fa-baby-carriage"></i>
                            <span>استقبال وتسجيل السليل المولود (+400 XP)</span>
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    updateLiveGestationTimers() {
        const container = document.getElementById('gestation-cards-container');
        if (container && this.activeTab === 'breeding') {
            container.innerHTML = this.renderGestationCards();
            this.bindGestationEvents();
        }
    }

    bindEvents() {
        const container = document.getElementById('view-sanctuary');
        if (!container) return;

        // Back to Hub
        container.querySelector('#sanctuary-back-hub')?.addEventListener('click', () => {
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

        // 3D Card Flip on Click
        container.querySelectorAll('.bio-card-3d-scene').forEach(cardScene => {
            cardScene.addEventListener('click', () => {
                cardScene.classList.toggle('flipped');
                SoundManager.click();
            });
        });

        // Start Breeding
        container.querySelector('#btn-start-mating')?.addEventListener('click', () => {
            const sireId = container.querySelector('#sire-select')?.value;
            const damId = container.querySelector('#dam-select')?.value;
            if (!sireId || !damId) {
                NotificationService.showToast('يرجى اختيار الأب والأم معاً', 'alert');
                return;
            }

            const res = SanctuaryService.startBreeding(sireId, damId);
            if (res.success) {
                SoundManager.playGoldChime();
                VisualEffects.triggerConfetti();
                this.render();
                this.bindEvents();
            } else {
                NotificationService.showToast(res.message, 'alert');
            }
        });

        // Bonsai actions
        container.querySelectorAll('.btn-bonsai-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const act = btn.dataset.action;
                const res = SanctuaryService.careBonsai(id, act);
                if (res.success) {
                    SoundManager.playGoldChime();
                    NotificationService.showToast(res.message, 'success');
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.bindGestationEvents();
    }

    bindGestationEvents() {
        const container = document.getElementById('view-sanctuary');
        if (!container) return;

        container.querySelectorAll('.btn-deliver-offspring').forEach(btn => {
            btn.addEventListener('click', () => {
                const eventId = btn.dataset.eventId;
                const res = SanctuaryService.deliverOffspring(eventId);
                if (res.success) {
                    SoundManager.playGoldChime();
                    VisualEffects.triggerConfetti();
                    NotificationService.showToast(`🎉 تم استقبال [${res.specimen.name}] في المحمية بنجاح!`, 'gold');
                    this.render();
                    this.bindEvents();
                } else {
                    NotificationService.showToast(res.message, 'alert');
                }
            });
        });
    }
}
