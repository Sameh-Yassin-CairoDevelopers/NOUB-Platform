/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/core/router.js
 * Version: 3.2.0 (DYNAMIC WORLD SPA ROUTER)
 * Description: View switcher managing independent world environments with dedicated
 *              bottom navigation bars and sub-tab synchronization.
 */

import { state } from './state.js';
import { SoundManager } from '../utils/soundManager.js';

export class Router {
    constructor() {
        this.currentViewId = null;
        this.currentSubTab = null;
        this.onNavChangeCallbacks = [];
        window.router = (viewId, subTab) => this.navigate(viewId, subTab);
    }

    onNavChange(fn) {
        this.onNavChangeCallbacks.push(fn);
    }

    /**
     * Navigates to a specific view section ID with optional sub-tab.
     * @param {string} viewId 
     * @param {string} [subTab]
     */
    navigate(viewId, subTab = null) {
        const views = document.querySelectorAll('.view-section');
        views.forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        const target = document.getElementById(viewId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            this.currentViewId = viewId;
            this.currentSubTab = subTab;

            // Determine active world
            let realm = 'hub';
            let worldTitle = 'الرئيسية الموحدة';
            let worldIcon = 'fa-house';

            if (viewId === 'view-sports' || viewId === 'view-arena' || viewId === 'view-scout' || viewId === 'view-team' || viewId === 'view-tournaments' || viewId === 'view-tactics') {
                realm = 'sports';
                worldTitle = 'منصة نوب سبورتس';
                worldIcon = 'fa-futbol';
            } else if (viewId === 'view-industry') {
                realm = 'industry';
                worldTitle = 'ورش وصروح الفراعنة';
                worldIcon = 'fa-landmark';
            } else if (viewId === 'view-sanctuary') {
                realm = 'sanctuary';
                worldTitle = 'محمية الأنساب 89x';
                worldIcon = 'fa-paw';
            } else if (viewId === 'view-profile') {
                realm = 'profile';
                worldTitle = 'حسابي والخزنة المركزية';
                worldIcon = 'fa-user-shield';
            } else if (viewId === 'view-onboarding') {
                realm = 'onboarding';
            }

            state.setRealm(realm);
            this.updateHeaderWorldBadge(worldTitle, worldIcon);
            this.renderDynamicNavbar(realm, subTab);

            // Notify controllers
            this.onNavChangeCallbacks.forEach(cb => cb(realm, viewId, subTab));
        } else {
            console.error(`Route target not found: ${viewId}`);
        }
    }

    updateHeaderWorldBadge(title, icon) {
        const titleEl = document.getElementById('header-world-title');
        const badgeEl = document.getElementById('header-world-badge');
        if (titleEl) titleEl.innerText = title;
        if (badgeEl) {
            const iconEl = badgeEl.querySelector('i');
            if (iconEl) iconEl.className = `fa-solid ${icon}`;
        }

        // Also update live gold in header
        const user = state.getUser();
        const goldEl = document.getElementById('header-gold-val');
        if (goldEl && user) {
            goldEl.innerText = (user.gold_balance || 0).toLocaleString('ar-EG');
        }
        const nameEl = document.getElementById('header-user-name');
        if (nameEl && user) {
            nameEl.innerText = user.full_name || 'كابتن نوب';
        }
    }

