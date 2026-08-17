import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../services/courseService';
import type { Course } from '../types/course';
import { formatDate } from '../utils/helpers';
import EnrollmentForm from '../components/EnrollmentForm';
import CourseEnrollmentsModal from '../components/CourseEnrollmentsModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { ApiError } from '../types/api';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEnrollments, setShowEnrollments] = useState(false);

  const courseId = Number(id);

  const fetchCourse = useCallback(async () => {
    if (isNaN(courseId) || courseId <= 0) {
      setError('Invalid course ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Course not found.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleEnrollmentSuccess = () => {
    fetchCourse(); // Refresh to update enrollment count
  };

  if (loading) return <Loading message="Loading course details..." />;

  if (error) {
    return (
      <div className="page">
        <ErrorMessage message={error} onRetry={() => navigate('/courses')} />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-back" onClick={() => navigate('/courses')}>
        ← Back to Courses
      </button>

      <div className="course-details-layout">
        {/* Course Information Card */}
        <div className="course-info-card">
          <div className="course-info-header">
            <h1 className="course-info-title">{course.title}</h1>
            <div className="course-info-badges">
              <span className={`badge badge--category badge--${course.category.toLowerCase()}`}>
                {course.category}
              </span>
              <span className={`badge badge--level badge--${course.level.toLowerCase()}`}>
                {course.level}
              </span>
            </div>
          </div>

          {course.description && (
            <p className="course-info-description">{course.description}</p>
          )}

          <div className="course-info-grid">
            <div className="course-info-item">
              <span className="course-info-label">📅 Start Date</span>
              <span className="course-info-value">{formatDate(course.startDate)}</span>
            </div>
            <div className="course-info-item">
              <span className="course-info-label">📅 End Date</span>
              <span className="course-info-value">{formatDate(course.endDate)}</span>
            </div>
            <div className="course-info-item">
              <span className="course-info-label">⏱️ Duration</span>
              <span className="course-info-value">{course.durationHours} hours</span>
            </div>
            <div className="course-info-item">
              <span className="course-info-label">👥 Current Enrolled</span>
              <span className="course-info-value enrollment-highlight">
                {course.currentEnrollmentCount} Learner{course.currentEnrollmentCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowEnrollments(true)}
            id="view-enrollments-btn"
          >
            View Enrollments
          </button>
        </div>

        {/* Enrollment Form */}
        <EnrollmentForm courseId={courseId} onEnrollmentSuccess={handleEnrollmentSuccess} />
      </div>

      {/* Enrollments Modal */}
      <CourseEnrollmentsModal
        courseId={courseId}
        courseTitle={course.title}
        isOpen={showEnrollments}
        onClose={() => setShowEnrollments(false)}
      />
    </div>
  );
}
