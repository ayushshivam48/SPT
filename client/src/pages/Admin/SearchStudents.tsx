import { useState, useEffect } from 'react';
import AdminSidebar from '../../Shared/Slidebars/Admin';
import api from '../../api';

// Define types for our data structures
interface Student {
  _id: string;
  name: string;
  enrollment: string;
  email: string;
  course: string;
  semester: number;
}

const SearchStudents = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [query, setQuery] = useState('');
	const [editingStudent, setEditingStudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState(false);
	const [, setErrorMsg] = useState('');

	useEffect(() => {
		const fetchStudents = async () => {
			setLoading(true);
			setErrorMsg('');
			try {
				const data = await api.get('/students');
				setStudents(Array.isArray(data) ? data : []);
			} catch {
				setStudents([]);
				setErrorMsg('Failed to load students.');
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, []);

	const filteredStudents = students.filter((student) => {
		const nameLower = (student.name || '').toLowerCase();
		const enrollmentLower = (student.enrollment || '').toLowerCase();
		const q = query.toLowerCase();
		return nameLower.includes(q) || enrollmentLower.includes(q);
	});

	const handleDelete = async (id: string) => {
		const confirmed = window.confirm('Are you sure you want to delete this student?');
		if (!confirmed) return;
		await api.delete(`/students/${id}`);
		setStudents((prev) => prev.filter((student) => student._id !== id));
		if (editingStudent && editingStudent._id === id) setEditingStudent(null);
	};

	const handleEdit = (student: Student) => {
		setEditingStudent({ ...student });
	};

	const handleUpdate = async () => {
		if (!editingStudent || !editingStudent._id) return;
		if (!editingStudent.name?.trim() || !editingStudent.enrollment?.trim() || !editingStudent.email?.trim() || !editingStudent.course?.trim() || !editingStudent.semester || isNaN(editingStudent.semester)) {
			alert('Please fill all fields correctly.');
			return;
		}
		await api.put(`/students/${editingStudent._id}`, editingStudent);
		setStudents((prev) => prev.map((student) => (student._id === editingStudent._id ? editingStudent : student)));
		setEditingStudent(null);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<AdminSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">🎓 Manage Students</h1>
					<div className="bg-white rounded-2xl p-6 shadow mb-6">
						<form onSubmit={(e) => e.preventDefault()} className="flex gap-4 items-center" role="search" aria-label="Search students by name or enrollment">
							<input type="text" placeholder="Search by name or enrollment..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Search input" />
							<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" aria-label="Search students" onClick={(e) => e.preventDefault()} disabled>🔍 Search</button>
						</form>
					</div>

					{editingStudent && (
						<div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow mb-6" role="region" aria-label="Edit student form">
							<h2 className="text-lg font-semibold text-yellow-800 mb-4">✏️ Edit Student</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input type="text" value={editingStudent.name} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="Name" aria-label="Edit student name" />
								<input type="text" value={editingStudent.enrollment} onChange={(e) => setEditingStudent({ ...editingStudent, enrollment: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="Enrollment No" aria-label="Edit student enrollment number" />
								<input type="email" value={editingStudent.email} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="Email" aria-label="Edit student email" />
								<input type="text" value={editingStudent.course} onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })} className="border px-3 py-2 rounded w-full" placeholder="Course" aria-label="Edit student course" />
								<input type="number" value={editingStudent.semester} onChange={(e) => setEditingStudent({ ...editingStudent, semester: parseInt(e.target.value) || 0 })} className="border px-3 py-2 rounded w-full" placeholder="Semester" aria-label="Edit student semester" min={1} max={8} />
							</div>
							<div className="mt-4 flex gap-3">
								<button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" aria-label="Save student changes">✅ Update</button>
								<button onClick={() => setEditingStudent(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" aria-label="Cancel editing">❌ Cancel</button>
							</div>
						</div>
					)}

					<div className="bg-white rounded-2xl p-6 shadow">
						<h2 className="text-lg font-semibold text-gray-700 mb-4">Student Records</h2>
						{loading ? (
							<p>Loading students...</p>
						) : filteredStudents.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm text-center border-collapse">
									<thead>
										<tr className="bg-gray-100 text-gray-700">
											<th className="py-2 px-4 text-left">Name</th>
											<th className="py-2 px-4">Enrollment</th>
											<th className="py-2 px-4">Email</th>
											<th className="py-2 px-4">Course</th>
											<th className="py-2 px-4">Semester</th>
											<th className="py-2 px-4">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredStudents.map((student) => (
											<tr key={student._id} className="hover:bg-gray-50 border-b">
												<td className="text-left py-2 px-4">{student.name}</td>
												<td>{student.enrollment}</td>
												<td>{student.email}</td>
												<td>{student.course}</td>
												<td>{student.semester}</td>
												<td>
													<button onClick={() => handleEdit(student)} className="text-blue-600 hover:underline mr-3" aria-label={`Edit ${student.name}`}>Edit</button>
													<button onClick={() => handleDelete(student._id)} className="text-red-600 hover:underline" aria-label={`Delete ${student.name}`}>Delete</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="py-4 text-gray-500">No matching students found.</p>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default SearchStudents;