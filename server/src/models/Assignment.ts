import { Schema, model, Types } from 'mongoose';

const assignmentSchema = new Schema(
	{
		course: { type: String, required: true },
		semester: { type: Number, required: true },
		subject: { type: String, required: true },
		title: { type: String, required: true },
		dueDate: { type: Date, required: true },
		teacherName: { type: String },
		teacherId: { type: String },
		courseRef: { type: Types.ObjectId, ref: 'Course' },
	},
	{ timestamps: true }
);

export const Assignment = model('Assignment', assignmentSchema);