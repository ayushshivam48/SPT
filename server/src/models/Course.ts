import { Schema, model, Types } from 'mongoose';

const courseSchema = new Schema(
	{
		name: { type: String, required: true },
		code: { type: String, required: true, unique: true },
		semester: { type: Number },
		teacher: { type: Types.ObjectId, ref: 'Teacher' },
	},
	{ timestamps: true }
);

export const Course = model('Course', courseSchema);