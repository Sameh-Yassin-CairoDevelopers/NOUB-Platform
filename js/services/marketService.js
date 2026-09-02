/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/services/marketService.js
 * Version: Noub Sports_beta 2.0.0 (ADVANCED MULTI-FILTER SCOUT)
 * Status: Production Ready
 */

import { supabase } from '../core/supabaseClient.js';
import { PlayerCard } from '../models/PlayerCard.js';
import { SEED_PLAYERS } from '../data/seedData.js';

export class MarketService {

    static async getGlobalMarket(filters = {}) {
        const getFallbackPlayers = () => {
            let res = [...SEED_PLAYERS];
            if (filters.position && filters.position !== 'ALL') {
                res = res.filter(p => p.position === filters.position);
            }
            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase();
                res = res.filter(p => p.display_name.toLowerCase().includes(q) || p.users?.username.toLowerCase().includes(q));
            }
            return res.map(card => {
                const playerCard = new PlayerCard(card);
                playerCard.ownerName = card.users?.username || 'Unknown';
                playerCard.zoneId = card.users?.current_zone_id || 1;
                playerCard.reputation = card.users?.reputation_score || 100;
                return playerCard;
            });
        };

        if (!supabase) return getFallbackPlayers();

        try {
            let query = supabase
                .from('cards')
                .select(`
                    id,
                    owner_id,
                    display_name,
                    position,
                    activity_type,
                    stats,
                    visual_dna,
                    is_verified,
                    created_at,
                    users:owner_id (
                        username,
                        current_zone_id,
                        reputation_score
                    )
                `)
                .eq('type', 'GENESIS');

            if (filters.position && filters.position !== 'ALL') {
                query = query.eq('position', filters.position);
            }

            if (filters.zoneId) {
                query = query.eq('users.current_zone_id', filters.zoneId);
            }

            if (filters.searchQuery) {
                query = query.ilike('display_name', `%${filters.searchQuery}%`);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                console.warn("Market Fetch using fallback seed data:", error.message || error);
                return getFallbackPlayers();
            }

            if (!data || data.length === 0) {
                return getFallbackPlayers();
            }

            return data.map(card => {
                const playerCard = new PlayerCard(card);
                playerCard.ownerName = card.users?.username || 'Unknown';
                playerCard.zoneId = card.users?.current_zone_id || 1;
                playerCard.reputation = card.users?.reputation_score || 100;
                return playerCard;
            });
        } catch (err) {
            console.warn("Market offline fallback active:", err);
            return getFallbackPlayers();
        }
    }

    static async getTrendingTalents() {
        if (!supabase) return SEED_PLAYERS.slice(0, 5).map(c => new PlayerCard(c));
        try {
            const { data, error } = await supabase
                .from('cards')
                .select('id, display_name, position, stats, visual_dna')
                .eq('type', 'GENESIS')
                .limit(10);

            if (error || !data || data.length === 0) {
                return SEED_PLAYERS.slice(0, 5).map(c => new PlayerCard(c));
            }

            return data.map(c => new PlayerCard(c));
        } catch (err) {
            return SEED_PLAYERS.slice(0, 5).map(c => new PlayerCard(c));
        }
    }
}
