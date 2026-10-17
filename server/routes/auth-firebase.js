const express = require('express');
const router = express.Router();
const { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} = require('firebase/auth');
const { auth } = require('../config/firebase');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username required' });
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Firebase
    await auth.currentUser.getIdToken();

    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        uid: user.uid,
        email: user.email,
        username: username,
        userType: userType || 'CLIENT'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        uid: user.uid,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Verify Token
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Firebase
    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      success: true,
      user: decodedToken
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
