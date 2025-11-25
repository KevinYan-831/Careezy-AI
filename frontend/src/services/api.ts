
const API_URL = 'http://localhost:3001/api';

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

export const api = {
    resumes: {
        create: async (data: ResumeData) => {
            const response = await fetch(`${API_URL}/resumes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth header here if needed
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create resume');
            return response.json();
        },
        getSuggestions: async (resumeContent: string) => {
            const response = await fetch(`${API_URL}/resumes/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeContent }),
            });
            if (!response.ok) throw new Error('Failed to get suggestions');
            return response.json();
        },
    },
    internships: {
        search: async (query: string, location: string) => {
            const response = await fetch(`${API_URL}/internships/search?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`);
            if (!response.ok) throw new Error('Failed to search internships');
            return response.json();
        },
    },
    coach: {
        chat: async (message: string) => {
            const response = await fetch(`${API_URL}/coach/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });
            if (!response.ok) throw new Error('Failed to create checkout session');
            return response.json();
        },
    },
};
