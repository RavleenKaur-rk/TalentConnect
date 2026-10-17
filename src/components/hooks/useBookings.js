import { useState, useEffect } from 'react';
import { fetchUserBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserBookings(user.uid);
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  return { bookings, loading, error, refetch: () => loadBookings() };
};
