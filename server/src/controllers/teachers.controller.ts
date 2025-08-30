import type { Request, Response } from 'express';
import { Teacher } from '../models/Teacher.js';
import { User } from '../models/User.js';

function toViewModel(teacher: any) {
	const user = teacher.user as any;
	return {
		_id: teacher._id,
		name: user?.name,
		email: user?.email,
		teacherId: teacher.teacherId,
		specialization: teacher.specialization,
		userId: teacher.user?._id || teacher.user,
	};
}

export async function listTeachers(_req: Request, res: Response) {
	const teachers = await Teacher.find({}).populate('user', 'name email').lean();
	return res.json(teachers.map(toViewModel));
}

export async function filterTeachers(req: Request, res: Response) {
	const { department, assignedCourse } = req.query as { department?: string; assignedCourse?: string };
	const filter: any = {};
	if (assignedCourse) filter.assignedCourse = assignedCourse;
	if (department) filter.assignedCourse = department; // treat department as course
	const teachers = await Teacher.find(filter).populate('user', 'name email').lean();
	return res.json(teachers.map(toViewModel));
}

export async function getTeacher(req: Request, res: Response) {
	const { id } = req.params;
	let teacher = await Teacher.findById(id).populate('user', 'name email').lean();
	if (!teacher) {
		teacher = await Teacher.findOne({ user: id }).populate('user', 'name email').lean() as any;
	}
	if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
	return res.json(toViewModel(teacher));
}

export async function updateTeacher(req: Request, res: Response) {
	const { id } = req.params;
	const { name, email, teacherId, specialization } = req.body;
	const teacher = await Teacher.findById(id);
	if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
	if (teacherId !== undefined) teacher.teacherId = teacherId;
	if (specialization !== undefined) teacher.specialization = specialization;
	await teacher.save();
	if (name !== undefined || email !== undefined) {
		await User.findByIdAndUpdate(teacher.user, { $set: { ...(name && { name }), ...(email && { email }) } });
	}
	const populated = await Teacher.findById(id).populate('user', 'name email');
	return res.json(toViewModel(populated));
}

export async function deleteTeacher(req: Request, res: Response) {
	const { id } = req.params;
	const teacher = await Teacher.findById(id);
	if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
	await Teacher.deleteOne({ _id: id });
	return res.json({ ok: true });
}