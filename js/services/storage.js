/*
 * Filename: js/services/storage.js
 * Description: Handles Supabase Storage uploads.
 */

import { supabase } from '../core/supabaseClient.js';

export class StorageService {
    static async uploadAvatar(file, userId) {
        if (!supabase) return null;
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}_${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('noub_media')
            .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from('noub_media')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
}
