import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { searchStudents, searchTeachers, assignStudentId } from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/search-student', searchStudents);
router.get('/search-teacher', searchTeachers);
router.post('/assign-id', assignStudentId);

export default router;