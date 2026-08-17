import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../services/courseService';
import { getCourseEnrollments } from '../services/enrollmentService';
import type { Course } from '../types/course';
import type { CourseEnrollment } from '../types/enrollment';
import { formatDate, formatDateTime } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { ApiError } from '../types/api';

export default function AdminCourseEnrollmentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (isNaN(courseId) || courseId <= 0) {
      setError('Invalid course ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [courseData, enrollmentsData] = await Promise.all([
        getCourseById(courseId),
        getCourseEnrollments(courseId),
      ]);
      setCourse(courseData);
      setEnrollments(enrollmentsData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Unable to load course enrollments.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading message="Loading enrollments..." />;

  if (error) {
    return (
      <div className="page">
        <ErrorMessage message={error} onRetry={() => navigate('/admin')} />
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn btn-secondary btn-back" onClick={() => navigate('/admin')}>
        ← Back to Dashboard
      </button>

      {course && (
        <div className="card course-overview-card">
          <div className="course-overview-header">
            <div>
              <span className="badge badge--category badge--active" style={{ marginBottom: '8px' }}>
                Course Enrollments
              </span>
              <h1 className="course-overview-title">{course.title}</h1>
            </div>
            <div className="course-overview-badges">
              <span className={`badge badge--category badge--${course.category.toLowerCase()}`}>
                {course.category}
              </span>
              <span className={`badge badge--level badge--${course.level.toLowerCase()}`}>
                {course.level}
              </span>
            </div>
          </div>

          <div className="course-overview-grid">
            <div className="overview-stat">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{course.durationHours} hours</span>
            </div>
            <div className="overview-stat">
              <span className="stat-label">Start Date</span>
              <span className="stat-value">{formatDate(course.startDate)}</span>
            </div>
            <div className="overview-stat">
              <span className="stat-label">End Date</span>
              <span className="stat-value">{formatDate(course.endDate)}</span>
            </div>
            <div className="overview-stat">
              <span className="stat-label">Total Enrolled</span>
              <span className="stat-value enrollment-highlight">
                {enrollments.length} Learner{enrollments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-message">No learners have enrolled in this course yet.</p>
          <p className="empty-state-hint">Enrollments will appear here once learners enroll.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Learner Name</th>
                <th>Learner Email</th>
                <th>Status</th>
                <th>Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td className="td-title">{enrollment.learnerName}</td>
                  <td>{enrollment.learnerEmail}</td>
                  <td>
                    <StatusBadge status={enrollment.status} />
                  </td>
                  <td>{formatDateTime(enrollment.enrolledOn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
