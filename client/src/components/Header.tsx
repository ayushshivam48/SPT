import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Header() {
	const { user, logout } = useAuthStore();
	return (
		<header className="border-b bg-white">
			<div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
				<Link to="/" className="text-xl font-bold text-blue-600">SPT</Link>
				<nav className="flex gap-4 text-sm">
					{user?.role === 'admin' && (
						<>
							<NavLink to="/admin/dashboard">Dashboard</NavLink>
							<NavLink to="/admin/search-student">Students</NavLink>
							<NavLink to="/admin/search-teacher">Teachers</NavLink>
							<NavLink to="/admin/assignments">Assignments</NavLink>
							<NavLink to="/admin/timetable">Timetable</NavLink>
						</>
					)}
					{user?.role === 'teacher' && (
						<>
							<NavLink to="/teacher/dashboard">Dashboard</NavLink>
							<NavLink to="/teacher/grades">Grades</NavLink>
							<NavLink to="/teacher/attendance">Attendance</NavLink>
							<NavLink to="/teacher/announcements">Announcements</NavLink>
						</>
					)}
					{user?.role === 'student' && (
						<NavLink to="/student/dashboard">My Dashboard</NavLink>
					)}
				</nav>
				<div className="flex items-center gap-3">
					{!user ? (
						<>
							<Link className="text-sm" to="/login">Login</Link>
							<Link className="text-sm" to="/signup">Signup</Link>
						</>
					) : (
						<>
							<span className="text-sm">{user.name} ({user.role})</span>
							<button className="rounded bg-gray-100 px-3 py-1 text-sm" onClick={logout}>Logout</button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
