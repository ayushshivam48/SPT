import { Schema, model, Types } from 'mongoose';

const resultSchema = new Schema(
	{
		student: { type: Types.ObjectId, ref: 'Student', required: true },
		course: { type: String, required: true },
		semester: { type: Number, required: true },
		subject: { type: String, required: true },
		internal: { type: Number, min: 0, max: 10 },
		external: { type: Number, min: 0, max: 10 },
		resultStatus: { type: String, enum: ['Pass', 'Fail'], default: 'Fail' },
	},
	{ timestamps: true }
);

export const Result = model('Result', resultSchema);