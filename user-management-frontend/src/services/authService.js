import api, { handleApiResponse, handleApiError } from './api';

export const authService = {
  // Login user with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role || 'user'
      });
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send forgot password email
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        email
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current user information
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data) {
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with client-side logout even if server call fails
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get stored auth token
  getStoredToken: () => {
    return localStorage.getItem('authToken');
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data.token) {
        localStorage.setItem('authToken', result.data.token);
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Change password for authenticated user
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', {
        token
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Resend email verification
  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', {
        email
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
