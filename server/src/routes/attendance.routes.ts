import { Router } from 'express';
import { createAttendance, getAttendanceByStudent } from '../controllers/attendance.controller.js';

const router = Router();

router.post('/attendance', createAttendance);
router.get('/attendances/student/:id', getAttendanceByStudent);

export default router;