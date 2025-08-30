import { CalendarApp, createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/calendar.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dasboard from './pages/dasboard'; // Kept intentional naming
import Calendar from './pages/Calendar';
import CreatePost from './pages/CreatePost';
import Analytics from './pages/Analytics';
import Footer from './components/Footer';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import './App.css';
import Nofound from './pages/Nofound'


// Utility function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('jwt_token');
  // Optionally verify token validity (e.g., check expiration)
  return !!token;
};

// Protected Route component to handle authentication
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

function App() {
  // State to track if auth check is complete
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Handle token from LinkedIn redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('jwt_token', token);
      // Clean up URL by removing token query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setIsAuthChecked(true);
  }, []);

  // Show loading state until auth check is complete
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <>
                  <Sidebar />
                  <Dasboard />
                  <Footer />
                </>
              }
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              element={
                <>
                  <Sidebar />
                  <Calendar />
                  <Footer />
                </>
              }
            />
          }
        />
        <Route
          path="/CreatePost"
          element={
            <ProtectedRoute
              element={
                <>
                  <Sidebar />
                  <CreatePost />
                  <Footer />
                </>
              }
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              element={
                <>
                  <Sidebar />
                  <Analytics />
                  <Footer />
                </>
              }
            />
          }
        />

<Route
          path="/NotFound"
          element={
            <ProtectedRoute
              element={
                <>
                  <Sidebar />
                  <Nofound/>
                  <Footer />
                </>
              }
            />
          }
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
    </Router>
  );
}

export default App;