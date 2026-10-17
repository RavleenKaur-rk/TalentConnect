const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { collection, getDocs, getDoc, addDoc, query, where, updateDoc, deleteDoc, doc } = require('firebase/firestore');

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, location, sortBy } = req.query;
    
    let eventsQuery = collection(db, 'events');
    const snapshot = await getDocs(eventsQuery);
    
    let events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter by category
    if (category) {
      events = events.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }

    // Filter by location
    if (location) {
      events = events.filter(e => e.location?.toLowerCase().includes(location.toLowerCase()));
    }

    // Sort
    if (sortBy === 'price-low') {
      events.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      events.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'date') {
      events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', req.params.id));
    
    if (!eventDoc.exists()) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      event: {
        id: eventDoc.id,
        ...eventDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create event (organizer only)
router.post('/', async (req, res) => {
  try {
    const { name, category, date, time, location, capacity, price, description, artistId } = req.body;

    if (!name || !category || !date || !location || !price) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newEvent = {
      name,
      category,
      date,
      time,
      location,
      capacity: capacity || 100,
      price: parseFloat(price),
      description,
      artistId,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);

    res.json({
      success: true,
      message: 'Event created',
      eventId: docRef.id
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const eventRef = doc(db, 'events', req.params.id);
    await updateDoc(eventRef, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Event updated' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'events', req.params.id));
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
