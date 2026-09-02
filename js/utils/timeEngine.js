/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/timeEngine.js
 * Version: 3.0.0 (89x BIOLOGICAL TIME TRANSLATION ENGINE)
 * Description: Mathematical time translation between real earth seconds and the
 *              accelerated biological sanctuary clock (89.0x speed ratio).
 */

export const BIO_TIME_ACCELERATION = 89.0;

export class TimeEngine {
    /**
     * Converts a biological duration in days into real-world milliseconds.
     * Formula: Real_ms = (Bio_Days * 86400 * 1000) / 89.0
     * 
     * @param {number} bioDays - Number of biological days
     * @returns {number} Real-world milliseconds
     */
    static bioDaysToRealMs(bioDays) {
        const bioSeconds = bioDays * 86400;
        const realSeconds = bioSeconds / BIO_TIME_ACCELERATION;
        return Math.floor(realSeconds * 1000);
    }

    /**
     * Calculates remaining real-world time until a biological target timestamp.
     * 
     * @param {string|Date|number} targetTime - Real target completion timestamp
     * @returns {Object} { remainingMs, isComplete, formatted, progressPercent }
     */
    static getRemainingTime(targetTime, startTime = null) {
        const target = new Date(targetTime).getTime();
        const now = Date.now();
        const remainingMs = Math.max(0, target - now);
        const isComplete = remainingMs <= 0;

        let progressPercent = 100;
        if (startTime) {
            const start = new Date(startTime).getTime();
            const totalDuration = target - start;
            if (totalDuration > 0) {
                const elapsed = now - start;
                progressPercent = Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
            }
        }

        const seconds = Math.floor((remainingMs / 1000) % 60);
        const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
        const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

        let formatted = '';
        if (days > 0) formatted += `${days}ي `;
        if (hours > 0 || days > 0) formatted += `${hours}س `;
        formatted += `${minutes}د ${seconds}ث`;

        return {
            remainingMs,
            isComplete,
            formatted,
            progressPercent
        };
    }

    /**
     * Formats an ISO string into an elegant Arabic date and time string.
     */
    static formatArabicDateTime(isoString) {
        if (!isoString) return 'غير محدد';
        const d = new Date(isoString);
        return d.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
