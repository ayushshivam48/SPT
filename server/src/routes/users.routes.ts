import { Router } from 'express';
import { register, loginUser } from '../controllers/users.controller.js';

const router = Router();

router.post('/users/register', register);
router.post('/users/login', loginUser);

export default router;

