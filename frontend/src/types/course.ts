export interface Course {
  id: number;
  title: string;
  description: string | null;
  category: string;
  level: string;
  durationHours: number;
  startDate: string;
  endDate: string;
  currentEnrollmentCount: number;
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  category: string;
  level: string;
  durationHours: number;
  startDate: string;
  endDate: string;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
}
