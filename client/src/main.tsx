import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Home from './pages/Public/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Test from './pages/Test';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import SearchStudents from './pages/Admin/SearchStudents';
import SearchTeachers from './pages/Admin/SearchTeachers';
import AssignmentManager from './pages/Admin/Assignments';
import AdminTimetableManager from './pages/Admin/Timetable';
import TeacherDashboard from './pages/Teacher/Dashboard';
import GradeEntry from './pages/Teacher/Grades';
import AttendanceEntry from './pages/Teacher/Attendance';
import AnnouncementPanel from './pages/Teacher/Announcements';
import StudentDashboard from './pages/Student/Dashboard';
import { useAuthStore } from './store/auth';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Header />
			<main>{children}</main>
		</div>
	);
}

export function WithAdminUser({ children }: { children: (user: { name: string; email: string } | undefined) => React.ReactNode }) {
	const { user } = useAuthStore();
	return <>{children(user ? { name: user.name, email: user.email } : undefined)}</>;
}

export function WithTeacherUser({ children }: { children: (user: Teacher | undefined) => React.ReactNode }) {
	const { user } = useAuthStore();
	return <>{children(user ? { _id: user?.id || '', name: user.name, email: user.email, role: user.role } : undefined)}</>;
}

export function WithStudentUser({ children }: { children: (user: { _id: string; name: string; email: string; role: string } | undefined) => React.ReactNode }) {
	const { user } = useAuthStore();
	return <>{children(user ? { _id: user?.id || '', name: user.name, email: user.email, role: user.role } : undefined)}</>;
}

export function WithAttendanceUser({ children }: { children: (user: User | undefined) => React.ReactNode }) {
	const { user } = useAuthStore();
	return <>{children(user ? { _id: user?.id || '', name: user.name, email: user.email, role: user.role } : undefined)}</>;
}

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},
	{ path: '/login', element: <Layout><Login /></Layout> },
	{ path: '/signup', element: <Layout><Signup /></Layout> },
	{ path: '/test', element: <Test /> },
	{
		path: '/admin',
		element: <PrivateRoute allow={['admin']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithAdminUser>{(u) => <AdminDashboard user={u} />}</WithAdminUser></Layout> },
			{ path: 'search-student', element: <Layout><SearchStudents /></Layout> },
			{ path: 'search-teacher', element: <Layout><SearchTeachers /></Layout> },
			{ path: 'assignments', element: <Layout><AssignmentManager /></Layout> },
			{ path: 'timetable', element: <Layout><AdminTimetableManager /></Layout> },
			// assign-id removed
		],
	},
	{
		path: '/teacher',
		element: <PrivateRoute allow={['teacher']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithTeacherUser>{(u) => <TeacherDashboard user={u} />}</WithTeacherUser></Layout> },
			{ path: 'grades', element: <Layout><GradeEntry /></Layout> },
			{ path: 'attendance', element: <Layout><WithAttendanceUser>{(u) => <AttendanceEntry user={u} />}</WithAttendanceUser></Layout> },
			{ path: 'announcements', element: <Layout><AnnouncementPanel /></Layout> },
		],
	},
	{
		path: '/student',
		element: <PrivateRoute allow={['student']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithStudentUser>{(u) => <StudentDashboard user={u} />}</WithStudentUser></Layout> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
