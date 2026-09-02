/*
 * Filename: js/services/realtime.js
 * Description: Listens to Supabase database changes in realtime.
 */

import { supabase } from '../core/supabaseClient.js';
import { NotificationService } from './notificationService.js';

export class RealtimeService {
    static initSubscriptions() {
        if (!supabase) return;

        try {
            supabase
                .channel('emergency_feed')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emergency_alerts' }, payload => {
                    console.log("🚨 Realtime Emergency Alert:", payload.new);
                    NotificationService.showToast(`إشارة طوارئ جديدة في منطقتك!`, 'warning');
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log("Realtime emergency feed connected.");
                    }
                });

            supabase
                .channel('matches_feed')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, payload => {
                    console.log("⚽ Realtime Match Finished:", payload.new);
                    NotificationService.showToast("تم تسجيل مباراة جديدة في الساحة!", 'info');
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log("Realtime matches feed connected.");
                    }
                });
        } catch (err) {
            console.warn("Realtime subscription bypassed:", err);
        }
    }
}
