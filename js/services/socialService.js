/*
 * Filename: js/services/socialService.js
 * Description: Handles user interactions, following, reputation endorsements.
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';

export class SocialService {
    static async endorsePlayer(targetUserId) {
        if (!supabase) return;
        const user = state.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول للإشادة باللاعب.");

        const { error } = await supabase
            .from('endorsements')
            .insert([{
                giver_id: user.id,
                receiver_id: targetUserId,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error("Endorsement error:", error);
            throw error;
        }
    }
}
