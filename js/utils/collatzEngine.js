/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/utils/collatzEngine.js
 * Version: 3.0.0 (COLLATZ CONJECTURE 3n+1 POWER GENERATOR)
 * Description: Mathematical engine calculating Collatz trajectory, peak value,
 *              and total stopping time to derive Soul Card power levels and affinities.
 */

export class CollatzEngine {
    /**
     * Computes the full Collatz trajectory for a given integer n.
     * Rule: if n is even => n / 2; if n is odd => 3n + 1
     * 
     * @param {number} seed - Positive integer seed
     * @returns {Object} { seed, totalSteps, peakValue, path, powerScore, elementalAffinity }
     */
    static computeTrajectory(seed) {
        let n = Math.max(1, Math.floor(Math.abs(Number(seed) || 7)));
        const originalSeed = n;
        const path = [n];
        let peakValue = n;
        let steps = 0;

        // Limit iteration to 5000 to prevent infinite loops
        while (n !== 1 && steps < 5000) {
            if (n % 2 === 0) {
                n = n / 2;
            } else {
                n = 3 * n + 1;
            }
            path.push(n);
            if (n > peakValue) peakValue = n;
            steps++;
        }

        // Derive Power Score: bounded between 750 and 9999
        const basePower = (steps * 37) + Math.floor(Math.log2(peakValue + 1) * 45);
        const powerScore = Math.min(9999, Math.max(750, basePower));

        // Derive Elemental Affinity based on trajectory characteristics
        const affinities = [
            { name: 'شمس رع الخالدة (Solar Ra)', icon: '☀️', color: '#D4AF37' },
            { name: 'فيضان النيل الأزرق (Nile Flood)', icon: '🌊', color: '#3b82f6' },
            { name: 'ريح الصحراء الهادرة (Desert Storm)', icon: '🌪️', color: '#10b981' },
            { name: 'لهيب سخمت المقدس (Sekhmet Flame)', icon: '🔥', color: '#ef4444' },
            { name: 'صخرة الجرانيت الملكي (Royal Granite)', icon: '🗿', color: '#8b5cf6' }
        ];
        const affinity = affinities[steps % affinities.length];

        return {
            seed: originalSeed,
            totalSteps: steps,
            peakValue,
            path: path.slice(0, 30), // first 30 points for chart
            powerScore,
            affinity
        };
    }

    /**
     * Converts a player's profile data into a deterministic Collatz numerical seed.
     * 
     * @param {string} userId - UUID or string
     * @param {string} name - Player display name
     * @param {number} level - Current player level
     * @returns {number} Deterministic integer seed
     */
    static generateSeedFromProfile(userId, name, level = 1) {
        let hash = 0;
        const str = `${userId || 'noub'}_${name || 'player'}_${level}`;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash % 997) + 27; // Clean seed between 27 and 1024
    }
}
