/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/core/appClass.js
 * Version: 3.0.0 (MASTER UNIFIED BOOTSTRAPPER)
 * Description: The single authoritative bootstrapper coordinating the master state,
 *              Supabase synchronization, multi-realm routing, and lifecycle events.
 */

import { Router } from './router.js';
import { TelegramService } from './telegram.js';
import { state } from './state.js';
import { AuthService } from '../services/authService.js';
import { SoundManager } from '../utils/soundManager.js';

// Master Controllers
import { OnboardingController } from '../controllers/onboardingCtrl.js';
import { HubController } from '../controllers/hubCtrl.js';
import { SportsController } from '../controllers/sportsCtrl.js';
import { IndustryController } from '../controllers/industryCtrl.js';
import { SanctuaryController } from '../controllers/sanctuaryCtrl.js';
import { ProfileController } from '../controllers/profileCtrl.js';
import { MenuController } from '../controllers/menuCtrl.js';

export class NoubSportsApp {
    constructor() {
        this.router = new Router();
        this.telegram = new TelegramService();
        this.auth = new AuthService();
    }

    async boot() {
        console.log("👑 Booting NOUB MASTER UNIFIED ECOSYSTEM...");
        
        this.telegram.init();
        SoundManager.init();

        try {
            const user = await this.auth.checkUser();
            
            if (user) {
                state.setUser(user);
                this.mountAuthenticatedApp();
            } else {
                this.mountOnboarding();
            }
        } catch (e) {
            console.error("Master boot exception:", e);
            this.mountOnboarding();
        }

        // Smoothly dismiss splash screen
        setTimeout(() => {
            const splash = document.getElementById('screen-splash');
            if (splash) {
                splash.style.transition = 'opacity 0.4s ease';
                splash.style.opacity = '0';
                setTimeout(() => splash.remove(), 400);
            }
        }, 600);
    }

    mountOnboarding() {
        document.getElementById('global-header')?.classList.add('hidden');
        document.getElementById('global-navbar')?.classList.add('hidden');
        
        const onbCtrl = new OnboardingController(this.router, () => {
            this.mountAuthenticatedApp();
        });
        onbCtrl.init();
        
        this.router.navigate('view-onboarding');
    }

    mountAuthenticatedApp() {
        document.getElementById('global-header')?.classList.remove('hidden');
        document.getElementById('global-navbar')?.classList.remove('hidden');

        // Update header user name
        const user = state.data.user;
        const headerName = document.getElementById('header-user-name');
        if (headerName && user) {
            headerName.innerText = user.full_name || 'بطل نوب الموحد';
        }

        // Initialize All Domain Controllers
        this.hubCtrl = new HubController(this.router);
        this.sportsCtrl = new SportsController(this.router);
        this.industryCtrl = new IndustryController(this.router);
        this.sanctuaryCtrl = new SanctuaryController(this.router);
        this.profileCtrl = new ProfileController(this.router);
        this.menuCtrl = new MenuController(this.router);

        this.hubCtrl.init();
        this.sportsCtrl.init();
        this.industryCtrl.init();
        this.sanctuaryCtrl.init();
        this.profileCtrl.init();
        this.menuCtrl.init();

        // Bind Global Bottom Navbar Buttons
        const navHub = document.getElementById('nav-hub');
        const navSports = document.getElementById('nav-sports');
        const navIndustry = document.getElementById('nav-industry');
        const navSanctuary = document.getElementById('nav-sanctuary');
        const navProfile = document.getElementById('nav-profile');

        if (navHub && !navHub.dataset.bound) {
            navHub.dataset.bound = 'true';
            navHub.addEventListener('click', () => {
                SoundManager.click();
                this.hubCtrl.init();
                this.router.navigate('view-hub');
            });
        }

        if (navSports && !navSports.dataset.bound) {
            navSports.dataset.bound = 'true';
            navSports.addEventListener('click', () => {
                SoundManager.click();
                this.sportsCtrl.init();
                this.router.navigate('view-sports');
            });
        }

        if (navIndustry && !navIndustry.dataset.bound) {
            navIndustry.dataset.bound = 'true';
            navIndustry.addEventListener('click', () => {
                SoundManager.click();
                this.industryCtrl.init();
                this.router.navigate('view-industry');
            });
        }

        if (navSanctuary && !navSanctuary.dataset.bound) {
            navSanctuary.dataset.bound = 'true';
            navSanctuary.addEventListener('click', () => {
                SoundManager.click();
                this.sanctuaryCtrl.init();
                this.router.navigate('view-sanctuary');
            });
        }

        if (navProfile && !navProfile.dataset.bound) {
            navProfile.dataset.bound = 'true';
            navProfile.addEventListener('click', () => {
                SoundManager.click();
                this.profileCtrl.init();
                this.router.navigate('view-profile');
            });
        }

        // Start on Hub
        this.router.navigate('view-hub');
    }
}
