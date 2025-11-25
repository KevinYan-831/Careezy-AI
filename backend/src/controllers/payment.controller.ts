import type { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import type { AuthRequest } from '../middleware/auth.middleware.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any // Cast to any to avoid type mismatch if SDK types are older/newer
});

export class PaymentController {
    static async createCheckoutSession(req: AuthRequest, res: Response) {
        try {
            const { priceId } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/pricing`,
                metadata: {
                    userId: userId,
                },
            });

            res.json({ sessionId: session.id, url: session.url });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({ error: 'Failed to create checkout session' });
        }
    }
}
