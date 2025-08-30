import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
	return (
		<aside className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
			<nav className="space-y-2 text-sm">
				<NavLink to="/admin/dashboard" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Dashboard</NavLink>
				<NavLink to="/admin/search-student" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Search Students</NavLink>
				<NavLink to="/admin/search-teacher" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Search Teachers</NavLink>
				<NavLink to="/admin/assignments" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Assignments</NavLink>
				<NavLink to="/admin/timetable" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>Timetable</NavLink>
			</nav>
		</aside>
	);
}