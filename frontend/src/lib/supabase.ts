import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)');
        }
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            }
        });
    }
    return supabaseClient;
}

export const supabase = {
    get client() {
        return getSupabaseClient();
    },
    get isConfigured() {
        return !!(supabaseUrl && supabaseAnonKey);
    }
};
