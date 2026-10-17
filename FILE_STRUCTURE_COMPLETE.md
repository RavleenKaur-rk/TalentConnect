# 📁 TalentConnect - Complete File Structure & Architecture

## 🗂️ **Project Root Directory Structure**

```
TalentConnect/
├── 📄 .env                              (Environment variables - Firebase config)
├── 📄 .env.example                      (Example environment template)
├── 📄 .gitignore                        (Git ignore rules)
├── 📄 eslint.config.js                  (ESLint configuration)
├── 📄 index.html                        (HTML entry point)
├── 📄 package.json                      (Project dependencies)
├── 📄 package-lock.json                 (Dependency lock file)
├── 📄 vite.config.js                    (Vite configuration)
│
├── 📚 Documentation Files (14 guides)
│   ├── README.md                        (Project overview)
│   ├── START_HERE.md                    (Quick start guide)
│   ├── QUICK_START.md                   (5-minute setup)
│   ├── QUICK_SETUP.md                   (Backend setup)
│   ├── QUICKSTART.md                    (Alternative quick start)
│   ├── FIREBASE_SETUP.md                (Firebase detailed setup)
│   ├── FIREBASE_SETUP_COMPLETE.md       (Complete Firebase guide with API)
│   ├── COMPLETE_FIREBASE_GUIDE.md       (Comprehensive Firebase docs)
│   ├── SETUP_SUMMARY.md                 (Migration summary)
│   ├── VERIFICATION_CHECKLIST.md        (Pre-deployment checklist)
│   ├── PROJECT_STATUS.md                (Current project status)
│   ├── PROJECT_RUNNING.md               (How to run project)
│   ├── FUNCTION_REFERENCE.md            (Function documentation)
│   ├── ACTIVITY_DIAGRAMS_COMPLETE.md    (Complete activity flows)
│   ├── RAZORPAY_SETUP.md                (Payment integration setup)
│   ├── RAZORPAY_READY.md                (Razorpay configuration)
│   ├── RAZORPAY_TROUBLESHOOTING.md      (Payment debugging)
│   ├── PAYMENT_IMPLEMENTATION.md        (Payment features)
│   ├── PAYMENT_HTML_SETUP.md            (HTML payment setup)
│   └── MYSQL_SETUP.md                   (Legacy MySQL setup)
│
├── 📂 public/                           (Static files)
│   ├── About.html                       (About page static HTML)
│   ├── bookings.html                    (Bookings page static HTML)
│   └── payment.html                     (Payment page static HTML)
│
├── 📂 src/                              (Source code - React application)
│   │
│   ├── 📂 assets/                       (Images, icons, fonts)
│   │
│   ├── 📂 components/                   (Reusable React components)
│   │   ├── 📂 auth/                     (Authentication components)
│   │   │   ├── LoginForm.jsx            (Login form component)
│   │   │   └── SignupForm.jsx           (Registration form component)
│   │   │
│   │   ├── 📂 common/                   (Shared components)
│   │   │   ├── Footer.jsx               (Footer with links & info)
│   │   │   ├── Header.jsx               (Navigation header/navbar)
│   │   │   ├── LoadingSpinner.jsx       (Loading indicator)
│   │   │   └── Notification.jsx         (Toast notifications)
│   │   │
│   │   ├── 📂 context/                  (React Context providers)
│   │   │   └── AuthContext.jsx          (Global auth state management)
│   │   │
│   │   ├── 📂 events/                   (Event-related components)
│   │   │   ├── EventCard.jsx            (Event card display)
│   │   │   ├── EventDetails.jsx         (Full event information page)
│   │   │   └── EventFilters.jsx         (Filter sidebar for events)
│   │   │
│   │   ├── 📂 hooks/                    (Custom React hooks)
│   │   │   ├── useAuth.js               (Authentication hook)
│   │   │   ├── useBookings.js           (Bookings data hook)
│   │   │   └── useEvents.js             (Events data hook)
│   │   │
│   │   ├── 📂 profile/                  (User profile components)
│   │   │   ├── BookingCard.jsx          (Individual booking card)
│   │   │   ├── ProfileInfo.jsx          (User profile display)
│   │   │   └── StatsCard.jsx            (Statistics display card)
│   │   │
│   │   └── 📂 styles/                   (Global styles)
│   │       └── global.css               (Global CSS styles)
│   │
│   ├── 📂 pages/                        (Full page components - 14 pages)
│   │   ├── AboutUs.jsx                  (About page)
│   │   │   └─ Info: Company mission, team, values
│   │   │
│   │   ├── Bookings.jsx                 (My Bookings page)
│   │   │   └─ Shows: User's event bookings, canceled/past events
│   │   │
│   │   ├── BrowseEvents.jsx             (Event discovery page)
│   │   │   └─ Features: Filter, search, sort, list all events
│   │   │
│   │   ├── ContactUs.jsx                (Contact/Support page)
│   │   │   └─ Features: Contact form, support email, FAQs
│   │   │
│   │   ├── EventBooking.jsx             (Booking form page)
│   │   │   └─ Features: Ticket selection, attendee details, amount calculation
│   │   │
│   │   ├── Home.jsx                     (Landing page)
│   │   │   └─ Features: Hero, featured events, location search
│   │   │
│   │   ├── HostEvent.jsx                (Event creation page - Organizers)
│   │   │   └─ Features: Event form, image upload, pricing setup
│   │   │
│   │   ├── Login.jsx                    (Login page)
│   │   │   └─ Features: Email/password login, sign up link
│   │   │
│   │   ├── OrganizerDashboard.jsx       (Organizer management page)
│   │   │   └─ Features: Event list, stats, bookings, revenue tracking
│   │   │
│   │   ├── OrganizerVerification.jsx    (KYC verification page)
│   │   │   └─ Features: Phone verify, business info, payment
│   │   │
│   │   ├── Payment.jsx                  (Razorpay payment page)
│   │   │   └─ Features: Payment gateway, order confirmation
│   │   │
│   │   ├── PrivacyPolicy.jsx            (Privacy policy page)
│   │   │   └─ Content: Data privacy terms and conditions
│   │   │
│   │   ├── Profile.jsx                  (User profile page)
│   │   │   └─ Features: Edit profile, change password, view stats
│   │   │
│   │   └── TermsConditions.jsx          (Terms of service page)
│   │       └─ Content: Usage terms, liability, agreements
│   │
│   ├── 📂 services/                     (API & external service integrations)
│   │   ├── api.js                       (Axios instance & API calls)
│   │   │   └─ All HTTP requests to backend
│   │   │
│   │   ├── firebase.js                  (Firebase configuration)
│   │   │   └─ Firebase initialization, auth, firestore, realtime db
│   │   │
│   │   └── firebaseApi.js               (Firebase direct operations)
│   │       └─ Direct Firestore/Realtime DB queries
│   │
│   ├── 📂 styles/                       (Global stylesheets)
│   │   ├── global.css                   (Global styles)
│   │   └─ CSS Grid, Flexbox, Typography, Colors
│   │
│   ├── 📂 utils/                        (Utility functions & constants)
│   │   ├── constants.js                 (App constants, configs)
│   │   │   └─ API URLs, event categories, validation rules
│   │   │
│   │   └── helpers.js                   (Helper functions)
│   │       └─ Formatting, validation, calculations
│   │
│   ├── App.jsx                          (Root app component)
│   │   └─ Routes, layout, main app logic
│   │
│   ├── App.css                          (App styles)
│   │
│   ├── index.css                        (Base styles)
│   │
│   └── main.jsx                         (React entry point)
│       └─ Mounts React app to DOM
│
└── 📂 server/                           (Backend - Express.js)
    │
    ├── 📄 .env                          (Backend environment variables)
    ├── 📄 package.json                  (Backend dependencies)
    ├── 📄 package-lock.json
    │
    ├── 📄 server-firebase.js            (Main Express server)
    │   └─ Port: 5000
    │   └─ Routes: /api/auth, /api/events, /api/bookings, /api/users
    │   └─ Middleware: CORS, JWT verification
    │
    ├── 📄 migrate-to-firebase.js        (Data migration script)
    │   └─ Migrates data from MySQL to Firebase
    │
    ├── 📄 import-firebase-data.js       (Initial data import)
    │   └─ Imports sample data to Firestore/Realtime DB
    │
    ├── 📂 config/                       (Configuration files)
    │   └─ firebase.js                   (Firebase admin initialization)
    │
    ├── 📂 middleware/                   (Express middleware)
    │   ├─ Authentication middleware
    │   ├─ CORS configuration
    │   ├─ Request validation
    │   └─ Error handling
    │
    ├── 📂 routes/                       (API route handlers)
    │   ├── auth-firebase.js             (Authentication endpoints)
    │   │   ├─ POST /signup              - User registration
    │   │   ├─ POST /login               - User login
    │   │   └─ GET /verify-token         - Token verification
    │   │
    │   ├── events-firebase.js           (Event management endpoints)
    │   │   ├─ GET /events               - List all events
    │   │   ├─ GET /events/:id           - Get event details
    │   │   ├─ POST /events              - Create event (organizer)
    │   │   ├─ PUT /events/:id           - Update event
    │   │   └─ DELETE /events/:id        - Delete event
    │   │
    │   ├── bookings-firebase.js         (Booking management endpoints)
    │   │   ├─ GET /bookings             - List bookings
    │   │   ├─ GET /bookings/:id         - Get booking details
    │   │   ├─ GET /bookings/user/:userId - User bookings
    │   │   ├─ POST /bookings            - Create booking
    │   │   ├─ PUT /bookings/:id         - Update booking status
    │   │   └─ DELETE /bookings/:id      - Cancel booking
    │   │
    │   └── users-firebase.js            (User profile endpoints)
    │       ├─ GET /users/:userId        - Get user profile
    │       ├─ PUT /users/:userId        - Update user profile
    │       ├─ GET /users/:userId/verify - Check verification
    │       └─ PUT /users/:userId/verify - Update verification
    │
    └── 📂 node_modules/                 (Dependencies)
        ├─ express
        ├─ firebase-admin
        ├─ cors
        ├─ bcrypt
        ├─ jsonwebtoken
        ├─ dotenv
        └─ (Other packages)

```

