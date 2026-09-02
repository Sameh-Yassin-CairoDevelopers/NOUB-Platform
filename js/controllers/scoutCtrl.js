/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/scoutCtrl.js
 * Version: Noub Sports_beta 2.0.0 (ZONE-FILTERED ADVANCED SCOUT)
 * Status: Production Ready
 */

import { MarketService } from '../services/marketService.js';
import { TeamService } from '../services/teamService.js';
import { SoundManager } from '../utils/soundManager.js';
import { AvatarEngine } from '../utils/avatarEngine.js';

export class ScoutController {
    constructor(router) {
        this.router = router;
        this.currentScope = 'PLAYERS'; 
        this.currentPosFilter = 'ALL';
        this.searchQuery = '';
        this.players = [];
        this.teams = [];
        this.trending = [];
    }

    async init() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        this.trending = await MarketService.getTrendingTalents();
        if (this.currentScope === 'PLAYERS') {
            this.players = await MarketService.getGlobalMarket({
                position: this.currentPosFilter,
                searchQuery: this.searchQuery
            });
        } else {
            this.teams = await TeamService.getGlobalTeams();
        }
    }

    render() {
        const view = document.getElementById('view-scout');
        if (!view) return;

        view.innerHTML = `
            <!-- SCOUT HEADER -->
            <div class="scout-header">
                <div class="scope-wrapper">
                    <button class="scope-btn ${this.currentScope === 'PLAYERS' ? 'active' : ''}" id="scope-players">
                        <i class="fa-solid fa-users"></i> سوق اللاعبين
                    </button>
                    <button class="scope-btn ${this.currentScope === 'TEAMS' ? 'active' : ''}" id="scope-teams">
                        <i class="fa-solid fa-shield-halved"></i> دليل الفرق
                    </button>
                </div>

                <div class="search-bar-wrapper">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="scout-search" placeholder="ابحث بالاسم، المركز، أو المنطقة..." value="${this.searchQuery}">
                </div>

                ${this.currentScope === 'PLAYERS' ? `
                    <div class="filter-pills">
                        <button class="pill ${this.currentPosFilter === 'ALL' ? 'active' : ''}" data-pos="ALL">الكل</button>
                        <button class="pill ${this.currentPosFilter === 'FWD' ? 'active' : ''}" data-pos="FWD">هجوم</button>
                        <button class="pill ${this.currentPosFilter === 'MID' ? 'active' : ''}" data-pos="MID">وسط</button>
                        <button class="pill ${this.currentPosFilter === 'DEF' ? 'active' : ''}" data-pos="DEF">دفاع</button>
                        <button class="pill ${this.currentPosFilter === 'GK' ? 'active' : ''}" data-pos="GK">حراس</button>
                    </div>
                ` : ''}
            </div>

            <!-- TRENDING SECTION -->
            ${this.currentScope === 'PLAYERS' && this.trending.length > 0 ? `
                <div class="trending-section">
                    <h4><i class="fa-solid fa-fire"></i> مواهب صاعدة</h4>
                    <div class="trending-scroll">
                        ${this.trending.map(t => `
                            <div class="mini-trend-card">
                                <div class="mini-avatar"><i class="fa-solid fa-user-ninja" style="color:var(--gold-main);"></i></div>
                                <strong>${t.stats?.rating || 60}</strong>
                                <span>${t.displayName}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- MAIN GRID -->
            <div class="market-grid-section">
                <h4>${this.currentScope === 'PLAYERS' ? 'كروت اللاعبين المتاحة' : 'قائمة الفرق المسجلة'}</h4>
                <div class="market-grid">
                    ${this.currentScope === 'PLAYERS' ? this.renderPlayerCards() : this.renderTeamCards()}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderPlayerCards() {
        if (!this.players || this.players.length === 0) {
            return `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px;">لا توجد نتائج مطابقة.</p>`;
        }

        return this.players.map(p => {
            const dna = p.visuals || { skin: 1, kit: '#3b82f6', hair: 1 };
            const rating = p.stats?.rating || 60;
            const rarity = rating >= 80 ? 'diamond' : (rating >= 70 ? 'gold' : 'silver');

            return `
                <div class="scout-card rarity-${rarity} fade-in">
                    <div class="scout-card-top">
                        <span class="scout-pos">${p.position}</span>
                        <span class="scout-rating">${rating}</span>
                    </div>

                    <div class="scout-avatar-wrapper">
                        ${AvatarEngine.generateAvatarHTML(dna, p.displayName)}
                    </div>

                    <div class="scout-info">
                        <h5>${p.displayName}</h5>
                        <div class="scout-tags">
                            <span><i class="fa-solid fa-star" style="color:var(--gold-main)"></i> ${p.ratingLabel}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTeamCards() {
        if (!this.teams || this.teams.length === 0) {
            return `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px;">لا توجد فرق مسجلة.</p>`;
        }

        return this.teams.map(t => {
            return `
                <div class="scout-card team-mode rarity-gold fade-in">
                    <div class="team-logo-scaler" style="background:${t.color_primary || '#10b981'};">
                        <i class="fa-solid ${t.logo_url || 'fa-shield-halved'}"></i>
                    </div>

                    <div class="scout-info">
                        <h5>${t.name}</h5>
                        <div class="scout-tags">
                            <span>القائد: ${t.captain?.username || 'مجهول'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    bindEvents() {
        document.getElementById('scope-players')?.addEventListener('click', async () => {
            this.currentScope = 'PLAYERS';
            SoundManager.play('click');
            await this.loadData();
            this.render();
        });

        document.getElementById('scope-teams')?.addEventListener('click', async () => {
            this.currentScope = 'TEAMS';
            SoundManager.play('click');
            await this.loadData();
            this.render();
        });

        document.querySelectorAll('.filter-pills .pill').forEach(pill => {
            pill.addEventListener('click', async (e) => {
                this.currentPosFilter = e.currentTarget.dataset.pos;
                SoundManager.play('click');
                await this.loadData();
                this.render();
            });
        });

        const searchInput = document.getElementById('scout-search');
        let debounceTimer;
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                this.searchQuery = e.target.value.trim();
                await this.loadData();
                this.render();
            }, 300);
        });
    }
}
