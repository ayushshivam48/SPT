import { NavLink } from 'react-router-dom';

export default function TeacherSidebar() {
	return (
		<aside className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
			<nav className="space-y-2 text-sm">
				<NavLink to="/teacher/dashboard" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Dashboard</NavLink>
				<NavLink to="/teacher/grades" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Grades</NavLink>
				<NavLink to="/teacher/attendance" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Attendance</NavLink>
				<NavLink to="/teacher/announcements" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Announcements</NavLink>
			</nav>
		</aside>
	);
}