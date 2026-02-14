import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import History from "./pages/History";
import Emergency from "./pages/Emergency";
import CheckIn from "./pages/CheckIn";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Competition from "./pages/Competition";
import LandingPage from "./pages/LandingPage";
import Loader from "./components/Loader";
import "./styles/App.scss";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect to /app if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // If user is logged in and trying to access public pages (like Landing, Login, Register)
  if (user) {
    // If on landing page (root), redirect to app
    // If on login/register, redirect to app
    return <Navigate to="/app" replace />;
  }

  return children;
};

// Main App Layout with Bottom Nav
const AppLayout = ({ children }) => {
  return (
    <div className="app">
      {children}
      <BottomNav />
    </div>
  );
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Moved to /app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <History />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <Emergency />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CheckIn />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/competition"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Competition />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
