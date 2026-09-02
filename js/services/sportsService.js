/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/services/sportsService.js
 * Version: 3.0.0 (SPORTS ECOSYSTEM SERVICE)
 * Description: Data access and logic for Player Cards, Tactical Formations,
 *              Live Matches, Emergency Callouts, and Ramadan Tournaments.
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';

export class SportsService {
    /**
     * Fetches or builds the default sports card for the current player.
     */
    static async getPlayerCard(userId) {
        if (state.data.sports.card) return state.data.sports.card;

        if (supabase && userId) {
            try {
                const { data, error } = await supabase
                    .from('cards')
                    .select('*')
                    .eq('owner_id', userId)
                    .single();
                if (data && !error) {
                    state.setSportsCard(data);
                    return data;
                }
            } catch (err) {
                console.warn("Card fetch fallback:", err);
            }
        }

        // Default initial card
        const defaultCard = {
            id: 'card_' + Math.random().toString(36).substr(2, 6),
            owner_id: userId || 'local_user',
            player_name: state.data.user?.full_name || 'كابتن نوب',
            primary_position: 'CM',
            overall_rating: 84,
            speed: 86,
            shooting: 82,
            passing: 88,
            dribbling: 85,
            defending: 78,
            physicality: 80,
            visual_dna: {
                kit: '#D4AF37',
                logo: 1,
                face: 1,
                hair: 1,
                skin: 2
            },
            matches_played: 14,
            goals_scored: 9,
            assists: 12,
            man_of_match_count: 3
        };

        state.setSportsCard(defaultCard);
        return defaultCard;
    }

    /**
     * Saves or updates a player's sports card.
     */
    static async savePlayerCard(cardData) {
        state.setSportsCard(cardData);
        if (supabase && cardData.owner_id) {
            try {
                await supabase.from('cards').upsert([cardData]);
            } catch (err) {
                console.warn("Card persist error:", err);
            }
        }
        return cardData;
    }

    /**
     * Fetches active emergency callouts.
     */
    static async getActiveEmergencies() {
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('emergency_alerts')
                    .select('*')
                    .eq('status', 'ACTIVE')
                    .order('created_at', { ascending: false });
                if (data && !error && data.length > 0) {
                    state.setEmergencies(data);
                    return data;
                }
            } catch (e) {
                console.warn("Emergencies fetch fallback:", e);
            }
        }

        // High-fidelity initial emergencies
        const mockEmergencies = [
            {
                id: 'emg_1',
                title: 'مطلوب حارس مرمى فوراً (ناقص لاعب)',
                stadium_name: 'ملعب النجوم - الفسطاط',
                zone_name: 'الفسطاط والمعادي',
                missing_role: 'GK',
                match_time: 'الليلة 09:30 م',
                reward_gold: 500,
                status: 'ACTIVE',
                contact_phone: '01012345678',
                created_at: new Date().toISOString()
            },
            {
                id: 'emg_2',
                title: 'مباراة خماسي حاسمة - مطلوب مدافع صلب',
                stadium_name: 'نادي الشمس - مصر الجديدة',
                zone_name: 'مدينة نصر ومصر الجديدة',
                missing_role: 'CB',
                match_time: 'الليلة 11:00 م',
                reward_gold: 400,
                status: 'ACTIVE',
                contact_phone: '01198765432',
                created_at: new Date().toISOString()
            }
        ];
        state.setEmergencies(mockEmergencies);
        return mockEmergencies;
    }

    /**
     * Broadcasts a new emergency callout.
     */
    static async broadcastEmergency(alertData) {
        const newAlert = {
            id: 'emg_' + Date.now(),
            ...alertData,
            status: 'ACTIVE',
            created_at: new Date().toISOString()
        };

        const list = [newAlert, ...(state.data.sports.emergencies || [])];
        state.setEmergencies(list);

        if (supabase) {
            try {
                await supabase.from('emergency_alerts').insert([newAlert]);
            } catch (e) {
                console.warn("Emergency insert error:", e);
            }
        }

        state.addNotification({
            title: '🚨 إشارة طوارئ جديدة',
            message: `تم بث نداء: ${newAlert.title} في ${newAlert.stadium_name}`,
            type: 'alert'
        });

        return newAlert;
    }
}
