import { useState, useEffect } from "react";
import DirectoryFilterBar from "./DirectoryFilterBar";
import CongregationCard from "./CongregationCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const DirectoryList = () => {
  const [congregations, setCongregations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCongregations, setFilteredCongregations] = useState([]);

  useEffect(() => {
    const fetchCongregations = async () => {
      try {
        const response = await fetch("/api/congregations.json");
        const data = await response.json();
        setCongregations(data);
        setFilteredCongregations(data);
      } catch (error) {
        console.error("Error fetching congregations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCongregations();
  }, []);

  const handleFilter = (filters) => {
    let filtered = [...congregations];

    if (filters.country) {
      filtered = filtered.filter((c) => c.country === filters.country);
    }
    if (filters.search) {
      filtered = filtered.filter((c) =>
        c.congregation_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredCongregations(filtered);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Church Directory</h1>
      <DirectoryFilterBar onFilter={handleFilter} />

      {filteredCongregations.length === 0 ? (
        <p className="text-gray-600 mt-6">No congregations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredCongregations.map((congregation) => (
            <CongregationCard
              key={congregation.id}
              congregation={congregation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectoryList;
