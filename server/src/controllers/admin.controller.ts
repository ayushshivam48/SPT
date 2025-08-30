import { z } from 'zod';
import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';

export async function searchStudents(req: Request, res: Response) {
	const { q } = req.query as { q?: string };
	const filter = q
		? {
			$or: [
				{ name: new RegExp(q, 'i') },
				{ email: new RegExp(q, 'i') },
			],
		}
		: {};
	const users = await User.find({ role: 'student', ...filter }).limit(50);
	return res.json(users);
}

export async function searchTeachers(req: Request, res: Response) {
	const { q } = req.query as { q?: string };
	const filter = q
		? {
			$or: [
				{ name: new RegExp(q, 'i') },
				{ email: new RegExp(q, 'i') },
			],
		}
		: {};
	const users = await User.find({ role: 'teacher', ...filter }).limit(50);
	return res.json(users);
}

const assignIdSchema = z.object({ userId: z.string(), enrollmentNumber: z.string().min(3) });
export async function assignStudentId(req: Request, res: Response) {
	const parsed = assignIdSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const { userId, enrollmentNumber } = parsed.data;
	const student = await Student.findOneAndUpdate(
		{ user: userId },
		{ $set: { enrollmentNumber } },
		{ upsert: true, new: true }
	);
	return res.json(student);
}