import apiClient from '../config/api';

export const getInterviewQuestions = () => {
  return apiClient.get('/interview/questions');
};

export const submitInterview = (question, answer) => {
  return apiClient.post('/interview/submit', { question, answer });
};

export const submitVoiceAnswer = (formData) => {
  return apiClient.post('/interview/voice-answer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getInterviewHistory = () => {
  return apiClient.get('/interview/history');
};
