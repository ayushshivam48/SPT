import { Router } from 'express';
import { listAnnouncements, createAnnouncement } from '../controllers/announcements.controller.js';

const router = Router();

router.get('/announcements', listAnnouncements);
router.post('/announcements', createAnnouncement);

export default router;