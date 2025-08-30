import type { Request, Response } from 'express';
import { Attendance } from '../models/Attendance.js';

export async function createAttendance(req: Request, res: Response) {
	const item = await Attendance.create(req.body);
	return res.status(201).json(item);
}

export async function getAttendanceByStudent(req: Request, res: Response) {
	const { id } = req.params;
	const items = await Attendance.find({ student: id }).lean();
	return res.json(items);
}