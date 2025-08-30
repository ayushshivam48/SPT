import type { Request, Response } from 'express';
import { Announcement } from '../models/Announcement.js';

export async function listAnnouncements(req: Request, res: Response) {
	const { course, semester, subject } = req.query as { course?: string; semester?: string; subject?: string };
	const filter: any = {};
	if (course) filter.course = course;
	if (semester) filter.semester = Number(semester);
	if (subject) filter.subject = subject;
	const items = await Announcement.find(filter).sort({ createdAt: -1 }).lean();
	return res.json(items);
}

export async function createAnnouncement(req: Request, res: Response) {
	const item = await Announcement.create(req.body);
	return res.status(201).json(item);
}