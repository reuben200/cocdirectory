import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events.json")
      .then((r) => r.json())
      .then((d) => setEvents(d.slice(0, 4)));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join us for worship services, bible studies, and fellowship
            gatherings across our congregations.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No upcoming events at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-2xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {ev.title}
                  </h3>

                  {/* Event Description */}
                  {ev.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 shrink-0" />
                      <span>{ev.date}</span>
                    </div>

                    {/* Time */}
                    {ev.time && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                    )}

                    {/* Congregation */}
                    {ev.congregation_name && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 shrink-0" />
                        <span>{ev.congregation_name}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Link */}
                  {ev.id && (
                    <a
                      href={`/events/${ev.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        {events.length > 0 && (
          <div className="text-center">
            <Link
              to={"/events"}
              className="inline-flex items-center bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
            >
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
