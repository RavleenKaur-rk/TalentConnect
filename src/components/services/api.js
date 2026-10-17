import { ref, get, set, push, update, remove } from 'firebase/database';
import { db } from './firebase';

// Events API
export const fetchEvents = async (filters = {}) => {
  try {
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const eventsData = snapshot.val();
    let events = Object.entries(eventsData).map(([id, data]) => ({
      id,
      ...data,
      imageUrl: data.image || data.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'
    })).reverse();
    
    // Apply filters
    if (filters.category && filters.category !== 'All') {
      events = events.filter(e => e.category === filters.category);
    }
    
    if (filters.type && filters.type !== 'All') {
      events = events.filter(e => e.type === filters.type);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      events = events.filter(e => 
        (e.title || '').toLowerCase().includes(search) || 
        (e.description || '').toLowerCase().includes(search) ||
        (e.location || '').toLowerCase().includes(search)
      );
    }
    
    if (filters.location) {
      const location = filters.location.toLowerCase();
      events = events.filter(e => 
        (e.location || '').toLowerCase().includes(location) ||
        (e.title || '').toLowerCase().includes(location)
      );
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEventById = async (id) => {
  try {
    const eventRef = ref(db, `events/${id}`);
    const snapshot = await get(eventRef);
    
    if (snapshot.exists()) {
      return {
        id,
        ...snapshot.val(),
        imageUrl: snapshot.val().image || snapshot.val().imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const createEvent = async (eventData) => {
  try {
    const eventsRef = ref(db, 'events');
    const newEventRef = push(eventsRef);
    
    const newEvent = {
      ...eventData,
      availableSeats: eventData.capacity,
      createdAt: new Date().toISOString()
    };
    
    await set(newEventRef, newEvent);
    return { id: newEventRef.key, ...newEvent };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Bookings API
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = ref(db, 'bookings');
    const newBookingRef = push(bookingsRef);
    
    const booking = {
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    await set(newBookingRef, booking);
    
    // Update available seats
    const eventRef = ref(db, `events/${bookingData.eventId}`);
    const eventSnapshot = await get(eventRef);
    if (eventSnapshot.exists()) {
      const event = eventSnapshot.val();
      await update(eventRef, {
        availableSeats: (event.availableSeats || event.capacity) - bookingData.numberOfTickets
      });
    }
    
    return { id: newBookingRef.key, ...booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const fetchUserBookings = async (userId) => {
  try {
    const bookingsRef = ref(db, 'bookings');
    const snapshot = await get(bookingsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const bookingsData = snapshot.val();
    return Object.entries(bookingsData)
      .filter(([_, data]) => data.userId === userId)
      .map(([id, data]) => ({ id, ...data }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const bookingRef = ref(db, `bookings/${bookingId}`);
    const snapshot = await get(bookingRef);
    
    if (snapshot.exists()) {
      const booking = snapshot.val();
      await update(bookingRef, { status: 'cancelled' });
      
      // Restore available seats
      const eventRef = ref(db, `events/${booking.eventId}`);
      const eventSnapshot = await get(eventRef);
      if (eventSnapshot.exists()) {
        const event = eventSnapshot.val();
        await update(eventRef, {
          availableSeats: (event.availableSeats || 0) + booking.numberOfTickets
        });
      }
      
      return { id: bookingId, ...booking, status: 'cancelled' };
    }
    return null;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};

// Organizer API
export const fetchOrganizerEvents = async (organizerId) => {
  try {
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const eventsData = snapshot.val();
    return Object.entries(eventsData)
      .filter(([_, data]) => data.organizerId === organizerId)
      .map(([id, data]) => ({ id, ...data }));
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    return [];
  }
};

export const fetchOrganizerStats = async (organizerId) => {
  try {
    const events = await fetchOrganizerEvents(organizerId);
    
    const bookingsRef = ref(db, 'bookings');
    const bookingsSnapshot = await get(bookingsRef);
    
    let bookings = [];
    if (bookingsSnapshot.exists()) {
      const bookingsData = bookingsSnapshot.val();
      bookings = Object.entries(bookingsData)
        .filter(([_, data]) => events.some(e => e.id === data.eventId))
        .map(([id, data]) => ({ id, ...data }));
    }
    
    return {
      totalEvents: events.length,
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
    };
  } catch (error) {
    console.error('Error fetching organizer stats:', error);
    return {
      totalEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      upcomingEvents: 0
    };
  }
};
