// API service for MySQL backend
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Set auth token
const setAuthToken = (token) => localStorage.setItem('authToken', token);

// Remove auth token
const removeAuthToken = () => localStorage.removeItem('authToken');

// Auth API
export const authAPI = {
  signup: async (email, password, name, userType) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, userType })
    });
    const data = await response.json();
    if (response.ok) {
      setAuthToken(data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeAuthToken();
    return Promise.resolve();
  },

  verifyToken: async () => {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      removeAuthToken();
      return null;
    }
    return await response.json();
  }
};

// Events API
export const eventsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    return await response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return await response.json();
  },

  create: async (eventData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    return await response.json();
  },

  getOrganizerEvents: async (organizerId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/organizer/${organizerId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  update: async (id, eventData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    return await response.json();
  },

  delete: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: async (userId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  getById: async (bookingId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  create: async (bookingData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  },

  cancel: async (bookingId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};

// Users API
export const usersAPI = {
  getProfile: async (userId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  updateProfile: async (userId, userData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    return await response.json();
  }
};

// Helper to fetch events (for compatibility with existing code)
export const fetchEvents = async () => {
  return await eventsAPI.getAll();
};
