import type { Request, Response } from 'express';
import { Assignment } from '../models/Assignment.js';

export async function listAssignments(_req: Request, res: Response) {
	const items = await Assignment.find({}).lean();
	return res.json(items);
}

export async function filterAssignments(req: Request, res: Response) {
	const { course, semester, teacher } = req.query as { course?: string; semester?: string; teacher?: string };
	const filter: any = {};
	if (course) filter.course = course;
	if (semester) filter.semester = Number(semester);
	if (teacher) filter.teacherId = teacher;
	const items = await Assignment.find(filter).lean();
	return res.json(items);
}

export async function createAssignment(req: Request, res: Response) {
	const item = await Assignment.create(req.body);
	return res.status(201).json(item);
}

export async function updateAssignment(req: Request, res: Response) {
	const { id } = req.params;
	const updated = await Assignment.findByIdAndUpdate(id, { $set: req.body }, { new: true });
	return res.json(updated);
}

export async function deleteAssignment(req: Request, res: Response) {
	const { id } = req.params;
	await Assignment.deleteOne({ _id: id });
	return res.json({ ok: true });
}