/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/services/mintingService.js
 * Version: Noub Sports_beta 2.0.0
 * Status: Production Ready
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';

export class MintingService {

    static async mintDigitalCard(cardData) {
        if (!supabase) throw new Error("قاعدة البيانات غير متصلة.");
        const user = state.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول لسك البطاقة.");

        const payload = {
            owner_id: user.id,
            subject_id: user.id,
            display_name: cardData.name || user.username,
            activity_type: cardData.activityType || 'ACADEMY',
            position: cardData.position || 'MID',
            visual_dna: cardData.visualDna || { skin: 1, kit: '#3b82f6', hair: 1 },
            stats: cardData.stats || { rating: 65, matches: 0, goals: 0 },
            minted_by: user.id,
            serial_number: Date.now() % 100000,
            type: cardData.type || 'SPECIAL',
            is_verified: false
        };

        const { data, error } = await supabase
            .from('cards')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error("Mint Card Error:", error);
            throw error;
        }

        return data;
    }
}
