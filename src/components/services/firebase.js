import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE5yRL0Vx6a1asXMMioEr3t9Ah2w3QxtM",
  authDomain: "talent-f474d.firebaseapp.com",
  databaseURL: "https://talent-f474d-default-rtdb.firebaseio.com",
  projectId: "talent-f474d",
  storageBucket: "talent-f474d.firebasestorage.app",
  messagingSenderId: "826760976811",
  appId: "1:826760976811:web:34c70fe2619bd047885aee",
  measurementId: "G-7L12448Y3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Enable authentication persistence (already enabled by default in Firebase v9+)
// Firebase automatically persists auth state in browser local storage

export default app;
