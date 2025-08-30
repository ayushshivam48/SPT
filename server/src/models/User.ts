import { Schema, model } from 'mongoose';
import type { UserRole } from '../utils/roles.js';

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
	},
	{ timestamps: true }
);

export const User = model('User', userSchema);