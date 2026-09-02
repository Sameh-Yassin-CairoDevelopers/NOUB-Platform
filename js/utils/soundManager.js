/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/soundManager.js
 * Version: 3.0.0 (HAPTIC & AUDIO EFFECTS CONTROLLER)
 * Description: Synthesized Web Audio API sound effects and Telegram Haptic Feedback.
 */

export class SoundManager {
    static ctx = null;

    static init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                SoundManager.ctx = new AudioContext();
            }
        } catch (e) {
            console.warn("AudioContext not supported");
        }
    }

    /**
     * Plays a pleasant synthesized reward chime.
     */
    static playGoldChime() {
        if (!SoundManager.ctx) return;
        try {
            if (SoundManager.ctx.state === 'suspended') {
                SoundManager.ctx.resume();
            }
            const now = SoundManager.ctx.currentTime;
            const osc = SoundManager.ctx.createOscillator();
            const gain = SoundManager.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
            osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

            osc.connect(gain);
            gain.connect(SoundManager.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {
            // Safe fallback
        }

        // Telegram Haptic Feedback
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
    }

    /**
     * Light click haptic.
     */
    static click() {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
}
