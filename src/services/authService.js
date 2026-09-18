import apiClient from '../config/api';

export const signupUser = (email, password, name) => {
  return apiClient.post('/auth/signup', { email, password, name });
};

export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const logoutUser = () => {
  return apiClient.post('/auth/logout');
};

export const getAuthProfile = () => {
  return apiClient.get('/auth/profile');
};
