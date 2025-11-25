import type { Response } from 'express';
import { AIService } from '../services/ai.service.js';
import { supabase } from '../config/supabase.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

export class CoachController {
    static async createSession(req: AuthRequest, res: Response) {
        try {
            const { title, session_type } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { data, error } = await supabase
                .from('coaching_sessions')
                .insert([{ user_id: userId, title, session_type }])
                .select()
                .single();

            if (error) throw error;
            res.status(201).json(data);
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Failed to create session' });
        }
    }

    static async getSessions(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabase
                .from('coaching_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ error: 'Failed to fetch sessions' });
        }
    }

    static async getSession(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const { data, error } = await supabase
                .from('coaching_sessions')
                .select('*, messages:coaching_messages(*)')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            if (!data) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }
            res.json(data);
        } catch (error) {
            console.error('Error fetching session:', error);
            res.status(500).json({ error: 'Failed to fetch session' });
        }
    }

    static async deleteSession(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const { error } = await supabase
                .from('coaching_sessions')
                .update({ is_active: false })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            res.json({ message: 'Session archived successfully' });
        } catch (error) {
            console.error('Error deleting session:', error);
            res.status(500).json({ error: 'Failed to delete session' });
        }
    }

    static async sendMessage(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params; // Session ID
            const { message } = req.body;
            const userId = req.user?.id;

            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            // Verify session ownership
            const { data: session, error: sessionError } = await supabase
                .from('coaching_sessions')
                .select('id')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (sessionError || !session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            // Save user message
            await supabase.from('coaching_messages').insert({
                session_id: id,
                role: 'user',
                content: message
            });

            // Get AI response
            const aiResponse = await AIService.chat(message);

            // Save AI response
            await supabase.from('coaching_messages').insert({
                session_id: id,
                role: 'assistant',
                content: aiResponse
            });

            res.json({ response: aiResponse });
        } catch (error) {
            console.error('Error in coach chat:', error);
            res.status(500).json({ error: 'Failed to get chat response' });
        }
    }

    // Legacy chat method for backward compatibility if needed, or remove it
    static async chat(req: AuthRequest, res: Response) {
        // Redirect to sendMessage logic or keep simple stateless chat
        // For now, let's keep it simple stateless as before but using AuthRequest
        try {
            const { message } = req.body;
            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            const response = await AIService.chat(message);
            res.json({ response });
        } catch (error) {
            console.error('Error in coach chat:', error);
            res.status(500).json({ error: 'Failed to get chat response' });
        }
    }
}
