# 📋 TalentConnect - Complete Function List

## 🎯 Overview
All functions, hooks, and utilities used in the TalentConnect project (Frontend + Backend)

---

## 🔐 **Authentication Functions** (`src/services/firebaseApi.js`)

### User Registration & Login
```javascript
// 1. signup(username, email, password, userType)
// Creates new user in Firebase Auth + Firestore
// Returns: { success: true, user: { uid, email } }

// 2. login(email, password)
// Logs in user with Firebase
// Returns: { success: true, token, user: { uid, email } }

// 3. logout()
// Signs out current user
// Returns: { success: true }

// 4. getCurrentUser()
// Gets current authenticated user
// Returns: Promise<User>
```

---

## 📊 **Event Functions** (`src/services/firebaseApi.js`)

### Event Management
```javascript
// 5. getEvents(category, location)
// Fetches all events with optional filters
// Returns: { success: true, events: [] }

// 6. getEventById(eventId)
// Gets single event details
// Returns: { success: true, event: {...} }

// 7. createEvent(eventData)
// Creates new event (organizer only)
// Returns: { success: true, eventId }

// 8. updateEvent(eventId, updates)
// Updates existing event
// Returns: { success: true }

// 9. deleteEvent(eventId)
// Deletes event
// Returns: { success: true }
```

---

## 🎟️ **Booking Functions** (`src/services/firebaseApi.js`)

### Booking Management
```javascript
// 10. getMyBookings(userId)
// Gets user's all bookings
// Returns: { success: true, bookings: [] }

// 11. createBooking(bookingData)
// Creates new booking
// Data: { clientId, eventId, eventName, seats, amount }
// Returns: { success: true, bookingId, confirmationCode }

// 12. updateBookingStatus(bookingId, status)
// Updates booking status (PENDING/CONFIRMED/CANCELLED)
// Returns: { success: true }

// 13. cancelBooking(bookingId)
// Cancels a booking
// Returns: { success: true }
```

---

## 👤 **User Profile Functions** (`src/services/firebaseApi.js`)

### Profile Management
```javascript
// 14. getUserProfile(userId)
// Gets user's profile details
// Returns: { success: true, user: {...} }

// 15. updateUserProfile(userId, profileData)
// Updates user profile
// Returns: { success: true }
```

---

## ⚛️ **React Hooks** 

### Custom Hooks (`src/components/hooks/`)

```javascript
// 16. useAuth()
// Hook for accessing authentication context
// Returns: { currentUser, userData, loading, logout, user }
// File: context/AuthContext.jsx

// 17. useBookings()
// Hook for managing user bookings
// Returns: { bookings, loading, error, refetch }
// File: hooks/useBookings.js

// 18. useEvents()
// Hook for managing events
// Returns: { events, loading, error, refetch }
// File: hooks/useEvents.js
```

### Context API

```javascript
// 19. onAuthStateChanged()
// Firebase listener for auth state changes
// File: context/AuthContext.jsx

// 20. AuthProvider()
// Context provider component for authentication
// File: context/AuthContext.jsx
```

---

## 🎨 **Component Functions**

### Header Component (`src/components/common/Header.jsx`)

```javascript
// 21. toggleMenu()
// Toggles mobile menu open/close
// Returns: void

// 22. toggleDropdown()
// Toggles user dropdown menu
// Returns: void

// 23. handleLogout()
// Handles user logout
// Returns: Promise

// 24. isActive(path)
// Checks if route is active
// Returns: boolean

// 25. handleClickOutside(e)
// Closes dropdown when clicking outside
// Returns: void
```

### Home Page (`src/pages/Home.jsx`)

```javascript
// 26. loadEvents()
// Loads featured events from Firebase
// Returns: Promise

// 27. detectLocation()
// Detects user's geolocation
// Uses: Geolocation API + Nominatim reverse geocoding
// Returns: void (updates state)

// 28. searchEvents()
// Searches events by location
// Returns: void (navigates)

// 29. bookEvent(eventId)
// Navigates to booking page
// Returns: void
```

---

## 🔥 **Firebase Functions**

### Firebase Initialization (`src/services/firebase.js`)

