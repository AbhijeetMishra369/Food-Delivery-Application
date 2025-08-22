import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const data = error.response?.data;
		if (data && typeof data === 'object') {
			return Promise.reject({
				message: data.message || 'Something went wrong',
				code: data.code,
				fieldErrors: data.fieldErrors
			});
		}
		return Promise.reject(error);
	}
);

export default api;