import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { Subject } from '../models/Subject.js';
import { Teacher } from '../models/Teacher.js';
import { Student } from '../models/Student.js';
import { Timetable } from '../models/Timetable.js';
import { Admin } from '../models/Admin.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_performance';

function generateSubjectCode(name: string, course: string, semester: number) {
	const base = name
		.split(/[\s\/(\)–\-]+/)
		.filter(Boolean)
		.map((w) => w[0]!.toUpperCase())
		.join('');
	const prefix = course.replace(/[^A-Z]/gi, '').substring(0, 2).toUpperCase();
	return `${prefix}_${base}${semester}`;
}

const btechSubjectsBySemester: Record<number, string[]> = {
	1: [
		'Engineering Mathematics – I',
		'Engineering Physics / Chemistry',
		'Programming in C',
		'Basic Electrical / Electronics Engineering',
		'Engineering Graphics / Workshop Practice',
		'Communication Skills',
		'Environmental Studies',
	],
	2: [
		'Engineering Mathematics – II',
		'Data Structures using C',
		'Digital Logic',
		'Discrete Mathematics',
		'Object-Oriented Programming',
		'Engineering Physics / Chemistry (opposite of Sem 1)',
		'Lab Work',
	],
	3: [
		'Computer Organization and Architecture',
		'Data Structures & Algorithms',
		'Operating Systems',
		'Database Management Systems',
		'Software Engineering',
		'Lab Work',
	],
	4: [
		'Theory of Computation',
		'Microprocessors and Interfacing',
		'Design and Analysis of Algorithms',
		'Web Technologies',
		'Computer Networks',
		'Lab Work',
	],
	5: [
		'Compiler Design',
		'Artificial Intelligence',
		'Mobile Computing',
		'Elective I',
		'Computer Graphics',
		'Lab Work',
	],
	6: [
		'Machine Learning',
		'Software Project Management',
		'Information Security',
		'Elective II',
		'Lab Work',
	],
	7: [
		'Major Project – Phase I',
		'Internship',
		'Elective III',
		'Seminar',
	],
	8: [
		'Major Project – Phase II',
		'Comprehensive Viva',
		'Final Elective(s)',
	],
};

const bcaSubjectsBySemester: Record<number, string[]> = {
	1: [
		'Fundamentals of Computers',
		'Programming in C',
		'Mathematics I',
		'Digital Electronics',
		'Communication Skills',
		'Lab Work',
	],
	2: [
		'Data Structures',
		'OOP using C++',
		'Mathematics II',
		'Operating Systems',
		'DBMS',
		'Lab Work',
	],
	3: [
		'Computer Networks',
		'Web Development',
		'Software Engineering',
		'Java Programming',
		'Lab Work',
	],
	4: [
		'Python Programming',
		'Advanced DBMS',
		'Design and Analysis of Algorithms',
		'Operating System Concepts',
		'Lab Work',
	],
	5: [
		'Mobile App Development',
		'.NET Programming or PHP',
		'Artificial Intelligence',
		'Mini Project',
		'Lab Work',
	],
	6: [
		'Cloud Computing',
		'Major Project / Internship',
		'Computer Graphics',
		'Seminar',
	],
};

const dummyTeachersData = [
	{
		name: 'Rohit Kumar',
		email: 'rohitkumar@amitypatna.edu',
		password: 'teacherpass',
		department: 'CSE/IT',
		assignedCourses: ['BCA', 'B.Tech'],
		assignedSemesters: [1, 2, 3],
		assignedSubjects: [],
		teacherId: 'AMIIT101',
		institute: 'Amity University',
	},
	{
		name: 'Sunita Sharma',
		email: 'sunitasharma@amitypatna.edu',
		password: 'teacherpass',
		department: 'CSE/IT',
		assignedCourses: ['B.Tech'],
		assignedSemesters: [4, 5, 6],
		assignedSubjects: [],
		teacherId: 'AMIIT102',
		institute: 'Amity University',
	},
	{
		name: 'Anil Singh',
		email: 'anilsingh@amitypatna.edu',
		password: 'teacherpass',
		department: 'CSE/IT',
		assignedCourses: ['BCA'],
		assignedSemesters: [4, 5, 6],
		assignedSubjects: [],
		teacherId: 'AMIIT103',
		institute: 'Amity University',
	},
];

