import { useState, useMemo } from "react";

const EventFilterBar = ({ events = [], onFilter }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [congregation, setCongregation] = useState("");

  // Extract unique values dynamically
  const categories = useMemo(() => [...new Set(events.map(e => e.category).filter(Boolean))], [events]);
  const locations = useMemo(() => [...new Set(events.map(e => e.location).filter(Boolean))], [events]);
  const congregations = useMemo(() => [...new Set(events.map(e => e.congregation_name).filter(Boolean))], [events]);

  const apply = () => onFilter({ query, category, location, congregation });

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-3 items-center">
      {/* 🔍 Search */}
      <input
        className="flex-1 border rounded px-3 py-2 w-full"
        placeholder="Search events, description, or congregation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={apply}
      />

      {/* 🏷️ Category */}
      <select
        className="w-48 border rounded px-3 py-2"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          apply();
        }}
      >
        <option value="">All Categories</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      {/* 📍 Location */}
      <select
        className="w-48 border rounded px-3 py-2"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          apply();
        }}
      >
        <option value="">All Locations</option>
        {locations.map((loc, i) => (
          <option key={i} value={loc}>{loc}</option>
        ))}
      </select>

      {/* 🕍 Congregation */}
      <select
        className="w-48 border rounded px-3 py-2"
        value={congregation}
        onChange={(e) => {
          setCongregation(e.target.value);
          apply();
        }}
      >
        <option value="">All Congregations</option>
        {congregations.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      {/* Apply */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        onClick={apply}
      >
        Filter
      </button>
    </div>
  );
};

export default EventFilterBar;
