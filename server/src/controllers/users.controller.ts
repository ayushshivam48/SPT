import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';

function signToken(user: any) {
	const payload = { userId: user._id.toString(), role: user.role };
	return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response) {
	const { role, name, email, password, phone, dob, address, institute, course, semester, enrollment, department, specification, teacherId } = req.body as any;
	if (!role || !name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
	const existing = await User.findOne({ email: email.toLowerCase() });
	if (existing) return res.status(409).json({ message: 'Email already registered' });
	if (role === 'student') {
		if (!enrollment) return res.status(400).json({ message: 'Enrollment required' });
		const student = await Student.findOne({ enrollment: enrollment.toUpperCase() });
		if (!student) return res.status(404).json({ message: 'Enrollment not found' });
		// Optional: verify name matches preloaded student name if you store it in User; here we skip as Student has no name
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'student' });
		student.user = user._id;
		if (course) student.course = course;
		if (semester) student.semester = Number(semester);
		await student.save();
		return res.status(201).json({ id: user._id, role: user.role });
	}
	if (role === 'teacher') {
		if (!teacherId) return res.status(400).json({ message: 'Teacher ID required' });
		const teacher = await Teacher.findOne({ teacherId: teacherId.toUpperCase() });
		if (!teacher) return res.status(404).json({ message: 'Teacher ID not found' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'teacher' });
		teacher.user = user._id as any;
		await teacher.save();
		return res.status(201).json({ id: user._id, role: user.role });
	}
	if (role === 'admin') {
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'admin' });
		return res.status(201).json({ id: user._id, role: user.role });
	}
	return res.status(400).json({ message: 'Invalid role' });
}

export async function loginUser(req: Request, res: Response) {
	const { email, enrollment, role, password } = req.body as any;
	let user: any = null;
	if (email) {
		user = await User.findOne({ email: String(email).toLowerCase() });
	} else if (enrollment) {
		if (role === 'student') {
			const student = await Student.findOne({ enrollment: String(enrollment).toUpperCase() });
			if (student?.user) user = await User.findById(student.user);
		} else if (role === 'teacher') {
			const teacher = await Teacher.findOne({ teacherId: String(enrollment).toUpperCase() });
			if (teacher?.user) user = await User.findById(teacher.user);
		}
	}
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
	const token = signToken(user);
	return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
}

