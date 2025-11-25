import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!supabaseClient) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase URL or Key. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
        }

        supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseClient;
}

export const supabase = {
    get client() {
        return getSupabase();
    }
};
