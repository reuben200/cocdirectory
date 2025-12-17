import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Bell,
  Menu,
  X,
  LogOut,
  Church,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const { profile, congregation, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  const user = {
    name: profile.email,
    role: profile.role,
    congregation: congregation?.name || "—",
  };

  const navigationItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Congregation Info", href: "/dashboard/congregation", icon: Church },
    { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Verification", href: "/dashboard/verification", icon: CheckCircle },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
        <h1 className="ml-4 font-bold">CoC Dashboard</h1>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-full w-64 bg-white border-r transform transition ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  {item.name}
                </div>
                {isActive(item.href) && <ChevronRight size={16} />}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center justify-center gap-2 text-red-600 border rounded px-4 py-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="pt-20 lg:pl-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
