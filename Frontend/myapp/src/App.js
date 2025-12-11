import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import RegisterPage from "./Components/RegisterPage";
import LoginPage from "./Components/LoginPage";
import PassengerDashboard from "./Components/PassengerDashboard";
import DriverDashboard from "./Components/DriverDashboard";
import HomePage from "./Components/HomePage";
import ForgotPassword from "./Components/ForgotPassword";

// Simple authentication check
const isAuthenticated = () => !!localStorage.getItem("token");

// Get user role from localStorage
const getUserRole = () => localStorage.getItem("role"); // 'DRIVER' or 'PASSENGER'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

// Role-based Route wrapper
const RoleRoute = ({ children, role }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (getUserRole() !== role) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Optional generic dashboard redirect */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {getUserRole() === "DRIVER" ? (
                <Navigate to="/driver-dashboard" replace />
              ) : (
                <Navigate to="/passenger-dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Role-based Dashboards */}
        <Route
          path="/driver-dashboard"
          element={
            <RoleRoute role="DRIVER">
              <DriverDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/passenger-dashboard"
          element={
            <RoleRoute role="PASSENGER">
              <PassengerDashboard />
            </RoleRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
