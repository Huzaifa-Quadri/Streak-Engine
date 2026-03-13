import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import History from "./pages/History";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Competition from "./pages/Competition";
import Loader from "./components/Loader";
import ProgressLoader from "./components/ProgressLoader";
import "./styles/App.scss";

// Lazy-load LandingPage — three.js/gsap/framer-motion only downloaded when needed
const LandingPage = React.lazy(() => import("./pages/LandingPage"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <ProgressLoader />;
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

  // Keep-alive ping from client: wakes up the server while user reads landing page
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/health" || "http://localhost:5000/api/health")
      .catch((err) => console.log("Health ping silenced:", err));
  }, []);

  if (loading) {
    return <ProgressLoader />;
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
      {/* Public Landing Page — lazy loaded */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Suspense fallback={null}>
              <LandingPage />
            </Suspense>
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
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProfile />
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
