import { useState, useEffect, useCallback } from 'react';
import { getCourses } from '../services/courseService';
import type { Course, CourseFilters } from '../types/course';
import CourseTable from '../components/CourseTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { ApiError } from '../types/api';

const CATEGORIES = ['', 'Backend', 'Frontend', 'Cloud', 'DataScience', 'Business', 'Design'];
const LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = useCallback(async (filters?: CourseFilters) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCourses(filters);
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Unable to load courses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleApplyFilters = () => {
    const filters: CourseFilters = {};
    if (search.trim()) filters.search = search.trim();
    if (category) filters.category = category;
    if (level) filters.level = level;
    fetchCourses(filters);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    fetchCourses();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">Browse available training courses and enroll today.</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            id="course-search"
          />
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="category-filter"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'DataScience' ? 'Data Science' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            id="level-filter"
          >
            <option value="">All Levels</option>
            {LEVELS.filter(Boolean).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleApplyFilters} id="apply-filters">
            Apply
          </button>
          <button className="btn btn-secondary" onClick={handleClearFilters} id="clear-filters">
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <Loading message="Loading courses..." />}

      {error && <ErrorMessage message={error} onRetry={() => fetchCourses()} />}

      {!loading && !error && <CourseTable courses={courses} />}
    </div>
  );
}
