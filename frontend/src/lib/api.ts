import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // CORS: no cookies, just JWT tokens
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - normalize backend format
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps: { success: true, data: {...}, message: "..." }
    // We unwrap to return just the data
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data && 'data' in response.data) {
        return { ...response, data: response.data.data };
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network error (backend not running)
    if (!error.response) {
      console.error('[API] Network Error - Backend unreachable at:', API_BASE_URL);
      return Promise.reject(new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:5000'));
    }

    // Handle 401 - try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = data.data.tokens;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    const message = (error.response?.data as any)?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
