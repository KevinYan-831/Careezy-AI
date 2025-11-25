import type { Request, Response, NextFunction } from 'express';
import { getSupabase } from '../config/supabase.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Return 401 if no authorization header is present
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      // Return 401 if no token is provided
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const { data: { user }, error } = await getSupabase().auth.getUser(token);

    if (error || !user) {
      // Return 401 if the token is invalid or user is not found
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
