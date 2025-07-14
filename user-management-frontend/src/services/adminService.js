import api from './api';

export const getUserStatistics = async () => {
  try {
    const response = await api.get('/admin/statistics/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentActivities = async (limit = 10) => {
  try {
    const response = await api.get('/admin/activities', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 