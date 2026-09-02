/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/onboardingCtrl.js
 * Version: 3.0.0 (INTERACTIVE ONBOARDING & STARTER GRANT)
 * Description: Step-by-step player identity initialization, visual avatar customization
 *              with real-time SVG preview, and 10,000 gold starter reward disbursement.
 */

import { state } from '../core/state.js';
import { AuthService } from '../services/authService.js';
import { SportsService } from '../services/sportsService.js';
import { AvatarEngine } from '../utils/avatarEngine.js';
import { EGYPTIAN_ZONES, PLAYER_POSITIONS } from '../data/sportsData.js';
import { SoundManager } from '../utils/soundManager.js';
import { VisualEffects } from '../utils/visualEffects.js';
import { NotificationService } from '../services/notificationService.js';

export class OnboardingController {
    constructor(router, onComplete = null) {
        this.router = router;
        this.onComplete = onComplete;
        this.auth = new AuthService();
        this.step = 1;
        this.cardDna = {
            kit: '#D4AF37',
            logo: 1,
            face: 1,
            hair: 1,
            skin: 2
        };
        this.selectedPos = 'CM';
        this.selectedZone = 'fustat_maadi';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById('view-onboarding');
        if (!container) return;

        container.innerHTML = `
            <div class="onboarding-wrapper">
                <div class="onboarding-hero">
                    <div class="brand-badge"><i class="fa-solid fa-crown"></i> منظومة نوب الموحدة</div>
                    <h1>انضم إلى المنظومة الملكية</h1>
                    <p>احصل فوراً على <strong>10,000 ذهب</strong> كهدية ترحيبية وابدأ رحلتك في الرياضة، الصناعة الفرعونية، والمحمية البيولوجية.</p>
                </div>

                <div class="onboarding-card">
                    <!-- STEP 1: BASIC INFO -->
                    <div id="onb-step-1" class="onb-step ${this.step === 1 ? 'active' : 'hidden'}">
                        <h3><i class="fa-solid fa-user-astronaut"></i> بيانات الهوية الرياضية</h3>
                        <div class="form-group">
                            <label>اسم اللاعب أو الكابتن</label>
                            <input type="text" id="onb-player-name" class="noub-input" placeholder="مثال: كابتن حمزة" value="كابتن نوب">
                        </div>

                        <div class="form-group">
                            <label>المنطقة الجغرافية والملعب المفضل</label>
                            <select id="onb-player-zone" class="noub-select">
                                ${EGYPTIAN_ZONES.map(z => `<option value="${z.id}">${z.name_ar} (${z.governorate})</option>`).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>مركزك في الملعب</label>
                            <div class="position-pills-grid">
                                ${Object.keys(PLAYER_POSITIONS).map(posKey => `
                                    <button type="button" class="pos-pill ${this.selectedPos === posKey ? 'selected' : ''}" data-pos="${posKey}">
                                        <strong>${posKey}</strong>
                                        <span>${PLAYER_POSITIONS[posKey].name_ar}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <button id="onb-to-step-2" class="btn-noub-gold w-full mt-4">
                            <span>التالي: تصميم الكارت والزي</span>
                            <i class="fa-solid fa-arrow-left"></i>
                        </button>
                    </div>

                    <!-- STEP 2: AVATAR & CARD CUSTOMIZATION -->
                    <div id="onb-step-2" class="onb-step ${this.step === 2 ? 'active' : 'hidden'}">
                        <h3><i class="fa-solid fa-wand-magic-sparkles"></i> تصميم الكارت والزي الرياضي</h3>
                        
                        <!-- LIVE AVATAR PREVIEW (FIXED COLLAR ALIGNMENT) -->
                        <div class="avatar-preview-box" id="onb-avatar-preview">
                            ${AvatarEngine.generateAvatarHTML(this.cardDna, 'NOUB')}
                        </div>

                        <div class="customizer-controls">
                            <label>لون الطقم الأساسي</label>
                            <div class="color-palette">
                                ${AvatarEngine.getConfig().KITS.map(c => `
                                    <button type="button" class="color-dot ${this.cardDna.kit === c ? 'selected' : ''}" style="background-color: ${c}" data-kit="${c}"></button>
                                `).join('')}
                            </div>

                            <label class="mt-3">درجة لون البشرة</label>
                            <div class="color-palette">
                                ${AvatarEngine.getConfig().SKIN_TONES.map((s, idx) => `
                                    <button type="button" class="color-dot ${this.cardDna.skin === idx + 1 ? 'selected' : ''}" style="background-color: ${s}" data-skin="${idx + 1}"></button>
                                `).join('')}
                            </div>

                            <div class="grid-2 mt-3">
                                <div>
                                    <label>شعار الفريق</label>
                                    <select id="onb-logo-select" class="noub-select">
                                        <option value="1">درع الأبطال</option>
                                        <option value="2">النجمة الملكية</option>
                                        <option value="3">الصاعقة الخاطفة</option>
                                        <option value="4">لهيب النار</option>
                                        <option value="5">التاج الذهبي</option>
                                    </select>
                                </div>
                                <div>
                                    <label>إكسسوار الرأس والوجه</label>
                                    <select id="onb-head-select" class="noub-select">
                                        <option value="1">بدون غطاء</option>
                                        <option value="2">قبعة رعاة البقر</option>
                                        <option value="3">قبعة التخرج</option>
                                        <option value="4">خوذة الأمان</option>
                                        <option value="5">التاج الملكي</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="flex-actions mt-4">
                            <button id="onb-back-to-1" class="btn-noub-ghost">السابق</button>
                            <button id="onb-finish" class="btn-noub-gold flex-1">
                                <i class="fa-solid fa-gift"></i>
                                <span>استلام 10,000 ذهب وبدء الرحلة</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.getElementById('view-onboarding');
        if (!container) return;

        // Position select
        container.querySelectorAll('.pos-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.pos-pill').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPos = btn.dataset.pos;
                SoundManager.click();
            });
        });

        // Step 1 -> Step 2
        container.querySelector('#onb-to-step-2')?.addEventListener('click', () => {
            const name = container.querySelector('#onb-player-name')?.value.trim();
            if (!name) {
                NotificationService.showToast('يرجى إدخال اسم اللاعب أولاً', 'alert');
                return;
            }
            this.step = 2;
            this.render();
            this.bindEvents();
            SoundManager.click();
        });

        // Step 2 -> Step 1
        container.querySelector('#onb-back-to-1')?.addEventListener('click', () => {
            this.step = 1;
            this.render();
            this.bindEvents();
            SoundManager.click();
        });

        // Color picking
        container.querySelectorAll('[data-kit]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.cardDna.kit = btn.dataset.kit;
                this.updateAvatarPreview();
                SoundManager.click();
            });
        });

        container.querySelectorAll('[data-skin]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.cardDna.skin = Number(btn.dataset.skin);
                this.updateAvatarPreview();
                SoundManager.click();
            });
        });

        // Logo change
        container.querySelector('#onb-logo-select')?.addEventListener('change', (e) => {
            this.cardDna.logo = Number(e.target.value);
            this.updateAvatarPreview();
        });

        container.querySelector('#onb-head-select')?.addEventListener('change', (e) => {
            this.cardDna.hair = Number(e.target.value);
            this.updateAvatarPreview();
        });

        // Finish onboarding & Grant 10,000 Gold
        container.querySelector('#onb-finish')?.addEventListener('click', async () => {
            const playerName = container.querySelector('#onb-player-name')?.value?.trim() || 'كابتن نوب';
            const zone = container.querySelector('#onb-player-zone')?.value || 'fustat_maadi';

            const user = await this.auth.registerInstantPlayer(playerName, zone, this.cardDna);

            // Save initial sports card
            await SportsService.savePlayerCard({
                id: 'card_' + user.id,
                owner_id: user.id,
                player_name: playerName,
                primary_position: this.selectedPos,
                overall_rating: 85,
                speed: 87,
                shooting: 84,
                passing: 89,
                dribbling: 86,
                defending: 80,
                physicality: 82,
                visual_dna: this.cardDna,
                matches_played: 0,
                goals_scored: 0,
                assists: 0,
                man_of_match_count: 0
            });

            SoundManager.playGoldChime();
            VisualEffects.triggerConfetti();

            NotificationService.showToast('🎉 مبروك! تم إيداع 10,000 ذهب ترحيبي في خزنتك الموحدة!', 'gold');

            if (typeof this.onComplete === 'function') {
                this.onComplete();
            } else {
                document.getElementById('global-header')?.classList.remove('hidden');
                document.getElementById('global-navbar')?.classList.remove('hidden');
                this.router.navigate('view-hub');
            }
        });
    }

    updateAvatarPreview() {
        const preview = document.getElementById('onb-avatar-preview');
        const nameInput = document.getElementById('onb-player-name');
        const shirtName = nameInput ? nameInput.value.trim() : 'NOUB';
        if (preview) {
            preview.innerHTML = AvatarEngine.generateAvatarHTML(this.cardDna, shirtName);
        }
    }
}
