import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuthRole, isAuthenticated, type AuthRole } from "../../lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AuthRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const role = getAuthRole();
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
