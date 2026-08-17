import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getLearnerEnrollments } from '../services/enrollmentService';
import { getLearnerById } from '../services/learnerService';
import type { LearnerEnrollment, Learner } from '../types/learner';
import { formatDateTime } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { ApiError } from '../types/api';

export default function LearnerEnrollmentsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Support both /learners/:id/enrollments and /learners/enrollments?learnerId=X
  const learnerId = Number(id) || Number(searchParams.get('learnerId')) || 0;

  const [enrollments, setEnrollments] = useState<LearnerEnrollment[]>([]);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (learnerId <= 0) {
      setError('Please provide a valid learner ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [enrollmentsData, learnerData] = await Promise.all([
        getLearnerEnrollments(learnerId),
        getLearnerById(learnerId),
      ]);
      setEnrollments(enrollmentsData);
      setLearner(learnerData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Unable to load enrollments.');
    } finally {
      setLoading(false);
    }
  }, [learnerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading message="Loading enrollments..." />;

  if (error) return (
    <div className="page">
      <ErrorMessage message={error} onRetry={fetchData} />
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Enrollments</h1>
        {learner && (
          <p className="page-subtitle">
            Showing enrollments for <strong>{learner.fullName}</strong> ({learner.email})
          </p>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p className="empty-state-message">No enrollments found.</p>
          <p className="empty-state-hint">Browse courses and enroll to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Title</th>
                <th>Status</th>
                <th>Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td className="td-title">{enrollment.courseTitle}</td>
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
