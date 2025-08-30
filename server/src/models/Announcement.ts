import { Schema, model } from 'mongoose';

const announcementSchema = new Schema(
	{
		course: { type: String },
		semester: { type: Number },
		subject: { type: String },
		message: { type: String, required: true },
		date: { type: Date, default: () => new Date() },
	},
	{ timestamps: true }
);

export const Announcement = model('Announcement', announcementSchema);