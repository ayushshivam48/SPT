import type { Request, Response } from 'express';
import { Submission } from '../models/Submission.js';
import { Assignment } from '../models/Assignment.js';
import { Attendance } from '../models/Attendance.js';

export async function dashboard(_req: Request, res: Response) {
	const userId = _req.user!.userId;
	const [submissions, assignments, attendance] = await Promise.all([
		Submission.find({}).limit(10),
		Assignment.find({}).limit(10),
		Attendance.find({}).limit(10),
	]);
	return res.json({ submissions, assignments, attendance });
}