---

## 📊 **Component Hierarchy & Dependencies**

```
App.jsx (Root)
│
├─ AuthContext.Provider
│  └─ Provides: user, login, logout, isAuthenticated
│
├─ Header.jsx
│  ├─ Logo
│  ├─ Navigation Links
│  ├─ User Menu
│  └─ Search Bar
│
├─ Routes (React Router v6)
│  │
│  ├─ / → Home.jsx
│  │   ├─ Hero Section
│  │   ├─ Featured Events Carousel
│  │   ├─ Location Search
│  │   └─ Event Categories
│  │
│  ├─ /login → Login.jsx
│  │   └─ LoginForm.jsx (uses useAuth hook)
│  │
│  ├─ /signup → Login.jsx (with signup tab)
│  │   └─ SignupForm.jsx (uses useAuth hook)
│  │
│  ├─ /browse-events → BrowseEvents.jsx
│  │   ├─ EventFilters.jsx
│  │   │   ├─ Category filter
│  │   │   ├─ Price range slider
│  │   │   ├─ Date picker
│  │   │   └─ Location search
│  │   │
│  │   └─ Event List
│  │       ├─ EventCard.jsx (multiple)
│  │       └─ Uses: useEvents hook
│  │
│  ├─ /event/:eventId → EventDetails.jsx
│  │   ├─ Event Information
│  │   ├─ Organizer Profile Card
│  │   ├─ Review Section
│  │   └─ "Book Now" Button
│  │       └─ Leads to /book-event/:eventId
│  │
│  ├─ /book-event/:eventId → EventBooking.jsx
│  │   ├─ Ticket Quantity Selector
│  │   ├─ Attendee Details Form
│  │   ├─ Custom Questions Form
│  │   ├─ Amount Summary
│  │   └─ "Proceed to Payment" Button
│  │       └─ Leads to /payment/:bookingId
│  │
│  ├─ /payment/:bookingId → Payment.jsx
│  │   ├─ Razorpay Integration
│  │   ├─ Payment Method Selection
│  │   └─ Order Confirmation
│  │
│  ├─ /profile → Profile.jsx
│  │   ├─ ProfileInfo.jsx
│  │   │   ├─ Avatar & Name
│  │   │   ├─ Email & Phone
│  │   │   ├─ Edit Button
│  │   │   └─ Change Password Button
│  │   │
│  │   ├─ User Stats (StatsCard.jsx components)
│  │   │   ├─ Total Bookings
│  │   │   ├─ Amount Spent
│  │   │   └─ Member Since
│  │   │
│  │   └─ Verification Status (if organizer)
│  │
│  ├─ /my-bookings → Bookings.jsx
│  │   ├─ Upcoming Events Section
│  │   │   └─ BookingCard.jsx (multiple)
│  │   │
│  │   ├─ Past Events Section
│  │   │   └─ BookingCard.jsx (multiple)
│  │   │
│  │   └─ Canceled Events Section
│  │       └─ BookingCard.jsx (multiple)
│  │
│  ├─ /host-event → HostEvent.jsx (Organizer only)
│  │   ├─ Event Form
│  │   │   ├─ Name Input
│  │   │   ├─ Date/Time Picker
│  │   │   ├─ Venue Info
│  │   │   ├─ Category Dropdown
│  │   │   ├─ Pricing Form
│  │   │   ├─ Description Editor
│  │   │   ├─ Image Upload
│  │   │   ├─ Ticket Quantity
│  │   │   ├─ Custom Questions
│  │   │   └─ Submit Button
│  │   │
│  │   └─ Form Validation & Error Handling
│  │
│  ├─ /dashboard → OrganizerDashboard.jsx (Organizer only)
│  │   ├─ Stats Cards (StatsCard.jsx)
│  │   │   ├─ Total Events
│  │   │   ├─ Total Bookings
│  │   │   ├─ Total Revenue
│  │   │   └─ Cancellation Rate
│  │   │
│  │   ├─ Event List
│  │   │   ├─ Active Events
│  │   │   ├─ Draft Events
│  │   │   └─ Canceled Events
│  │   │
│  │   ├─ Recent Bookings
│  │   │   └─ BookingCard.jsx (multiple)
│  │   │
│  │   └─ Action Buttons
│  │       ├─ Create Event
│  │       ├─ View Analytics
│  │       └─ Manage Payouts
│  │
│  ├─ /verify → OrganizerVerification.jsx (New organizer)
│  │   ├─ Phone Verification
│  │   ├─ Email Verification
│  │   ├─ Business Info Form
│  │   ├─ Document Upload
│  │   ├─ Payment Section (Razorpay)
│  │   └─ Verification Status
│  │
│  ├─ /about → AboutUs.jsx
│  ├─ /contact → ContactUs.jsx
│  ├─ /privacy → PrivacyPolicy.jsx
│  └─ /terms → TermsConditions.jsx
│
├─ Notification.jsx
│   └─ Toast notifications for alerts
│
├─ LoadingSpinner.jsx
│   └─ Loading indicators
│
└─ Footer.jsx
    ├─ Links
    ├─ Social Media
    └─ Copyright Info

```

