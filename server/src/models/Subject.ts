import { Schema, model } from 'mongoose';

const subjectSchema = new Schema(
	{
		name: { type: String, required: true },
		code: { type: String },
		course: { type: String, required: true },
		semester: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const Subject = model('Subject', subjectSchema);