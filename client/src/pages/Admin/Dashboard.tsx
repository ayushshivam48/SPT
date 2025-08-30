import { useEffect, useState } from "react";
import { FaUserShield, FaUserGraduate, FaChalkboardTeacher, FaBook, FaPlus } from "react-icons/fa";
import api from "../../api";
import AdminSidebar from "../../Shared/Slidebars/Admin";

const AdminDashboard = ({ user }: { user?: { name: string; email: string } }) => {
	const [admin, setAdmin] = useState<{ name: string; email: string; post: string; institute: string; phone: string; dob: string; address: string; role: string } | null>(null);
	const [students, setStudents] = useState<{ _id: string; name: string; enrollment: string; email: string }[]>([]);
	const [teachers, setTeachers] = useState<{ _id: string; name: string; userId: string; email: string }[]>([]);
	const [assignments, setAssignments] = useState<{ course: string; semester: number; subject: string; teacher: string }[]>([]);

	const [form, setForm] = useState({ course: "", semester: "", subject: "", teacher: "" });
	const [showForm, setShowForm] = useState(false);

	const [loading, setLoading] = useState({ admin: true, students: true, teachers: true, assignments: true });
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const [formSuccess, setFormSuccess] = useState("");

	useEffect(() => {
		const fetchAdminInfo = async () => {
			try {
				const data = await api.get("/admins");
				if (data && data.length > 0) {
					const adminData = data[0];
					setAdmin({
						name: user?.name || adminData.name || "Admin User",
						email: user?.email || adminData.email || "",
						post: "Principal",
						institute: adminData.institute || "",
						phone: adminData.phone || "",
						dob: adminData.dob || "",
						address: adminData.address || "",
						role: "admin",
					});
				} else {
					setAdmin({
						name: user?.name || "Admin User",
						email: user?.email || "admin@example.com",
						post: "Principal",
						institute: "XYZ Institute",
						phone: "1234567890",
						dob: "1980-01-01",
						address: "123 Admin Lane",
						role: "admin",
					});
				}
			} catch {
				setAdmin({
					name: user?.name || "Admin User",
					email: user?.email || "admin@example.com",
					post: "Principal",
					institute: "XYZ Institute",
					phone: "1234567890",
					dob: "1980-01-01",
					address: "123 Admin Lane",
					role: "admin",
				});
			} finally {
				setLoading((prev) => ({ ...prev, admin: false }));
			}
		};

		const fetchStudents = async () => {
			try {
				const data = await api.get("/students");
				if (data && data.data && Array.isArray(data.data)) setStudents(data.data);
				else if (Array.isArray(data)) setStudents(data);
				else setStudents([]);
			} catch {
				setStudents([]);
			} finally {
				setLoading((prev) => ({ ...prev, students: false }));
			}
		};

		const fetchTeachers = async () => {
			try {
				const data = await api.get("/teachers");
				if (data && data.data && Array.isArray(data.data)) setTeachers(data.data);
				else if (Array.isArray(data)) setTeachers(data);
				else setTeachers([]);
			} catch {
				setTeachers([]);
			} finally {
				setLoading((prev) => ({ ...prev, teachers: false }));
			}
		};

		const fetchAssignments = async () => {
			try {
				const data = await api.get("/assignments");
				if (data && data.data && Array.isArray(data.data)) setAssignments(data.data);
				else if (Array.isArray(data)) setAssignments(data);
				else setAssignments([]);
			} catch {
				setAssignments([]);
			} finally {
				setLoading((prev) => ({ ...prev, assignments: false }));
			}
		};

		fetchAdminInfo();
		fetchStudents();
		fetchTeachers();
		fetchAssignments();
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");
		setFormSuccess("");
		setFormSubmitting(true);
		const { course, semester, subject, teacher } = form;
		if (!course.trim() || !semester.trim() || !subject.trim() || !teacher.trim()) {
			setFormError("Please fill out all fields.");
			setFormSubmitting(false);
			return;
		}
		try {
			await api.post("/assignments", { course: course.trim(), semester: parseInt(semester.trim()), subject: subject.trim(), teacher: teacher.trim() });
			setForm({ course: "", semester: "", subject: "", teacher: "" });
			setShowForm(false);
			try {
				const data = await api.get("/assignments");
				if (data && data.data && Array.isArray(data.data)) setAssignments(data.data);
				else if (Array.isArray(data)) setAssignments(data);
				else setAssignments([]);
			} catch {
				setAssignments([]);
			}
			setFormSuccess("Assignment added successfully!");
		} catch (error) {
			setFormError((error as Error)?.message || "Failed to add assignment.");
		} finally {
			setFormSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
			<div className="flex flex-col lg:flex-row">
				<AdminSidebar />
				<main className="flex-1 p-6 lg:p-10 space-y-10">
					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
							<FaUserShield className="text-purple-600" /> Admin Info
						</h2>
						{loading.admin ? (
							<p>Loading admin info...</p>
						) : (
							<div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
								<p><strong>👤 Name:</strong> {admin?.name || "N/A"}</p>
								<p><strong>📧 Email:</strong> {admin?.email || "N/A"}</p>
								<p><strong>🏢 Institute:</strong> {admin?.institute || "N/A"}</p>
								<p><strong>🎓 Post:</strong> {admin?.post || "N/A"}</p>
								<p><strong>📞 Phone:</strong> {admin?.phone || "N/A"}</p>
								<p><strong>🎂 DOB:</strong> {admin?.dob ? new Date(admin.dob).toDateString() : "N/A"}</p>
								<p className="md:col-span-2"><strong>📍 Address:</strong> {admin?.address || "N/A"}</p>
							</div>
						)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><FaUserGraduate className="text-blue-500" /> Latest Enrolled Students</h2>
						{loading.students ? <p>Loading students...</p> : students.length === 0 ? <p>No students found.</p> : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
								{students.map((s) => (
									<div key={s._id || s.enrollment} className="p-4 border rounded bg-gray-50 text-sm">
										<p><strong>Name:</strong> {s.name || "N/A"}</p>
										<p><strong>Enrollment:</strong> {s.enrollment || "N/A"}</p>
										<p><strong>Email:</strong> {s.email || "N/A"}</p>
									</div>
								))}
							</div>
						)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><FaChalkboardTeacher className="text-green-600" /> Latest Appointed Teachers</h2>
						{loading.teachers ? <p>Loading teachers...</p> : teachers.length === 0 ? <p>No teachers found.</p> : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
								{teachers.map((t) => (
									<div key={t._id} className="p-4 border rounded bg-gray-50 text-sm">
										<p><strong>Name:</strong> {t.name || "N/A"}</p>
										<p><strong>ID:</strong> {t.userId || "N/A"}</p>
										<p><strong>Email:</strong> {t.email || "N/A"}</p>
									</div>
								))}
							</div>
						)}
					</section>

					<section className="bg-white/80 backdrop-blur border border-white/20 p-6 rounded-2xl shadow-lg">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold flex items-center gap-2"><FaBook className="text-indigo-500" /> New Course Assignments</h2>
							<button onClick={() => { setShowForm((prev) => !prev); setForm({ course: "", semester: "", subject: "", teacher: "" }); setFormError(""); setFormSuccess(""); }} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
								<FaPlus /> {showForm ? "Cancel" : "Add Assignment"}
							</button>
						</div>
						{showForm && (
							<form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mb-6">
								<input name="course" placeholder="Course" value={form.course} onChange={handleChange} required className="border p-2 rounded" />
								<input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required className="border p-2 rounded" type="number" min="1" />
								<input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required className="border p-2 rounded" />
								<input name="teacher" placeholder="Teacher" value={form.teacher} onChange={handleChange} required className="border p-2 rounded" />
								<button type="submit" disabled={formSubmitting} className="sm:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">{formSubmitting ? "Adding..." : "Add Assignment"}</button>
							</form>
						)}
						{formError && <p className="text-red-600 mb-4">{formError}</p>}
						{formSuccess && <p className="text-green-600 mb-4">{formSuccess}</p>}
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{assignments.length === 0 ? <p>No assignments found.</p> : (
								assignments.map((a, idx) => (
									<div key={idx} className="p-4 border rounded bg-gray-50 text-sm">
										<p><strong>Course:</strong> {a.course || "N/A"}</p>
										<p><strong>Semester:</strong> {a.semester || "N/A"}</p>
										<p><strong>Subject:</strong> {a.subject || "N/A"}</p>
										<p><strong>Teacher:</strong> {a.teacher || "N/A"}</p>
									</div>
								))
							)}
						</div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;