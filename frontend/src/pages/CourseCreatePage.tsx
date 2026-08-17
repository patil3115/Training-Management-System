import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../services/courseService';
import type { ApiError } from '../types/api';

const CATEGORIES = ['Backend', 'Frontend', 'Cloud', 'DataScience', 'Business', 'Design'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CourseCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Backend');
  const [level, setLevel] = useState('Beginner');
  const [durationHours, setDurationHours] = useState<number | ''>(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Frontend validation
    if (!title.trim()) {
      setErrorMessage('Course title is required.');
      return;
    }
    if (title.length > 100) {
      setErrorMessage('Course title cannot exceed 100 characters.');
      return;
    }
    if (description.length > 250) {
      setErrorMessage('Description cannot exceed 250 characters.');
      return;
    }
    if (!durationHours || Number(durationHours) <= 0) {
      setErrorMessage('Duration must be greater than 0 hours.');
      return;
    }
    if (!startDate) {
      setErrorMessage('Start date is required.');
      return;
    }
    if (!endDate) {
      setErrorMessage('End date is required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('End date cannot be earlier than start date.');
      return;
    }

    setSubmitting(true);

    try {
      await createCourse({
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        category,
        level,
        durationHours: Number(durationHours),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      navigate('/admin');
    } catch (err) {
      const apiError = err as ApiError;
      setErrorMessage(apiError.message || 'Failed to create course. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <button className="btn btn-secondary btn-back" onClick={() => navigate('/admin')}>
        ← Back to Dashboard
      </button>

      <div className="card">
        <h1 className="card-title">Create New Course</h1>
        <p className="card-subtitle">Fill in the details below to publish a new training course.</p>

        {errorMessage && <div className="alert alert--error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Course Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              placeholder="e.g. Advanced TypeScript Patterns"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              required
            />
            <span className="form-hint">{title.length}/100 characters</span>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-input form-textarea"
              placeholder="Brief course overview and learning objectives..."
              maxLength={250}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
            <span className="form-hint">{description.length}/250 characters</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'DataScience' ? 'Data Science' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level" className="form-label">
                Level <span className="text-danger">*</span>
              </label>
              <select
                id="level"
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={submitting}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration" className="form-label">
              Duration (Hours) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="duration"
              className="form-input"
              min={1}
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value ? Number(e.target.value) : '')}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Course...' : 'Create Course'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
