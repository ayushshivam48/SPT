import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listAssignedCourses, gradeSubmission, markAttendance, createAnnouncement } from '../controllers/teacher.controller.js';

const router = Router();

router.use(authenticate, authorize('teacher'));

router.get('/courses', listAssignedCourses);
router.post('/grade', gradeSubmission);
router.post('/attendance', markAttendance);
router.post('/announcements', createAnnouncement);

export default router;