    /**
     * Renders a dedicated bottom navbar for the active world.
     */
    renderDynamicNavbar(realm, activeSubTab) {
        const navbar = document.getElementById('global-navbar');
        if (!navbar) return;

        if (realm === 'onboarding') {
            navbar.classList.add('hidden');
            return;
        }

        navbar.classList.remove('hidden');

        let buttons = [];

        if (realm === 'sports') {
            const defTab = activeSubTab || 'matches';
            buttons = [
                { id: 'tab-matches', icon: 'fa-futbol', label: 'المباريات', action: () => window.sportsCtrl?.switchTab('matches') },
                { id: 'tab-tournaments', icon: 'fa-trophy', label: 'البطولات', action: () => window.sportsCtrl?.switchTab('tournaments') },
                { id: 'tab-tactics', icon: 'fa-chalkboard-user', label: 'التكتيك', action: () => window.sportsCtrl?.switchTab('tactics') },
                { id: 'tab-team', icon: 'fa-shield-halved', label: 'فريقـي', action: () => window.sportsCtrl?.switchTab('team') },
                { id: 'tab-scout', icon: 'fa-binoculars', label: 'الكشافين', action: () => window.sportsCtrl?.switchTab('scout') },
                { id: 'tab-emergency', icon: 'fa-triangle-exclamation', label: 'طوارئ SOS', action: () => window.sportsCtrl?.switchTab('emergency') },
                { id: 'tab-card', icon: 'fa-id-card', label: 'كارتي 3D', action: () => window.sportsCtrl?.switchTab('card') },
            ];
        } else if (realm === 'industry') {
            buttons = [
                { id: 'tab-workshops', icon: 'fa-wheat-awn', label: 'الورش', action: () => window.industryCtrl?.switchTab('workshops') },
                { id: 'tab-contracts', icon: 'fa-scroll', label: 'العقود', action: () => window.industryCtrl?.switchTab('contracts') },
                { id: 'tab-auctions', icon: 'fa-scale-balanced', label: 'المزاد', action: () => window.industryCtrl?.switchTab('auctions') },
                { id: 'tab-craft', icon: 'fa-flask-vial', label: 'المختبر', action: () => window.industryCtrl?.switchTab('craft') },
            ];
        } else if (realm === 'sanctuary') {
            buttons = [
                { id: 'tab-pedigree', icon: 'fa-dna', label: 'الأنساب 89x', action: () => window.sanctuaryCtrl?.switchTab('pedigree') },
                { id: 'tab-gestation', icon: 'fa-heart-pulse', label: 'الحضانة', action: () => window.sanctuaryCtrl?.switchTab('gestation') },
                { id: 'tab-farm', icon: 'fa-seedling', label: 'المزرعة', action: () => window.sanctuaryCtrl?.switchTab('farm') },
                { id: 'tab-market', icon: 'fa-paw', label: 'السوق', action: () => window.sanctuaryCtrl?.switchTab('market') },
            ];
        } else if (realm === 'profile') {
            buttons = [
                { id: 'tab-overview', icon: 'fa-user-astronaut', label: 'الملف والـ DNA', action: () => window.profileCtrl?.switchTab('overview') },
                { id: 'tab-vault', icon: 'fa-vault', label: 'الخزنة والذهب', action: () => window.profileCtrl?.switchTab('vault') },
                { id: 'tab-stats', icon: 'fa-chart-pie', label: 'الإحصائيات', action: () => window.profileCtrl?.switchTab('stats') },
                { id: 'tab-edit', icon: 'fa-user-pen', label: 'تعديل البيانات', action: () => window.profileCtrl?.switchTab('edit') },
            ];
        } else {
            // Default Hub
            buttons = [
                { id: 'tab-hub-home', icon: 'fa-house', label: 'الرئيسية', action: () => this.navigate('view-hub') },
                { id: 'tab-hub-ads', icon: 'fa-bullhorn', label: 'الإعلانات والطلبات', action: () => window.hubCtrl?.switchTab('ads') },
                { id: 'tab-hub-emergencies', icon: 'fa-triangle-exclamation', label: 'الطوارئ', action: () => window.hubCtrl?.switchTab('emergencies') },
                { id: 'tab-hub-rank', icon: 'fa-ranking-star', label: 'المتصدرين', action: () => window.hubCtrl?.switchTab('rank') },
            ];
        }

        navbar.innerHTML = buttons.map((b, idx) => `
            <button class="nav-btn ${idx === 0 ? 'active' : ''}" id="dynamic-${b.id}">
                <i class="fa-solid ${b.icon}"></i>
                <span>${b.label}</span>
            </button>
        `).join('');

        buttons.forEach((b) => {
            const el = document.getElementById(`dynamic-${b.id}`);
            el?.addEventListener('click', () => {
                SoundManager.click();
                navbar.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                el.classList.add('active');
                b.action();
            });
        });
    }

    /**
     * Highlights an active button inside the current realm navbar.
     */
    setActiveNavButton(tabId) {
        const navbar = document.getElementById('global-navbar');
        if (!navbar) return;
        navbar.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`dynamic-tab-${tabId}`);
        if (btn) btn.classList.add('active');
    }
}

