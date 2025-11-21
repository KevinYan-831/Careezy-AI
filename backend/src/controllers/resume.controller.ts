import type { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

export class ResumeController {
  static async create(req: AuthRequest, res: Response) {
    try {
      // Placeholder for resume creation logic
      // 1. Validate input
      // 2. Save to database (Supabase)
      // 3. Return created resume
      res.status(201).json({ message: 'Resume created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create resume' });
    }
  }

  static async getSuggestions(req: AuthRequest, res: Response) {
    try {
      const { resumeContent } = req.body;
      if (!resumeContent) {
        res.status(400).json({ error: 'Resume content is required' });
        return;
      }

      const suggestions = await AIService.generateResumeSuggestions(resumeContent);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  }
}
