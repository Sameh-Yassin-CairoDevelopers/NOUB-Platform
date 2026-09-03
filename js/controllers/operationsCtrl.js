/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/controllers/operationsCtrl.js
 * Version: Noub Sports_beta 2.0.0 (CENTRAL ACTION ENGINE)
 * Status: Production Ready
 */

import { EmergencyService } from '../services/emergencyService.js';
import { SoundManager } from '../utils/soundManager.js';
import { NotificationService } from '../services/notificationService.js';

export class OperationsController {
    constructor(router) {
        this.router = router;
        this.isFabOpen = false;
    }

    init() {
        this.bindFab();
    }

    bindFab() {
        const fabBtn = document.getElementById('nav-action');
        const overlay = document.getElementById('fab-actions-overlay');
        const closeBtn = document.getElementById('fab-close-btn');

        fabBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleFab(true);
        });

        closeBtn?.addEventListener('click', () => {
            this.toggleFab(false);
        });

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.toggleFab(false);
            }
        });

        // ACTION BUTTONS INSIDE FAB
        document.getElementById('fab-action-emergency')?.addEventListener('click', async () => {
            this.toggleFab(false);
            const notes = prompt("أدخل تفاصيل الطوارئ أو طلب المساعدة (مثال: نحتاج حارس مرمى فوراً في ملعب الفسطاط):");
            if (notes) {
                try {
                    await EmergencyService.broadcastEmergency('NEED_PLAYERS', notes);
                    NotificationService.showToast("تم إرسال إشارة الطوارئ لجميع لاعبي المنطقة!", "success");
                    SoundManager.play('whistle');
                } catch (err) {
                    NotificationService.showToast(err.message || "فشل إرسال الإشارة", "error");
                }
            }
        });

        document.getElementById('fab-action-match')?.addEventListener('click', () => {
            this.toggleFab(false);
            this.router.navigate('view-arena');
            document.getElementById('tab-arena-record')?.click();
        });

        document.getElementById('fab-action-tactic')?.addEventListener('click', () => {
            this.toggleFab(false);
            this.router.navigate('view-tactics');
        });

        document.getElementById('fab-action-tournament')?.addEventListener('click', () => {
            this.toggleFab(false);
            this.router.navigate('view-tournaments');
        });

        document.getElementById('fab-action-card')?.addEventListener('click', () => {
            this.toggleFab(false);
            this.router.navigate('view-home');
        });
    }

    toggleFab(open) {
        const overlay = document.getElementById('fab-actions-overlay');
        if (!overlay) return;

        this.isFabOpen = open;
        if (open) {
            overlay.classList.add('active');
            SoundManager.play('notify');
        } else {
            overlay.classList.remove('active');
            SoundManager.play('click');
        }
    }
}