```javascript
// 30. initializeApp(config)
// Initializes Firebase app
// Returns: app instance

// 31. getAuth(app)
// Gets Firebase Auth instance
// Returns: auth instance

// 32. getFirestore(app)
// Gets Firestore instance (if using Firestore)
// Returns: firestore instance

// 33. getDatabase(app)
// Gets Realtime Database instance
// Returns: database instance
```

### Firebase Authentication

```javascript
// 34. createUserWithEmailAndPassword(auth, email, password)
// Firebase Auth function for signup
// Returns: UserCredential

// 35. signInWithEmailAndPassword(auth, email, password)
// Firebase Auth function for login
// Returns: UserCredential

// 36. signOut(auth)
// Firebase Auth function for logout
// Returns: Promise

// 37. onAuthStateChanged(auth, callback)
// Firebase listener for auth state
// Returns: unsubscribe function
```

### Firebase Realtime Database

```javascript
// 38. ref(database, path)
// Creates reference to database location
// Returns: DatabaseReference

// 39. get(ref)
// Gets data from database
// Returns: Promise<DataSnapshot>

// 40. set(ref, value)
// Sets data in database
// Returns: Promise

// 41. update(ref, updates)
// Updates data in database
// Returns: Promise

// 42. remove(ref)
// Deletes data from database
// Returns: Promise

// 43. child(ref, path)
// Gets child reference
// Returns: DatabaseReference
```

### Firebase Firestore (Backup)

```javascript
// 44. collection(db, collectionName)
// Gets Firestore collection reference
// Returns: CollectionReference

// 45. addDoc(collection, data)
// Adds document to collection
// Returns: Promise<DocumentReference>

// 46. getDocs(query)
// Gets documents from Firestore
// Returns: Promise<QuerySnapshot>

// 47. getDoc(docRef)
// Gets single document
// Returns: Promise<DocumentSnapshot>

// 48. updateDoc(docRef, data)
// Updates Firestore document
// Returns: Promise

// 49. deleteDoc(docRef)
// Deletes Firestore document
// Returns: Promise

// 50. query(ref, ...constraints)
// Creates Firestore query
// Returns: Query

// 51. where(field, operator, value)
// Creates where constraint for Firestore
// Returns: QueryConstraint
```

---

## 🎛️ **React Router Functions** (`src/App.jsx`)

```javascript
// 52. useNavigate()
// Hook for navigation
// Returns: navigate function

// 53. useLocation()
// Hook for current location
// Returns: location object

// 54. BrowserRouter()
// Router component
// Wraps app for routing

// 55. Routes()
// Container for Route components
// Returns: JSX

// 56. Route()
// Individual route definition
// Props: path, element

// 57. Navigate()
// Component for programmatic navigation
// Returns: JSX

// 58. Link()
// Navigation link component
// Returns: JSX

// 59. ProtectedRoute(children, allowedUserTypes)
// Custom component for protected routes
// Returns: JSX

// 60. GuestRoute(children)
// Custom component for guest-only routes
// Returns: JSX
```

---

## 🛠️ **Utility & Browser Functions**

```javascript
// 61. fetch(url, options)
// Standard fetch API for HTTP requests
// Used in: Location detection

// 62. navigator.geolocation.getCurrentPosition()
// Gets user's geolocation
// Used in: Home.jsx for location detection
// Returns: Position object

// 63. setInterval(callback, delay)
// Sets recurring timer
// Used in: Carousel auto-slide

// 64. clearInterval(id)
// Clears interval
// Used in: Cleanup

// 65. useState(initialValue)
// React hook for state management
// Returns: [state, setState]

// 66. useEffect(callback, dependencies)
// React hook for side effects
// Returns: cleanup function

// 67. useContext(Context)
// React hook for accessing context
// Returns: context value

// 68. createContext(initialValue)
// React function to create context
// Returns: Context object

// 69. useCallback(callback, dependencies)
// React hook for memoized callback
// Returns: memoized callback

// 70. useMemo(callback, dependencies)
// React hook for memoized value
// Returns: memoized value
```

---

## 📱 **API Endpoints** (Backend - `server-firebase.js`)

### Authentication Endpoints

