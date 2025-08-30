import { Router } from 'express';
import { filterTimetables, createTimetables } from '../controllers/timetables.controller.js';

const router = Router();

router.get('/timetables/filter', filterTimetables);
router.post('/timetables', createTimetables);

export default router;