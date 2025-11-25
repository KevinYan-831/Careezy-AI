import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create-checkout-session', authenticate, PaymentController.createCheckoutSession);

export default router;
