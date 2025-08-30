import { Schema, model } from 'mongoose';

const timetableSchema = new Schema(
	{
		day: { type: String, required: true },
		period: { type: String, required: true },
		subject: { type: String, required: true },
		teacher: { type: String, required: true },
		course: { type: String, required: true },
		semester: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const Timetable = model('Timetable', timetableSchema);