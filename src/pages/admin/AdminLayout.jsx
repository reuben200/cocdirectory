import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Church,
  Calendar,
  CheckCircle,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Shield,
  BarChart3,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [admin, setAdmin] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);

  // Mock notifications
  const notifications = [
    { id: 1, text: "5 new congregations pending verification", time: "1 hour ago", read: false },
    { id: 2, text: "New event reported by users", time: "3 hours ago", read: false },
    { id: 3, text: "System backup completed", time: "1 day ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Congregations", href: "/admin/congregations", icon: Church },
    { name: "Verifications", href: "/admin/verifications", icon: CheckCircle, badge: 5 },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users.json");
        const users = await response.json();
        const currentUser = users.find((u) => u.id === authState?.user?.id);
        if (currentUser) setAdmin(currentUser);
        else {
          logout();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, [authState?.user?.id, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 dark:text-indigo-500 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
            Loading your admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in again to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="ml-3 flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Manage your platform</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Notifications
                      </h3>
                      <span className="px-2.5 py-1 bg-indigo-600 dark:bg-indigo-500 text-white text-xs rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notif.read ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-400" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notif.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{admin.username}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize font-medium">{admin.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md text-lg">
                {admin.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out z-20 pt-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="flex flex-col h-full p-4">
          {/* Navigation Items */}
          <div className="flex-1 space-y-2 mt-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="relative flex items-center space-x-3 flex-1">
                    <Icon className={`h-5 w-5 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <div className="relative flex items-center space-x-2">
                    {item.badge && (
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-bold ${
                          active
                            ? "bg-white text-indigo-600"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {active && <ChevronRight className="h-4 w-4" />}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Info Card */}
          <div className="mt-4 mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {admin.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{admin.username}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">{admin.role} Access</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-4 py-3.5 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-semibold group"
          >
            <LogOut className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative pt-24 lg:pl-72 transition-all min-h-screen">
        <div className="p-6 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;