```javascript
// POST /api/auth/signup
// Creates new user account
// Body: { username, email, password, userType }
// Response: { success, message, user }

// POST /api/auth/login
// Logs in user
// Body: { email, password }
// Response: { success, message, token, user }

// GET /api/auth/verify-token
// Verifies JWT token
// Headers: { Authorization: "Bearer {token}" }
// Response: { success, user }
```

### Events Endpoints

```javascript
// GET /api/events
// Gets all events with filters
// Query: { category, location, sortBy }
// Response: { success, events }

// GET /api/events/:id
// Gets single event
// Response: { success, event }

// POST /api/events
// Creates new event (organizer)
// Body: { name, category, date, time, location, price... }
// Response: { success, message, eventId }

// PUT /api/events/:id
// Updates event
// Body: { ...updates }
// Response: { success, message }

// DELETE /api/events/:id
// Deletes event
// Response: { success, message }
```

### Bookings Endpoints

```javascript
// GET /api/bookings
// Gets all bookings
// Response: { success, bookings }

// GET /api/bookings/my-bookings/:userId
// Gets user's bookings
// Response: { success, bookings }

// POST /api/bookings
// Creates new booking
// Body: { clientId, eventId, seats, amount, eventName }
// Response: { success, message, bookingId, confirmationCode }

// PUT /api/bookings/:id
// Updates booking status
// Body: { status }
// Response: { success, message }

// DELETE /api/bookings/:id
// Cancels booking
// Response: { success, message }
```

### Users Endpoints

```javascript
// GET /api/users/:userId
// Gets user profile
// Response: { success, user }

// PUT /api/users/:userId
// Updates user profile
// Body: { ...profileData }
// Response: { success, message }
```

---

## 🗂️ **Migration & Setup Functions**

### Migration Script (`server/migrate-to-firebase.js`)

```javascript
// 71. migrateData()
// Migrates sample data to Firebase Firestore
// Adds: users, events, bookings, transactions, categories
// Returns: Promise
```

---

## 📊 **Summary Statistics**

| Category | Count |
|----------|-------|
| Firebase Functions | 20 |
| React Hooks & Context | 7 |
| Component Functions | 9 |
| API Endpoints | 15 |
| Utility Functions | 10 |
| Custom Hooks | 3 |
| **Total Functions** | **71** |

---

## 🔗 **Function Dependencies**

```
Login → getCurrentUser() → useAuth() → onAuthStateChanged()
       ↓
       → updateUserProfile()
       
Browse Events → getEvents() → database/ref → get()
              → filterEvents()
              
Book Event → createBooking() → addDoc()
           → updateBookingStatus()

My Bookings → getMyBookings() → query()
            → where()

Logout → logout() → signOut() → navigate()
```

---

## 📚 **Function Usage Examples**

### Authentication Flow
```javascript
// 1. User signs up
const result = await signup(username, email, password, 'CLIENT');

// 2. User logs in
const loginResult = await login(email, password);

// 3. Store token in localStorage
localStorage.setItem('token', loginResult.token);

// 4. Check authentication state
const user = await getCurrentUser();

// 5. User logs out
await logout();
```

### Event Booking Flow
```javascript
// 1. Get all events
const { events } = await getEvents('Music', 'Mumbai');

// 2. Get event details
const { event } = await getEventById(eventId);

// 3. Create booking
const { bookingId } = await createBooking({
  clientId: user.uid,
  eventId: event.id,
  eventName: event.name,
  seats: 2,
  amount: 1000
});

// 4. Update booking after payment
await updateBookingStatus(bookingId, 'CONFIRMED');

// 5. Get user's bookings
const { bookings } = await getMyBookings(user.uid);
```

---

## 🎯 **Key Takeaways**

✅ **71 Total Functions** across:
- Firebase (Auth, Realtime DB, Firestore)
- React (Hooks, Context, Router)
- Custom components & utilities
- Backend API endpoints

✅ **Well-organized structure**:
- Authentication flows
- Event management
- Booking system
- User profiles

✅ **Real-time updates** with Firebase listeners

✅ **Full-stack application** with frontend + backend

---

*Generated: December 2024*
*Project: TalentConnect Event Booking Platform*
