import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import { DirectoryList, CongregationDetails } from "./pages/directory";
import { EventList, EventDetails } from "./pages/events";
import MainLayout from "./pages/home/MainLayout";
import NotFound from "./pages/NotFound";

import {
  DashboardLayout,
  Verification,
  CongregationProfile,
  DashboardHome,
  EventsManagement
} from "./pages/dashboard";

import {
  CongregationManagement,
  AdminHome,
  AdminLayout,
  EventsControl,
  NotificationManagement,
  UserManagement,
  Reports,
  Settings
} from "./pages/admin";

import ProtectedRoute from "./components/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import Spinner from "./components/Spinner";
import ForceLogout from "./pages/auth/ForceLogout";

const AppRoutes = () => {
  const { loading, isAuthenticated, profile } = useAuth();

  // ⏳ HARD BLOCK until auth + profile are ready
  if (loading || (isAuthenticated && !profile)) {
    return <Spinner />;
  }

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/directory" element={<DirectoryList />} />
        <Route path="/directory/:id" element={<CongregationDetails />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Emergency escape */}
        <Route path="/__logout" element={<ForceLogout />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : profile.role === "super_admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              profile.role === "super_admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Registration />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= CONGREGATION ADMIN ================= */}
      <Route
        element={
          <ProtectedRoute
            allowedRole="congregation_admin"
            requireVerification
          />
        }
      >
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="verification" element={<Verification />} />
          <Route path="congregation" element={<CongregationProfile />} />
          <Route path="events" element={<EventsManagement />} />
        </Route>
      </Route>

      {/* ================= SUPER ADMIN ================= */}
      <Route
        element={<ProtectedRoute allowedRole="super_admin" />}
      >
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="congregations" element={<CongregationManagement />} />
          <Route path="events" element={<EventsControl />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
