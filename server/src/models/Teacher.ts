import { Schema, model, Types } from 'mongoose';

const teacherSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
		teacherId: { type: String, unique: true, sparse: true },
		specialization: { type: String },
		phone: { type: String },
		address: { type: String },
		dob: { type: Date },
		assignedCourse: { type: String },
		courses: [{ type: Types.ObjectId, ref: 'Course' }],
	},
	{ timestamps: true }
);

export const Teacher = model('Teacher', teacherSchema);