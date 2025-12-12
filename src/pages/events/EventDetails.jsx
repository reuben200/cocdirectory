import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Info,
  CalendarPlus,
  Share2,
  Tag,
} from "lucide-react";
import CountdownTimer from "../../components/CountdownTimer";

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/events.json");
        if (!res.ok) throw new Error("Failed to fetch events.json");

        const events = await res.json();
        const foundEvent = events.find((item) => String(item.id) === id);
        setEvent(foundEvent || null);
      } catch (error) {
        console.error("Error loading event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Generate calendar URLs
  const generateCalendarLinks = (event) => {
    if (!event) return {};

    const title = encodeURIComponent(event.title || "Event");
    const description = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    // Parse date and time
    const eventDate = event.date || new Date().toISOString().split("T")[0];
    const eventTime = event.time || "09:00";

    // Create ISO date strings
    const startDateTime = new Date(`${eventDate}T${eventTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const formatDateForICS = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    // Google Calendar
    const googleStart = formatDateForGoogle(startDateTime);
    const googleEnd = formatDateForGoogle(endDateTime);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&location=${location}&dates=${googleStart}/${googleEnd}`;

    // Outlook
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}`;

    // Yahoo
    const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${title}&desc=${description}&in_loc=${location}&st=${formatDateForGoogle(
      startDateTime
    )}&et=${formatDateForGoogle(endDateTime)}`;

    // ICS file for Apple Calendar and others
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Church of Christ Directory//Event//EN
BEGIN:VEVENT
UID:${event.id}@churchofchristdirectory.com
DTSTART:${formatDateForICS(startDateTime)}
DTEND:${formatDateForICS(endDateTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
CATEGORIES:${event.category || ""}
ORGANIZER:${event.congregation_name || ""}
END:VEVENT
END:VCALENDAR`;

    return { googleUrl, outlookUrl, yahooUrl, icsContent };
  };

  // Download ICS file
  const downloadICS = () => {
    const { icsContent } = generateCalendarLinks(event);
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowCalendarMenu(false);
  };

  // Share functionality
  const shareEvent = async (platform) => {
    const shareUrl = window.location.href;
    const shareText = `${event.title} - ${event.date} at ${event.time}\n${
      event.description || ""
    }\nLocation: ${event.location || ""}`;
    const shareData = {
      title: event.title,
      text: shareText,
      url: shareUrl,
    };

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
        setShowShareMenu(false);
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      let url = "";
      const fullMessage = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

      switch (platform) {
        case "whatsapp":
          url = `https://wa.me/?text=${fullMessage}`;
          break;
        case "telegram":
          url = `https://t.me/share/url?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(shareText)}`;
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case "linkedin":
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case "email":
          url = `mailto:?subject=${encodeURIComponent(
            event.title
          )}&body=${fullMessage}`;
          break;
        case "copy":
          navigator.clipboard.writeText(shareUrl);
          alert("Link copied to clipboard!");
          setShowShareMenu(false);
          return;
      }
      window.open(url, "_blank");
      setShowShareMenu(false);
    }
  };

  // Format time display
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date display
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Loading event details...
        </p>
      </div>
    );
  }

  // Not found
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Event Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          We couldn't find the event you're looking for. It may have been
          removed or renamed.
        </p>
        <Link
          to="/events"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  const { googleUrl, outlookUrl, yahooUrl } = generateCalendarLinks(event);

  // Main content
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/events"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 overflow-hidden">
          {/* Image */}
          {event.image && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header with Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h1>
                  {event.category && (
                    <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                      <Tag className="w-3 h-3 mr-1" />
                      {event.category}
                    </span>
                  )}
                </div>
                {event.congregation_name && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    <small className="text-base italic text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full mr-2">
                      Hosted by:
                    </small>
                    {event.congregation_name}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Add to Calendar Button */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => {
                      setShowCalendarMenu(!showCalendarMenu);
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Add to Calendar</span>
                  </button>

                  {/* Calendar Dropdown */}
                  {showCalendarMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            window.open(googleUrl, "_blank");
                            setShowCalendarMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          📅 Google Calendar
                        </button>
                        <button
                          onClick={() => {
                            window.open(outlookUrl, "_blank");
                            setShowCalendarMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          📧 Outlook
                        </button>
                        <button
                          onClick={() => {
                            window.open(yahooUrl, "_blank");
                            setShowCalendarMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          📆 Yahoo Calendar
                        </button>
                        <button
                          onClick={downloadICS}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          🍎 Apple Calendar (.ics)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => {
                      setShowShareMenu(!showShareMenu);
                      setShowCalendarMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-semibold text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  {/* Share Dropdown */}
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
                      <div className="py-1">
                        {navigator.share && (
                          <button
                            onClick={() => shareEvent("native")}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            📤 Share via...
                          </button>
                        )}
                        <button
                          onClick={() => shareEvent("whatsapp")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          💬 WhatsApp
                        </button>
                        <button
                          onClick={() => shareEvent("telegram")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          ✈️ Telegram
                        </button>
                        <button
                          onClick={() => shareEvent("twitter")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          🐦 Twitter
                        </button>
                        <button
                          onClick={() => shareEvent("facebook")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          📘 Facebook
                        </button>
                        <button
                          onClick={() => shareEvent("linkedin")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          💼 LinkedIn
                        </button>
                        <button
                          onClick={() => shareEvent("email")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          ✉️ Email
                        </button>
                        <button
                          onClick={() => shareEvent("copy")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-t border-gray-200 dark:border-gray-600"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  About This Event
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                {event.date && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Date
                      </div>
                      <div className="font-medium">
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Time */}
                {event.time && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Time
                      </div>
                      <div className="font-medium">
                        {formatTime(event.time)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </div>
                      <div className="font-medium">{event.location}</div>
                    </div>
                  </div>
                )}

                {/* Congregation */}
                {event.congregation_name && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Organizer
                      </div>
                      <div className="font-medium">
                        {event.congregation_name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event ID */}
                {event.id && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <Info className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Event ID
                      </div>
                      <div className="font-medium">#{event.id}</div>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {event.created_at && (
                  <div className="flex items-start text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Posted
                      </div>
                      <div className="font-medium">
                        {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center mx-auto flex justify-center items-center flex-col text-gray-800 dark:text-gray-200">
              <h1 className="text-xl mb-2">Event Starts In</h1>
              <CountdownTimer eventDate={event.date} />
            </div>

            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to={`/directory/${event.congregation_id}`}
                className="flex-1 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                View Congregation Details
              </Link>
              <Link
                to="/events"
                className="flex-1 text-center bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showCalendarMenu || showShareMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowCalendarMenu(false);
            setShowShareMenu(false);
          }}
        ></div>
      )}
    </section> 
  );
};

export default EventDetailsPage;
