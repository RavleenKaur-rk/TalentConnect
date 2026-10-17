# 🔄 Switch Back to Firebase

Your TalentConnect app has been switched back from MySQL to **Firebase**!

## ✅ What Changed

### ✓ Backend Routes Updated
- `server-firebase.js` - Main Firebase-enabled server
- `routes/auth-firebase.js` - Firebase Authentication
- `routes/events-firebase.js` - Firestore Events collection
- `routes/bookings-firebase.js` - Firestore Bookings collection
- `routes/users-firebase.js` - Firestore Users collection

### ✓ Frontend Services Updated
- `src/services/firebaseApi.js` - Firebase API calls
- `src/services/firebase.js` - Firebase initialization

---

## 🚀 Setup Instructions

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Go to **Project Settings** → **General**
4. Copy your Firebase config object

### Step 2: Create .env File

Create `.env` file in project root with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### Step 3: Create Backend .env

Create `.env` file in `server/` directory:

```
PORT=5000
NODE_ENV=production
```

### Step 4: Get Firebase Service Account

1. In Firebase Console → **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save as `server/firebase-key.json`

### Step 5: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install firebase-admin
```

### Step 6: Start Services

**Terminal 1 - Backend (Firebase)**
```bash
cd server
node server-firebase.js
```

**Terminal 2 - Frontend**
```bash
npm run dev
```

---

## 📊 How Data is Stored in Firebase

### Authentication
- **Firebase Auth** - User accounts, passwords
- Automatic user management
- JWT tokens for API access

### Data Collections in Firestore

```
talentconnect (Firebase Project)
├── users/
│   ├── {userId}
│   │   ├── username
│   │   ├── email
│   │   ├── userType (CLIENT/ARTIST)
│   │   └── createdAt
│
├── events/
│   ├── {eventId}
│   │   ├── name
│   │   ├── category
│   │   ├── date
│   │   ├── price
│   │   ├── location
│   │   ├── artistId
│   │   └── status
│
├── bookings/
│   ├── {bookingId}
│   │   ├── clientId
│   │   ├── eventId
│   │   ├── eventName
│   │   ├── seats
│   │   ├── amount
│   │   ├── status (PENDING/CONFIRMED)
│   │   └── confirmationCode
│
└── transactions/
    ├── {transactionId}
    │   ├── bookingId
    │   ├── amount
    │   ├── paymentStatus
    │   ├── paymentMethod
    │   └── razorpayDetails
```

---

## 🎯 API Endpoints (Firebase)

All endpoints now use Firebase backend:

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-token` - Verify JWT token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/my-bookings/:userId` - User's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile

---

## 📝 Key Differences: Firebase vs MySQL

| Feature | Firebase | MySQL |
|---------|----------|-------|
| **Setup** | Cloud-hosted | Local server |
| **Auth** | Built-in Firebase Auth | Manual JWT |
| **Database** | Firestore NoSQL | Relational |
| **Scalability** | Auto-scales | Manual scaling |
| **Cost** | Pay per use | Fixed server cost |
| **Latency** | Cloud CDN | Local network |
| **Offline** | Offline support | Online only |

---

## 🧪 Test the Firebase Connection

1. Sign up at http://localhost:5173
2. Your account is created in **Firebase Auth**
3. User profile saved to **Firestore users** collection
4. Browse events from **Firestore events** collection
5. Create booking → Saved to **Firestore bookings** collection
6. Check [Firebase Console](https://console.firebase.google.com) to see real-time updates!

---

## 🔍 View Your Data in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**
4. View all collections:
   - `users` - All user profiles
   - `events` - All events
   - `bookings` - All bookings
   - `transactions` - All payments

---

## ❓ Troubleshooting

### "Cannot find module 'firebase-admin'"
```bash
cd server
npm install firebase-admin
```

### "Firebase config is undefined"
- Make sure `.env` file is in root directory with correct credentials
- Restart the frontend server after creating `.env`

### "Firebase key not found"
- Save your service account key as `server/firebase-key.json`
- Ensure it's in the correct format

### "CORS error"
- Backend is running on port 5000
- Frontend is running on port 5173
- CORS is enabled in `server-firebase.js`

---

## ✅ You're All Set!

Your TalentConnect app is now connected to **Firebase** for:
- ✅ User authentication
- ✅ Event storage
- ✅ Booking management
- ✅ Payment tracking

Start at: **http://localhost:5173**

All your data is stored in the cloud with **Firebase Firestore**!
