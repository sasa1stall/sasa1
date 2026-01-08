import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api', 
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
    
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle 401 errors (unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      // Don't retry if this was already a refresh token request
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        // Clear auth and let the app handle it gracefully
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, wait for the new token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        onTokenRefreshed(data.accessToken);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Clear auth data but don't force redirect - let components handle auth state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Dispatch a custom event that AuthContext can listen to
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

