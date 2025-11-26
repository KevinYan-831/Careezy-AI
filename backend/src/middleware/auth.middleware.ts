import type { Request, Response, NextFunction } from 'express';
import { getSupabase } from '../config/supabase.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Auth: No authorization header present');
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Auth: No token in authorization header');
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    console.log('Auth: Validating token...');
    const { data: { user }, error } = await getSupabase().auth.getUser(token);

    if (error) {
      console.error('Auth: Token validation error:', error.message);
      res.status(401).json({ error: 'Invalid token', details: error.message });
      return;
    }

    if (!user) {
      console.log('Auth: No user found for token');
      res.status(401).json({ error: 'User not found' });
      return;
    }

    console.log('Auth: User authenticated:', user.id);
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth Middleware Error:', error?.message || error);
    res.status(401).json({ error: 'Authentication failed', details: error?.message });
  }
};