---

## 🔄 **Data Flow & State Management**

```
Global State (AuthContext)
│
├─ user object
│   ├─ uid
│   ├─ email
│   ├─ name
│   ├─ userType (customer/organiser)
│   ├─ isEmailVerified
│   ├─ isPhoneVerified
│   └─ businessInfo (if organizer)
│
├─ isAuthenticated (boolean)
├─ isLoading (boolean)
├─ error (string or null)
│
├─ Methods:
│   ├─ login(email, password)
│   ├─ signup(email, password, name, userType)
│   ├─ logout()
│   └─ updateUserProfile(data)

Local State (Component level)
│
├─ Home.jsx
│   ├─ featured_events (list)
│   ├─ user_location (coords)
│   └─ loading_state
│
├─ BrowseEvents.jsx
│   ├─ all_events (list)
│   ├─ filtered_events (list)
│   ├─ selected_category (string)
│   ├─ selected_price_range (array)
│   ├─ selected_date (date)
│   └─ search_query (string)
│
├─ EventDetails.jsx
│   ├─ event_data (object)
│   ├─ organizer_data (object)
│   ├─ reviews_list (array)
│   └─ is_saved (boolean)
│
├─ EventBooking.jsx
│   ├─ ticket_quantity (number)
│   ├─ attendee_details (object)
│   ├─ custom_answers (object)
│   ├─ total_amount (number)
│   └─ booking_in_progress (boolean)
│
├─ Payment.jsx
│   ├─ order_details (object)
│   ├─ payment_method (string)
│   ├─ payment_status (string)
│   └─ transaction_id (string)
│
├─ Profile.jsx
│   ├─ user_profile (object)
│   ├─ is_editing (boolean)
│   ├─ form_data (object)
│   └─ verification_status (object)
│
└─ OrganizerDashboard.jsx
    ├─ created_events (array)
    ├─ all_bookings (array)
    ├─ revenue_stats (object)
    ├─ selected_event_id (string)
    └─ time_period (string)

Custom Hooks
│
├─ useAuth.js
│   └─ Returns: user, login, signup, logout, isAuthenticated
│
├─ useEvents.js
│   └─ Returns: events, loading, error, getEventById, createEvent, updateEvent
│
└─ useBookings.js
    └─ Returns: bookings, loading, error, createBooking, cancelBooking, getBookingById

```

