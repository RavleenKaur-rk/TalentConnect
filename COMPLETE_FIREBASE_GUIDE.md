# 🚀 Complete Firebase Setup for TalentConnect

## ✅ Quick Setup (5 Steps)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Create a project** → Name it `talentconnect`
3. Complete the setup wizard

### Step 2: Get Your Firebase Config
1. In Firebase Console, click the **Settings icon** (gear) → **Project Settings**
2. Scroll down to **Your apps** section → **Web** (or create if needed)
3. Copy your config object (you'll see `apiKey`, `authDomain`, etc.)

### Step 3: Create `.env` File in Project Root
Create file: `e:\TalentConnect\.env`

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id_here
```

Replace `your_*` values with your actual Firebase credentials.

### Step 4: Get Service Account Key
1. In Firebase Console → **Project Settings** → **Service Accounts** tab
2. Click **Generate New Private Key**
3. A JSON file will download
4. Rename it to `firebase-key.json` and save to: `e:\TalentConnect\server\firebase-key.json`

### Step 5: Setup Firebase Services
In Firebase Console:

**A. Enable Firestore Database**
- Go to **Firestore Database**
- Click **Create Database**
- Select **Start in test mode**
- Choose region: `us-central1`

**B. Enable Authentication**
- Go to **Authentication**
- Click **Get Started**
- Enable **Email/Password** provider

---

## 📦 Install Dependencies

### Frontend
```bash
cd e:\TalentConnect
npm install
```

### Backend
```bash
cd e:\TalentConnect\server
npm install firebase-admin
```

---

## 📊 Add Sample Data to Firebase

Run the migration script to add all your previous data:

```bash
cd e:\TalentConnect\server
node migrate-to-firebase.js
```

This will add:
- ✅ 5 Users (3 Artists, 2 Clients)
- ✅ 3 Events (Music, Comedy, etc.)
- ✅ 3 Bookings (PENDING/CONFIRMED)
- ✅ 3 Transactions (SUCCESS/PENDING)
- ✅ 3 Categories

---

## 🚀 Start the Application

**Terminal 1 - Backend Server**
```bash
cd e:\TalentConnect\server
node server-firebase.js
```

You should see:
```
🚀 Server running on http://localhost:5000
📊 Using Firebase for data storage
```

**Terminal 2 - Frontend**
```bash
cd e:\TalentConnect
npm run dev
```

You should see:
```
VITE v7.2.2  ready in 256 ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access Your App

Open in browser: **http://localhost:5173**

### Test with Sample Accounts:
- **Artist Email**: `sharma@example.com`
- **Client Email**: `patel@example.com`
- **Password**: Use any password (accounts created at signup)

### Or Create New Account:
1. Click "Sign Up"
2. Enter email & password
3. Account created in Firebase Auth + stored in Firestore!

---

## 📊 View Your Data in Firebase

Go to: **https://console.firebase.google.com**

Select your project → **Firestore Database**

You'll see collections:
- **users/** - All user profiles
- **events/** - All events (Classical Night, Comedy Show, etc.)
- **bookings/** - All bookings
- **transactions/** - All payments
- **categories/** - Event types

---

## 🔍 Data Structure in Firebase

### Users Collection
```
users/
├── {docId}
│   ├── uid: "artist_sharma_001"
│   ├── username: "artist_sharma"
│   ├── email: "sharma@example.com"
│   ├── userType: "ARTIST"
│   ├── contact: "9876543210"
│   ├── location: "Mumbai"
│   └── createdAt: timestamp
```

### Events Collection
```
events/
├── {docId}
│   ├── name: "Classical Night"
│   ├── category: "Music"
│   ├── date: "2024-02-14"
│   ├── price: 500
│   ├── location: "Mumbai"
│   ├── artistId: "artist_sharma_001"
│   ├── capacity: 200
│   ├── status: "PUBLISHED"
│   └── createdAt: timestamp
```

### Bookings Collection
```
bookings/
├── {docId}
│   ├── clientId: "client_patel_001"
│   ├── eventId: "{eventDocId}"
│   ├── eventName: "Classical Night"
│   ├── seats: 2
│   ├── amount: 1000
│   ├── status: "CONFIRMED"
│   ├── confirmationCode: "CONF001"
│   └── createdAt: timestamp
```

### Transactions Collection
```
transactions/
├── {docId}
│   ├── bookingId: "{bookingDocId}"
│   ├── amount: 1000
│   ├── paymentStatus: "SUCCESS"
│   ├── paymentMethod: "CARD"
│   ├── razorpayOrderId: "order_001"
│   ├── razorpayPaymentId: "pay_001"
│   └── createdAt: timestamp
```

---

## 🎯 API Endpoints

All endpoints automatically use Firebase:

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/verify-token` - Verify token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/my-bookings/:userId` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile

---

## ✅ Checklist

- [ ] Created Firebase project at console.firebase.google.com
- [ ] Copied Firebase config to `.env` file
- [ ] Downloaded service account key to `server/firebase-key.json`
- [ ] Enabled Firestore Database in Firebase
- [ ] Enabled Email/Password Authentication
- [ ] Installed dependencies: `npm install` & `npm install firebase-admin`
- [ ] Ran migration script: `node migrate-to-firebase.js`
- [ ] Started backend: `node server-firebase.js`
- [ ] Started frontend: `npm run dev`
- [ ] Opened http://localhost:5173

---

## 🧪 Test the Full Flow

1. **Signup** → Account created in Firebase Auth + Firestore
2. **Login** → JWT token generated
3. **Browse Events** → Load from Firestore events collection
4. **Book Event** → Save to Firestore bookings collection
5. **Payment** → Save to Firestore transactions collection
6. **My Bookings** → Load user's bookings from Firestore
7. **Check Firebase Console** → See all data updated in real-time!

---

## ❓ Troubleshooting

### "firebase-key.json not found"
- Make sure the service account key is saved as `server/firebase-key.json`
- Check the file path is correct

### "VITE_FIREBASE_API_KEY is undefined"
- Create `.env` file in project root (same level as `package.json`)
- Restart the frontend server after creating `.env`

### "Migration script failed"
- Make sure `firebase-admin` is installed: `npm install firebase-admin`
- Check that `firebase-key.json` exists and is valid

### "Cannot connect to backend"
- Make sure backend is running: `node server-firebase.js`
- Check port 5000 is not already in use
- CORS is enabled, should work fine

### "Events not loading"
- Check Firestore Database is enabled in Firebase Console
- Verify data exists in `events/` collection in Firestore
- Check browser console for errors (F12)

---

## 🎉 You're All Set!

Your TalentConnect app is now:
- ✅ Connected to Firebase Authentication
- ✅ Using Firestore for data storage
- ✅ Have 5 sample users
- ✅ Have 3 sample events
- ✅ Have 3 sample bookings
- ✅ Ready for real-time updates!

**Start at:** http://localhost:5173

**Manage data at:** https://console.firebase.google.com

---

## 📚 Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

*Need help? Check the error messages in the terminal for more details.*
