import { Router } from 'express';
import { CoachController } from '../controllers/coach.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/chat', authenticate, CoachController.chat);

export default router;
