import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

// Get base URL from environment variable or use default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
	baseURL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers = config.headers as AxiosRequestHeaders || {} as AxiosRequestHeaders;
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
