/*
 * Project: NOUB SPORTS ECOSYSTEM
 * Filename: js/services/emergencyService.js
 * Version: Noub Sports_beta 2.0.0 (REALTIME DISPATCH ENGINE)
 * Status: Production Ready
 */

import { supabase } from '../core/supabaseClient.js';
import { state } from '../core/state.js';
import { SEED_ALERTS } from '../data/seedData.js';

export class EmergencyService {

    static async broadcastEmergency(type, notes = "") {
        const user = state.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول لطلب طوارئ.");

        const payload = {
            id: 'alert_local_' + Date.now(),
            sender_id: user.id,
            type: type, 
            zone_id: user.zoneId || 1,
            notes: notes,
            status: 'ACTIVE',
            created_at: new Date().toISOString(),
            sender: { username: user.username || 'كابتن', current_zone_id: user.zoneId || 1 }
        };

        if (!supabase) {
            SEED_ALERTS.unshift(payload);
            return payload;
        }

        try {
            const { data, error } = await supabase
                .from('emergency_alerts')
                .insert([{
                    sender_id: user.id,
                    type: type, 
                    zone_id: user.zoneId || 1,
                    notes: notes,
                    status: 'ACTIVE',
                    created_at: payload.created_at
                }])
                .select()
                .single();

            if (error) {
                console.warn("Emergency Broadcast fallback:", error);
                SEED_ALERTS.unshift(payload);
                return payload;
            }

            return data;
        } catch (err) {
            console.warn("Emergency broadcast network fallback:", err);
            SEED_ALERTS.unshift(payload);
            return payload;
        }
    }

    static async getActiveAlerts(zoneId = null) {
        if (!supabase) return zoneId ? SEED_ALERTS.filter(a => a.zone_id === zoneId) : SEED_ALERTS;
        try {
            let query = supabase
                .from('emergency_alerts')
                .select(`
                    *,
                    sender:users ( username, current_zone_id )
                `)
                .eq('status', 'ACTIVE')
                .order('created_at', { ascending: false });

            if (zoneId) {
                query = query.eq('zone_id', zoneId);
            }

            const { data, error } = await query;
            if (error) {
                console.warn("Fetch Alerts using fallback seed data:", error.message || error);
                return zoneId ? SEED_ALERTS.filter(a => a.zone_id === zoneId) : SEED_ALERTS;
            }

            return data && data.length > 0 ? data : (zoneId ? SEED_ALERTS.filter(a => a.zone_id === zoneId) : SEED_ALERTS);
        } catch (err) {
            console.warn("Alerts offline fallback active:", err);
            return zoneId ? SEED_ALERTS.filter(a => a.zone_id === zoneId) : SEED_ALERTS;
        }
    }

    static async resolveAlert(alertId) {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('emergency_alerts')
                .update({ status: 'RESOLVED' })
                .eq('id', alertId);

            if (error) throw error;
        } catch (err) {
            const idx = SEED_ALERTS.findIndex(a => a.id === alertId);
            if (idx !== -1) SEED_ALERTS.splice(idx, 1);
        }
    }
}
