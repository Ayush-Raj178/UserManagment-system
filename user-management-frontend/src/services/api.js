import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      message: 'Error preparing request',
      originalError: error
    });
  }
);

// Response interceptor to handle 401 errors and other responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            // Try to refresh the token
            const response = await api.post(endpoints.auth.refreshToken, {
              refreshToken
            });
            
            if (response.token) {
              localStorage.setItem('token', response.token);
              if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
              }
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.token}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.warn('Token refresh failed:', refreshError);
          }
        }

        // If refresh failed or no refresh token, clear auth data and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        
        return Promise.reject({
          message: 'Session expired. Please login again.',
          status: 401,
          originalError: error
        });
      } catch (refreshError) {
        return Promise.reject({
          message: 'Authentication refresh failed',
          status: 401,
          originalError: refreshError
        });
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network Error: Please check your internet connection',
        isNetworkError: true,
        originalError: error
      });
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        return Promise.reject({
          message: error.response.data.message || 'Invalid request',
          status: 400,
          originalError: error
        });
      
      case 403:
        return Promise.reject({
          message: 'You do not have permission to perform this action',
          status: 403,
          originalError: error
        });
      
      case 404:
        return Promise.reject({
          message: 'Requested resource not found',
          status: 404,
          originalError: error
        });
      
      case 422:
        return Promise.reject({
          message: error.response.data.message || 'Validation failed',
          status: 422,
          validationErrors: error.response.data.errors,
          originalError: error
        });
      
      case 429:
        return Promise.reject({
          message: 'Too many requests. Please try again later.',
          status: 429,
          originalError: error
        });
      
      case 500:
        return Promise.reject({
          message: 'Internal server error. Please try again later.',
          status: 500,
          originalError: error
        });
      
      default:
        return Promise.reject({
          message: error.response?.data?.message || 'An unexpected error occurred',
          status: error.response?.status,
          originalError: error
        });
    }
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    validateResetToken: (token) => `/auth/reset-password/validate/${token}`,
    resetPassword: '/auth/reset-password'
  },
  users: {
    list: '/users',
    getById: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    profile: '/users/profile',
    password: '/users/password'
  },
  admin: {
    statistics: '/admin/statistics/users',
    activities: '/admin/activities'
  }
};

// Helper functions for common API operations
export const apiHelpers = {
  /**
   * Generic GET request
   * @param {string} url - The endpoint URL
   * @param {Object} params - Query parameters
   */
  get: async (url, params = {}) => {
    try {
      return await api.get(url, { params });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generic POST request
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   */
  post: async (url, data = {}, config = {}) => {
    try {
      return await api.post(url, data, config);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generic PUT request
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   */
  put: async (url, data = {}, config = {}) => {
    try {
      return await api.put(url, data, config);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generic DELETE request
   * @param {string} url - The endpoint URL
   * @param {Object} config - Additional axios config
   */
  delete: async (url, config = {}) => {
    try {
      return await api.delete(url, config);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload file(s)
   * @param {string} url - The endpoint URL
   * @param {FormData} formData - Form data with files
   * @param {Function} onProgress - Progress callback
   */
  upload: async (url, formData, onProgress = null) => {
    try {
      return await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      });
    } catch (error) {
      throw error;
    }
  }
};

export default api; 