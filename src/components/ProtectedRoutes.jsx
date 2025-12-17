import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRole, requireVerification = false }) => {
  const { isAuthenticated, profile, loading } = useAuth();

  // ⏳ Wait until auth + profile are ready
  if (loading || (isAuthenticated && profile === null)) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role gate
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // 🛡️ Verification applies ONLY to congregation admins
  if (
    requireVerification &&
    profile.role === "congregation_admin" &&
    !profile.verified
  ) {
    return <Navigate to="/dashboard/verification" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
