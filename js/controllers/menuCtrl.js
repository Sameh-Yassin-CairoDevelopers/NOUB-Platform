/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/controllers/menuCtrl.js
 * Version: 3.0.0 (DRAWER & QUICK ACTIONS CONTROLLER)
 * Description: Side drawer navigation, quick action overlays, and realm jumps.
 */

import { AuthService } from '../services/authService.js';
import { SoundManager } from '../utils/soundManager.js';

export class MenuController {
    constructor(router) {
        this.router = router;
        this.auth = new AuthService();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        const overlay = document.getElementById('main-menu-overlay');
        const closeBtn = document.getElementById('close-menu-btn');

        menuToggleBtn?.addEventListener('click', () => {
            overlay?.classList.add('open');
            SoundManager.click();
        });

        closeBtn?.addEventListener('click', () => {
            overlay?.classList.remove('open');
        });

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });

        // Menu items
        document.getElementById('menu-card-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-home');
        });

        document.getElementById('menu-arena-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-arena');
        });

        document.getElementById('menu-tournament-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-tournaments');
        });

        document.getElementById('menu-tactics-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-tactics');
        });

        document.getElementById('menu-team-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-team');
        });

        document.getElementById('menu-scout-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-scout');
        });

        document.getElementById('menu-operations-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-operations');
        });

        document.getElementById('menu-industry-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-industry');
        });

        document.getElementById('menu-sanctuary-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-sanctuary');
        });

        document.getElementById('menu-profile-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-profile');
        });

        document.getElementById('menu-hub-btn')?.addEventListener('click', () => {
            overlay?.classList.remove('open');
            this.router.navigate('view-hub');
        });

        document.getElementById('menu-logout-btn')?.addEventListener('click', async () => {
            if (confirm('هل ترغب في تسجيل الخروج؟')) {
                await this.auth.logout();
            }
        });

        // Profile header trigger
        document.getElementById('header-profile-trigger')?.addEventListener('click', () => {
            SoundManager.click();
            this.router.navigate('view-profile');
        });
    }
}
