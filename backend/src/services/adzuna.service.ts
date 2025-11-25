import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

export class AdzunaService {
    static async searchInternships(query: string, location: string, country: string = 'us') {
        if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
            console.error('Adzuna credentials missing in .env');
            throw new Error('Adzuna credentials missing');
        }

        console.log(`Searching Adzuna: query="${query}", location="${location}", country="${country}"`);
        console.log(`Using App ID: ${ADZUNA_APP_ID.substring(0, 4)}...`);

        try {
            // Clean up location for API (remove spaces if needed or use as-is)
            const cleanLocation = location.trim() || 'US';

            const response = await axios.get(`${BASE_URL}/${country}/search/1`, {
                params: {
                    app_id: ADZUNA_APP_ID,
                    app_key: ADZUNA_API_KEY,
                    what: query || 'internship',
                    where: cleanLocation,
                    results_per_page: 20,
                    // Don't include content_type in params, set it in headers instead
                },
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });

            console.log(`Adzuna API Response: Found ${response.data.results?.length} results`);
            return response.data.results;
        } catch (error: any) {
            if (error.response) {
                console.error('Adzuna API Error Data:', JSON.stringify(error.response.data, null, 2));
                console.error('Adzuna API Error Status:', error.response.status);
            } else {
                console.error('Adzuna API Error:', error.message);
            }
            throw new Error('Failed to fetch internships');
        }
    }
}
