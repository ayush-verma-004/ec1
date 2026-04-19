import axios from 'axios';
import { getToken, clearSession } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (unvalid token or expired), log out and redirect
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Avoid redirect loops if we are already on the landing page
      if (window.location.pathname !== '/') {
        clearSession();
        window.location.href = '/?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
