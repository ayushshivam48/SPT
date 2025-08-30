import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../store/auth';

interface Props {
	allow: UserRole[];
}

export default function PrivateRoute({ allow }: Props) {
	const { user, token } = useAuthStore();
	if (!token) return <Navigate to="/login" replace />;
	if (user && allow.includes(user.role)) return <Outlet />;
	return <Navigate to="/" replace />;
}