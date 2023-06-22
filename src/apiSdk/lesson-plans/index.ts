import axios from 'axios';
import queryString from 'query-string';
import { LessonPlanInterface, LessonPlanGetQueryInterface } from 'interfaces/lesson-plan';
import { GetQueryInterface } from '../../interfaces';

export const getLessonPlans = async (query?: LessonPlanGetQueryInterface) => {
  const response = await axios.get(`/api/lesson-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLessonPlan = async (lessonPlan: LessonPlanInterface) => {
  const response = await axios.post('/api/lesson-plans', lessonPlan);
  return response.data;
};

export const updateLessonPlanById = async (id: string, lessonPlan: LessonPlanInterface) => {
  const response = await axios.put(`/api/lesson-plans/${id}`, lessonPlan);
  return response.data;
};

export const getLessonPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/lesson-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLessonPlanById = async (id: string) => {
  const response = await axios.delete(`/api/lesson-plans/${id}`);
  return response.data;
};
