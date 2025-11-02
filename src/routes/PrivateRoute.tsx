// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * PrivateRoute
 * 
 * Wraps protected routes to ensure only authenticated users can access them.
 * If not authenticated, redirects to /login.
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Optional: show nothing or a loader while checking auth
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
        }}
      >
        <p style={{ fontSize: 18, color: "#555" }}>Checking authentication...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected page
  return <>{children}</>;
};

export default PrivateRoute;
