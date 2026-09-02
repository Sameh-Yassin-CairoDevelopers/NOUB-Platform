/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/homeCtrl.js
 * Version: Noub Sports_beta 4.0.0 (MASTER ROYAL EXPERIENCE)
 * Status: Production Ready
 */

import { state } from '../core/state.js';
import { CVGenerator } from '../utils/cvGenerator.js';
import { SoundManager } from '../utils/soundManager.js';
import { AvatarEngine } from '../utils/avatarEngine.js';

export class HomeController {
    constructor(router) {
        this.router = router;
        this.currentTab = 'CARD'; 
        this.is3DFlipped = false;
        this.cardRarity = 'diamond'; 
    }

    init() {
        this.render();
    }

    render() {
        const user = state.getUser();
        if (!user) return;

        const view = document.getElementById('view-home');
        if (!view) return;

        const dynamicContent = this.currentTab === 'CARD' ? this.render3DCard(user) : this.renderQuickStats(user);

        view.innerHTML = `
            <div class="home-wrapper fade-in">
                <!-- ROYAL SWITCH TABS -->
                <div class="home-tabs">
                    <button class="htab ${this.currentTab === 'CARD' ? 'active' : ''}" id="tab-show-card">
                        <i class="fa-solid fa-id-card"></i> كارت الهوية
                    </button>
                    <button class="htab ${this.currentTab === 'STATS' ? 'active' : ''}" id="tab-show-stats">
                        <i class="fa-solid fa-chart-simple"></i> السجل والإحصائيات
                    </button>
                </div>

                <!-- DYNAMIC CONTENT (CARD OR STATS) -->
                <div id="home-dynamic-content">
                    ${dynamicContent}
                </div>

                <!-- ACTION DECK -->
                <div class="home-actions">
                    <button class="btn-royal btn-royal-gold" id="btn-share-card">
                        <i class="fa-solid fa-share-nodes"></i> مشاركة الكارت
                    </button>
                    <button class="btn-royal btn-royal-dark" id="btn-export-cv">
                        <i class="fa-solid fa-download"></i> تصدير CV
                    </button>
                </div>
            </div>
        `;

        this.bindEvents(user);
    }

    render3DCard(user) {
        const dna = user.visualDna || { skin: 1, kit: '#3b82f6', hair: 1 };
        const stats = user.stats || { matches: 0, goals: 0, rating: 60 };
        const position = user.position || 'FWD';
        const rating = stats.rating || 60;

        return `
            <div class="card-3d-wrapper ${this.is3DFlipped ? 'flipped' : ''}" id="main-player-card">
                <div class="card-flipper">
                    <!-- FRONT: ULTIMATE 3D IDENTITY -->
                    <div class="card-front rarity-${this.cardRarity}">
                        <div class="card-glass-shine"></div>
                        
                        <div class="card-top-header">
                            <div class="rating-box">
                                <span class="card-rating">${rating}</span>
                                <span class="card-pos">${position}</span>
                            </div>
                            <div class="badge-flag">
                                <i class="fa-solid fa-gem"></i>
                            </div>
                        </div>

                        <!-- 3D AVATAR COMPOSITION -->
                        <div class="card-avatar-container">
                            ${AvatarEngine.generateAvatarHTML(dna, user.username)}
                        </div>

                        <!-- METALLIC NAME PLATE -->
                        <div class="card-name-plate">
                            <h2>${user.username}</h2>
                            <div class="sub-label">${user.role || 'PRO PLAYER'}</div>
                        </div>

                        <!-- RADIAL STATS DOCK -->
                        <div class="card-stats-dock">
                            <div class="stat-pill">
                                <span class="lbl">مباريات</span>
                                <span class="val">${stats.matches || 0}</span>
                            </div>
                            <div class="stat-pill">
                                <span class="lbl">أهداف</span>
                                <span class="val">${stats.goals || 0}</span>
                            </div>
                            <div class="stat-pill">
                                <span class="lbl">السمعة</span>
                                <span class="val">${user.reputation || 100}</span>
                            </div>
                        </div>
                    </div>

                    <!-- BACK: DIGITAL PASSPORT -->
                    <div class="card-back rarity-${this.cardRarity}">
                        <div class="passport-header">
                            <i class="fa-solid fa-shield-halved"></i>
                            <h3>جواز السفر الرياضي</h3>
                        </div>

                        <div class="passport-body">
                            <div class="pass-row">
                                <span>المنطقة:</span>
                                <strong>الفسطاط / المعادي</strong>
                            </div>
                            <div class="pass-row">
                                <span>الرقم التسلسلي:</span>
                                <strong class="gold-code">#NOUB-${user.id ? user.id.slice(0, 6) : '0001'}</strong>
                            </div>
                            <div class="pass-row">
                                <span>حالة التوثيق:</span>
                                <strong style="color:var(--success)"><i class="fa-solid fa-circle-check"></i> موثق</strong>
                            </div>
                            
                            <div class="qr-mock">
                                <i class="fa-solid fa-qrcode"></i>
                                <small>امسح للتحقق الفوري</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderQuickStats(user) {
        const stats = user.stats || { matches: 0, goals: 0, rating: 60 };

        return `
            <div class="stats-overview-box fade-in" style="width:90%; max-width:380px; background:var(--bg-surface); padding:25px; border-radius:20px; border:1px solid rgba(212,175,55,0.2);">
                <h3 style="color:var(--gold-main); font-family:var(--font-sport); margin-bottom:20px; text-align:center;">السجل الرياضي الكامل</h3>
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span style="color:var(--text-muted);">إجمالي المباريات الملعوبة</span>
                        <strong style="color:#fff; font-family:var(--font-orbitron);">${stats.matches || 0}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span style="color:var(--text-muted);">الأهداف المسجلة</span>
                        <strong style="color:var(--gold-main); font-family:var(--font-orbitron);">${stats.goals || 0}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span style="color:var(--text-muted);">التقييم العام (Rating)</span>
                        <strong style="color:var(--success); font-family:var(--font-orbitron);">${stats.rating || 60}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span style="color:var(--text-muted);">نقاط السمعة والانضباط</span>
                        <strong style="color:var(--gold-main); font-family:var(--font-orbitron);">${user.reputation || 100}</strong>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(user) {
        document.getElementById('tab-show-card')?.addEventListener('click', () => {
            this.currentTab = 'CARD';
            SoundManager.play('click');
            this.render();
        });

        document.getElementById('tab-show-stats')?.addEventListener('click', () => {
            this.currentTab = 'STATS';
            SoundManager.play('click');
            this.render();
        });

        const cardElement = document.getElementById('main-player-card');
        cardElement?.addEventListener('click', () => {
            this.is3DFlipped = !this.is3DFlipped;
            cardElement.classList.toggle('flipped');
            SoundManager.play('click');
        });

        document.getElementById('btn-export-cv')?.addEventListener('click', () => {
            SoundManager.play('success');
            CVGenerator.downloadCV('main-player-card', `${user.username}-noub-card.png`);
        });

        document.getElementById('btn-share-card')?.addEventListener('click', () => {
            SoundManager.play('click');
            if (navigator.share) {
                navigator.share({
                    title: `كارت اللاعب ${user.username}`,
                    text: `شاهد كارت اللاعب ${user.username} على منصة نوب الرياضية!`,
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("تم نسخ رابط الكارت!");
            }
        });
    }
}
