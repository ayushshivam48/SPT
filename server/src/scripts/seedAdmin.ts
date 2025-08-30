import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../config/db.js';
import { User } from '../models/User.js';

async function main() {
	await connectToDatabase(process.env.MONGO_URI as string);
	const email = process.env.ADMIN_EMAIL || 'admin@example.com';
	const name = process.env.ADMIN_NAME || 'Admin';
	const password = process.env.ADMIN_PASSWORD || 'admin123';

	const existing = await User.findOne({ email });
	if (existing) {
		console.log('Admin already exists:', email);
		process.exit(0);
	}
	const passwordHash = await bcrypt.hash(password, 10);
	await User.create({ name, email, passwordHash, role: 'admin' });
	console.log('Admin created:', email);
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});