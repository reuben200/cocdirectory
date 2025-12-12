import { Search, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/directory?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("https://cdn.pixabay.com/photo/2020/05/25/13/15/golden-weddings-5218598_1280.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-snug font-serif">
            Find a <br />
            <span className="text-sky-200 dark:text-sky-300 font-extrabold text-5xl md:text-6xl lg:text-8xl">
              Church{" "}
              <span className="text-blue-400 dark:text-blue-300 italic">
                of
              </span>{" "}
              Christ
            </span>
            <br />
            <span className="text-blue-200 dark:text-blue-100">Near You</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-8 max-w-3xl mx-auto">
            Connect with congregations worldwide. Discover worship times,
            events, and fellowship opportunities.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by location, congregation name, or preacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
                className="w-full pl-14 pr-2 py-3 text-lg rounded-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-sky-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-700 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-30 backdrop-blur-sm rounded-lg p-6 border border-gray-500 dark:border-gray-700 border-opacity-20 dark:border-opacity-30">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-500 dark:text-blue-400" />
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-blue-100 dark:text-blue-200">
                Congregations
              </div>
            </div>
            <div className="bg-gray-700 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-30 backdrop-blur-sm rounded-lg p-6 border border-gray-500 dark:border-gray-700 border-opacity-20 dark:border-opacity-30">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-500 dark:text-blue-400" />
              <div className="text-3xl font-bold mb-1">1,200+</div>
              <div className="text-blue-100 dark:text-blue-200">
                Upcoming Events
              </div>
            </div>
            <div className="bg-gray-700 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-30 backdrop-blur-sm rounded-lg p-6 border border-gray-500 dark:border-gray-700 border-opacity-20 dark:border-opacity-30">
              <svg
                className="h-8 w-8 mx-auto mb-3 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-blue-100 dark:text-blue-200">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
