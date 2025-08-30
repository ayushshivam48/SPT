import { useEffect, useState } from 'react';
import AdminSidebar from '../../Shared/Slidebars/Admin';
import api from '../../api';

// Define types for our data structures
interface Assignment {
  _id?: string;
  id?: string;
  course: string;
  semester: number;
  subject: string;
  title: string;
  dueDate?: string;
  teacherName?: string;
  teacher?: string;
  teacherId?: string;
}

interface Subject {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

const AssignmentManager = () => {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [form, setForm] = useState({ course: '', semester: '', subject: '', title: '', dueDate: '', teacherName: '', teacherId: '' });
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (form.course === 'BCA') setAvailableSemesters([1,2,3,4,5,6]);
		else if (form.course === 'B.Tech') setAvailableSemesters([1,2,3,4,5,6,7,8]);
		else setAvailableSemesters([]);
		setForm((prev) => ({ ...prev, semester: '', subject: '', teacherName: '', teacherId: '' }));
		setSubjects([]); setTeachers([]);
	}, [form.course]);

	useEffect(() => {
		const fetchAssignments = async () => {
			try { const data = await api.get('/assignments'); setAssignments(Array.isArray(data) ? data : []); } catch { setAssignments([]); }
		};
		fetchAssignments();
	}, []);

	useEffect(() => {
		const fetchSubjects = async () => {
			if (!form.course || !form.semester) { setSubjects([]); return; }
			try { const response = await api.get(`/subjects/filter?course=${encodeURIComponent(form.course)}&semester=${encodeURIComponent(form.semester)}`); const subjectsData = Array.isArray(response) ? response : []; setSubjects(subjectsData); } catch { setErrorMsg('Failed to load subjects. Please try again.'); setSubjects([]); }
		};
		fetchSubjects();
		setForm((prev) => ({ ...prev, subject: '' }));
	}, [form.course, form.semester]);

	useEffect(() => {
		const fetchTeachers = async () => {
			if (!form.course) { setTeachers([]); return; }
			try { const data = await api.get(`/teachers/filter?department=${encodeURIComponent(form.course)}&assignedCourse=${encodeURIComponent(form.course)}`); setTeachers(Array.isArray(data) ? data : []); } catch { setTeachers([]); }
		};
		fetchTeachers();
		setForm((prev) => ({ ...prev, teacherName: '', teacherId: '' }));
	}, [form.course]);

	const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTeacherName = e.target.value;
		const selectedTeacher = teachers.find((t) => t.name === selectedTeacherName);
		setForm((prev) => ({ ...prev, teacherName: selectedTeacherName, teacherId: selectedTeacher ? selectedTeacher._id : '' }));
	};
	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedSubjectId = e.target.value;
		const selectedSubject = subjects.find((s) => s._id === selectedSubjectId);
		setForm((prev) => ({ ...prev, subject: selectedSubject ? selectedSubject.name : '' }));
	};

	const isFormValid = () => {
		const { course, semester, subject, title, dueDate, teacherName, teacherId } = form;
		return course.trim() && semester.trim() && subject.trim() && title.trim() && dueDate.trim() && teacherName.trim() && teacherId.trim();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault(); setErrorMsg(''); if (!isFormValid()) { setErrorMsg('Please fill out all fields.'); return; }
		setLoading(true);
		const payload = { course: form.course.trim(), semester: parseInt(form.semester.trim()) || 0, subject: form.subject.trim(), title: form.title.trim(), dueDate: form.dueDate.trim(), teacherName: form.teacherName.trim(), teacherId: form.teacherId.trim() };
		try {
			if (isEditing && editId) { 
				await api.put(`/assignments/${editId}`, payload); 
				setAssignments((prev) => prev.map((a) => (a._id === editId || a.id === editId ? { ...a, ...payload, _id: editId || '', id: editId || '' } : a)));
			} else { 
				const saved = await api.post('/assignments', payload); 
				setAssignments((prev) => [...prev, saved]); 
			}
			setForm({ course: '', semester: '', subject: '', title: '', dueDate: '', teacherName: '', teacherId: '' }); 
			setIsEditing(false); 
			setEditId(null);
		} catch { 
			setErrorMsg('Failed to save assignment.'); 
		} finally { 
			setLoading(false); 
		}
	};

	const handleEdit = (assignment: Assignment) => { 
		setForm({ 
			course: assignment.course || '', 
			semester: assignment.semester?.toString() || '', 
			subject: assignment.subject || '', 
			title: assignment.title || '', 
			dueDate: assignment.dueDate ? assignment.dueDate.substring(0,10) : '', 
			teacherName: assignment.teacherName || assignment.teacher || '', 
			teacherId: assignment.teacherId || '' 
		}); 
		setEditId(assignment._id || assignment.id || null); 
		setIsEditing(true); 
	};
	
	const handleDelete = async (id: string) => { 
		if (!window.confirm('Are you sure you want to delete this assignment?')) return; 
		await api.delete(`/assignments/${id}`); 
		setAssignments((prev) => prev.filter((a) => a._id !== id && a.id !== id)); 
		if (editId === id) { 
			setIsEditing(false); 
			setEditId(null); 
			setForm({ course: '', semester: '', subject: '', title: '', dueDate: '', teacherName: '', teacherId: '' }); 
		} 
	};
	
	const handleCancelEdit = () => { 
		setForm({ course: '', semester: '', subject: '', title: '', dueDate: '', teacherName: '', teacherId: '' }); 
		setIsEditing(false); 
		setEditId(null); 
		setErrorMsg(''); 
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<AdminSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold mb-6 text-gray-800">📚 Manage Assignments</h1>
					{errorMsg && <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>}
					<form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6 space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							<select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value, subject: '', teacherName: '', teacherId: '' })} className="border px-3 py-2 rounded" required aria-label="Select Course">
								<option value="">Select Course</option>
								<option value="BCA">BCA</option>
								<option value="B.Tech">B.Tech</option>
							</select>
							<select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value, subject: '' })} className="border px-3 py-2 rounded" required disabled={!form.course} aria-label="Select Semester">
								<option value="">Select Semester</option>
								{availableSemesters.map((sem) => (<option key={sem} value={sem}>{sem}</option>))}
							</select>
							<select value={subjects.find((s) => s.name === form.subject)?._id || ''} onChange={handleSubjectChange} className="border px-3 py-2 rounded" required disabled={!subjects.length} aria-label="Select Subject">
								<option value="">Select Subject</option>
								{subjects.length > 0 ? subjects.map((sub) => (<option key={sub._id || sub.name} value={sub._id}>{sub.name}</option>)) : (<option value="" disabled>No subjects available</option>)}
							</select>
							<input type="text" placeholder="Assignment Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border px-3 py-2 rounded" required aria-label="Assignment Title" />
							<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="border px-3 py-2 rounded" required aria-label="Due Date" />
							<select value={form.teacherName} onChange={handleTeacherChange} className="border px-3 py-2 rounded" required disabled={!teachers.length} aria-label="Select Teacher">
								<option value="">Select Teacher</option>
								{teachers.map((teacher) => (<option key={teacher._id} value={teacher.name}>{teacher.name}</option>))}
							</select>
							<input type="text" placeholder="Teacher ID" value={form.teacherId} readOnly className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" aria-label="Teacher ID (readonly)" required />
						</div>
						<div className="text-right">
							<button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow disabled:opacity-50 disabled:cursor-not-allowed">{isEditing ? '✏️ Update Assignment' : '➕ Add Assignment'}</button>
							{isEditing && (
								<button type="button" onClick={handleCancelEdit} className="ml-3 px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded shadow">Cancel</button>
							)}
						</div>
					</form>

					<div className="overflow-x-auto bg-white rounded shadow">
						<table className="w-full text-sm text-left border">
							<thead className="bg-blue-50 text-gray-700">
								<tr>
									<th className="px-4 py-2">Course</th>
									<th className="px-4 py-2">Sem</th>
									<th className="px-4 py-2">Subject</th>
									<th className="px-4 py-2">Title</th>
									<th className="px-4 py-2">Due Date</th>
									<th className="px-4 py-2">Teacher</th>
									<th className="px-4 py-2 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{assignments.length === 0 ? (
									<tr><td className="px-4 py-4 text-center" colSpan={7}>No assignments found.</td></tr>
								) : (
									assignments.map((a) => { const id = a._id || a.id || ''; return (
										<tr key={id} className="border-t hover:bg-gray-50">
											<td className="px-4 py-2">{a.course}</td>
											<td className="px-4 py-2">{a.semester}</td>
											<td className="px-4 py-2">{a.subject}</td>
											<td className="px-4 py-2">{a.title}</td>
											<td className="px-4 py-2">{a.dueDate?.substring(0,10)}</td>
											<td className="px-4 py-2"><div><p className="font-medium">{a.teacherName || a.teacher}</p><p className="text-xs text-gray-500">{a.teacherId}</p></div></td>
											<td className="px-4 py-2 text-center">
												<button onClick={() => handleEdit(a)} className="text-blue-600 hover:underline mr-3" aria-label={`Edit assignment ${a.title}`}>Edit</button>
												<button onClick={() => handleDelete(id)} className="text-red-600 hover:underline" aria-label={`Delete assignment ${a.title}`}>Delete</button>
											</td>
										</tr>
									); })
								)}
							</tbody>
						</table>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AssignmentManager;
