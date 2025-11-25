import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, ResumeController.create);
router.get('/:id', authenticate, ResumeController.getResume);
router.put('/:id', authenticate, ResumeController.updateResume);
router.post('/suggestions', authenticate, ResumeController.getSuggestions);

export default router;
