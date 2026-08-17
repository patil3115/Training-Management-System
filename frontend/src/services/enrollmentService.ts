import { apiGet, apiPost } from './api';
import type { Enrollment, EnrollmentCreateRequest, CourseEnrollment } from '../types/enrollment';
import type { LearnerEnrollment } from '../types/learner';

/**
 * Create a new enrollment.
 */
export async function createEnrollment(data: EnrollmentCreateRequest): Promise<Enrollment> {
  return apiPost<Enrollment>('/enrollments', data);
}

/**
 * Get all enrollments for a specific course (Admin/Instructor view).
 */
export async function getCourseEnrollments(courseId: number): Promise<CourseEnrollment[]> {
  return apiGet<CourseEnrollment[]>(`/courses/${courseId}/enrollments`);
}

/**
 * Get all enrollments for a specific learner (My Enrollments view).
 */
export async function getLearnerEnrollments(learnerId: number): Promise<LearnerEnrollment[]> {
  return apiGet<LearnerEnrollment[]>(`/learners/${learnerId}/enrollments`);
}
