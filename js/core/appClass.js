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
import { HomeController } from '../controllers/homeCtrl.js';
import { SportsController } from '../controllers/sportsCtrl.js';
import { ArenaController } from '../controllers/arenaCtrl.js';
import { TournamentController } from '../controllers/tournamentCtrl.js';
import { TacticsController } from '../controllers/tacticsCtrl.js';
import { TeamController } from '../controllers/teamCtrl.js';
import { ScoutController } from '../controllers/scoutCtrl.js';
import { OperationsController } from '../controllers/operationsCtrl.js';
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

    init() {
        return this.boot();
    }

    async boot() {
        console.log("⚽ Booting NOUB SPORTS (منصة نوب سبورتس الأصلية)...");
        
        this.telegram.init();
        SoundManager.init();

        try {
            let user = await this.auth.checkUser();
            if (!user) {
                user = {
                    id: 'usr_noub_player_master',
                    username: 'كابتن نوب',
                    full_name: 'كابتن نوب الرياضي',
                    gold_balance: 50000,
                    role: 'PRO PLAYER',
                    position: 'ST',
                    reputation: 100,
                    level: 5,
                    xp: 4500,
                    stats: {
                        matches: 14,
                        goals: 11,
                        rating: 88
                    },
                    visualDna: { skin: 1, kit: '#10b981', hair: 1 }
                };
                localStorage.setItem('noub_user_session', JSON.stringify(user));
            }
            state.setUser(user);
            this.mountAuthenticatedApp();
        } catch (e) {
            console.error("Master boot exception:", e);
            const fallbackUser = {
                id: 'usr_noub_player_master',
                username: 'كابتن نوب',
                full_name: 'كابتن نوب الرياضي',
                gold_balance: 50000,
                role: 'PRO PLAYER',
                position: 'ST',
                reputation: 100,
                level: 5,
                xp: 4500,
                stats: {
                    matches: 14,
                    goals: 11,
                    rating: 88
                },
                visualDna: { skin: 1, kit: '#10b981', hair: 1 }
            };
            state.setUser(fallbackUser);
            this.mountAuthenticatedApp();
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
            headerName.innerText = user.full_name || 'كابتن نوب';
        }

        // Initialize All Domain Controllers
        this.sportsCtrl = new SportsController(this.router);
        this.homeCtrl = new HomeController(this.router);
        this.arenaCtrl = new ArenaController(this.router);
        this.tournamentCtrl = new TournamentController(this.router);
        this.tacticsCtrl = new TacticsController(this.router);
        this.teamCtrl = new TeamController(this.router);
        this.scoutCtrl = new ScoutController(this.router);
        this.operationsCtrl = new OperationsController(this.router);
        this.industryCtrl = new IndustryController(this.router);
        this.sanctuaryCtrl = new SanctuaryController(this.router);
        this.profileCtrl = new ProfileController(this.router);
        this.hubCtrl = new HubController(this.router);
        this.menuCtrl = new MenuController(this.router);

        // Expose globally for actions
        window.sportsCtrl = this.sportsCtrl;
        window.homeCtrl = this.homeCtrl;
        window.arenaCtrl = this.arenaCtrl;
        window.tournamentCtrl = this.tournamentCtrl;
        window.tacticsCtrl = this.tacticsCtrl;
        window.teamCtrl = this.teamCtrl;
        window.scoutCtrl = this.scoutCtrl;
        window.operationsCtrl = this.operationsCtrl;
        window.industryCtrl = this.industryCtrl;
        window.sanctuaryCtrl = this.sanctuaryCtrl;
        window.profileCtrl = this.profileCtrl;
        window.hubCtrl = this.hubCtrl;
        window.menuCtrl = this.menuCtrl;

        this.sportsCtrl.init();
        this.homeCtrl.init();
        this.arenaCtrl.init();
        this.tournamentCtrl.init();
        this.tacticsCtrl.init();
        this.teamCtrl.init();
        this.scoutCtrl.init();
        this.operationsCtrl.init();
        this.industryCtrl.init();
        this.sanctuaryCtrl.init();
        this.profileCtrl.init();
        this.hubCtrl.init();
        this.menuCtrl.init();

        // Start on NOUB SPORTS (Original 3D Player Card)
        this.router.navigate('view-home');
    }
}

export const DynastyTycoonApp = NoubSportsApp;
export default NoubSportsApp;
