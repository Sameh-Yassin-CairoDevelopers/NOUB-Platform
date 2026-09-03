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
            let realm = 'sports';
            let worldTitle = 'منصة نوب سبورتس (NOUB SPORTS)';
            let worldIcon = 'fa-futbol';

            if (viewId === 'view-sports' || viewId === 'view-home' || viewId === 'view-arena' || 
                viewId === 'view-tournaments' || viewId === 'view-tactics' || viewId === 'view-scout' || 
                viewId === 'view-team' || viewId === 'view-operations') {
                realm = 'sports';
                worldTitle = 'منصة نوب سبورتس (NOUB SPORTS)';
                worldIcon = 'fa-futbol';
            } else if (viewId === 'view-industry') {
                realm = 'industry';
                worldTitle = 'ورش وصروح الفراعنة ومقابر الملوك';
                worldIcon = 'fa-landmark';
            } else if (viewId === 'view-sanctuary') {
                realm = 'sanctuary';
                worldTitle = 'محمية الأنساب والوراثة 89x';
                worldIcon = 'fa-paw';
            } else if (viewId === 'view-profile') {
                realm = 'profile';
                worldTitle = 'الخزنة الملكية والأصول';
                worldIcon = 'fa-vault';
            } else if (viewId === 'view-hub') {
                realm = 'hub';
                worldTitle = 'سلالات الفراعنة والورش الكبرى';
                worldIcon = 'fa-crown';
            } else if (viewId === 'view-onboarding') {
                realm = 'onboarding';
            }

            state.setRealm(realm);
            this.updateHeaderWorldBadge(worldTitle, worldIcon);
            this.renderDynamicNavbar(realm, viewId, subTab);

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
    renderDynamicNavbar(realm, activeViewId, activeSubTab) {
        const navbar = document.getElementById('global-navbar');
        if (!navbar) return;

        if (realm === 'onboarding') {
            navbar.classList.add('hidden');
            return;
        }

        navbar.classList.remove('hidden');

        let buttons = [];

        if (realm === 'sports') {
            buttons = [
                { id: 'sports-nav-home', icon: 'fa-id-card', label: 'كارتي 3D', isActive: activeViewId === 'view-home', action: () => this.navigate('view-home') },
                { id: 'sports-nav-arena', icon: 'fa-futbol', label: 'المباريات', isActive: activeViewId === 'view-arena', action: () => this.navigate('view-arena') },
                { id: 'nav-action', icon: 'fa-plus', label: '', isActionCenter: true, action: () => window.operationsCtrl?.toggleFab(true) },
                { id: 'sports-nav-tourn', icon: 'fa-trophy', label: 'البطولات', isActive: activeViewId === 'view-tournaments', action: () => this.navigate('view-tournaments') },
                { id: 'sports-nav-tactics', icon: 'fa-chalkboard-user', label: 'التكتيك', isActive: activeViewId === 'view-tactics', action: () => this.navigate('view-tactics') },
            ];
        } else if (realm === 'industry') {
            buttons = [
                { id: 'ind-workshops', icon: 'fa-wheat-awn', label: 'الورش', isActive: !activeSubTab || activeSubTab === 'workshops', action: () => window.industryCtrl?.switchTab('workshops') },
                { id: 'ind-tombs', icon: 'fa-gem', label: 'المقابر 62', isActive: activeSubTab === 'tombs', action: () => window.industryCtrl?.switchTab('tombs') },
                { id: 'ind-soul', icon: 'fa-infinity', label: 'كارت الروح', isActive: activeSubTab === 'soul', action: () => window.industryCtrl?.switchTab('soul') },
                { id: 'ind-projects', icon: 'fa-monument', label: 'الصروح', isActive: activeSubTab === 'projects', action: () => window.industryCtrl?.switchTab('projects') },
                { id: 'ind-home', icon: 'fa-house', label: 'الرئيسية', isActive: false, action: () => this.navigate('view-hub') },
            ];
        } else if (realm === 'sanctuary') {
            buttons = [
                { id: 'sanc-pedigree', icon: 'fa-dna', label: 'الأنساب', isActive: !activeSubTab || activeSubTab === 'pedigree', action: () => window.sanctuaryCtrl?.switchTab('pedigree') },
                { id: 'sanc-gestation', icon: 'fa-heart-pulse', label: 'الحضانة', isActive: activeSubTab === 'gestation', action: () => window.sanctuaryCtrl?.switchTab('gestation') },
                { id: 'sanc-farm', icon: 'fa-seedling', label: 'المزرعة', isActive: activeSubTab === 'farm', action: () => window.sanctuaryCtrl?.switchTab('farm') },
                { id: 'sanc-market', icon: 'fa-paw', label: 'السوق', isActive: activeSubTab === 'market', action: () => window.sanctuaryCtrl?.switchTab('market') },
                { id: 'sanc-home', icon: 'fa-house', label: 'الرئيسية', isActive: false, action: () => this.navigate('view-hub') },
            ];
        } else if (realm === 'profile') {
            buttons = [
                { id: 'prof-overview', icon: 'fa-crown', label: 'العرش واللقب', isActive: !activeSubTab || activeSubTab === 'overview', action: () => window.profileCtrl?.switchTab('overview') },
                { id: 'prof-vault', icon: 'fa-vault', label: 'الخزنة', isActive: activeSubTab === 'vault', action: () => window.profileCtrl?.switchTab('vault') },
                { id: 'prof-stats', icon: 'fa-chart-pie', label: 'الأصول', isActive: activeSubTab === 'stats', action: () => window.profileCtrl?.switchTab('stats') },
                { id: 'prof-home', icon: 'fa-house', label: 'الرئيسية', isActive: false, action: () => this.navigate('view-hub') },
            ];
        } else {
            // Default Pharaonic Hub
            buttons = [
                { id: 'hub-main', icon: 'fa-house', label: 'الرئيسية', isActive: activeViewId === 'view-hub', action: () => this.navigate('view-hub') },
                { id: 'hub-ind', icon: 'fa-wheat-awn', label: 'الورش', isActive: false, action: () => {
                    this.navigate('view-industry');
                    window.industryCtrl?.switchTab('workshops');
                }},
                { id: 'hub-tombs', icon: 'fa-gem', label: 'المقابر 62', isActive: false, action: () => {
                    this.navigate('view-industry');
                    window.industryCtrl?.switchTab('tombs');
                }},
                { id: 'hub-sanc', icon: 'fa-dna', label: 'الأنساب 89x', isActive: false, action: () => this.navigate('view-sanctuary') },
                { id: 'hub-prof', icon: 'fa-vault', label: 'الخزنة', isActive: false, action: () => this.navigate('view-profile') },
            ];
        }

        navbar.innerHTML = buttons.map((b) => {
            if (b.isActionCenter) {
                return `
                    <button class="nav-btn action-center" id="${b.id}" title="إجراءات سريعة" aria-label="إجراءات سريعة">
                        <i class="fa-solid ${b.icon}"></i>
                    </button>
                `;
            }
            return `
                <button class="nav-btn ${b.isActive ? 'active' : ''}" id="${b.id}">
                    <i class="fa-solid ${b.icon}"></i>
                    <span>${b.label}</span>
                </button>
            `;
        }).join('');

        buttons.forEach((b) => {
            const el = document.getElementById(b.id);
            el?.addEventListener('click', () => {
                SoundManager.click();
                if (!b.isActionCenter) {
                    navbar.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    el.classList.add('active');
                }
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

