import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [learnerId, setLearnerId] = useState('1');

  const handleViewEnrollments = () => {
    const id = parseInt(learnerId, 10);
    if (id > 0) {
      navigate(`/learners/${id}/enrollments`);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">View your profile and access your enrollments.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h2 className="profile-name">Training Portal User</h2>
          <p className="profile-detail">Use the form below to look up enrollments by learner ID.</p>
        </div>
      </div>

      <div className="profile-actions-card">
        <h3>Quick Navigation</h3>
        <div className="learner-lookup">
          <div className="form-group">
            <label htmlFor="learnerId" className="form-label">
              Learner ID
            </label>
            <input
              type="number"
              id="learnerId"
              className="form-input"
              min="1"
              value={learnerId}
              onChange={(e) => setLearnerId(e.target.value)}
              placeholder="Enter learner ID"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleViewEnrollments}
            disabled={!learnerId || parseInt(learnerId, 10) <= 0}
            id="view-my-enrollments-btn"
          >
            View Enrollments
          </button>
        </div>
      </div>
    </div>
  );
}
