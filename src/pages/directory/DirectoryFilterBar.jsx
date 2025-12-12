import { useState } from "react";
import { Search } from "lucide-react";

const DirectoryFilterBar = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  const handleFilterChange = () => {
    onFilter({ search, country });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-center bg-white shadow p-4 rounded-lg">
      <div className="flex items-center w-full md:w-1/2 border rounded-lg px-3 py-2">
        <Search className="mr-2" size={18} />
        <input
          type="text"
          placeholder="Search congregation, preacher, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleFilterChange}
          className="w-full outline-none"
        />
      </div>

      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          handleFilterChange();
        }}
        className="w-full md:w-1/3 border px-3 py-2 rounded-lg"
      >
        <option value="">All Countries</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Ghana">Ghana</option>
        <option value="Kenya">Kenya</option>
        <option value="USA">USA</option>
      </select>
    </div>
  );
};

export default DirectoryFilterBar;