const dummyStudentsData = [
	{
		name: 'Karan Verma',
		email: 'karanverma@student.amitypatna.edu',
		password: 'studentpass',
		course: 'B.Tech',
		currentSemester: 1,
		dob: new Date('2003-05-15'),
		enrollment: 'AMIIT203001',
		institute: 'Amity University',
	},
	{
		name: 'Priya Singh',
		email: 'priyasingh@student.amitypatna.edu',
		password: 'studentpass',
		course: 'BCA',
		currentSemester: 2,
		dob: new Date('2004-03-20'),
		enrollment: 'AMIIT203002',
		institute: 'Amity University',
	},
];

async function connectDB() {
	await mongoose.connect(MONGO_URI);
	console.log('MongoDB connected for seeding...');
}

async function clearAll() {
	console.log('Clearing collections...');
	await Promise.all([
		User.deleteMany({}),
		Subject.deleteMany({}),
		Teacher.deleteMany({}),
		Student.deleteMany({}),
		Timetable.deleteMany({}),
		Admin.deleteMany({}),
	]);
	console.log('Collections cleared');
}

async function seedSubjects() {
	console.log('Seeding subjects...');
	for (const [semStr, names] of Object.entries(btechSubjectsBySemester)) {
		const semester = Number(semStr);
		for (const name of names) {
			await Subject.create({ name, code: generateSubjectCode(name, 'B.Tech', semester), course: 'B.Tech', semester });
		}
	}
	for (const [semStr, names] of Object.entries(bcaSubjectsBySemester)) {
		const semester = Number(semStr);
		for (const name of names) {
			await Subject.create({ name, code: generateSubjectCode(name, 'BCA', semester), course: 'BCA', semester });
		}
	}
	console.log('Subjects seeded');
}

async function seedUsers() {
	console.log('Seeding admin...');
	const adminPasswordHash = await bcrypt.hash('900800', 10);
	const adminUser = await User.create({ name: 'Ayush Shivam', email: 'ayush@gmail.com', passwordHash: adminPasswordHash, role: 'admin' });
	await Admin.create({ user: adminUser._id, name: 'Ayush Shivam', email: 'ayush@gmail.com', institute: 'Amity University', phone: '9876543210', address: 'Admin Office' });

	console.log('Seeding teachers...');
	for (const t of dummyTeachersData) {
		const user = await User.create({ name: t.name, email: t.email.toLowerCase(), passwordHash: await bcrypt.hash(t.password, 10), role: 'teacher' });
		await Teacher.create({ user: user._id, teacherId: t.teacherId.toUpperCase(), specialization: 'General', assignedCourse: t.assignedCourses[0] });
	}

	console.log('Seeding students...');
	for (const s of dummyStudentsData) {
		const user = await User.create({ name: s.name, email: s.email.toLowerCase(), passwordHash: await bcrypt.hash(s.password, 10), role: 'student' });
		await Student.create({ user: user._id, enrollment: s.enrollment.toUpperCase(), course: s.course, currentSemester: s.currentSemester, dob: s.dob, semester: s.currentSemester });
	}
	console.log('Users seeded');
}

async function seedTimetable() {
	console.log('Seeding timetable...');
	const monday = 'Monday';
	const period = '09:00 - 10:00';
	const btechSubjects = await Subject.find({ course: 'B.Tech', semester: 1 });
	const bcaSubjects = await Subject.find({ course: 'BCA', semester: 1 });
	const teachers = await Teacher.find();
	if (btechSubjects.length && teachers.length) {
		const subject0 = btechSubjects[0]!;
		const teacher0: any = teachers[0]!;
		await Timetable.create({ day: monday, period, subject: subject0.name, teacher: teacher0.teacherId || String(teacher0._id), course: 'B.Tech', semester: 1 });
	}
	if (bcaSubjects.length && teachers.length > 1) {
		const subject1 = bcaSubjects[0]!;
		const teacher1: any = teachers[1]!;
		await Timetable.create({ day: monday, period, subject: subject1.name, teacher: teacher1.teacherId || String(teacher1._id), course: 'BCA', semester: 1 });
	}
	console.log('Timetable seeded');
}

export async function seedData(exitAfter = true) {
	await connectDB();
	await clearAll();
	await seedSubjects();
	await seedUsers();
	await seedTimetable();
	console.log('Database seeded successfully!');
	if (exitAfter) process.exit(0);
}

seedData().catch((e) => { console.error(e); process.exit(1); });