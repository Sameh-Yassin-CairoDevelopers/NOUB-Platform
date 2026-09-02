/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/visualEffects.js
 * Version: 3.0.0 (CONFETTI & VISUAL FLAIR)
 * Description: Particle celebration effects and animated UI interactions.
 */

export class VisualEffects {
    /**
     * Launches celebratory confetti across the viewport.
     */
    static triggerConfetti() {
        if (typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#10b981', '#3b82f6', '#f59e0b', '#ffffff']
            });
        }
    }
}
