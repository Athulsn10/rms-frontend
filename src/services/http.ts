import axios from 'axios';

const url = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('token');
export const http = axios.create({baseURL:`${url}`, 
     headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },})

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Clear invalid token
      window.location.href = "/"; // Redirect to Home page
    }
    return Promise.reject(error);
  }
);
  