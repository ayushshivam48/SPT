import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Assignment } from '../models/Assignment.js';

export async function adminOverview(_req: Request, res: Response) {
	const [students, teachers, courses, assignments] = await Promise.all([
		User.countDocuments({ role: 'student' }),
		User.countDocuments({ role: 'teacher' }),
		Course.countDocuments({}),
		Assignment.countDocuments({}),
	]);
	return res.json({ students, teachers, courses, assignments });
}