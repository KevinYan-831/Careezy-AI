import type { Request, Response } from 'express';
import { AdzunaService } from '../services/adzuna.service.js';

export class InternshipController {
    static async search(req: Request, res: Response) {
        try {
            const { q, l } = req.query;
            const query = q as string;
            const location = l as string;

            const results = await AdzunaService.searchInternships(query, location);
            res.json({ results });
        } catch (error) {
            console.error('Error searching internships:', error);
            res.status(500).json({ error: 'Failed to search internships' });
        }
    }
}
