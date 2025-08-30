import { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaIdBadge, FaBook, FaTasks } from 'react-icons/fa';
import api from '../../api';
import TeacherSidebar from '../../Shared/Slidebars/Teacher';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  teacherId?: string;
  userId?: string;
  specialization?: string;
  phone?: string;
  dob?: string;
  address?: string;
}

interface Assignment {
  course: string;
  semester: string;
  subject: string;
  _id?: string;
  teacherId?: string;
  teacherName?: string;
}

interface Student {
  _id: string;
  name: string;
  enrollment: string;
  course: string;
  semester?: string;
  currentSemester?: string;
  subject?: string;
  attendance?: string;
}

interface TimetableEntry {
  day: string;
  period: string;
  subjectName?: string;
  subject?: string;
  course: string;
  semester: string;
  _id?: string;
}

interface Filter {
  course: string;
  semester: string;
  subject: string;
}

const TeacherDashboard = ({ user }: { user?: Teacher }) => {
	const [teacher, setTeacher] = useState<Teacher | null>(null);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
	const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
	const [timetableDay, setTimetableDay] = useState('');
	const [filter, setFilter] = useState<Filter>({ course: '', semester: '', subject: '' });

	const filteredTimetable = timetableDay ? timetable.filter((slot) => slot.day === timetableDay) : timetable;

	useEffect(() => {
		if (!user) return;
		async function fetchData() {
			try {
				try { 
					const teacherData = await api.get(`/teachers/${user?._id}`); 
					setTeacher(teacherData); 
				} catch { 
					if (user) {
						setTeacher(user); 
					}
				}
				try { 
					const assignmentsData = await api.get(`/assignments/filter?teacher=${user?._id}`); 
					setAssignments(assignmentsData || []); 
				} catch { 
					setAssignments([]); 
				}
				try { 
					setStudents([]); 
				} catch { 
					setStudents([]); 
				}
			} catch { 
				if (user) {
					setTeacher(user); 
				}
				setAssignments([]); 
				setStudents([]); 
			}
		}
		fetchData();
	}, [user]);

	useEffect(() => {
		const { course, semester, subject } = filter;
		const filtered = students.filter((s: Student) => {
			const sSemester = s.semester ?? s.currentSemester ?? '';
			const sSubject = s.subject ?? '';
			return (!course || s.course === course) && (!semester || sSemester === semester) && (!subject || sSubject === subject);
		});
		setFilteredStudents(filtered);
	}, [filter, students]);

	useEffect(() => {
		if (!assignments.length || !user) { 
			setTimetable([]); 
			return; 
		}
		async function fetchTimetable() { 
				try { 
					const data = await api.get(`/timetables/filter?role=teacher&teacher=${user?._id}`); 
					setTimetable(data || []); 
				} catch { 
					setTimetable([]); 
				} 
		}
		fetchTimetable();
	}, [assignments, user]);

	const courseOptions = [...new Set(assignments.map((a) => a.course))];
	const semesterOptions = [...new Set(assignments.map((a) => a.semester))];
	const subjectOptions = [...new Set(assignments.map((a) => a.subject))];

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
			<div className="flex flex-col lg:flex-row">
				<TeacherSidebar />
				<main className="flex-1 p-6 lg:p-10 space-y-8">
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
						<FaChalkboardTeacher className="inline mr-2 text-blue-600" />
						Welcome, {teacher?.name || user?.name || 'Teacher'}
					</h1>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><FaIdBadge /> Your Profile</h2>
						{teacher ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
								<p><strong>Name:</strong> {teacher.name}</p>
								<p><strong><FaEnvelope className="inline mr-1" />Email:</strong> {teacher.email}</p>
								<p><strong><FaIdBadge className="inline mr-1" />ID:</strong> {teacher.teacherId || teacher.userId}</p>
								<p><strong><FaBook className="inline mr-1" />Specialization:</strong> {teacher.specialization ?? 'N/A'}</p>
								<p><strong><FaPhone className="inline mr-1" />Phone:</strong> {teacher.phone ?? 'N/A'}</p>
								<p><strong><FaBirthdayCake className="inline mr-1" />DOB:</strong> {teacher.dob ? new Date(teacher.dob).toDateString() : 'N/A'}</p>
								<p className="md:col-span-2"><strong><FaMapMarkerAlt className="inline mr-1" />Address:</strong> {teacher.address ?? 'N/A'}</p>
							</div>
						) : (<p>Loading profile...</p>)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><FaTasks /> Assigned Courses</h2>
						{assignments.length > 0 ? (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{assignments.map((a, idx) => (
									<div key={idx} className="bg-gray-50 border p-4 rounded">
										<p><strong>📚 Course:</strong> {a.course}</p>
										<p><strong>📅 Semester:</strong> {a.semester}</p>
										<p><strong>📖 Subject:</strong> {a.subject}</p>
									</div>
								))}
							</div>
						) : (<p>No assignments found.</p>)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
							<h2 className="text-xl font-semibold text-blue-700">📅 Your Weekly Timetable</h2>
							<select className="border px-4 py-2 rounded bg-gray-50 text-sm" value={timetableDay} onChange={(e) => setTimetableDay(e.target.value)} aria-label="Filter timetable by day">
								<option value="">All Days</option>
								{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (<option key={day} value={day}>{day}</option>))}
							</select>
						</div>
						{filteredTimetable.length === 0 ? (
							<p className="text-gray-500 text-sm text-center">No timetable available for your assignments.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full table-auto border-collapse text-sm text-center">
									<thead>
										<tr className="bg-gray-100 text-gray-700">
											<th className="py-2 px-3">Day</th>
											<th className="py-2 px-3">Period</th>
											<th className="py-2 px-3">Subject</th>
											<th className="py-2 px-3">Course</th>
											<th className="py-2 px-3">Semester</th>
										</tr>
									</thead>
									<tbody>
										{filteredTimetable.map((slot, i) => (
											<tr key={i} className="border-b hover:bg-gray-50">
												<td className="py-2 px-3">{slot.day}</td>
												<td className="py-2 px-3">{slot.period}</td>
												<td className="py-2 px-3">{slot.subjectName || slot.subject}</td>
												<td className="py-2 px-3">{slot.course}</td>
												<td className="py-2 px-3">{slot.semester}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-xl font-semibold text-blue-700 mb-4">🎯 Filter Students</h2>
						<div className="flex flex-wrap gap-4">
							<select className="border px-4 py-2 rounded bg-gray-50" value={filter.course} onChange={(e) => setFilter((prev) => ({ ...prev, course: e.target.value }))}>
								<option value="">All Courses</option>
								{courseOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
							</select>
							<select className="border px-4 py-2 rounded bg-gray-50" value={filter.semester} onChange={(e) => setFilter((prev) => ({ ...prev, semester: e.target.value }))}>
								<option value="">All Semesters</option>
								{semesterOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
							</select>
							<select className="border px-4 py-2 rounded bg-gray-50" value={filter.subject} onChange={(e) => setFilter((prev) => ({ ...prev, subject: e.target.value }))}>
								<option value="">All Subjects</option>
								{subjectOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
							</select>
						</div>
					</section>

					<section className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold text-blue-700 mb-4">📊 Filtered Students</h2>
						{filteredStudents.length === 0 ? (
							<p className="text-sm text-gray-500">No students found for selected criteria.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-sm text-center border-collapse">
									<thead>
										<tr className="bg-gray-100 text-gray-700">
											<th className="py-2 px-3 text-left">Name</th>
											<th className="py-2 px-3">Enrollment</th>
											<th className="py-2 px-3">Course</th>
											<th className="py-2 px-3">Semester</th>
											<th className="py-2 px-3">Subject</th>
											<th className="py-2 px-3">Attendance %</th>
										</tr>
									</thead>
									<tbody>
										{filteredStudents.map((s, i) => (
											<tr key={i} className="hover:bg-gray-50 border-b">
												<td className="text-left py-2 px-3">{s.name}</td>
												<td>{s.enrollment}</td>
												<td>{s.course}</td>
												<td>{s.semester ?? s.currentSemester}</td>
												<td>{s.subject}</td>
												<td>{s.attendance ?? '-'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				</main>
			</div>
		</div>
	);
};

export default TeacherDashboard;