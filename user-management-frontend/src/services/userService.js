import api from './api';

export const getUsers = async ({ page = 1, limit = 10, sort = 'firstName', order = 'asc', search = '' }) => {
  try {
    const response = await api.get('/users', {
      params: {
        page,
        limit,
        sort,
        order,
        search,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/users/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 