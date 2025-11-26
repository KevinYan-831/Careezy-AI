import { getSupabaseClient } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : '/api';

interface ResumeData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
}

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
    try {
        const supabase = getSupabaseClient();
        
        // First try getSession (cached)
        let { data: { session }, error } = await supabase.auth.getSession();
        
        // If no session, try to refresh from storage
        if (!session && !error) {
            console.log('Auth: No cached session, checking for stored session...');
            const { data } = await supabase.auth.refreshSession();
            session = data.session;
        }
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (error) {
            console.error('Auth: Error getting session:', error.message);
            return headers;
        }

        if (session?.access_token) {
            console.log('Auth: Token found, user:', session.user?.email);
            headers['Authorization'] = `Bearer ${session.access_token}`;
        } else {
            console.warn('Auth: No active session found');
            // Check localStorage directly as fallback
            const storageKey = 'sb-sprnnfloasrxygjvixcl-auth-token';
            const storedSession = localStorage.getItem(storageKey);
            console.log('Auth: LocalStorage has token:', !!storedSession);
        }

        return headers;
    } catch (err: any) {
        console.error('Auth: Error in getAuthHeaders:', err?.message || err);
        return { 'Content-Type': 'application/json' };
    }
}

export const api = {
    resumes: {
        create: async (data: ResumeData) => {
            const response = await fetch(`${API_URL}/resumes`, {
                method: 'POST',
                headers: await getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create resume');
            return response.json();
        },
        update: async (id: string, data: ResumeData) => {
            const response = await fetch(`${API_URL}/resumes/${id}`, {
                method: 'PUT',
                headers: await getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update resume');
            return response.json();
        },
        get: async (id: string) => {
            const response = await fetch(`${API_URL}/resumes/${id}`, {
                headers: await getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch resume');
            return response.json();
        },
        getSuggestions: async (resumeContent: string) => {
            const response = await fetch(`${API_URL}/resumes/suggestions`, {
                method: 'POST',
                headers: await getAuthHeaders(),
                body: JSON.stringify({ resumeContent }),
            });
            if (!response.ok) throw new Error('Failed to get suggestions');
            return response.json();
        },
    },
    internships: {
        search: async (query: string, location: string) => {
            const response = await fetch(`${API_URL}/internships/search?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`, {
                headers: await getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to search internships');
            return response.json();
        },
    },
    coach: {
        chat: async (message: string) => {
            const response = await fetch(`${API_URL}/coach/chat`, {
                method: 'POST',
                headers: await getAuthHeaders(),
                body: JSON.stringify({ message }),
            });
            if (!response.ok) throw new Error('Failed to get chat response');
            return response.json();
        },
    },
    payments: {
        createCheckoutSession: async (priceId: string) => {
            const response = await fetch(`${API_URL}/payments/create-checkout-session`, {
                method: 'POST',
                headers: await getAuthHeaders(),
                body: JSON.stringify({ priceId }),
            });
            if (!response.ok) throw new Error('Failed to create checkout session');
            return response.json();
        },
    },
};
