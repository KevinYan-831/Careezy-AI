import type { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

import { supabase } from '../config/supabase.js';

export class ResumeController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { fullName, title, email, phone, location, summary, experience, education, skills } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Generate a title for the resume (required field)
      const resumeTitle = title || `${fullName}'s Resume` || 'Untitled Resume';

      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            user_id: userId,
            title: resumeTitle,
            content: { fullName, title, email, phone, location, summary, experience, education, skills }
          }
        ])
        .select();

      if (error) throw error;

      res.status(201).json({ message: 'Resume created successfully', resume: data[0] });
    } catch (error) {
      console.error('Error creating resume:', error);
      res.status(500).json({ error: 'Failed to create resume' });
    }
  }

  static async getTemplates(req: AuthRequest, res: Response) {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  }

  static async getResume(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: 'Resume not found' });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ error: 'Failed to fetch resume' });
    }
  }

  static async updateResume(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const resumeData = req.body;

      // Wrap the resume data in a content field for storage
      const { data, error } = await supabase
        .from('resumes')
        .update({ content: resumeData })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating resume:', error);
      res.status(500).json({ error: 'Failed to update resume' });
    }
  }

  static async deleteResume(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ error: 'Failed to delete resume' });
    }
  }

  static async downloadPDF(req: AuthRequest, res: Response) {
    try {
      // Placeholder for PDF generation
      // In a real app, we'd use puppeteer or a PDF library here
      res.status(501).json({ error: 'Not implemented yet' });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({ error: 'Failed to download PDF' });
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
      console.error('Error getting suggestions:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  }
}
