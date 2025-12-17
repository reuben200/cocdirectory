import { useEffect, useState } from "react";
import { fetchCongregations } from "../utils/api";

const useCongregations = () => {
  const [congregations, setCongregations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCongregations = async () => {
    try {
      setLoading(true);
      const data = await fetchCongregations();
      setCongregations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCongregations();
  }, []);

  return {
    congregations,
    loading,
    error,
    refetch: loadCongregations
  };
};

export default useCongregations;
