import { Router } from 'express';
import { CoachController } from '../controllers/coach.controller.js';

const router = Router();

router.post('/chat', CoachController.chat);

export default router;
