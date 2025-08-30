import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		enrollmentOrId: "",
		password: "",
		role: "student",
	});
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setFormData({ email: "", enrollmentOrId: "", password: "", role: "student" });
		setErrorMsg("");
		setSuccessMsg("");
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errorMsg) setErrorMsg("");
		if (successMsg) setSuccessMsg("");
	};

	const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const role = e.target.value;
		setFormData((prev) => ({ ...prev, role, email: "", enrollmentOrId: "" }));
		setErrorMsg("");
		setSuccessMsg("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg("");
		setSuccessMsg("");
		const { email, enrollmentOrId, password, role } = formData;
		if (!email.trim() && !enrollmentOrId.trim()) {
			setErrorMsg("Please enter your email or enrollment/teacher/admin ID.");
			return;
		}
		if (!password.trim()) {
			setErrorMsg("Password is required.");
			return;
		}
		setLoading(true);
		try {
			const loginPayload: {
				password: string;
				role: string;
				email?: string;
				enrollment?: string;
			} = { password: password.trim(), role };
			if (email.trim()) loginPayload.email = email.trim().toLowerCase(); else loginPayload.enrollment = enrollmentOrId.trim().toUpperCase();
			const response = await api.post("/users/login", loginPayload);
			if (!response || !response.data) { setErrorMsg("Invalid response from server. Please try again."); setLoading(false); return; }
			const { user, token } = response.data;
			if (!user || !token) { setErrorMsg("Login failed. Invalid response data. Please try again."); setLoading(false); return; }
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("token", token);
			setSuccessMsg("Login successful! Redirecting...");
			setTimeout(() => {
				if (user.role === "admin") navigate("/admin/dashboard");
				else if (user.role === "teacher") navigate("/teacher/dashboard");
				else navigate("/student/dashboard");
			}, 1000);
		} catch (error) {
			if (error instanceof Error) {
				setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
			} else {
				setErrorMsg("An unexpected error occurred. Please try again.");
			}
		} finally { setLoading(false); }
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 px-4 py-8 relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
			<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 transform -skew-y-6"></div>
			<div className="w-full max-w-7xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2 relative border border-white/20">
				<div className="relative bg-cover bg-center flex flex-col justify-center items-center text-center p-12" aria-hidden="true" style={{ backgroundImage: "url('https://media.licdn.com/dms/image/v2/D4D12AQEy2BTOzrtnuA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1686045322310?e=2147483647&v=beta&t=JlqpnPOirD8aIVXQgRZLqgyhPYYagn6V8S6GjI8Kd5Y')" }}>
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl"></div>
				</div>
				<div className="p-8 sm:p-12 bg-white/95 backdrop-blur-xl rounded-3xl relative z-10">
					<div className="text-center mb-8">
						<div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0m..." />
							</svg>
						</div>
						<h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome Back</h3>
						<p className="text-gray-600 mt-2 text-lg">Sign in to your account to continue your educational journey</p>
					</div>
					{successMsg && (<div role="alert" className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="font-medium">{successMsg}</span></div>)}
					{errorMsg && (<div role="alert" className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18..." /></svg><span className="font-medium">{errorMsg}</span></div>)}
					<form onSubmit={handleSubmit} className="space-y-6" noValidate>
						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
							<select id="role" name="role" value={formData.role} onChange={handleRoleChange} className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
								<option value="student">Student</option>
								<option value="teacher">Teacher</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
							<input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
							<p className="mt-1 text-xs text-gray-500">Or leave blank to use Enrollment/Teacher/Admin ID</p>
						</div>
						<div>
							<label htmlFor="enrollmentOrId" className="block text-sm font-medium text-gray-700">Enrollment Number / Teacher or Admin ID</label>
							<input id="enrollmentOrId" name="enrollmentOrId" type="text" placeholder="Enter your Enrollment or ID" value={formData.enrollmentOrId} onChange={handleChange} className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
							<input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
						</div>
						<button type="submit" disabled={loading} className={`w-full flex justify-center rounded bg-indigo-600 px-4 py-2 text-lg font-semibold text-white ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}`}>{loading ? (<><svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="img" aria-label="Loading spinner"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Logging in...</>) : ("Login")}</button>
					</form>
					<p className="mt-6 text-center text-sm text-gray-600">Don’t have an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Register here</Link></p>
				</div>
			</div>
		</div>
	);
};

export default Login;