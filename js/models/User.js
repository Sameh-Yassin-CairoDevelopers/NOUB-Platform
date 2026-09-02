/*
 * Filename: js/models/User.js
 * Description: Data model representing a Player/User entity.
 */

export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.username = data.username || 'Unknown';
        this.role = data.role || 'FAN';
        this.zoneId = data.current_zone_id || 0;
        this.balance = data.wallet_balance || 0;
        this.telegramId = data.telegram_id || null;
        this.position = data.position || 'FAN';
        this.visualDna = data.visual_dna || data.visualDna || { skin: 1, kit: '#3b82f6', hair: 1 };
        this.stats = data.stats || { matches: 0, goals: 0, rating: 60 };
        this.reputation = data.reputation_score || 100;
    }

    get isPlayer() {
        return this.role !== 'FAN' && this.role !== 'INACTIVE';
    }
}
