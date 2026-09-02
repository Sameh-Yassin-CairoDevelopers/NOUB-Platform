/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/profileCtrl.js
 * Version: 3.0.0 (MASTER PROFILE & TREASURY CONTROLLER)
 * Description: Unified player profile, cross-domain treasury breakdown, Collatz power status,
 *              official badges showcase, and session controls.
 */

import { state } from '../core/state.js';
import { AuthService } from '../services/authService.js';
import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';
import { TimeEngine } from '../utils/timeEngine.js';

export class ProfileController {
    constructor(router) {
        this.router = router;
        this.auth = new AuthService();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById('view-profile');
        if (!container) return;

        const user = state.data.user || { full_name: 'بطل نوب', gold_balance: 10000, level: 1, xp: 250 };
        const card = state.data.sports.card || {};
        const soul = state.data.industry.soulCard;
        const specimensCount = (state.data.sanctuary.specimens || []).length;
        const tombsCount = (state.data.industry.unlockedTombs || []).length;

        container.innerHTML = `
            <div class="profile-view-wrapper">
                <div class="view-header-bar">
                    <button class="btn-back-hub" id="profile-back-hub">
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>العودة للبوابة الرئيسية</span>
                    </button>
                    <h2><i class="fa-solid fa-user-shield text-gold"></i> الحساب والملف الشخصي الموحد</h2>
                </div>

                <!-- PROFILE HEADER CARD -->
                <div class="profile-main-card">
                    <div class="profile-avatar-circle">
                        <i class="fa-solid fa-crown text-gold"></i>
                    </div>
                    <div class="profile-details">
                        <h3>${user.full_name}</h3>
                        <span class="user-id-tag">معرف الحساب: ${user.id}</span>
                        <div class="user-level-row">
                            <span class="badge-level">المستوى ${user.level || 1}</span>
                            <span class="badge-reputation">السمعة: 100% موثوق</span>
                        </div>
                    </div>
                </div>

                <!-- TREASURY & ASSETS BREAKDOWN -->
                <div class="treasury-breakdown-grid mt-4">
                    <div class="tr-box gold">
                        <i class="fa-solid fa-coins"></i>
                        <span class="label">رصيد الذهب الموحد</span>
                        <strong class="val">${(user.gold_balance || 0).toLocaleString('ar-EG')} نوب</strong>
                    </div>
                    <div class="tr-box sports">
                        <i class="fa-solid fa-futbol"></i>
                        <span class="label">تقييم الكارت الرياضي</span>
                        <strong class="val">${card.overall_rating || 85} OVR</strong>
                    </div>
                    <div class="tr-box industry">
                        <i class="fa-solid fa-key"></i>
                        <span class="label">مقابر وادي الملوك المفتوحة</span>
                        <strong class="val">${tombsCount} / 62</strong>
                    </div>
                    <div class="tr-box sanctuary">
                        <i class="fa-solid fa-paw"></i>
                        <span class="label">كائنات المحمية والأنساب</span>
                        <strong class="val">${specimensCount} كائنات</strong>
                    </div>
                </div>

                <!-- SOUL CARD SUMMARY -->
                <div class="profile-soul-summary mt-4">
                    <h4><i class="fa-solid fa-infinity text-gold"></i> كارت الروح الأبدي (#9999)</h4>
                    ${soul ? `
                        <div class="soul-inline-pill">
                            <span>طاقة كولاتز: <strong>${soul.power_score}</strong></span>
                            <span>العنصر الحاكم: <strong>${soul.affinity.name}</strong></span>
                        </div>
                    ` : `
                        <p class="text-muted">لم يتم انبعاث كارت الروح بعد. توجه لقطاع الفراعنة لتفعيله.</p>
                    `}
                </div>

                <!-- BADGES & TITLES -->
                <div class="profile-badges-card mt-4">
                    <h4><i class="fa-solid fa-award text-gold"></i> الأوسمة والألقاب الملكية</h4>
                    <div class="badges-row">
                        <div class="badge-item earned">
                            <i class="fa-solid fa-award"></i>
                            <span>المؤسس الأول</span>
                        </div>
                        <div class="badge-item earned">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>كابتن معتمد</span>
                        </div>
                        <div class="badge-item earned">
                            <i class="fa-solid fa-dna"></i>
                            <span>عالم وراثة 89x</span>
                        </div>
                        <div class="badge-item earned">
                            <i class="fa-solid fa-gem"></i>
                            <span>خبير وادي الملوك</span>
                        </div>
                    </div>
                </div>

                <!-- ACCOUNT ACTIONS -->
                <div class="profile-actions mt-4">
                    <button class="btn-logout-danger" id="btn-profile-logout">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>تسجيل الخروج من المنظومة</span>
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.getElementById('view-profile');
        if (!container) return;

        // Back to Hub
        container.querySelector('#profile-back-hub')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-hub');
        });

        // Logout
        container.querySelector('#btn-profile-logout')?.addEventListener('click', async () => {
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                await this.auth.logout();
            }
        });
    }
}
