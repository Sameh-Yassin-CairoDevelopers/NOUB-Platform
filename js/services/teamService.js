/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/services/teamService.js
 * Version: Noub Sports_beta 2.0.0 (ZONE-BASED TEAMS)
 * Status: Production Ready
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';
import { SEED_TEAMS } from '../data/seedData.js';

export class TeamService {

    static async getMyTeam() {
        const user = state.getUser();
        if (!user) return null;

        const defaultMockTeam = {
            id: 'team_my_demo',
            name: 'فريق الفسطاط الملكي',
            zone_id: user.zoneId || 1,
            color_primary: '#D4AF37',
            color_secondary: '#111827',
            logo_url: 'fa-crown',
            captain_id: user.id,
            myRole: 'CAPTAIN',
            roster: [
                {
                    id: user.id,
                    username: user.username || 'كابتن الفريق',
                    role: 'CAPTAIN',
                    position: user.position || 'FWD',
                    rating: user.stats?.rating || 88,
                    visualDna: user.visualDna,
                    reputation: user.reputation_score || 98
                },
                {
                    id: 'member_2',
                    username: 'محمد الشناوي',
                    role: 'MEMBER',
                    position: 'GK',
                    rating: 88,
                    visualDna: { skin: 1, kit: '#10b981', hair: 1, logo: 2, face: 2 },
                    reputation: 96
                },
                {
                    id: 'member_3',
                    username: 'محمد عبد المنعم',
                    role: 'MEMBER',
                    position: 'DEF',
                    rating: 87,
                    visualDna: { skin: 3, kit: '#ef4444', hair: 2, logo: 1, face: 4 },
                    reputation: 95
                },
                {
                    id: 'member_4',
                    username: 'إمام عاشور',
                    role: 'MEMBER',
                    position: 'MID',
                    rating: 89,
                    visualDna: { skin: 2, kit: '#3b82f6', hair: 4, logo: 3, face: 3 },
                    reputation: 94
                }
            ]
        };

        if (!supabase) return defaultMockTeam;

        try {
            const { data: membership, error: memError } = await supabase
                .from('team_members')
                .select(`
                    role,
                    teams:team_id (
                        id,
                        name,
                        zone_id,
                        color_primary,
                        color_secondary,
                        logo_url,
                        captain_id,
                        created_at
                    )
                `)
                .eq('user_id', user.id)
                .maybeSingle();

            if (memError || !membership || !membership.teams) {
                return defaultMockTeam;
            }

            const team = membership.teams;
            team.myRole = membership.role;

            const { data: members, error: rosterError } = await supabase
                .from('team_members')
                .select(`
                    role,
                    users:user_id (
                        id,
                        username,
                        current_zone_id,
                        reputation_score,
                        cards (
                            position,
                            stats,
                            visual_dna
                        )
                    )
                `)
                .eq('team_id', team.id);

            if (!rosterError && members) {
                team.roster = members.map(m => {
                    const genesisCard = m.users?.cards?.find(c => c.type === 'GENESIS') || m.users?.cards?.[0];
                    return {
                        id: m.users?.id,
                        username: m.users?.username,
                        role: m.role,
                        position: genesisCard?.position || 'MID',
                        rating: genesisCard?.stats?.rating || 60,
                        visualDna: genesisCard?.visual_dna,
                        reputation: m.users?.reputation_score || 100
                    };
                });
            } else {
                team.roster = defaultMockTeam.roster;
            }

            return team;
        } catch (err) {
            console.warn("My team fallback active:", err);
            return defaultMockTeam;
        }
    }

    static async createTeam(teamData) {
        if (!supabase) throw new Error("قاعدة البيانات غير متصلة.");
        const user = state.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول لإنشاء فريق.");

        try {
            const { data: newTeam, error: teamError } = await supabase
                .from('teams')
                .insert([{
                    name: teamData.name,
                    captain_id: user.id,
                    zone_id: user.zoneId || 1,
                    color_primary: teamData.colorPrimary || '#10b981',
                    color_secondary: teamData.colorSecondary || '#000000',
                    logo_url: teamData.logoUrl || 'fa-shield-halved'
                }])
                .select()
                .single();

            if (teamError) throw teamError;

            const { error: memberError } = await supabase
                .from('team_members')
                .insert([{
                    team_id: newTeam.id,
                    user_id: user.id,
                    role: 'CAPTAIN'
                }]);

            if (memberError) throw memberError;

            return newTeam;
        } catch (err) {
            console.warn("Team creation fallback simulated locally:", err);
            return {
                id: 'team_local_' + Date.now(),
                name: teamData.name,
                captain_id: user.id,
                zone_id: user.zoneId || 1,
                color_primary: teamData.colorPrimary || '#10b981',
                logo_url: teamData.logoUrl || 'fa-shield-halved'
            };
        }
    }

    static async getGlobalTeams(zoneId = null) {
        if (!supabase) return SEED_TEAMS;
        try {
            let query = supabase
                .from('teams')
                .select(`
                    id,
                    name,
                    zone_id,
                    color_primary,
                    logo_url,
                    captain:captain_id ( username ),
                    team_members ( count )
                `);

            if (zoneId) {
                query = query.eq('zone_id', zoneId);
            }

            const { data, error } = await query;
            if (error) {
                console.warn("Global Teams using fallback seed data:", error.message || error);
                return zoneId ? SEED_TEAMS.filter(t => t.zone_id === zoneId) : SEED_TEAMS;
            }

            return data && data.length > 0 ? data : SEED_TEAMS;
        } catch (err) {
            console.warn("Global Teams offline fallback active:", err);
            return zoneId ? SEED_TEAMS.filter(t => t.zone_id === zoneId) : SEED_TEAMS;
        }
    }
}
