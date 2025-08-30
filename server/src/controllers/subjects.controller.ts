import type { Request, Response } from 'express';
import { Subject } from '../models/Subject.js';

export async function filterSubjects(req: Request, res: Response) {
	const { course, semester } = req.query as { course?: string; semester?: string };
	const filter: any = {};
	if (course) filter.course = course;
	if (semester) filter.semester = Number(semester);
	const subjects = await Subject.find(filter).sort({ semester: 1, name: 1 }).lean();
	return res.json(subjects);
}