---

## 📡 **Database Schema (Firebase)**

### **Firestore Collections:**

```
/users
├─ uid (document ID)
│   ├─ email: string
│   ├─ name: string
│   ├─ userType: "customer" | "organiser"
│   ├─ phoneNumber: string (optional)
│   ├─ avatar: string (URL)
│   ├─ isPhoneVerified: boolean
│   ├─ isEmailVerified: boolean
│   ├─ createdAt: timestamp
│   ├─ lastLoginAt: timestamp
│   │
│   └─ [For Organizers only:]
│       ├─ businessInfo: object
│       │   ├─ organization: string
│       │   ├─ businessType: string
│       │   ├─ address: string
│       │   ├─ city: string
│       │   ├─ state: string
│       │   ├─ zipCode: string
│       │   ├─ country: string
│       │   ├─ taxId: string (GST)
│       │   └─ verificationStatus: "pending" | "verified" | "rejected"
│       ├─ organizerVerified: boolean
│       ├─ verifiedDate: timestamp
│       ├─ verificationFee: number
│       ├─ paymentComplete: boolean
│       ├─ paymentDate: timestamp
│       └─ bankDetails: object
│           ├─ accountNumber: string
│           ├─ ifscCode: string
│           └─ accountHolder: string

/events
├─ eventId (document ID)
│   ├─ name: string
│   ├─ description: string
│   ├─ category: string (comedy, art, music, etc.)
│   ├─ date: date
│   ├─ startTime: string (HH:MM)
│   ├─ endTime: string (HH:MM)
│   ├─ eventType: "In-person" | "Online"
│   ├─ venueName: string
│   ├─ venueAddress: string
│   ├─ ticketPrice: number
│   ├─ ticketType: "Paid" | "Free"
│   ├─ totalTickets: number
│   ├─ availableTickets: number
│   ├─ image: string (base64 or URL)
│   ├─ organizerId: string (reference to users)
│   ├─ customQuestions: array of strings
│   ├─ status: "draft" | "published" | "canceled"
│   ├─ createdAt: timestamp
│   ├─ publishedDate: timestamp
│   ├─ lastModified: timestamp
│   └─ ratings: array
│       ├─ userId: string
│       ├─ rating: number (1-5)
│       ├─ review: string
│       └─ timestamp: timestamp

/bookings
├─ bookingId (document ID)
│   ├─ eventId: string (reference)
│   ├─ eventName: string
│   ├─ userId: string (reference)
│   ├─ fullName: string
│   ├─ email: string
│   ├─ phone: string
│   ├─ organizerId: string (reference)
│   ├─ ticketCount: number
│   ├─ ticketPrice: number
│   ├─ bookingFee: number
│   ├─ gstAmount: number
│   ├─ totalAmount: number
│   ├─ paymentMethod: "upi" | "card" | "wallet"
│   ├─ status: "pending" | "confirmed" | "canceled"
│   ├─ transactionId: string (Razorpay)
│   ├─ bookingDate: timestamp
│   ├─ attendeeDetails: object
│   │   ├─ attendee_1: object
│   │   │   ├─ name: string
│   │   │   └─ email: string
│   │   └─ ...more attendees
│   ├─ customAnswers: object (answers to event questions)
│   └─ refundDetails: object (if canceled)
│       ├─ refundAmount: number
│       ├─ refundDate: timestamp
│       └─ refundReason: string

/pendingBookings
├─ pendingId (document ID)
│   ├─ eventId: string
│   ├─ eventName: string
│   ├─ userId: string
│   ├─ fullName: string
│   ├─ email: string
│   ├─ phone: string
│   ├─ organizerId: string
│   ├─ ticketCount: number
│   ├─ ticketPrice: number
│   ├─ bookingFee: number
│   ├─ gstAmount: number
│   ├─ totalAmount: number
│   ├─ status: "pending"
│   ├─ createdAt: timestamp
│   ├─ expiresAt: timestamp (30 mins to complete payment)
│   ├─ eventDate: date
│   ├─ eventTime: string
│   ├─ eventVenue: string
│   ├─ customQuestions: string (stringified)
│   └─ attendeeDetails: object

```

