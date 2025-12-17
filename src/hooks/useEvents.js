import { useEffect, useState } from "react";
import {
  fetchEvents,
  fetchEventsByCongregation
} from "../utils/api";

const useEvents = (congregationId = null) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);

    const data = congregationId
      ? await fetchEventsByCongregation(congregationId)
      : await fetchEvents();

    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [congregationId]);

  return {
    events,
    loading,
    refetch: loadEvents
  };
};

export default useEvents;
