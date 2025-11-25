import { Router } from 'express';
import { InternshipController } from '../controllers/internship.controller.js';

const router = Router();

router.get('/search', InternshipController.search);

export default router;
