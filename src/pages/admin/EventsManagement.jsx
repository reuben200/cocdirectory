import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  Trash2,
  Search,
  CalendarClock,
  CalendarCheck,
  Calendar,
  Tag,
  AlertTriangle,
  X,
  CheckCircle
} from "lucide-react";
import { db } from "../../utils/firebaseConfig";

/* =====================================================
   Helpers
===================================================== */

const formatDate = (value) => {
  if (!value) return "—";
  if (value.toDate) return value.toDate().toLocaleDateString();
  const parsed = new Date(value);
  return isNaN(parsed) ? "—" : parsed.toLocaleDateString();
};

const getEventStatus = (eventDate) => {
  if (!eventDate) return "unknown";

  const now = new Date();

  if (eventDate.toDate) {
    return eventDate.toDate() < now ? "elapsed" : "upcoming";
  }

  const parsed = new Date(eventDate);
  if (isNaN(parsed)) return "unknown";

  return parsed < now ? "elapsed" : "upcoming";
};

/* =====================================================
   Component
===================================================== */

const EventsControl = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  /* =====================================================
     Fetch Events
  ===================================================== */

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchEvents();
  }, []);

  /* =====================================================
     Derived Data
  ===================================================== */

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const status = getEventStatus(evt.date);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const matchesSearch =
        evt.title?.toLowerCase().includes(search.toLowerCase()) ||
        evt.congregation_name?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [events, search, statusFilter]);

  const analytics = useMemo(() => {
    const summary = {
      total: events.length,
      upcoming: 0,
      elapsed: 0,
      categories: {}
    };

    events.forEach(evt => {
      const status = getEventStatus(evt.date);
      if (status === "upcoming") summary.upcoming++;
      if (status === "elapsed") summary.elapsed++;

      if (evt.category) {
        summary.categories[evt.category] =
          (summary.categories[evt.category] || 0) + 1;
      }
    });

    return summary;
  }, [events]);

  /* =====================================================
     Actions
  ===================================================== */

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    for (const id of selected) {
      await deleteDoc(doc(db, "events", id));
    }

    setEvents(prev => prev.filter(e => !selected.includes(e.id)));
    setSelected([]);
    setConfirmBulkDelete(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-900 dark:bg-slate-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Events Moderation</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300 ml-13">
          Manage and monitor events across all congregations
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Events" 
          value={analytics.total} 
          icon={Calendar}
          gradient="from-slate-500 to-slate-600"
        />
        <StatCard
          label="Upcoming"
          value={analytics.upcoming}
          icon={CalendarCheck}
          gradient="from-emerald-500 to-green-600"
        />
        <StatCard
          label="Elapsed"
          value={analytics.elapsed}
          icon={CalendarClock}
          gradient="from-slate-400 to-slate-500"
        />
        <StatCard
          label="Categories"
          value={Object.keys(analytics.categories).length}
          icon={Tag}
          gradient="from-purple-500 to-indigo-600"
        />
      </div>

      {/* Category Breakdown */}
      {Object.keys(analytics.categories).length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Events by Category</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analytics.categories).map(([cat, count]) => (
              <span
                key={cat}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              >
                {cat}: <span className="font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
          <input
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Search by title or congregation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="relative lg:w-48">
          <select
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="elapsed">Elapsed Only</option>
          </select>
        </div>

        {/* Bulk Delete */}
        {selected.length > 0 && (
          <button
            onClick={() => setConfirmBulkDelete(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Trash2 size={18} />
            Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === filteredEvents.length && filteredEvents.length > 0}
                    onChange={() =>
                      setSelected(
                        selected.length === filteredEvents.length
                          ? []
                          : filteredEvents.map(e => e.id)
                      )
                    }
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Event Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Congregation
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredEvents.map(evt => {
                const status = getEventStatus(evt.date);

                return (
                  <tr 
                    key={evt.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(evt.id)}
                        onChange={() => toggleSelect(evt.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500 cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {evt.title}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CalendarClock className="w-4 h-4" />
                        {formatDate(evt.date)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {status === "elapsed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          <CalendarClock className="w-3.5 h-3.5" />
                          Elapsed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Upcoming
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {evt.congregation_name || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {evt.category ? (
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          {evt.category}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        No events match your filters
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredEvents.length > 0 && (
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredEvents.length}</span> of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{events.length}</span> events
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {confirmBulkDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Delete Events
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 ml-15">
                Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">{selected.length}</span> {selected.length === 1 ? 'event' : 'events'}?
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                  ⚠️ This action cannot be undone. All selected events will be permanently removed from the database.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setConfirmBulkDelete(false)}
              >
                Cancel
              </button>

              <button
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={deleteSelected}
              >
                <Trash2 size={16} />
                Delete Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   Enhanced Stat Card
===================================================== */

const StatCard = ({ label, value, icon: Icon, gradient }) => (
  <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
    {/* Background gradient on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className="relative flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
      {Icon && (
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  </div>
);

export default EventsControl;