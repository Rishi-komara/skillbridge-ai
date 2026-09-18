import apiClient from '../config/api';

export const analyzeSkillGap = (currentSkills, targetRole) => {
  return apiClient.post('/skill-gap/analyze', { currentSkills, targetRole });
};

export const getSkillGapReport = () => {
  return apiClient.get('/skill-gap/report');
};
