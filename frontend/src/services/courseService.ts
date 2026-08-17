import { apiGet, apiPost } from './api';
import type { Course, CourseFilters } from '../types/course';

/**
 * Fetch all courses with optional filtering.
 */
export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  const params: Record<string, string> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.level) params.level = filters.level;
  if (filters?.search) params.search = filters.search;

  return apiGet<Course[]>('/courses', params);
}

/**
 * Fetch a single course by ID.
 */
export async function getCourseById(id: number): Promise<Course> {
  return apiGet<Course>(`/courses/${id}`);
}

/**
 * Create a new course.
 */
export async function createCourse(data: {
  title: string;
  description?: string;
  category: string;
  level: string;
  durationHours: number;
  startDate: string;
  endDate: string;
}): Promise<Course> {
  return apiPost<Course>('/courses', data);
}
