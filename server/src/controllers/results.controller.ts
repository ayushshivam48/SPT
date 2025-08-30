import type { Request, Response } from 'express';
import { Result } from '../models/Result.js';

export async function filterResults(req: Request, res: Response) {
	const { course, semester, subject, student } = req.query as { course?: string; semester?: string; subject?: string; student?: string };
	const filter: any = {};
	if (course) filter.course = course;
	if (semester) filter.semester = Number(semester);
	if (subject) filter.subject = subject;
	if (student) filter.student = student;
	const items = await Result.find(filter).lean();
	return res.json(items);
}

export async function createResult(req: Request, res: Response) {
	const item = await Result.create(req.body);
	return res.status(201).json(item);
}

export async function updateResult(req: Request, res: Response) {
	const { id } = req.params;
	const updated = await Result.findByIdAndUpdate(id, { $set: req.body }, { new: true });
	return res.json(updated);
}