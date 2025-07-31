import api, { handleApiResponse, handleApiError } from './api';

export const adminService = {
  // Get all users (for admin view with full access)
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
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/admin/users/${id}/role`, { role });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all activity logs
  getActivityLogs: async (page = 1, size = 50, searchTerm = '', sortBy = 'timestamp', sortOrder = 'desc') => {
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
      
      const response = await api.get(`/admin/activity-logs?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user by ID (admin view with full details)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user (admin can update any user)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Block/Unblock user
  toggleUserStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { isActive });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Reset user password (admin action)
  resetUserPassword: async (id) => {
    try {
      const response = await api.post(`/admin/users/${id}/reset-password`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get system statistics
  getSystemStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get dashboard data
  getDashboardData: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Bulk user operations
  bulkUserAction: async (userIds, action) => {
    try {
      const response = await api.post('/admin/users/bulk', {
        userIds,
        action // 'delete', 'activate', 'deactivate', etc.
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Export users data
  exportUsers: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({
        format,
        ...filters
      });
      
      const response = await api.get(`/admin/users/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Handle file download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Users data exported successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Import users from file
  importUsers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('usersFile', file);
      
      const response = await api.post('/admin/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send notification to users
  sendNotification: async (userIds, notification) => {
    try {
      const response = await api.post('/admin/notifications', {
        userIds,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info'
      });
      
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user activity by user ID
  getUserActivityById: async (userId, page = 1, size = 20) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      const response = await api.get(`/admin/users/${userId}/activity?${params.toString()}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Manage user sessions
  terminateUserSessions: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/terminate-sessions`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all user sessions
  getUserSessions: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/sessions`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

