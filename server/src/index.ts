import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminDashboardRoutes from './routes/admin.dashboard.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import studentsRoutes from './routes/students.routes.js';
import assignmentsRoutes from './routes/assignments.routes.js';
import timetablesRoutes from './routes/timetables.routes.js';
import resultsRoutes from './routes/results.routes.js';
import announcementsRoutes from './routes/announcements.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
	cors({
		origin: clientUrl,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/timetables', timetablesRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/users', usersRoutes);

const PORT = Number(process.env.PORT) || 4000;

async function start() {
	try {
		await connectToDatabase(process.env.MONGO_URI as string);
		app.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

start();
