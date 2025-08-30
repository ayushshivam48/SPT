import { useEffect, useState } from "react";
import AdminSidebar from "../../Shared/Slidebars/Admin";
import api from "../../api";

// Define types for our data structures
interface Teacher {
  _id: string;
  name: string;
  email: string;
  teacherId: string;
  specialization: string;
}

const SearchTeachers = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [filtered, setFiltered] = useState<Teacher[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({ name: "", email: "", teacherId: "", specialization: "" });
	const [loading, setLoading] = useState(false);
	const [, setErrorMsg] = useState("");

	useEffect(() => {
		const fetchTeachers = async () => {
			setLoading(true);
			setErrorMsg("");
			try {
				const data = await api.get("/teachers");
				setTeachers(Array.isArray(data) ? data : []);
			} catch {
				setErrorMsg("Error loading teachers");
				setTeachers([]);
			} finally {
				setLoading(false);
			}
		};
		fetchTeachers();
	}, []);

	useEffect(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) { setFiltered(teachers); return; }
		setFiltered(teachers.filter((t) => {
			const name = t.name || "";
			const email = t.email || "";
			const id = t.teacherId || "";
			return name.toLowerCase().includes(term) || email.toLowerCase().includes(term) || id.toLowerCase().includes(term);
		}));
	}, [searchTerm, teachers]);

	const startEdit = (teacher: Teacher) => {
		setEditingId(teacher._id);
		setFormData({ name: teacher.name || "", email: teacher.email || "", teacherId: teacher.teacherId || "", specialization: teacher.specialization || "" });
	};
	const cancelEdit = () => { setEditingId(null); setFormData({ name: "", email: "", teacherId: "", specialization: "" }); };

	const handleUpdate = async () => {
		if (!formData.name.trim() || !formData.email.trim() || !formData.teacherId.trim() || !formData.specialization.trim()) { alert("Please fill all fields."); return; }
		await api.put(`/teachers/${editingId}`, { ...formData, name: formData.name.trim(), email: formData.email.trim(), teacherId: formData.teacherId.trim(), specialization: formData.specialization.trim() });
		setTeachers((prev) => prev.map((t) => (t._id === editingId ? { ...t, ...formData } : t)));
		cancelEdit();
	};

	const handleDelete = async (id: string) => {
		const confirmed = window.confirm("Are you sure you want to delete this teacher?");
		if (!confirmed) return;
		await api.delete(`/teachers/${id}`);
		setTeachers((prev) => prev.filter((t) => t._id !== id));
		if (editingId === id) cancelEdit();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<AdminSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold mb-4 text-gray-800">Manage Teachers</h1>
					<div className="mb-4 flex items-center gap-3">
						<input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none" aria-label="Search teachers" />
						<button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700" aria-label="Search" disabled>Search</button>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
						<table className="min-w-full table-auto text-sm border-collapse">
							<thead>
								<tr className="bg-gray-100 text-gray-700 border-b">
									<th className="text-left py-2 px-3">Name</th>
									<th className="py-2 px-3">Email</th>
									<th className="py-2 px-3">ID</th>
									<th className="py-2 px-3">Specialization</th>
									<th className="py-2 px-3 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr><td colSpan={5} className="text-center py-6">Loading teachers...</td></tr>
								) : filtered.length === 0 ? (
									<tr><td colSpan={5} className="text-center py-6">No teachers found.</td></tr>
								) : (
									filtered.map((t) => (
										<tr key={t._id} className="border-b hover:bg-gray-50">
											<td className="py-2 px-3">{t.name || "N/A"}</td>
											<td className="py-2 px-3">{t.email || "N/A"}</td>
											<td className="py-2 px-3">{t.teacherId || "N/A"}</td>
											<td className="py-2 px-3">{t.specialization || "N/A"}</td>
											<td className="py-2 px-3 text-center space-x-2">
												<button onClick={() => startEdit(t)} className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50" aria-label={`Edit ${t.name || 'teacher'}`}>Edit</button>
												<button onClick={() => handleDelete(t._id)} className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50" aria-label={`Delete ${t.name || 'teacher'}`}>Delete</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{editingId && (
						<div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md" role="region" aria-label="Edit teacher form">
							<h2 className="text-lg font-semibold mb-4">Edit Teacher</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border px-3 py-2 rounded w-full" aria-label="Teacher name" />
								<input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border px-3 py-2 rounded w-full" aria-label="Teacher email" />
								<input type="text" name="teacherId" value={formData.teacherId} onChange={handleInputChange} placeholder="Teacher ID" className="border px-3 py-2 rounded w-full" aria-label="Teacher ID" />
								<input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="Specialization" className="border px-3 py-2 rounded w-full" aria-label="Teacher specialization" />
							</div>
							<div className="mt-4 flex gap-3">
								<button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" aria-label="Save changes">Save</button>
								<button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded" aria-label="Cancel editing">Cancel</button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default SearchTeachers;