import { Router } from 'express';
import { filterSubjects } from '../controllers/subjects.controller.js';

const router = Router();

router.get('/subjects/filter', filterSubjects);

export default router;