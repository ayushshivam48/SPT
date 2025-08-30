import { Router } from 'express';
import { filterResults, createResult, updateResult } from '../controllers/results.controller.js';

const router = Router();

router.get('/results/filter', filterResults);
router.post('/results', createResult);
router.put('/results/:id', updateResult);

export default router;