import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3113/api';
const API_TIMEOUT = 300000; // 5 minutes

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Add any custom headers or logging here
    
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - Better Auth will handle redirect via middleware
          console.error('[API] Unauthorized - session expired');
          
          // Prevent infinite retry loops
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            // Better Auth automatically refreshes tokens via cookies
            // If this fails, middleware will redirect to login
            return api(originalRequest);
          }
          
          // If retry failed, show toast and redirect to login
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Session expired - please log in again');
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('[API] Forbidden - insufficient permissions');
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Forbidden - insufficient permissions');
          }
          break;

        case 404:
          console.error('[API] Not found:', error.config?.url);
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Resource not found');
          }
          break;

        case 422:
          console.error('[API] Validation error:', error.response.data);
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Validation error');
          }
          break;

        case 429:
          console.error('[API] Too many requests - rate limited');
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Too many requests - please wait');
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          console.error('[API] Server error:', status);
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'Server error - please try again later');
          }
          break;

        default:
          console.error('[API] Error:', status, error.response.data);
          if (typeof window !== 'undefined') {
            toast.error(error.response.data?.message || 'An error occurred');
          }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[API] Network error - no response received');
      if (typeof window !== 'undefined') {
        toast.error('Network error - please check your connection');
      }
    } else {
      // Error in request setup
      console.error('[API] Request setup error:', error.message);
      if (typeof window !== 'undefined') {
        toast.error(error.message || 'An unexpected error occurred');
      }
    }

    return Promise.reject(formatError(error));
  }
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format axios error into standardized ApiError
 */
function formatError(error: AxiosError<ApiError>): ApiError {
  if (error.response) {
    return {
      message: error.response.data?.message || error.message || 'An error occurred',
      status: error.response.status,
      code: error.response.data?.code || error.code,
      details: error.response.data?.details,
    };
  }

  if (error.request) {
    return {
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Type-safe wrapper for GET requests
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

/**
 * Type-safe wrapper for POST requests
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

/**
 * Type-safe wrapper for PUT requests
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

/**
 * Type-safe wrapper for PATCH requests
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

/**
 * Type-safe wrapper for DELETE requests
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

// ============================================================================
// Export default instance
// ============================================================================

export default api;

