import axios from 'axios';

const createAxiosInstance = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (error.response?.status === 403) {
        window.location.href = '/unauthorized';
        return Promise.reject(error);
      }

      if (!error.response) {
        console.error('Network Error:', error);
        return Promise.reject(new Error('Network error occurred. Please check your connection.'));
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const http = createAxiosInstance();
