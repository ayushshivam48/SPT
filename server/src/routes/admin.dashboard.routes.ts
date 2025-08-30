import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { adminOverview } from '../controllers/admin.dashboard.controller.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/dashboard', adminOverview);

export default router;