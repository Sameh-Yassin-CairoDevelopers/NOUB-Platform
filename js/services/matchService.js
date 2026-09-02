/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/services/matchService.js
 * Version: Noub Sports_beta 2.0.0 (ZONE-FILTERED ARENA)
 * Status: Production Ready
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';
import { SEED_MATCHES } from '../data/seedData.js';

export class MatchService {

    static async getMatches(zoneId = null) {
        if (!supabase) return SEED_MATCHES;
        try {
            let query = supabase
                .from('matches')
                .select(`
                    id,
                    score_a,
                    score_b,
                    status,
                    played_at,
                    zone_id,
                    team_a:team_a_id ( id, name, logo_url, color_primary ),
                    team_b:team_b_id ( id, name, logo_url, color_primary ),
                    match_players (
                        player_id,
                        goals,
                        assists,
                        is_mvp,
                        users:player_id ( username )
                    )
                `)
                .order('played_at', { ascending: false });

            if (zoneId) {
                query = query.eq('zone_id', zoneId);
            }

            const { data, error } = await query;
            if (error) {
                console.warn("Fetch Matches using fallback seed data:", error.message || error);
                return zoneId ? SEED_MATCHES.filter(m => m.zone_id === zoneId) : SEED_MATCHES;
            }

            return data && data.length > 0 ? data : SEED_MATCHES;
        } catch (err) {
            console.warn("Matches offline fallback active:", err);
            return zoneId ? SEED_MATCHES.filter(m => m.zone_id === zoneId) : SEED_MATCHES;
        }
    }

    static async submitMatchResult(matchData) {
        if (!supabase) throw new Error("قاعدة البيانات غير متصلة.");
        const user = state.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول لتسجيل المباراة.");

        const { data: match, error: matchError } = await supabase
            .from('matches')
            .insert([{
                creator_id: user.id,
                team_a_id: matchData.teamAId,
                team_b_id: matchData.teamBId,
                score_a: matchData.scoreA,
                score_b: matchData.scoreB,
                zone_id: user.zoneId || 1,
                status: 'CONFIRMED',
                played_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (matchError) throw matchError;

        if (matchData.roster && matchData.roster.length > 0) {
            const rosterPayload = matchData.roster.map(p => ({
                match_id: match.id,
                player_id: p.id,
                goals: p.goals || 0,
                assists: p.assists || 0,
                is_mvp: p.isMvp || false
            }));

            const { error: rosterError } = await supabase
                .from('match_players')
                .insert(rosterPayload);

            if (rosterError) console.error("Roster Record Error:", rosterError);
        }

        return match;
    }
}
