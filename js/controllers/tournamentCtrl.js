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

                <!-- CREATE TOURNAMENT FORM MODAL -->
                <div id="modal-create-tourn" class="custom-modal-backdrop hidden">
                    <div class="custom-modal-card">
                        <div class="modal-card-header">
                            <h4><i class="fa-solid fa-trophy text-gold"></i> تنظيم دورة رمضانية جديدة</h4>
                            <button class="icon-btn-ghost" id="close-create-tourn-btn"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <form id="form-create-tourn" class="form-grid">
                            <div class="input-field-group">
                                <label for="new-tourn-name">اسم الدورة</label>
                                <input type="text" id="new-tourn-name" required placeholder="مثال: دورة أبطال المعادي الرمضانية" class="input-glow">
                            </div>
                            <div class="input-field-group">
                                <label for="new-tourn-zone">المنطقة والملعب</label>
                                <input type="text" id="new-tourn-zone" required placeholder="مثال: ملعب الفسطاط الخماسي" class="input-glow">
                            </div>
                            <div class="input-field-group">
                                <label for="new-tourn-teams">عدد الفرق المشاركة</label>
                                <select id="new-tourn-teams" class="input-glow">
                                    <option value="8">8 فرق (خروج مغلوب)</option>
                                    <option value="16" selected>16 فريق (مجموعات + إقصاء)</option>
                                    <option value="32">32 فريق (دورة كبرى)</option>
                                </select>
                            </div>
                            <div class="input-field-group">
                                <label for="new-tourn-prize">الجائزة والدرع</label>
                                <input type="text" id="new-tourn-prize" required placeholder="مثال: 30,000 ج.م + درع الذهب" class="input-glow">
                            </div>
                            <button type="submit" class="btn-royal btn-royal-gold" style="width:100%; margin-top:15px;" id="btn-submit-tourn">
                                <i class="fa-solid fa-check"></i> اعتماد ونشر البطولة فوراً
                            </button>
                        </form>
                    </div>
                </div>

                <!-- TOURNAMENT LIST -->
                <div class="t-list-section">
                    <h4 style="color:var(--gold-main); margin-bottom:15px; font-family:var(--font-sport);">البطولات المتاحة</h4>
                    <div id="tournaments-grid-list">
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
                            <button class="btn-view-tourn" data-id="${t.id}">
                                <i class="fa-solid fa-arrow-left"></i> عرض التفاصيل والتسجيل
                            </button>
                        </div>
                    `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const modal = document.getElementById('modal-create-tourn');
        document.getElementById('btn-create-tourn')?.addEventListener('click', () => {
            SoundManager.play('click');
            modal?.classList.remove('hidden');
        });

        document.getElementById('close-create-tourn-btn')?.addEventListener('click', () => {
            SoundManager.play('click');
            modal?.classList.add('hidden');
        });

        document.getElementById('form-create-tourn')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('new-tourn-name')?.value.trim();
            const zone = document.getElementById('new-tourn-zone')?.value.trim();
            const teams = parseInt(document.getElementById('new-tourn-teams')?.value, 10) || 16;
            const prize = document.getElementById('new-tourn-prize')?.value.trim() || 'كأس البطولة';

            if (!name || !zone) {
                NotificationService.showToast("يرجى ملء جميع الحقول المطلوبة", "error");
                return;
            }

            const newT = {
                id: `tourn-${Date.now()}`,
                title: name,
                zone: zone,
                teamsCount: teams,
                prize: prize,
                status: 'ACTIVE'
            };

            this.tournaments.unshift(newT);
            SoundManager.play('trophy');
            NotificationService.showToast(`تم إنشاء وتدشين "${name}" بنجاح!`, "success");
            modal?.classList.add('hidden');
            this.render();
        });

        document.querySelectorAll('.btn-view-tourn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundManager.play('click');
                NotificationService.showToast("تم تسجيل طلب مشاركة فريقك في البطولة بنجاح!", "success");
            });
        });
    }
}
