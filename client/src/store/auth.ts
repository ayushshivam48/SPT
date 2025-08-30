import { create } from 'zustand';
import { api } from '../services/api';

export type UserRole = 'admin' | 'teacher' | 'student';
export interface UserInfo {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

interface AuthState {
	user: UserInfo | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (u: UserInfo | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: localStorage.getItem('token'),
	loading: false,
	error: null,
	setUser: (u) => set({ user: u }),
	login: async (email, password) => {
		set({ loading: true, error: null });
		try {
			const { data } = await api.post('/api/auth/login', { email, password });
			localStorage.setItem('token', data.token);
			set({ user: data.user, token: data.token, loading: false });
		} catch (e: unknown) {
			const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
			set({ error: errorMessage, loading: false });
			throw e;
		}
	},
	logout: async () => {
		await api.post('/api/auth/logout');
		localStorage.removeItem('token');
		set({ user: null, token: null });
	},
}));
