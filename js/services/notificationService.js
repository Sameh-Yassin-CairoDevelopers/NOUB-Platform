/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/services/notificationService.js
 * Version: 3.0.0 (UNIVERSAL ACTION & NOTIFICATION DISPATCHER)
 * Description: In-app real-time notification alerts, toast banners, and deep link routing.
 */

import { state } from '../core/state.js';

export class NotificationService {
    /**
     * Shows a toast message on screen.
     * @param {string} message 
     * @param {string} type - 'success' | 'alert' | 'gold' | 'info'
     */
    static showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `app-toast toast-${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'alert') icon = 'fa-triangle-exclamation';
        if (type === 'gold') icon = 'fa-coins';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3800);
    }
}
