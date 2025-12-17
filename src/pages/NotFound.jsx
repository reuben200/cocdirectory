import { Home, ArrowLeft, Search, Church } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-linear-to-tr from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-4xl w-full text-center">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[200px] md:text-[300px] font-black text-gray-400/30 dark:text-gray-600/30 select-none">
                            404
                        </div>
                    </div>
                    <div className="relative py-12 rounded-full">
                        <div className="inline-flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                                <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-1 rounded-full shadow-2xl w-30 md:w-44">
                                    <img src='/images/coc-logo.webp' className="w-full text-white rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Page Not Found
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-3 max-w-2xl mx-auto">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-500 max-w-xl mx-auto">
                        Don't worry, you can find your way back to discover congregations, events, and fellowship opportunities.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link
                        to="/"
                        className="group relative inline-flex items-center gap-2 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <Home className="relative h-5 w-5" />
                        <span className="relative">Back to Home</span>
                    </Link>

                    <Link
                        to="/directory"
                        className="group inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>Browse Directory</span>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Quick Links
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            to="/directory"
                            className="group p-4 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50"
                        >
                            <Church className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Find Congregations
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Browse our global directory
                            </p>
                        </Link>

                        <Link
                            to="/events"
                            className="group p-4 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50"
                        >
                            <Search className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Upcoming Events
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Join worship and fellowship
                            </p>
                        </Link>

                        <Link
                            to="/about"
                            className="group p-4 bg-linear-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-xl hover:shadow-lg transition-all duration-300 border border-teal-200/50 dark:border-teal-700/50"
                        >
                            <Home className="h-8 w-8 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                About Us
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Learn more about CoC
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Error Code Badge */}
                <div className="mt-8">
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700">
                        Error Code: <span className="ml-2 font-bold text-gray-900 dark:text-white">404</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;