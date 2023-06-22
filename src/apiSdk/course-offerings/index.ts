import axios from 'axios';
import queryString from 'query-string';
import { CourseOfferingInterface, CourseOfferingGetQueryInterface } from 'interfaces/course-offering';
import { GetQueryInterface } from '../../interfaces';

export const getCourseOfferings = async (query?: CourseOfferingGetQueryInterface) => {
  const response = await axios.get(`/api/course-offerings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCourseOffering = async (courseOffering: CourseOfferingInterface) => {
  const response = await axios.post('/api/course-offerings', courseOffering);
  return response.data;
};

export const updateCourseOfferingById = async (id: string, courseOffering: CourseOfferingInterface) => {
  const response = await axios.put(`/api/course-offerings/${id}`, courseOffering);
  return response.data;
};

export const getCourseOfferingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/course-offerings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCourseOfferingById = async (id: string) => {
  const response = await axios.delete(`/api/course-offerings/${id}`);
  return response.data;
};