### **Realtime Database (/)**

```
/
├─ /bookings
│   └─ [mirrors Firestore bookings collection]
│
├─ /events
│   └─ [mirrors Firestore events collection]
│
├─ /users
│   └─ [mirrors Firestore users collection]
│
└─ /pendingBookings
    └─ [mirrors Firestore pendingBookings collection]

Purpose: Real-time updates and instant notifications
```

---

## 🔌 **API Endpoints Summary**

```
BASE_URL: http://localhost:5000/api

╔════════════════════════════════════════════════════════════╗
║              AUTHENTICATION ENDPOINTS                      ║
╠════════════════════════════════════════════════════════════╣
║ Method │ Endpoint        │ Auth │ Purpose                  ║
╠════════════════════════════════════════════════════════════╣
║ POST   │ /auth/signup    │ No   │ Register new user        ║
║ POST   │ /auth/login     │ No   │ Login existing user      ║
║ GET    │ /auth/verify    │ Yes  │ Verify JWT token         ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                EVENT ENDPOINTS                            ║
╠════════════════════════════════════════════════════════════╣
║ Method │ Endpoint           │ Auth │ Purpose              ║
╠════════════════════════════════════════════════════════════╣
║ GET    │ /events            │ No   │ List all events      ║
║ GET    │ /events/:id        │ No   │ Get event details    ║
║ POST   │ /events            │ Yes* │ Create event         ║
║ PUT    │ /events/:id        │ Yes* │ Update event         ║
║ DELETE │ /events/:id        │ Yes* │ Delete event         ║
║        │ (* organizer only) │      │                      ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                BOOKING ENDPOINTS                          ║
╠════════════════════════════════════════════════════════════╣
║ Method │ Endpoint                   │ Auth │ Purpose      ║
╠════════════════════════════════════════════════════════════╣
║ GET    │ /bookings                  │ Yes  │ List all     ║
║ GET    │ /bookings/:id              │ Yes  │ Get details  ║
║ GET    │ /bookings/my-bookings/:uid │ Yes  │ User bookings║
║ POST   │ /bookings                  │ Yes  │ Create       ║
║ PUT    │ /bookings/:id              │ Yes  │ Update       ║
║ DELETE │ /bookings/:id              │ Yes  │ Cancel       ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                USER ENDPOINTS                             ║
╠════════════════════════════════════════════════════════════╣
║ Method │ Endpoint                  │ Auth │ Purpose       ║
╠════════════════════════════════════════════════════════════╣
║ GET    │ /users/:userId            │ Yes  │ Get profile   ║
║ PUT    │ /users/:userId            │ Yes  │ Update        ║
║ GET    │ /users/:userId/verify     │ Yes  │ Check verify  ║
║ PUT    │ /users/:userId/verify     │ Yes  │ Update verify ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎨 **File Naming Conventions**

```
Components:
- PascalCase: LoginForm.jsx, EventCard.jsx
- Location: src/components/[category]/[Name].jsx

