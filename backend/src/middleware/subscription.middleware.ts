import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';

export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Placeholder for subscription check
    // Since Stripe integration is deferred, we'll allow all users or check a flag in the user profile
    // For now, let's assume everyone is premium or just pass through

    // In a real implementation, we would check:
    // if (req.user?.subscription_tier !== 'premium') {
    //   return res.status(403).json({ error: 'Premium subscription required' });
    // }

    next();
};
