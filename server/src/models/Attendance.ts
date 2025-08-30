import { Schema, model, Types } from 'mongoose';

const attendanceSchema = new Schema(
	{
		student: { type: Types.ObjectId, ref: 'Student', required: true },
		teacher: { type: Types.ObjectId, ref: 'Teacher' },
		subject: { type: String },
		course: { type: String },
		semester: { type: Number },
		date: { type: Date, required: true },
		status: { type: String, enum: ['present', 'absent', 'late'], required: true },
	},
	{ timestamps: true }
);

export const Attendance = model('Attendance', attendanceSchema);