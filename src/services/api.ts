import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // No, we are using 5175 now
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  withCredentials: true, // Important for cookies
});

api.interceptors.request.use(
  (config) => {
    // We no longer send token from localStorage manually for Refresh Token flow
    // But for Access Token, if we keep it in memory (React State), we inject it here.
    // However, simplest MERN pattern often uses just cookies or localstorage.
    // Given "Strongest Auth", we moved Refresh Token to HttpOnly Cookie.
    // We will keep Access Token in memory or short-lived local storage?
    // Let's assume we get accessToken in JSON response and put it in Authorization header.
    
    const token = localStorage.getItem('accessToken'); // Short lived
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