Pages:
- PascalCase: Home.jsx, BrowseEvents.jsx
- Location: src/pages/

Utilities:
- camelCase: helpers.js, constants.js
- Location: src/utils/

Services:
- camelCase: api.js, firebase.js
- Location: src/services/

Styles:
- kebab-case or camelCase
- Global: src/styles/global.css
- Component-level: Same directory as component

Backend Routes:
- kebab-case: auth-firebase.js, events-firebase.js
- Location: server/routes/
```

---

## 📦 **Dependencies Overview**

### **Frontend (package.json)**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "firebase": "^latest",
  "axios": "^latest",
  "razorpay": "^latest"
}
```

### **Backend (server/package.json)**
```json
{
  "express": "^4.18.2",
  "firebase-admin": "^11.11.1",
  "cors": "^2.8.5",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "dotenv": "^16.3.1"
}
```

---

## 🔐 **Security & Environment Variables**

### **.env File Structure**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Backend Configuration
FIREBASE_ADMIN_SDK_PATH=./firebase-key.json
JWT_SECRET=

# Razorpay Configuration (optional for frontend)
VITE_RAZORPAY_KEY_ID=
VITE_RAZORPAY_KEY_SECRET=
```

### **.gitignore**
```
node_modules/
.env
.env.local
firebase-key.json
dist/
build/
.DS_Store
```

---

## 📈 **Project Statistics**

```
Total Files:
├─ Pages: 14
├─ Components: 13
├─ Services: 2
├─ Utilities: 2
├─ Styles: 4+
├─ Routes (Backend): 4
├─ Documentation: 20+
└─ Total React Components: 30+

Total Lines of Code:
├─ Frontend: ~3000+ LOC
├─ Backend: ~1000+ LOC
├─ Styles: ~500+ LOC
└─ Total: ~4500+ LOC

Supported Users: Unlimited
Supported Events: Unlimited
Database Collections: 4 (Firestore)
API Endpoints: 15+
```

---

**End of File Structure Documentation**

*For detailed activity flows, see: ACTIVITY_DIAGRAMS_COMPLETE.md*
