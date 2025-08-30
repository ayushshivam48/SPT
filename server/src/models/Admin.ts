import { Schema, model, Types } from 'mongoose';

const adminSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User' },
		name: { type: String },
		email: { type: String },
		institute: { type: String },
		phone: { type: String },
		dob: { type: Date },
		address: { type: String },
	},
	{ timestamps: true }
);

export const Admin = model('Admin', adminSchema);

