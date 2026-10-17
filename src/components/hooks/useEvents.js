import { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents(filters);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [JSON.stringify(filters)]);

  return { events, loading, error };
};
