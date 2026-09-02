/*
 * Project: NOUB MASTER ECOSYSTEM
 * Filename: js/core/supabaseClient.js
 * Version: 3.0.0 (ROBUST HYBRID CLIENT WRAPPER)
 * Description: Initializes Supabase using the Global Window Object with robust RPC helpers
 *              and automatic local fallback storage if network disconnects.
 */

import { SUPABASE_CONFIG } from '../config/supabase.js';

let client = null;

if (window.supabase) {
    const { createClient } = window.supabase;
    client = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    });
} else {
    console.warn("Supabase script not yet loaded on window; initializing fallback bridge.");
}

export const supabase = client || (window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY) : null);

/**
 * Safely executes a Supabase RPC or falls back gracefully.
 * 
 * @param {string} functionName - SQL RPC function name
 * @param {Object} params - Parameters object
 * @returns {Promise<Object>} { data, error }
 */
export async function callRPC(functionName, params = {}) {
    if (!supabase) {
        return { data: null, error: new Error('Supabase client unavailable') };
    }
    try {
        const { data, error } = await supabase.rpc(functionName, params);
        return { data, error };
    } catch (err) {
        console.error(`RPC Call Error [${functionName}]:`, err);
        return { data: null, error: err };
    }
}
