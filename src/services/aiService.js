import apiClient from '../config/api';

export const chatWithAI = (userPrompt) => {
  return apiClient.post('/ai/chat', { userPrompt });
};
