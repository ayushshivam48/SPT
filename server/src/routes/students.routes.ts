import { Router } from 'express';
import { listStudents, getStudent, updateStudent, deleteStudent } from '../controllers/students.controller.js';

const router = Router();

router.get('/students', listStudents);
router.get('/students/:id', getStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

export default router;