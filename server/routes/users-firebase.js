const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { collection, getDoc, updateDoc, doc } = require('firebase/firestore');

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', req.params.userId));
    
    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const userRef = doc(db, 'users', req.params.userId);
    await updateDoc(userRef, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
