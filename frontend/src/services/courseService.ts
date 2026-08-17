import { apiGet, apiPost, apiPut, apiDelete } from './api';
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

/**
 * Update an existing course.
 */
export async function updateCourse(
  id: number,
  data: {
    title: string;
    description?: string;
    category: string;
    level: string;
    durationHours: number;
    startDate: string;
    endDate: string;
  }
): Promise<Course> {
  return apiPut<Course>(`/courses/${id}`, data);
}

/**
 * Delete a course.
 */
export async function deleteCourse(id: number): Promise<{ message?: string }> {
  return apiDelete<{ message?: string }>(`/courses/${id}`);
}

