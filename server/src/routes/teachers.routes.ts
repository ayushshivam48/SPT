import { Router } from 'express';
import { listTeachers, filterTeachers, getTeacher, updateTeacher, deleteTeacher } from '../controllers/teachers.controller.js';

const router = Router();

router.get('/teachers', listTeachers);
router.get('/teachers/filter', filterTeachers);
router.get('/teachers/:id', getTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

export default router;