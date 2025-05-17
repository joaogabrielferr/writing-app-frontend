import { User } from '@/models/user';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface AuthContextForInterceptor {
  getAccessToken: () => string | null;
  setAuthInfo: (token: string | null, user: User | null) => void;
  logout: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let authContextRef: AuthContextForInterceptor | null = null;

export const setAuthContextForInterceptors = (context: AuthContextForInterceptor) => {
  authContextRef = context;
};

// Request Interceptor: Injects the access token into headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authContextRef) {
      const token = authContextRef.getAccessToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles token refresh on 401 errors
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && authContextRef) {
      if (isRefreshing) {
        // If already refreshing, add new request to a queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Interceptor: Attempting to refresh token...');
        
        const { data } = await axios.post<{ token: string, user: User }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { token: newAccessToken, user: refreshedUser } = data;

        authContextRef.setAuthInfo(newAccessToken, refreshedUser);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Interceptor: Refresh token failed:', refreshError);
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        await authContextRef.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;