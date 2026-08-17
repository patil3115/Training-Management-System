import { useNavigate } from 'react-router-dom';
import type { Course } from '../types/course';
import { formatDate } from '../utils/helpers';

interface CourseTableProps {
  courses: Course[];
}

export default function CourseTable({ courses }: CourseTableProps) {
  const navigate = useNavigate();

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p className="empty-state-message">No courses found.</p>
        <p className="empty-state-hint">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
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
            <th>Action</th>
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
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
