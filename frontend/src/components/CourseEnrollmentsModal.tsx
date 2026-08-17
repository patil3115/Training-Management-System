import { useState, useEffect } from 'react';
import type { CourseEnrollment } from '../types/enrollment';
import { getCourseEnrollments } from '../services/enrollmentService';
import { formatDateTime } from '../utils/helpers';
import StatusBadge from './StatusBadge';
import Loading from './Loading';
import type { ApiError } from '../types/api';

interface CourseEnrollmentsModalProps {
  courseId: number;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseEnrollmentsModal({
  courseId,
  courseTitle,
  isOpen,
  onClose,
}: CourseEnrollmentsModalProps) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchEnrollments();
    }
  }, [isOpen, courseId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCourseEnrollments(courseId);
      setEnrollments(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load enrollments.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Enrollments — {courseTitle}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <Loading message="Loading enrollments..." />}

          {error && <div className="alert alert--error">{error}</div>}

          {!loading && !error && enrollments.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-message">No enrollments yet for this course.</p>
            </div>
          )}

          {!loading && !error && enrollments.length > 0 && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Learner Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Enrolled On</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment, index) => (
                    <tr key={enrollment.id}>
                      <td>{index + 1}</td>
                      <td>{enrollment.learnerName}</td>
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
      </div>
    </div>
  );
}
