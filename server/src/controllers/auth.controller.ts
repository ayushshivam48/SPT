import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import type { Request, Response } from 'express';
import type { UserRole, JWTPayload } from '../utils/roles.js';

const signupSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(['admin', 'teacher', 'student']),
});

export async function signup(req: Request, res: Response) {
	const parsed = signupSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const { name, email, password, role } = parsed.data;
	const existing = await User.findOne({ email });
	if (existing) return res.status(409).json({ message: 'Email already in use' });
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role });
	if (role === 'student') await Student.create({ user: user._id });
	if (role === 'teacher') await Teacher.create({ user: user._id });
	return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function login(req: Request, res: Response) {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const { email, password } = parsed.data;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
	const payload: JWTPayload = { userId: user._id.toString(), role: user.role as UserRole };
	const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
	res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
	return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export function logout(_req: Request, res: Response) {
	res.clearCookie('token');
	return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
	if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
	const user = await User.findById(req.user.userId).select('name email role');
	return res.json(user);
}