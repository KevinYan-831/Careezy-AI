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

            // Verify session ownership and get context summary
            const { data: session, error: sessionError } = await supabase
                .from('coaching_sessions')
                .select('id, context_summary, message_count')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (sessionError || !session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            // Fetch recent messages for context (last 15 messages)
            const { data: recentMessages } = await supabase
                .from('coaching_messages')
                .select('role, content')
                .eq('session_id', id)
                .order('created_at', { ascending: true })
                .limit(15);

            // Build context: use summary + recent messages
            const messages: Array<{ role: string; content: string }> = [];

            // Add context summary as system message if it exists
            if (session.context_summary) {
                messages.push({
                    role: 'system',
                    content: `Previous conversation context: ${session.context_summary}`
                });
            }

            // Add recent messages
            if (recentMessages && recentMessages.length > 0) {
                messages.push(...recentMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })));
            }

            // Add current user message
            messages.push({ role: 'user', content: message });

            // Get AI response
            const aiResponse = await AIService.chat(messages);

            // Save both messages in a single transaction-like operation
            await supabase.from('coaching_messages').insert([
                {
                    session_id: id,
                    role: 'user',
                    content: message
                },
                {
                    session_id: id,
                    role: 'assistant',
                    content: aiResponse
                }
            ]);

            // Update message count
            await supabase
                .from('coaching_sessions')
                .update({
                    message_count: (session.message_count || 0) + 2,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            // Every 20 messages, update the context summary
            if ((session.message_count || 0) % 20 === 0 && session.id) {
                await CoachController.updateContextSummary(session.id, messages);
            }

            res.json({ response: aiResponse });
        } catch (error) {
            console.error('Error in coach chat:', error);
            res.status(500).json({ error: 'Failed to get chat response' });
        }
    }

    // Helper method to generate and update context summary
    private static async updateContextSummary(sessionId: string, messages: Array<{ role: string; content: string }>) {
        try {
            const summaryPrompt = [
                {
                    role: 'system',
                    content: 'Summarize the key points and context from this career coaching conversation in 2-3 sentences. Focus on the user\'s goals, challenges, and main advice given.'
                },
                ...messages
            ];

            const summary = await AIService.chat(summaryPrompt);

            await supabase
                .from('coaching_sessions')
                .update({ context_summary: summary })
                .eq('id', sessionId);
        } catch (error) {
            console.error('Error updating context summary:', error);
            // Don't throw - this is a non-critical operation
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
                .select('id, context_summary, message_count')
                .eq('user_id', userId)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1);

            let sessionId: string;
            let contextSummary: string | null = null;
            let messageCount = 0;

            if (!sessions || sessions?.length === 0) {
                // Create new session
                const { data: newSession, error: createError } = await supabase
                    .from('coaching_sessions')
                    .insert([{
                        user_id: userId,
                        title: 'Career Coach Chat',
                        session_type: 'general',
                        message_count: 0
                    }])
                    .select('id, context_summary, message_count')
                    .single();

                if (createError || !newSession) {
                    throw new Error('Failed to create session');
                }
                sessionId = newSession.id;
                contextSummary = newSession.context_summary;
                messageCount = newSession.message_count || 0;
            } else {
                sessionId = sessions[0]!.id;
                contextSummary = sessions[0]!.context_summary;
                messageCount = sessions[0]!.message_count || 0;
            }

            // Fetch recent messages for context (last 15 messages)
            const { data: recentMessages } = await supabase
                .from('coaching_messages')
                .select('role, content')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })
                .limit(15);

            // Build context: use summary + recent messages
            const messages: Array<{ role: string; content: string }> = [];

            // Add context summary as system message if it exists
            if (contextSummary) {
                messages.push({
                    role: 'system',
                    content: `Previous conversation context: ${contextSummary}`
                });
            }

            // Add recent messages
            if (recentMessages && recentMessages.length > 0) {
                messages.push(...recentMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })));
            }

            // Add current user message
            messages.push({ role: 'user', content: message });

            // Get AI response
            const aiResponse = await AIService.chat(messages);

            // Save both messages
            await supabase.from('coaching_messages').insert([
                {
                    session_id: sessionId,
                    role: 'user',
                    content: message
                },
                {
                    session_id: sessionId,
                    role: 'assistant',
                    content: aiResponse
                }
            ]);

            // Update message count
            await supabase
                .from('coaching_sessions')
                .update({
                    message_count: messageCount + 2,
                    updated_at: new Date().toISOString()
                })
                .eq('id', sessionId);

            // Every 20 messages, update the context summary
            if (messageCount % 20 === 0 && messageCount > 0) {
                await CoachController.updateContextSummary(sessionId, messages);
            }

            res.json({ response: aiResponse, sessionId });
        } catch (error) {
            console.error('Error in coach chat:', error);
            res.status(500).json({ error: 'Failed to get chat response' });
        }
    }
}
