import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, ResumeController.create);
router.post('/suggestions', authenticate, ResumeController.getSuggestions);

export default router;
