import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!supabaseClient) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        console.log('Supabase Init: URL exists:', !!supabaseUrl);
        console.log('Supabase Init: Service Key exists:', !!supabaseKey);
        if (supabaseUrl) {
            console.log('Supabase Init: URL value:', supabaseUrl.substring(0, 30) + '...');
        }

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase Init: MISSING CREDENTIALS - Check that SUPABASE_URL and SUPABASE_SERVICE_KEY secrets are set');
            throw new Error('Missing Supabase URL or Key. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
        }

        supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase Init: Client created successfully');
    }
    return supabaseClient;
}

export const supabase = {
    get client() {
        return getSupabase();
    }
};
