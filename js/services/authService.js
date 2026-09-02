/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/services/authService.js
 * Version: 3.0.0 (CENTRAL AUTH & PROFILE ENGINE)
 * Description: Unified profile synchronization, starter 10,000 NOUB balance grant,
 *              XP/level computation, and fallback guest session manager.
 */

import { supabase, callRPC } from '../core/supabaseClient.js';
import { state } from '../core/state.js';

export class AuthService {
    /**
     * Checks existing authenticated user session from Supabase or local cache.
     * @returns {Promise<Object|null>} User Profile
     */
    async checkUser() {
        // 1. Check Supabase Auth
        if (supabase) {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session && session.user) {
                    return await this.fetchOrCreateProfile(session.user);
                }
            } catch (err) {
                console.warn("Supabase session check error:", err);
            }
        }

        // 2. Check Local Stored User
        const localUser = state.data.user;
        if (localUser && localUser.id) {
            return localUser;
        }

        return null;
    }

    /**
     * Fetches existing profile or bootstraps initial 10,000 gold profile in Supabase.
     * @param {Object} authUser 
     * @returns {Promise<Object>}
     */
    async fetchOrCreateProfile(authUser) {
        if (!supabase) return this.generateFallbackProfile(authUser.id, authUser.email);

        try {
            // Fetch profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile && !error) {
                return profile;
            }

            // Create initial profile with starter 10,000 Gold
            const newProfile = {
                id: authUser.id,
                full_name: authUser.user_metadata?.full_name || 'بطل نوب الذهبي',
                gold_balance: 10000,
                level: 1,
                xp: 0,
                reputation_score: 100,
                created_at: new Date().toISOString()
            };

            const { data: inserted, error: insertError } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select()
                .single();

            return inserted || newProfile;
        } catch (e) {
            console.warn("Profile fetch/create fallback:", e);
            return this.generateFallbackProfile(authUser.id, authUser.email);
        }
    }

    /**
     * Registers a guest or instant player with 10,000 Starter Gold.
     * @param {string} fullName 
     * @param {string} zoneId 
     * @param {Object} cardData 
     * @returns {Promise<Object>}
     */
    async registerInstantPlayer(fullName, zoneId = 'fustat_maadi', cardData = {}) {
        const guestId = 'noub_usr_' + Math.random().toString(36).substring(2, 11);
        const profile = {
            id: guestId,
            full_name: fullName || 'فارس نوب الموحد',
            phone_number: '010' + Math.floor(10000000 + Math.random() * 90000000),
            gold_balance: 10000,
            level: 1,
            xp: 250,
            reputation_score: 100,
            zone_id: zoneId,
            created_at: new Date().toISOString()
        };

        state.setUser(profile);

        // Attempt Supabase insert
        if (supabase) {
            try {
                await supabase.from('profiles').upsert([profile]);
            } catch (err) {
                console.warn("Silent profile sync error:", err);
            }
        }

        return profile;
    }

    /**
     * Fallback profile generator.
     */
    generateFallbackProfile(id, email) {
        return {
            id: id || 'local_guest',
            full_name: 'فارس نوب',
            gold_balance: 10000,
            level: 1,
            xp: 150,
            reputation_score: 100,
            email: email || 'guest@noub.app'
        };
    }

    /**
     * Logs out the user.
     */
    async logout() {
        if (supabase) {
            try {
                await supabase.auth.signOut();
            } catch (e) {
                console.warn("Supabase signOut error:", e);
            }
        }
        localStorage.removeItem('NOUB_MASTER_STATE');
        state.setUser(null);
        window.location.reload();
    }
}
