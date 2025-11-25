import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    university?: string;
    major?: string;
    graduation_year?: string;
    bio?: string;
    target_role?: string;
}

interface AuthState {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    loading: true,

    initialize: async () => {
        try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user ?? null;

            let profile = null;
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                profile = data;
            }

            set({ user, profile, loading: false });

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                const user = session?.user ?? null;
                let profile = null;
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    profile = data;
                }
                set({ user, profile, loading: false });
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ loading: false });
        }
    },

    signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    },

    signUp: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        if (error) throw error;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, profile: null });
    },

    updateProfile: async (updates) => {
        const { user, profile } = get();
        if (!user) throw new Error('No user logged in');

        // Ensure required fields are included
        const profileData = {
            id: user.id,
            email: user.email || profile?.email || '',
            full_name: profile?.full_name || user.user_metadata?.full_name || '',
            ...updates
        };

        const { error } = await supabase
            .from('profiles')
            .upsert(profileData);

        if (error) {
            console.error('Profile update error:', error);
            throw error;
        }

        // Update local state
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null
        }));
    },
}));
