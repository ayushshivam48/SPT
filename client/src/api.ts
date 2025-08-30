import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const api = {
	get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
		const { data } = await axios.get<T>(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, config);
		return data;
	},
	post: async <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		const { data } = await axios.post<T>(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, body, config);
		return data;
	},
	put: async <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		const { data } = await axios.put<T>(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, body, config);
		return data;
	},
	delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
		const { data } = await axios.delete<T>(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, config);
		return data;
	},
};

export default api;
