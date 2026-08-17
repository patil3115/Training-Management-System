import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LearnerEnrollmentsPage from './pages/LearnerEnrollmentsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/learners/:id/enrollments" element={<LearnerEnrollmentsPage />} />
            <Route path="/my-enrollments" element={<Navigate to="/learners/1/enrollments" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <div className="page">
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p className="empty-state-message">Page not found.</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
