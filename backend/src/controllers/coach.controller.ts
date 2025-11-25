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

            // Fetch previous messages for context (limit to last 10 for now)
            const { data: history } = await supabase
                .from('coaching_messages')
                .select('role, content')
                .eq('session_id', id)
                .order('created_at', { ascending: true })
                .limit(10);

            const messages = history ? history.map(msg => ({ role: msg.role, content: msg.content })) : [];
            // Ensure the latest message is included if not already (it should be because we just inserted it, but race conditions might apply if we don't wait for insert to propagate or if we query before insert completes - wait, we awaited insert)
            // Actually, we just inserted it. So fetching history SHOULD include it.

            // Get AI response
            const aiResponse = await AIService.chat(messages);

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

    // Chat method that auto-creates session and saves messages
    static async chat(req: AuthRequest, res: Response) {
        try {
            const { message } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            // Check for existing active session or create one
            let { data: sessions } = await supabase
                .from('coaching_sessions')
                .select('id')
                .eq('user_id', userId)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1);

            let sessionId: string;

            if (!sessions || sessions.length === 0) {
                // Create new session
                const { data: newSession, error: createError } = await supabase
                    .from('coaching_sessions')
                    .insert([{
                        user_id: userId,
                        title: 'Career Coach Chat',
                        session_type: 'general'
                    }])
                    .select('id')
                    .single();

                if (createError || !newSession) {
                    throw new Error('Failed to create session');
                }
                sessionId = newSession.id;
            } else {
                sessionId = sessions[0].id;
            }

            // Save user message
            await supabase.from('coaching_messages').insert({
                session_id: sessionId,
                role: 'user',
                content: message
            });

            // Fetch conversation history for context
            const { data: history } = await supabase
                .from('coaching_messages')
                .select('role, content')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })
                .limit(20);

            const messages = history ? history.map(msg => ({ role: msg.role, content: msg.content })) : [];

            // Get AI response
            const aiResponse = await AIService.chat(messages);

            // Save AI response
            await supabase.from('coaching_messages').insert({
                session_id: sessionId,
                role: 'assistant',
                content: aiResponse
            });

            res.json({ response: aiResponse });
        } catch (error) {
            console.error('Error in coach chat:', error);
            res.status(500).json({ error: 'Failed to get chat response' });
        }
    }
}
