import { apiGet, apiPost } from './api';
import type { Learner, LearnerCreateRequest } from '../types/learner';

/**
 * Create a new learner or get existing learner by email.
 */
export async function createOrGetLearner(data: LearnerCreateRequest): Promise<Learner> {
  return apiPost<Learner>('/learners', data);
}

/**
 * Get learner details by ID, optionally including enrollments.
 */
export async function getLearnerById(id: number, includeEnrollments = false): Promise<Learner> {
  const params: Record<string, string> = {};
  if (includeEnrollments) params.include = 'enrollments';
  return apiGet<Learner>(`/learners/${id}`, params);
}
