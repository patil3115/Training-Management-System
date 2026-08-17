import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/courses" className="navbar-brand">
          <span className="navbar-logo">📚</span>
          <span className="navbar-title">Training Management Portal</span>
        </NavLink>
        <nav className="navbar-links">
          <NavLink
            to="/courses"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            Courses
          </NavLink>
          <NavLink
            to="/my-enrollments"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            My Enrollments
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
