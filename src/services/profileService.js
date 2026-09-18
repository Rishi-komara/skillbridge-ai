import apiClient from '../config/api';

export const getProfile = () => {
  return apiClient.get('/profile');
};

export const updateProfile = (profileData) => {
  return apiClient.put('/profile/update', profileData);
};
