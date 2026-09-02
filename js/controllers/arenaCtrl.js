/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/arenaCtrl.js
 * Version: Noub Sports_beta 2.0.0 (ZONE-FILTERED ARENA & PRESS)
 * Status: Production Ready
 */

import { MatchService } from '../services/matchService.js';
import { TeamService } from '../services/teamService.js';
import { NewsEngine } from '../utils/newsEngine.js';
import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';

export class ArenaController {
    constructor(router) {
        this.router = router;
        this.currentViewMode = 'FEED'; 
        this.currentZoneFilter = null; 
        this.matches = [];
        this.teams = [];
    }

    async init() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        this.matches = await MatchService.getMatches(this.currentZoneFilter);
        this.teams = await TeamService.getGlobalTeams(this.currentZoneFilter);
    }

    render() {
        const view = document.getElementById('view-arena');
        if (!view) return;

        view.innerHTML = `
            <div class="arena-tabs">
                <button class="tab-btn ${this.currentViewMode === 'FEED' ? 'active' : ''}" id="tab-arena-feed">
                    <i class="fa-solid fa-list-ol"></i> المباريات والنتائج
                </button>
                <button class="tab-btn ${this.currentViewMode === 'RECORD' ? 'active' : ''}" id="tab-arena-record">
                    <i class="fa-solid fa-plus-circle"></i> تسجيل مباراة
                </button>
            </div>

            ${this.currentViewMode === 'FEED' ? this.renderMatchesFeed() : this.renderRecordForm()}
        `;

        this.bindEvents();
    }

    renderMatchesFeed() {
        if (!this.matches || this.matches.length === 0) {
            return `
                <div style="text-align:center; padding:50px 20px; color:var(--text-muted);">
                    <i class="fa-solid fa-futbol" style="font-size:3rem; margin-bottom:15px; opacity:0.3;"></i>
                    <p>لا توجد مباريات مسجلة حالياً في هذه المنطقة.</p>
                </div>
            `;
        }

        return this.matches.map(m => {
            const teamAName = m.team_a?.name || 'فريق أ';
            const teamBName = m.team_b?.name || 'فريق ب';
            const news = NewsEngine.generateReport(teamAName, teamBName, m.score_a, m.score_b);

            return `
                <div class="match-card fade-in">
                    <div class="match-meta">
                        <span><i class="fa-regular fa-clock"></i> ${new Date(m.played_at).toLocaleDateString('ar-EG')}</span>
                        <span class="match-status status-confirmed"><i class="fa-solid fa-check-double"></i> مؤكدة</span>
                    </div>

                    <div class="scoreboard">
                        <div class="sb-team">
                            <div class="sb-logo" style="background:${m.team_a?.color_primary || '#10b981'}; display:flex; justify-content:center; align-items:center;">
                                <i class="fa-solid ${m.team_a?.logo_url || 'fa-shield-halved'}"></i>
                            </div>
                            <strong style="color:#fff; font-size:0.85rem;">${teamAName}</strong>
                        </div>

                        <div class="sb-score">
                            ${m.score_a} - ${m.score_b}
                        </div>

                        <div class="sb-team">
                            <div class="sb-logo" style="background:${m.team_b?.color_primary || '#ef4444'}; display:flex; justify-content:center; align-items:center;">
                                <i class="fa-solid ${m.team_b?.logo_url || 'fa-shield-halved'}"></i>
                            </div>
                            <strong style="color:#fff; font-size:0.85rem;">${teamBName}</strong>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:10px; margin-top:10px; border-right:3px solid var(--gold-main);">
                        <strong style="color:var(--gold-main); font-size:0.8rem; display:block;">${news.headline}</strong>
                        <p style="color:var(--text-muted); font-size:0.75rem; margin-top:4px;">${news.body}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderRecordForm() {
        const teamOptions = this.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

        return `
            <div class="match-form-box fade-in">
                <h3><i class="fa-solid fa-clipboard-check"></i> تسجيل نتيجة رسمية</h3>
                <form id="form-record-match">
                    <div class="form-group">
                        <label>الفريق الأول</label>
                        <select id="rec-team-a" required>
                            <option value="" disabled selected>اختر الفريق الأول</option>
                            ${teamOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>الفريق الثاني</label>
                        <select id="rec-team-b" required>
                            <option value="" disabled selected>اختر الفريق الثاني</option>
                            ${teamOptions}
                        </select>
                    </div>

                    <div class="score-inputs">
                        <div class="si-box">
                            <label>أهداف الفريق 1</label>
                            <input type="number" id="rec-score-a" min="0" max="99" value="0" required>
                        </div>
                        <div class="si-box">
                            <label>أهداف الفريق 2</label>
                            <input type="number" id="rec-score-b" min="0" max="99" value="0" required>
                        </div>
                    </div>

                    <button type="submit" class="btn-royal btn-royal-gold" style="width:100%;" id="btn-submit-match">
                        <i class="fa-solid fa-trophy"></i> اعتماد النتيجة
                    </button>
                </form>
            </div>
        `;
    }

    bindEvents() {
        document.getElementById('tab-arena-feed')?.addEventListener('click', () => {
            this.currentViewMode = 'FEED';
            SoundManager.play('click');
            this.render();
        });

        document.getElementById('tab-arena-record')?.addEventListener('click', () => {
            this.currentViewMode = 'RECORD';
            SoundManager.play('click');
            this.render();
        });

        const form = document.getElementById('form-record-match');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit-match');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';
            }

            try {
                const teamAId = document.getElementById('rec-team-a').value;
                const teamBId = document.getElementById('rec-team-b').value;
                const scoreA = parseInt(document.getElementById('rec-score-a').value, 10);
                const scoreB = parseInt(document.getElementById('rec-score-b').value, 10);

                if (teamAId === teamBId) {
                    throw new Error("لا يمكن اختيار نفس الفريق للمنافسة!");
                }

                await MatchService.submitMatchResult({
                    teamAId,
                    teamBId,
                    scoreA,
                    scoreB
                });

                NotificationService.showToast("تم اعتماد نتيجة المباراة بنجاح!", "success");
                SoundManager.play('whistle');
                this.currentViewMode = 'FEED';
                await this.loadData();
                this.render();
            } catch (err) {
                NotificationService.showToast(err.message || "فشل تسجيل المباراة", "error");
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-trophy"></i> اعتماد النتيجة';
                }
            }
        });
    }
}
