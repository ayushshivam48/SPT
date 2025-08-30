import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { dashboard } from '../controllers/student.controller.js';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/dashboard', dashboard);

export default router;