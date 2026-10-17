import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ============= AUTHENTICATION =============

export const signup = async (username, email, password, userType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user info in Firestore
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      username,
      email,
      userType,
      createdAt: new Date()
    });

    return { success: true, user: { uid: user.uid, email } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    return { 
      success: true, 
      token,
      user: { uid: user.uid, email } 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// ============= EVENTS =============

export const getEvents = async (category = null, location = null) => {
  try {
    const eventsRef = collection(db, 'events');
    let q = eventsRef;
    
    const snapshot = await getDocs(q);
    let events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter
    if (category) {
      events = events.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }
    if (location) {
      events = events.filter(e => e.location?.toLowerCase().includes(location.toLowerCase()));
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    return { success: true, event: { id: eventDoc.id, ...eventDoc.data() } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createEvent = async (eventData) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const newEvent = {
      ...eventData,
      artistId: user.uid,
      createdAt: new Date(),
      status: 'PUBLISHED'
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return { success: true, eventId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============= BOOKINGS =============

export const getMyBookings = async (userId) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('clientId', '==', userId));
    
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, bookings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const newBooking = {
      ...bookingData,
      clientId: user.uid,
      status: 'PENDING',
      confirmationCode: `BOOKING_${Date.now()}`,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'bookings'), newBooking);
    return { 
      success: true, 
      bookingId: docRef.id,
      confirmationCode: newBooking.confirmationCode
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { 
      status,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============= USERS =============

export const getUserProfile = async (userId) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'User not found' };
    }

    const userDoc = snapshot.docs[0];
    return { success: true, user: { id: userDoc.id, ...userDoc.data() } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'User not found' };
    }

    const userDocRef = doc(db, 'users', snapshot.docs[0].id);
    await updateDoc(userDocRef, {
      ...profileData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
