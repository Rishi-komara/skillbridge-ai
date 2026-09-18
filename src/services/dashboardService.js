import apiClient from '../config/api';

export const getDashboardStats = () => {
  return apiClient.get('/dashboard/stats');
};
