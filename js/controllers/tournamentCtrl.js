/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/tournamentCtrl.js
 * Version: Noub Sports_beta 3.0.0 (RAMADAN TOURNAMENTS ENGINE)
 * Status: Production Ready
 */

import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';

export class TournamentController {
    constructor(router) {
        this.router = router;
        this.tournaments = [
            {
                id: 'tourn-1',
                title: 'دورة الفسطاط الرمضانية الكبرى',
                zone: 'الفسطاط / المعادي',
                teamsCount: 16,
                prize: '50,000 ج.م',
                status: 'ACTIVE'
            },
            {
                id: 'tourn-2',
                title: 'كأس درع المنيل والروضة',
                zone: 'مصر القديمة / المنيل',
                teamsCount: 8,
                prize: '25,000 ج.م',
                status: 'UPCOMING'
            }
        ];
    }

    init() {
        this.render();
    }

    render() {
        const view = document.getElementById('view-tournaments');
        if (!view) return;

        view.innerHTML = `
            <div class="tournament-hub fade-in">
                <!-- HERO BANNER -->
                <div class="t-hero-banner">
                    <div class="ramadan-deco"><i class="fa-solid fa-moon"></i></div>
                    <h2>بطولات ليالي رمضان</h2>
                    <p>انضم إلى أقوى الدورات الرمضانية الشعبية ونافس على جوائز الموسم</p>
                    <button class="btn-primary-gold" id="btn-create-tourn">
                        <i class="fa-solid fa-trophy"></i> تنظيم بطولة جديدة
                    </button>
                </div>

                <!-- TOURNAMENT LIST -->
                <div class="t-list-section">
                    <h4 style="color:var(--gold-main); margin-bottom:15px; font-family:var(--font-sport);">البطولات المتاحة</h4>
                    ${this.tournaments.map(t => `
                        <div class="tourn-card">
                            <span class="status-badge ${t.status === 'ACTIVE' ? 'active' : ''}">
                                ${t.status === 'ACTIVE' ? 'جارية الآن' : 'قريباً'}
                            </span>
                            <h3>${t.title}</h3>
                            <div class="t-meta">
                                <span><i class="fa-solid fa-location-dot"></i> ${t.zone}</span>
                                <span><i class="fa-solid fa-users"></i> ${t.teamsCount} فرق</span>
                                <span><i class="fa-solid fa-sack-dollar"></i> ${t.prize}</span>
                            </div>
                            <button class="btn-view-tourn" onclick="alert('تم تسجيل طلب المشاركة!')">
                                <i class="fa-solid fa-arrow-left"></i> عرض التفاصيل والتسجيل
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('btn-create-tourn')?.addEventListener('click', () => {
            SoundManager.play('click');
            NotificationService.showToast("سيتم فتح باب تنظيم البطولات للجميع قريباً!", "info");
        });
    }
}
