import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register, Login } from './pages/Auth';
import { ServiceBrowse, FreelancerDashboard } from './pages/Services';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { useAuthStore } from './store/authStore';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h1>Vibe Marketplace</h1>
            </div>
            <div className="nav-links">
              {isAuthenticated ? (
                <>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/services">Browse Services</a>
                  {user?.role === 'freelancer' && (
                    <a href="/freelancer-dashboard">My Services</a>
                  )}
                  <span className="user-info">
                    {user?.name} ({user?.role})
                  </span>
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login">Login</a>
                  <a href="/register">Register</a>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServiceBrowse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer-dashboard"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
