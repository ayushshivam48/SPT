import { Router } from 'express';
import { listAssignments, filterAssignments, createAssignment, updateAssignment, deleteAssignment } from '../controllers/assignments.controller.js';

const router = Router();

router.get('/assignments', listAssignments);
router.get('/assignments/filter', filterAssignments);
router.post('/assignments', createAssignment);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);

export default router;