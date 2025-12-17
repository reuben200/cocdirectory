import { useEffect, useState } from "react";
import { fetchCongregationById } from "../utils/api";

const useCongregation = (congregationId) => {
  const [congregation, setCongregation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCongregation = async () => {
    if (!congregationId) return;

    setLoading(true);
    const data = await fetchCongregationById(congregationId);
    setCongregation(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCongregation();
  }, [congregationId]);

  return {
    congregation,
    loading,
    refetch: loadCongregation,
    setCongregation // 🔥 optimistic UI
  };
};

export default useCongregation;