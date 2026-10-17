const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { collection, getDocs, addDoc, query, where, updateDoc, deleteDoc, doc, getDoc } = require('firebase/firestore');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'bookings'));
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings/:userId', async (req, res) => {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('clientId', '==', req.params.userId)
    );
    
    const snapshot = await getDocs(bookingsQuery);
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { clientId, eventId, seats, amount, eventName } = req.body;

    if (!clientId || !eventId || !seats || !amount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newBooking = {
      clientId,
      eventId,
      eventName,
      seats: parseInt(seats),
      amount: parseFloat(amount),
      status: 'PENDING',
      confirmationCode: `BOOKING_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'bookings'), newBooking);

    res.json({
      success: true,
      message: 'Booking created',
      bookingId: docRef.id,
      confirmationCode: newBooking.confirmationCode
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const bookingRef = doc(db, 'bookings', req.params.id);
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Booking updated' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'bookings', req.params.id));
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
