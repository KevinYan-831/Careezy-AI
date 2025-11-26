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
    const { data: { session } } = await getSupabaseClient().auth.getSession();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
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
