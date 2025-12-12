import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
    Home,
    Calendar,
    Settings,
    Users,
    Bell,
    Menu,
    X,
    LogOut,
    Church,
    Image,
    CheckCircle,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const location = useLocation();

    const { authState } = useContext(AuthContext);
    const loggedInUser = authState?.user;

    // Fetch simulated data from public/data/users.json
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/users.json");
                const data = await res.json();
                const foundUser = data.find(
                    (u) => u.username === loggedInUser?.username
                );
                setUserData(foundUser || loggedInUser);
            } catch (error) {
                console.error("Error loading user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (loggedInUser) {
            fetchUserData();
        }
    }, [loggedInUser]);

    // Mock notifications - replace with actual data
    const notifications = [
        { id: 1, text: "Your congregation info was updated", time: "2 hours ago", read: false },
        { id: 2, text: "New event published successfully", time: "1 day ago", read: false },
        { id: 3, text: "3 new members joined", time: "2 days ago", read: true }
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

    const navigationItems = [
        { name: "Overview", href: "/dashboard", icon: Home },
        { name: "Congregation Info", href: "/dashboard/congregation", icon: Church },
        { name: "Events", href: "/dashboard/events", icon: Calendar },
        { name: "Verification Status", href: "/dashboard/verification", icon: CheckCircle },
        // { name: "Settings", href: "/dashboard/settings", icon: Settings }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        console.log("Logging out...");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const user = userData || loggedInUser || { name: "Guest", role: "N/A", congregation: "Unknown" };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-cyan-950/30">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-teal-400/20 to-emerald-400/20 dark:from-teal-600/10 dark:to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 z-30 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-linear-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 transition-all duration-300 lg:hidden"
                        >
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <div className="ml-3 lg:ml-0 flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-60 animate-pulse"></div>
                                <div className="relative h-10 w-10 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Church className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    CoC Dashboard
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block font-medium">
                                    {user.congregation || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center space-x-3 sm:space-x-5">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2.5 rounded-xl hover:bg-linear-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 transition-all duration-300 group"
                            >
                                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-linear-to-br from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden">
                                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                                                <Bell className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                                Notifications
                                            </h3>
                                            <span className="px-2.5 py-1 bg-linear-to-r from-blue-600 to-cyan-600 text-white text-xs rounded-full font-bold">
                                                {unreadCount} new
                                            </span>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-linear-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 transition-all duration-300 cursor-pointer ${
                                                    !notif.read ? "bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-l-4 border-blue-600 dark:border-blue-400" : ""
                                                }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-blue-600 dark:bg-blue-400 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notif.text}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                            <span className="mr-1">🕐</span>
                                                            {notif.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                        <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                            View all notifications →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center space-x-3 bg-linear-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-xl px-3 py-2 border border-blue-200/50 dark:border-blue-700/50">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{user.name}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user.role}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-600 rounded-full blur-md opacity-60 animate-pulse"></div>
                                <div className="relative h-10 w-10 rounded-full bg-linear-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg text-lg">
                                    {user.name?.charAt(0) || "U"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-all duration-300 ease-in-out z-20 pt-20 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <nav className="p-4 h-full flex flex-col">
                    {/* Navigation Items */}
                    <div className="flex-1 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                                        active
                                            ? "bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:shadow-md"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {active && (
                                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                                    )}
                                    <div className="relative flex items-center space-x-3">
                                        <Icon className={`h-5 w-5 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                        <span className="font-semibold">{item.name}</span>
                                    </div>
                                    {active && <ChevronRight className="relative h-4 w-4" />}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info Card */}
                    <div className="mt-4 mb-4 p-4 bg-linear-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-600 rounded-full blur-md opacity-60"></div>
                                <div className="relative h-12 w-12 rounded-full bg-linear-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user.name?.charAt(0) || "U"}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user.role}</p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <div className="flex items-center justify-between">
                                <span>Congregation:</span>
                                <span className="font-semibold text-gray-900 dark:text-white truncate ml-2 max-w-[150px]">
                                    {user.congregation || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Status:</span>
                                <span className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center px-4 py-3.5 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-300 font-semibold group hover:shadow-lg hover:shadow-red-500/20"
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

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;