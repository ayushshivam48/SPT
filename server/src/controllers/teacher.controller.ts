import { z } from 'zod';
import type { Request, Response } from 'express';
import { Course } from '../models/Course.js';
import { Submission } from '../models/Submission.js';
import { Attendance } from '../models/Attendance.js';

export async function listAssignedCourses(req: Request, res: Response) {
	const teacherId = req.user!.userId;
	const courses = await Course.find({ teacher: teacherId });
	return res.json(courses);
}

const gradeSchema = z.object({ submissionId: z.string(), grade: z.number().min(0).max(100), feedback: z.string().optional() });
export async function gradeSubmission(req: Request, res: Response) {
	const parsed = gradeSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const { submissionId, grade, feedback } = parsed.data;
	const updated = await Submission.findByIdAndUpdate(
		submissionId,
		{ $set: { grade, feedback } },
		{ new: true }
	);
	return res.json(updated);
}

const attendanceSchema = z.object({ courseId: z.string(), date: z.string(), records: z.array(z.object({ studentId: z.string(), status: z.enum(['present', 'absent', 'late']) })) });
export async function markAttendance(req: Request, res: Response) {
	const parsed = attendanceSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const { courseId, date, records } = parsed.data;
	const doc = await Attendance.findOneAndUpdate(
		{ course: courseId, date: new Date(date) },
		{
			$set: {
				records: records.map((r) => ({ student: r.studentId, status: r.status })),
			},
		},
		{ upsert: true, new: true }
	);
	return res.json(doc);
}

const announcementSchema = z.object({ title: z.string().min(1), content: z.string().min(1), courseId: z.string().optional() });
export async function createAnnouncement(req: Request, res: Response) {
	const parsed = announcementSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	// For brevity, store announcements in-memory for now; real impl would persist
	return res.json({ ok: true });
}