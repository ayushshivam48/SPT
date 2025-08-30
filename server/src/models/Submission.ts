import { Schema, model, Types } from 'mongoose';

const submissionSchema = new Schema(
	{
		assignment: { type: Types.ObjectId, ref: 'Assignment', required: true },
		student: { type: Types.ObjectId, ref: 'Student', required: true },
		fileUrl: { type: String },
		grade: { type: Number, min: 0, max: 100 },
		feedback: { type: String },
	},
	{ timestamps: true }
);

export const Submission = model('Submission', submissionSchema);