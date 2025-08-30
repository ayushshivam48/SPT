import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const Signup = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		role: 'student',
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		dob: '',
		address: '',
		institute: '',
		department: '',
		specification: '',
		teacherId: '',
		course: '',
		semester: '',
		enrollment: '',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const coursesList = ['BCA', 'B.Tech'];
	const semestersBca = [1, 2, 3, 4, 5, 6];
	const semestersBtech = [1, 2, 3, 4, 5, 6, 7, 8];
	const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);

	useEffect(() => {
		const userJson = localStorage.getItem('user');
		if (userJson) {
			try {
				const user = JSON.parse(userJson);
				if (user.role === 'teacher') navigate('/teacher/dashboard');
				else if (user.role === 'student') navigate('/student/dashboard');
			} catch {
				localStorage.removeItem('user');
			}
		}
	}, [navigate]);

	useEffect(() => {
		if (formData.role === 'student') {
			if (formData.course === 'BCA') setAvailableSemesters(semestersBca);
			else if (formData.course === 'B.Tech') setAvailableSemesters(semestersBtech);
			else setAvailableSemesters([]);
			setFormData((prev) => ({ ...prev, semester: '' }));
		} else {
			setAvailableSemesters([]);
			setFormData((prev) => ({ ...prev, course: '', semester: '' }));
		}
	}, [formData.course, formData.role]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		const { role, name, email, password, confirmPassword, phone, dob, institute } = formData;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!name.trim() || !email.trim() || !password || !confirmPassword || !phone.trim() || !dob || !institute.trim()) {
			setErrorMsg('Please fill in all required fields.');
			return false;
		}
		if (!emailRegex.test(email.trim())) { setErrorMsg('Please enter a valid email address.'); return false; }
		if (password !== confirmPassword) { setErrorMsg('Passwords do not match.'); return false; }
		if (role === 'student') {
			if (!formData.course || !formData.semester || !formData.enrollment.trim()) { setErrorMsg('Please fill in course, semester, and enrollment number.'); return false; }
		}
		if (role === 'teacher') {
			if (!formData.department.trim() || !formData.specification.trim() || !formData.teacherId.trim()) { setErrorMsg('Please fill in department, specialization, and teacher ID.'); return false; }
		}
		setErrorMsg('');
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			if (formData.role === 'student') {
				const students = await api.get(`/students`);
				const exists = (Array.isArray(students) ? students : []).some((s: { enrollment: string }) => String(s.enrollment).toUpperCase() === formData.enrollment.trim().toUpperCase());
				if (!exists) {
					setErrorMsg('Enrollment not found in database for verification.');
					return;
				}
			} else if (formData.role === 'teacher') {
				const teachers = await api.get(`/teachers`);
				const exists = (Array.isArray(teachers) ? teachers : []).some((t: { teacherId: string }) => String(t.teacherId).toUpperCase() === formData.teacherId.trim().toUpperCase());
				if (!exists) {
					setErrorMsg('Teacher ID not found in database for verification.');
					return;
				}
			}
			const signupPayload: {
				role: string;
				name: string;
				email: string;
				password: string;
				phone: string;
				dob: string;
				address: string;
				institute: string;
				course?: string;
				semester?: number;
				enrollment?: string;
				department?: string;
				specification?: string;
				teacherId?: string;
			} = {
				role: formData.role,
				name: formData.name.trim(),
				email: formData.email.trim().toLowerCase(),
				password: formData.password,
				phone: formData.phone.trim(),
				dob: formData.dob,
				address: formData.address.trim(),
				institute: formData.institute.trim(),
			};
			if (formData.role === 'student') {
				signupPayload.course = formData.course;
				signupPayload.semester = Number(formData.semester);
				signupPayload.enrollment = formData.enrollment.trim().toUpperCase();
			} else if (formData.role === 'teacher') {
				signupPayload.department = formData.department.trim();
				signupPayload.specification = formData.specification.trim();
				signupPayload.teacherId = formData.teacherId.trim().toUpperCase();
			}
			const data = await api.post('/users/register', signupPayload);
			localStorage.setItem('user', JSON.stringify(data));
			if (data.role === 'teacher') navigate('/teacher/dashboard');
			else if (data.role === 'student') navigate('/student/dashboard');
			else navigate('/');
		} catch (error: unknown) {
			// Type guard to check if error is an object with a response property
			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as { response?: { data?: { message?: string } } };
				if (axiosError.response?.data?.message) {
					setErrorMsg(axiosError.response.data.message);
				} else {
					setErrorMsg('An error occurred during signup. Please try again.');
				}
			} else if (error instanceof Error) {
				// Handle network errors or other issues
				setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
			} else {
				// Handle non-Error objects
				setErrorMsg('An unexpected error occurred. Please try again.');
			}
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10 relative">
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
			<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 transform -skew-y-6" />
			<div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl p-8 md:p-12 relative z-10 shadow-xl">
				<div className="text-center mb-8">
					<div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mb-4">
						<svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0M3 20a6 6 0 0112 0v1H3v-1" />
						</svg>
					</div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create Your Account</h2>
					<p className="text-gray-600 mt-2">Join us to track and improve your academic journey</p>
				</div>
				{errorMsg && (
					<div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded p-4 mb-6 flex items-center animate-fadeIn" role="alert">
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 018 0" />
						</svg>
						<span className="font-medium">{errorMsg}</span>
					</div>
				)}
				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="md:col-span-2">
						<label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
						<select name="role" id="role" value={formData.role} onChange={handleChange} className="w-full border rounded px-4 py-2 focus:ring-green-400 focus:outline-none" aria-required="true">
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
						</select>
					</div>
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
						<input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="w-full border rounded px-4 py-2" autoComplete="name" />
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="example@edu.in" required className="w-full border rounded px-4 py-2" autoComplete="email" />
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••" required className="w-full border rounded px-4 py-2" autoComplete="new-password" />
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
						<input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" required className="w-full border rounded px-4 py-2" autoComplete="new-password" />
					</div>
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
						<input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} placeholder="1234567890" className="w-full border rounded px-4 py-2" autoComplete="tel" />
					</div>
					<div>
						<label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
						<input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="w-full border rounded px-4 py-2" max={new Date().toISOString().slice(0,10)} />
					</div>
					<div className="md:col-span-2">
						<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
						<input type="text" name="address" id="address" value={formData.address} onChange={handleChange} placeholder="123 Street, City" className="w-full border rounded px-4 py-2" />
					</div>
					<div className="md:col-span-2">
						<label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
						<input type="text" name="institute" id="institute" value={formData.institute} onChange={handleChange} placeholder="ABC Institute" required className="w-full border rounded px-4 py-2" />
					</div>
					{formData.role === 'student' && (<>
						<div>
							<label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
							<select name="course" id="course" value={formData.course} onChange={handleChange} required className="w-full border rounded px-4 py-2" aria-required="true">
								<option value="" disabled>Choose course</option>
								{coursesList.map((c) => (<option key={c} value={c}>{c}</option>))}
							</select>
						</div>
						<div>
							<label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
							<select name="semester" id="semester" value={formData.semester} onChange={handleChange} required disabled={availableSemesters.length === 0} className="w-full border rounded px-4 py-2" aria-required="true">
								<option value="" disabled>Select semester</option>
								{availableSemesters.map((sem) => (<option key={sem} value={sem}>{sem}</option>))}
							</select>
						</div>
						<div>
							<label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
							<input type="text" name="enrollment" id="enrollment" value={formData.enrollment} onChange={handleChange} placeholder="Enter enrollment number" required className="w-full border rounded px-4 py-2" aria-required="true" />
						</div>
					</>)}
					{formData.role === 'teacher' && (<>
						<div>
							<label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
							<input type="text" name="department" id="department" value={formData.department} onChange={handleChange} placeholder="CSE, ECE, etc." required className="w-full border rounded px-4 py-2" aria-required="true" />
						</div>
						<div>
							<label htmlFor="specification" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
							<input type="text" name="specification" id="specification" value={formData.specification} onChange={handleChange} placeholder="Networking, AI, etc." required className="w-full border rounded px-4 py-2" aria-required="true" />
						</div>
						<div>
							<label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
							<input type="text" name="teacherId" id="teacherId" value={formData.teacherId} onChange={handleChange} placeholder="Teacher unique ID" required className="w-full border rounded px-4 py-2" aria-required="true" />
						</div>
					</>)}
					<div className="md:col-span-2 mt-6">
						<button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5" aria-label="Sign up">{formData.role === 'student' ? 'Sign Up as Student' : 'Sign Up as Teacher'}</button>
					</div>
				</form>
				<div className="mt-6 text-center text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="text-blue-600 hover:underline" aria-label="Go to login page">Login</Link></div>
			</div>
		</div>
	);
};

export default Signup;