export interface Enrollment {
  id: number;
  courseId: number;
  learnerId: number;
  courseTitle: string;
  learnerName: string;
  status: string;
  enrolledOn: string;
}

export interface EnrollmentCreateRequest {
  courseId: number;
  learnerId: number;
}

export interface CourseEnrollment {
  id: number;
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  courseId: number;
  status: string;
  enrolledOn: string;
}
