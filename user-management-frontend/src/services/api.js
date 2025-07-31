import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and network issues
api.interceptors.response.use(
  (response) => {
    // Return the response data directly for successful requests
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout');
      return Promise.reject({
        message: 'Request timeout. Please check your internet connection.',
        type: 'TIMEOUT_ERROR',
        originalError: error
      });
    }
    
    if (!error.response) {
      // Network error (no response from server)
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'NETWORK_ERROR',
        originalError: error
      });
    }
    
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        // Forbidden - insufficient permissions
        console.error('Access forbidden');
        break;
      case 404:
        // Not found
        console.error('Resource not found');
        break;
      case 422:
        // Validation error
        console.error('Validation error:', data);
        break;
      case 500:
        // Server error
        console.error('Internal server error');
        break;
      default:
        console.error(`HTTP Error ${status}:`, data);
    }
    
    // Format error response
    const errorResponse = {
      message: data?.message || error.message || 'An unexpected error occurred',
      status: status,
      errors: data?.errors || null,
      type: 'API_ERROR',
      originalError: error
    };
    
    return Promise.reject(errorResponse);
  }
);

// Helper function to handle API responses
export const handleApiResponse = (response) => {
  if (response.data) {
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Operation completed successfully'
    };
  }
  return response;
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
    errors: error.errors || null,
    status: error.status || null
  };
};

export default api;
