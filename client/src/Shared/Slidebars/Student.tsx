import { NavLink } from 'react-router-dom';

export default function StudentSidebar() {
	return (
		<aside className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
			<nav className="space-y-2 text-sm">
				<NavLink to="/student/dashboard" className={({ isActive }) => `${isActive ? 'font-semibold text-blue-600' : ''} block px-2 py-1 rounded hover:bg-gray-50`}>
					My Dashboard
				</NavLink>
			</nav>
		</aside>
	);
}