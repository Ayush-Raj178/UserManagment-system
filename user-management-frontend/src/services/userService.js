import api, { handleApiResponse, handleApiError } from './api';

export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
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

  // Update current user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth,
        bio: userData.bio
      });
      
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

  // Get all users with pagination (for regular users with limited access)
  getAllUsers: async (page = 1, size = 10, searchTerm = '', sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortOrder
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await api.get(`/users?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data) {
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.profilePicture = result.data.profilePicture;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    try {
      const response = await api.delete('/users/profile/picture');
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        delete user.profilePicture;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user activity logs
  getUserActivity: async (page = 1, size = 20) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await api.get(`/users/activity?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/users/preferences', preferences);
      const result = handleApiResponse(response);
      
      if (result.success && result.data) {
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.preferences = result.data.preferences;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/users/preferences');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};
