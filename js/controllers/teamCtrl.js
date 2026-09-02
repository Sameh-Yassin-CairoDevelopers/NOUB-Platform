/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/teamCtrl.js
 * Version: Noub Sports_beta 2.0.0 (ZONE-BASED TEAMS)
 * Status: Production Ready
 */

import { TeamService } from '../services/teamService.js';
import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';

export class TeamController {
    constructor(router) {
        this.router = router;
        this.myTeam = null;
    }

    async init() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        this.myTeam = await TeamService.getMyTeam();
    }

    render() {
        const view = document.getElementById('view-team');
        if (!view) return;

        if (!this.myTeam) {
            view.innerHTML = this.renderCreateTeamView();
        } else {
            view.innerHTML = this.renderTeamDashboard();
        }

        this.bindEvents();
    }

    renderCreateTeamView() {
        return `
            <div class="team-creation-box fade-in">
                <i class="fa-solid fa-shield-halved empty-state-icon"></i>
                <h3>تأسيس فريقك الرياضي</h3>
                <p>قم بإنشاء هوية فريقك، واجمع لاعبي حيك للمنافسة على درع المنطقة والبطولات الرمضانية الكبرى.</p>

                <form id="form-create-team" style="text-align:right;">
                    <div class="form-group">
                        <label>اسم الفريق</label>
                        <input type="text" id="new-team-name" placeholder="مثال: نسور الفسطاط" required minlength="3">
                    </div>

                    <div class="form-group">
                        <label>لون التيشيرت الأساسي</label>
                        <div class="color-picker-row">
                            <input type="color" id="new-team-color" value="#10b981">
                        </div>
                    </div>

                    <button type="submit" class="btn-royal btn-royal-gold" style="width:100%; margin-top:15px;" id="btn-submit-team">
                        <i class="fa-solid fa-flag"></i> تأسيس الفريق
                    </button>
                </form>
            </div>
        `;
    }

    renderTeamDashboard() {
        const team = this.myTeam;
        const roster = team.roster || [];

        return `
            <div class="team-dashboard fade-in">
                <!-- TEAM HEADER -->
                <div class="team-header-card" style="background:linear-gradient(135deg, ${team.color_primary || '#10b981'} 0%, #000 100%);">
                    <div class="team-logo-circle">
                        <i class="fa-solid ${team.logo_url || 'fa-shield-halved'}"></i>
                    </div>
                    <h2>${team.name}</h2>
                    <span class="status-badge success">فريق نشط</span>
                </div>

                <!-- QUICK STATS -->
                <div class="team-stats-row">
                    <div class="t-stat">
                        <span class="val">${roster.length}</span>
                        <span class="lbl">اللاعبين</span>
                    </div>
                    <div class="t-stat">
                        <span class="val">#1</span>
                        <span class="lbl">تصنيف الحي</span>
                    </div>
                    <div class="t-stat">
                        <span class="val">100%</span>
                        <span class="lbl">الانضباط</span>
                    </div>
                </div>

                <!-- ROSTER SECTION -->
                <div class="roster-section">
                    <h4><i class="fa-solid fa-users"></i> قائمة اللاعبين المسجلين</h4>
                    <div class="roster-list">
                        ${roster.map(m => `
                            <div class="member-card">
                                <div class="member-avatar">
                                    <i class="fa-solid fa-user-ninja" style="color:var(--gold-main);"></i>
                                </div>
                                <div class="member-info">
                                    <div class="member-name">${m.username} ${m.role === 'CAPTAIN' ? '<i class="fa-solid fa-crown" style="color:var(--gold-main); font-size:0.8rem;"></i>' : ''}</div>
                                    <div class="member-pos">${m.position} • RATING: ${m.rating}</div>
                                </div>
                                <div class="member-rep">${m.reputation} REP</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const form = document.getElementById('form-create-team');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit-team');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تأسيس الفريق...';
            }

            try {
                const name = document.getElementById('new-team-name').value.trim();
                const color = document.getElementById('new-team-color').value;

                await TeamService.createTeam({
                    name: name,
                    colorPrimary: color
                });

                NotificationService.showToast("تم تأسيس الفريق بنجاح!", "success");
                SoundManager.play('success');
                await this.loadData();
                this.render();
            } catch (err) {
                NotificationService.showToast(err.message || "فشل تأسيس الفريق", "error");
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-flag"></i> تأسيس الفريق';
                }
            }
        });
    }
}
