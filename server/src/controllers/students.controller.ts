import type { Request, Response } from 'express';
import { Student } from '../models/Student.js';
import { User } from '../models/User.js';

function toViewModel(student: any) {
	const user = student.user as any;
	return {
		_id: student._id,
		name: user?.name,
		email: user?.email,
		enrollment: student.enrollment,
		course: student.course,
		semester: student.semester ?? student.currentSemester,
	};
}

export async function listStudents(_req: Request, res: Response) {
	const students = await Student.find({}).populate('user', 'name email').lean();
	return res.json(students.map(toViewModel));
}

export async function getStudent(req: Request, res: Response) {
	const { id } = req.params;
	let student = await Student.findById(id).populate('user', 'name email').lean();
	if (!student) {
		student = await Student.findOne({ user: id }).populate('user', 'name email').lean() as any;
	}
	if (!student) return res.status(404).json({ message: 'Student not found' });
	return res.json(toViewModel(student));
}

export async function updateStudent(req: Request, res: Response) {
	const { id } = req.params;
	const { name, email, enrollment, course, semester } = req.body;
	const student = await Student.findById(id);
	if (!student) return res.status(404).json({ message: 'Student not found' });
	if (enrollment !== undefined) student.enrollment = enrollment;
	if (course !== undefined) student.course = course;
	if (semester !== undefined) student.semester = semester;
	await student.save();
	if (name !== undefined || email !== undefined) {
		await User.findByIdAndUpdate(student.user, { $set: { ...(name && { name }), ...(email && { email }) } });
	}
	const populated = await Student.findById(id).populate('user', 'name email');
	return res.json(toViewModel(populated));
}

export async function deleteStudent(req: Request, res: Response) {
	const { id } = req.params;
	await Student.deleteOne({ _id: id });
	return res.json({ ok: true });
}