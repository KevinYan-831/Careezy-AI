import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

export class AdzunaService {
    static async searchInternships(query: string, location: string, country: string = 'us') {
        if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
            throw new Error('Adzuna credentials missing');
        }

        try {
            const response = await axios.get(`${BASE_URL}/${country}/search/1`, {
                params: {
                    app_id: ADZUNA_APP_ID,
                    app_key: ADZUNA_API_KEY,
                    what: query || 'internship',
                    where: location,
                    content_type: 'application/json',
                },
            });

            return response.data.results;
        } catch (error) {
            console.error('Adzuna API Error:', error);
            throw new Error('Failed to fetch internships');
        }
    }
}
