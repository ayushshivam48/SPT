import mongoose from 'mongoose';

export async function connectToDatabase(uri: string) {
	if (!uri) {
		throw new Error('MONGO_URI is required');
	}
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri);
	return mongoose.connection;
}