import { Schema, model, Types } from 'mongoose';

const studentSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User' },
		enrollment: { type: String, unique: true, index: true },
		course: { type: String },
		semester: { type: Number },
		currentSemester: { type: Number },
		phone: { type: String },
		address: { type: String },
		dob: { type: Date },
		courses: [{ type: Types.ObjectId, ref: 'Course' }],
	},
	{ timestamps: true }
);

export const Student = model('Student', studentSchema);