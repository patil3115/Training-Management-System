import { useState } from 'react';
import { createOrGetLearner } from '../services/learnerService';
import { createEnrollment } from '../services/enrollmentService';
import { isValidEmail } from '../utils/helpers';
import type { ApiError } from '../types/api';

interface EnrollmentFormProps {
  courseId: number;
  onEnrollmentSuccess: () => void;
}

export default function EnrollmentForm({ courseId, onEnrollmentSuccess }: EnrollmentFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Frontend validation
    if (!fullName.trim()) {
      setErrorMessage('Learner name is required.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create or get learner
      const learner = await createOrGetLearner({
        fullName: fullName.trim(),
        email: email.trim(),
      });

      // Step 2: Create enrollment
      await createEnrollment({
        courseId: courseId,
        learnerId: learner.id,
      });

      // Step 3: Show success
      setSuccessMessage('🎉 Enrollment successful! You have been enrolled in this course.');
      setFullName('');
      setEmail('');

      // Step 4: Refresh course details (enrollment count)
      onEnrollmentSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      setErrorMessage(apiError.message || 'An error occurred during enrollment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="enrollment-form-card">
      <h3 className="enrollment-form-title">Enroll in Course</h3>

      {successMessage && (
        <div className="alert alert--success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert--error">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Learner Name
          </label>
          <input
            type="text"
            id="fullName"
            className="form-input"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? 'Enrolling...' : 'Enroll Now'}
        </button>
      </form>
    </div>
  );
}
