export interface Learner {
  id: number;
  fullName: string;
  email: string;
  enrollments?: LearnerEnrollment[];
}

export interface LearnerCreateRequest {
  fullName: string;
  email: string;
}

export interface LearnerEnrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  status: string;
  enrolledOn: string;
}
