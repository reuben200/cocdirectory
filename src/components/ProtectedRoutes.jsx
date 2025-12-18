import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRole, requireVerification = false }) => {
  const { isAuthenticated, profile, loading, isMaintenanceMode } = useAuth();

  // ⏳ Wait until auth + profile are ready
  if (loading || (isAuthenticated && profile === null)) {
    return <Spinner />;
  }
  // 🛠️ Maintenance mode check
    if (isMaintenanceMode && profile?.role !== "super_admin") {
      return (
        <div className="flex items-center justify-center h-screen text-center">
          <div>
            <h1 className="text-2xl font-bold">Maintenance Mode</h1>
            <p className="text-gray-500">
              The system is temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      );
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
