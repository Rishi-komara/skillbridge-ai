import apiClient from '../config/api';

export const uploadResume = (formData) => {
  return apiClient.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const analyzeResume = (resumeId) => {
  return apiClient.post('/resume/analyze', { resumeId });
};

export const getResumeHistory = () => {
  return apiClient.get('/resume/history');
};
