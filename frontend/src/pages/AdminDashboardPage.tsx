import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../services/courseService';
import type { Course } from '../types/course';
import { formatDate } from '../utils/helpers';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { ApiError } from '../types/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Unable to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (course: Course) => {
    setActionSuccess('');
    setActionError('');

    const confirmed = window.confirm(`Are you sure you want to delete "${course.title}"?`);
    if (!confirmed) return;

    setDeletingId(course.id);
    try {
      await deleteCourse(course.id);
      setActionSuccess(`Course "${course.title}" was deleted successfully.`);
      // Refresh course list
      await fetchCourses();
    } catch (err) {
      const apiError = err as ApiError;
      setActionError(
        apiError.message || 'Unable to delete course. It may have existing enrollments.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header page-header--flex">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage training courses and view learner enrollments.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/courses/new')}
          id="create-course-btn"
        >
          + Create New Course
        </button>
      </div>

      {actionSuccess && <div className="alert alert--success">{actionSuccess}</div>}
      {actionError && <div className="alert alert--error">{actionError}</div>}

      {loading && <Loading message="Loading courses..." />}

      {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

      {!loading && !error && courses.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-message">No courses found.</p>
          <p className="empty-state-hint">Click "+ Create New Course" to add your first training course.</p>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="td-title">{course.title}</td>
                  <td>
                    <span className={`badge badge--category badge--${course.category.toLowerCase()}`}>
                      {course.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--level badge--${course.level.toLowerCase()}`}>
                      {course.level}
                    </span>
                  </td>
                  <td>{course.durationHours}h</td>
                  <td>{formatDate(course.startDate)}</td>
                  <td>{formatDate(course.endDate)}</td>
                  <td>
                    <span className="enrollment-count">{course.currentEnrollmentCount}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                        title="Edit Course"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/admin/courses/${course.id}/enrollments`)}
                        title="View Enrollments"
                      >
                        View Enrollments
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(course)}
                        disabled={deletingId === course.id}
                        title="Delete Course"
                      >
                        {deletingId === course.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
