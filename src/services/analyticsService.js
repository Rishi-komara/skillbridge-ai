import apiClient from '../config/api';

export const getAnalyticsProgress = () => {
  return apiClient.get('/analytics/progress');
};
