# 📊 TalentConnect - Complete Activity Diagrams & Descriptions

## 🎯 Project Overview

**TalentConnect** is a full-stack event booking platform with role-based access (Customers & Organizers) built with React + Firebase + Express.

---

## 1️⃣ **User Authentication Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

                          START
                            │
                            ▼
                  ┌─────────────────┐
                  │  User Visits    │
                  │   Home Page     │
                  └─────────────────┘
                            │
                            ▼
                  ┌─────────────────────────┐
                  │ Click Login/Sign Up     │
                  └─────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌──────────────┐       ┌──────────────┐
         │ Login Form   │       │ SignUp Form  │
         └──────────────┘       └──────────────┘
                │                       │
                │ Email, Password       │ Email, Password,
                │                       │ Name, UserType
                ▼                       ▼
         ┌──────────────────────────────────────┐
         │  Firebase Authentication API         │
         │  (signInWithEmailAndPassword or      │
         │   createUserWithEmailAndPassword)    │
         └──────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌──────────────┐       ┌──────────────┐
         │ Auth Success │       │ Auth Failed  │
         │ JWT Token    │       │ Show Error   │
         │ Generated    │       │ Message      │
         └──────────────┘       └──────────────┘
                │                       │
                │                       ▼
                │              ┌──────────────┐
                │              │ Retry Login/ │
                │              │ Sign Up      │
                │              └──────────────┘
                │                       │
                │                       └──────┐
                │                              │
                ▼                              │
         ┌──────────────┐                      │
         │ Store JWT    │                      │
         │ in Local     │                      │
         │ Storage      │                      │
         └──────────────┘                      │
                │                              │
                ▼                              │
         ┌──────────────┐                      │
         │ Redirect to  │                      │
         │ Home/        │◄─────────────────────┘
         │ Dashboard    │
         └──────────────┘
                │
                ▼
              END

```

### 📝 **Description:**

**Purpose:** Handles user registration and login

**Key Steps:**
1. User clicks "Login" or "Sign Up" button on home page
2. **LoginForm.jsx** or **SignupForm.jsx** component displays
3. User enters credentials:
   - **Login:** Email + Password
   - **SignUp:** Email + Password + Name + UserType (Customer/Organizer)
4. Firebase Authentication API processes request
   - `signInWithEmailAndPassword()` - Login users
   - `createUserWithEmailAndPassword()` - Register new users
5. On success:
   - JWT token generated and stored in localStorage
   - User redirected to Home or Dashboard
6. On failure:
   - Error message displayed
   - User can retry

**Files Involved:**
- `src/components/auth/LoginForm.jsx`
- `src/components/auth/SignupForm.jsx`
- `src/context/AuthContext.jsx`
- `server/routes/auth-firebase.js`

---

## 2️⃣ **Event Browsing & Search Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│              EVENT BROWSING & SEARCH FLOW                        │
└──────────────────────────────────────────────────────────────────┘

                        START
                          │
                          ▼
                ┌─────────────────────┐
                │ User on Home Page   │
                └─────────────────────┘
                          │
                          ▼
                ┌──────────────────────────┐
                │ Click "Browse Events"    │
                │ OR Search by Location    │
                └──────────────────────────┘
                          │
                ┌─────────┴──────────┐
                ▼                    ▼
         ┌───────────────┐    ┌──────────────────┐
         │ Direct Browse │    │ Location Search  │
         │ Events Page   │    │ (Geolocation API)│
         └───────────────┘    └──────────────────┘
                │                    │
                │ GET /api/events    │ GET /api/events?
                │                    │ location=<city>
                ▼                    ▼
         ┌───────────────────────────────────────┐
         │ Backend API Response                  │
         │ - Fetch from Firestore/Realtime DB   │
         │ - Filter by category/location        │
         │ - Sort by date/price                 │
         └───────────────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ BrowseEvents.jsx renders:    │
         │ - Event list with cards      │
         │ - Filter options             │
         │ - Search bar                 │
         └──────────────────────────────┘
                          │
                ┌─────────┴──────────┐
                ▼                    ▼
         ┌──────────────┐    ┌──────────────┐
         │ Apply Filter │    │ Click Event  │
         │ (Category/   │    │ Card         │
         │  Price/Date) │    └──────────────┘
         └──────────────┘            │
                │                    ▼
                │          ┌──────────────────────┐
                │          │ EventDetails.jsx     │
                │          │ Shows:               │
                │          │ - Event info         │
                │          │ - Organizer details  │
                │          │ - Ticket availability│
                │          │ - Reviews/Ratings    │
                │          └──────────────────────┘
                │                    │
                │          ┌─────────┴──────────┐
                │          ▼                    ▼
                │    ┌────────────┐     ┌─────────────┐
                │    │ Book Event │     │ Share Event │
                │    └────────────┘     └─────────────┘
                │          │
                │          ▼
                │    ┌──────────────────┐
                │    │ EventBooking.jsx │
                │    │ (Payment flow)   │
                │    └──────────────────┘
                │
                ▼
              END

```

### 📝 **Description:**

**Purpose:** Allow users to discover and browse available events

**Key Steps:**
1. User navigates to "Browse Events" page
2. Two options:
   - **Direct Browse:** View all events
   - **Location Search:** Uses geolocation API or manual location input
3. Backend API (`GET /api/events`) fetches events from Firebase with:
   - Optional filters: category, location, price range
   - Sorting options: date, price, popularity
4. **BrowseEvents.jsx** displays:
   - Event cards with thumbnails
   - Filter sidebar
   - Search bar
5. User can:
   - Apply filters to narrow results
   - Click on event card to view details
6. **EventDetails.jsx** shows:
   - Full event information
   - Organizer profile
   - Ticket availability
   - Customer reviews

**Files Involved:**
- `src/pages/BrowseEvents.jsx`
- `src/pages/EventDetails.jsx`
- `src/components/events/EventCard.jsx`
- `src/components/events/EventFilters.jsx`
- `server/routes/events-firebase.js`

---

## 3️⃣ **Event Booking & Payment Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│            EVENT BOOKING & PAYMENT FLOW                          │
└──────────────────────────────────────────────────────────────────┘

                        START
                          │
                          ▼
                ┌─────────────────────┐
                │ Click "Book Now"    │
                │ on Event Details    │
                └─────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ EventBooking.jsx              │
         │ - Select number of tickets   │
         │ - Enter attendee details     │
         │ - Answer custom questions    │
         └──────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ Calculate Total Amount        │
         │ - Base price × Quantity      │
         │ - Add booking fee (₹50)      │
         │ - Calculate GST (18%)        │
         └──────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ POST /api/bookings            │
         │ Create Pending Booking        │
         │ (Status: "pending")           │
         └──────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ Payment.jsx / Razorpay        │
         │ Integration                   │
         │ - Display payment methods     │
         │ - Show order summary          │
         └──────────────────────────────┘
                          │
                ┌─────────┴──────────┐
                ▼                    ▼
         ┌────────────────┐   ┌──────────────┐
         │ Payment Success│   │ Payment Failed
         │ - Razorpay OK  │   │ - Show error │
         └────────────────┘   │ - Retry      │
                │              └──────────────┘
                │                    │
                ▼                    ▼
         ┌────────────────────────────┐
         │ Update Booking Status      │
         │ "pending" → "confirmed"    │
         │ (POST /api/bookings/:id)   │
         └────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────┐
         │ Generate Booking Reference │
         │ & Confirmation Details     │
         └────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────┐
         │ Send Confirmation Email    │
         │ - Booking ID               │
         │ - Ticket details           │
         │ - Event info               │
         └────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────┐
         │ Redirect to Confirmation   │
         │ Page / My Bookings         │
         └────────────────────────────┘
                          │
                          ▼
                        END

```

### 📝 **Description:**

**Purpose:** Enable users to book tickets and make payments

**Key Steps:**
1. User clicks "Book Now" on event details page
2. **EventBooking.jsx** displays:
   - Ticket quantity selector
   - Attendee information form
   - Custom event questions
3. **Calculate totals:**
   - Base price × Number of tickets
   - Add booking fee (₹50)
   - Apply GST (18%)
4. **Create pending booking:**
   - POST request to `/api/bookings`
   - Status: "pending" (awaiting payment)
5. **Payment processing via Razorpay:**
   - **Payment.jsx** integrates Razorpay SDK
   - User selects payment method (UPI, Card, Wallet)
   - Razorpay handles secure payment
6. **On success:**
   - Update booking status to "confirmed"
   - Generate confirmation email with:
     - Booking reference ID
     - Ticket details
     - Event information
7. **On failure:**
   - Show error message
   - Allow payment retry

**Files Involved:**
- `src/pages/EventBooking.jsx`
- `src/pages/Payment.jsx`
- `src/components/BookingCard.jsx`
- `server/routes/bookings-firebase.js`
- Razorpay API Integration

---

## 4️⃣ **User Profile & My Bookings Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│         USER PROFILE & MY BOOKINGS FLOW                          │
└──────────────────────────────────────────────────────────────────┘

                        START
                          │
                          ▼
         ┌──────────────────────────────┐
         │ User Logged In               │
         │ Click Profile/My Bookings    │
         └──────────────────────────────┘
                          │
                ┌─────────┴──────────────┐
                ▼                        ▼
         ┌──────────────┐        ┌────────────────┐
         │ Profile Page │        │ My Bookings    │
         └──────────────┘        └────────────────┘
                │                       │
                ▼                       ▼
         ┌──────────────────┐   ┌──────────────────────┐
         │ Profile.jsx      │   │ BookingCard.jsx      │
         │ Shows:           │   │ Displays:            │
         │ - User avatar    │   │ - Upcoming events    │
         │ - Name, email    │   │ - Past events        │
         │ - Phone          │   │ - Booking details    │
         │ - Account type   │   │ - Ticket info        │
         └──────────────────┘   └──────────────────────┘
                │                       │
         ┌──────┴──────┐         ┌──────┴──────────┐
         ▼             ▼         ▼                  ▼
    ┌─────────┐  ┌──────────┐┌──────────┐   ┌────────────┐
    │ Edit    │  │ Change   ││Download  │   │ Cancel     │
    │ Profile │  │ Password ││Ticket    │   │ Booking    │
    └─────────┘  └──────────┘└──────────┘   └────────────┘
         │             │            │              │
         │ PUT         │ PUT        │ GET          │ DELETE
         │             │            │              │
         ▼─────────────┴────────────┴──────────────▼
         ┌──────────────────────────────────────┐
         │ /api/users/:userId                   │
         │ Update user profile info             │
         └──────────────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────┐
         │ Confirmation message displayed       │
         │ User data updated in Firebase        │
         └──────────────────────────────────────┘
                          │
                          ▼
                        END

```

### 📝 **Description:**

**Purpose:** Allow users to manage their profile and view booking history

**Key Steps:**
1. Logged-in user navigates to Profile or My Bookings
2. **Profile.jsx** displays:
   - User avatar and name
   - Email and phone
   - Account type (Customer/Organizer)
   - Edit and password change options
3. **My Bookings section** shows:
   - **Upcoming events:** Events not yet started
   - **Past events:** Completed events
   - **BookingCard.jsx** displays per booking:
     - Event name, date, time
     - Venue details
     - Ticket quantity and price
     - Booking status
4. **User actions:**
   - **Edit Profile:** Update name, phone, avatar
   - **Change Password:** Update account password
   - **Download Ticket:** Get PDF with QR code
   - **Cancel Booking:** Cancel if allowed (refund rules apply)
5. **API calls:**
   - `PUT /api/users/:userId` - Update profile
   - `GET /api/bookings/my-bookings/:userId` - Fetch user bookings
   - `DELETE /api/bookings/:bookingId` - Cancel booking

**Files Involved:**
- `src/pages/Profile.jsx`
- `src/pages/Bookings.jsx`
- `src/components/profile/ProfileInfo.jsx`
- `src/components/profile/BookingCard.jsx`
- `server/routes/users-firebase.js`
- `server/routes/bookings-firebase.js`

---

## 5️⃣ **Organizer Event Management Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│          ORGANIZER EVENT MANAGEMENT FLOW                         │
└──────────────────────────────────────────────────────────────────┘

                        START
                          │
                          ▼
         ┌──────────────────────────────┐
         │ Organizer Logged In          │
         │ Click "Host Event" or        │
         │ "Dashboard"                  │
         └──────────────────────────────┘
                          │
                ┌─────────┴──────────────┐
                ▼                        ▼
         ┌──────────────┐        ┌────────────────┐
         │ HostEvent.jsx│        │ OrganizerDash. │
         └──────────────┘        └────────────────┘
                │                       │
                ▼                       ▼
         ┌──────────────────────┐  ┌──────────────────┐
         │ Create Event Form    │  │ Dashboard Shows: │
         │ - Event details      │  │ - Created events │
         │ - Date & Time        │  │ - Bookings stats │
         │ - Venue info         │  │ - Revenue        │
         │ - Ticket info        │  │ - Attendee list  │
         │ - Pricing            │  └──────────────────┘
         │ - Description        │
         │ - Category           │
         │ - Images             │
         └──────────────────────┘
                │
                ▼
         ┌──────────────────────┐
         │ POST /api/events     │
         │ Create new event     │
         │ (Status: "draft")    │
         └──────────────────────┘
                │
                ▼
         ┌──────────────────────┐
         │ Event Created!       │
         │ ID: event_xxx        │
         └──────────────────────┘
                │
         ┌──────┴───────┐
         ▼              ▼
    ┌─────────┐   ┌──────────┐
    │ Preview │   │ Publish  │
    │ Event   │   │ Event    │
    │ (Draft) │   └──────────┘
    └─────────┘        │
         │             ▼
         │    ┌──────────────────┐
         │    │ Event Published! │
         │    │ Status: "active" │
         │    └──────────────────┘
         │             │
         └─────┬───────┘
               ▼
         ┌──────────────────────┐
         │ Event Visible to All │
         │ Users Can Book       │
         └──────────────────────┘
                │
         ┌──────┴──────────┐
         ▼                 ▼
    ┌──────────┐    ┌───────────┐
    │ Edit     │    │ View      │
    │ Event    │    │ Bookings  │
    │ Details  │    │ & Revenue │
    └──────────┘    └───────────┘
         │                 │
         │ PUT              │ GET
         │ /api/events/:id  │ /api/bookings/
         │                 │ event/:eventId
         ▼                 ▼
    ┌──────────────────────────────┐
    │ Update event or view stats   │
    └──────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ Organizer can also:          │
    │ - Cancel event               │
    │ - Refund bookings            │
    │ - Send announcements         │
    │ - Download attendee list     │
    └──────────────────────────────┘
         │
         ▼
       END

```

### 📝 **Description:**

**Purpose:** Enable organizers to create and manage events

**Key Steps:**
1. Organizer navigates to "Host Event" or "Dashboard"
2. **HostEvent.jsx** form collects:
   - Event name, date, time
   - Venue name and address
   - Category and event type (In-person/Online)
   - Ticket quantity and pricing
   - Description with custom questions
   - Event images/poster
3. **Create event:**
   - POST `/api/events` creates event with status "draft"
   - Event ID generated (e.g., `event_1761887353854`)
4. **Event states:**
   - **Draft:** Only organizer can see
   - **Published:** Visible to all users, bookings open
   - **Canceled:** No more bookings accepted
5. **OrganizerDashboard.jsx** displays:
   - List of created events
   - Booking statistics
   - Revenue summary
   - Attendee information
6. **Organizer actions:**
   - **Edit event:** Update details (PUT `/api/events/:id`)
   - **Publish event:** Make event visible to users
   - **View bookings:** See all attendees and payment status
   - **Manage revenue:** Track earnings
   - **Cancel event:** Remove from listings (allow refunds)

**Files Involved:**
- `src/pages/HostEvent.jsx`
- `src/pages/OrganizerDashboard.jsx`
- `src/pages/OrganizerVerification.jsx`
- `server/routes/events-firebase.js`
- `server/routes/bookings-firebase.js`

---

## 6️⃣ **Organizer Verification Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│          ORGANIZER VERIFICATION & KYC FLOW                       │
└──────────────────────────────────────────────────────────────────┘

                        START
                          │
                          ▼
         ┌──────────────────────────────┐
         │ New Organizer Signs Up       │
         │ (userType: "organiser")      │
         └──────────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────┐
         │ OrganizerVerification.jsx    │
         │ Shows verification process  │
         └──────────────────────────────┘
                          │
                ┌─────────┴──────────────┐
                ▼                        ▼
         ┌──────────────────┐   ┌────────────────┐
         │ Phone Verification│   │ Email Verif.  │
         │ - Enter phone #  │   │ - Verify link │
         │ - Receive OTP    │   │ - Confirm email
         │ - Enter OTP      │   └────────────────┘
         └──────────────────┘
                │                    │
                └────────┬───────────┘
                         ▼
         ┌──────────────────────────────┐
         │ Business Information Form    │
         │ - Organization name          │
         │ - Business type              │
         │ - Address                    │
         │ - Tax ID / GST               │
         │ - Bank details               │
         └──────────────────────────────┘
                         │
                         ▼
         ┌──────────────────────────────┐
         │ Payment: Verification Fee    │
         │ Amount: ₹999                 │
         │ Method: Razorpay             │
         └──────────────────────────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
         ┌──────────┐      ┌────────────┐
         │ Payment │      │ Payment    │
         │ Success │      │ Failed     │
         └──────────┘      │ Retry Btn │
                │          └────────────┘
                │                │
                ▼                ▼
         ┌──────────────────────────────┐
         │ PUT /api/users/:userId       │
         │ Update verification status   │
         │ - organiserVerified: true    │
         │ - paymentComplete: true      │
         │ - verifiedDate: timestamp    │
         └──────────────────────────────┘
                         │
                         ▼
         ┌──────────────────────────────┐
         │ Verification Complete!       │
         │ Organizer can now:           │
         │ - Create events              │
         │ - Accept bookings            │
         │ - Receive payments           │
         └──────────────────────────────┘
                         │
                         ▼
         ┌──────────────────────────────┐
         │ Redirect to Dashboard        │
         │ Start creating events!       │
         └──────────────────────────────┘
                         │
                         ▼
                       END

```

### 📝 **Description:**

**Purpose:** Verify organizer identity and collect business information

**Key Steps:**
1. New organizer signs up with `userType: "organiser"`
2. **OrganizerVerification.jsx** guides through:
   - **Phone Verification:** Enter phone, receive OTP, confirm
   - **Email Verification:** Verify email via confirmation link
3. **Business Information Collection:**
   - Organization name
   - Business type (Sole proprietor, Company, etc.)
   - Business address with city/state/zip
   - Tax ID or GST number
   - Bank account details
4. **Payment:** ₹999 verification fee via Razorpay
5. **On success:**
   - Update user document:
     - `organiserVerified: true`
     - `paymentComplete: true`
     - `verifiedDate: timestamp`
   - Organizer can now host events
6. **On failure:**
   - Show error, allow payment retry
   - Store incomplete data as draft

**Files Involved:**
- `src/pages/OrganizerVerification.jsx`
- `server/routes/users-firebase.js`
- Razorpay API

---

## 7️⃣ **Data Flow & API Integration Diagram**

```
┌──────────────────────────────────────────────────────────────────┐
│                   DATA FLOW ARCHITECTURE                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   React Frontend (Vite)   │
│  - Pages (14 files)       │
│  - Components             │
│  - Context/Hooks          │
└────────────┬─────────────┘
             │
             │ HTTP Requests (JWT Token)
             │
             ▼
┌──────────────────────────────────┐
│   Express Backend (Node.js)       │
│   - 4 Route Files                 │
│   - Authentication                │
│   - Validation & Business Logic   │
└────────────┬─────────────────────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐
│  Auth  │ │Events  │ │Bookings │ │ Users  │
│ Router │ │ Router │ │ Router  │ │ Router │
└────────┘ └────────┘ └─────────┘ └────────┘

Endpoints:
├─ POST   /api/auth/signup
├─ POST   /api/auth/login
├─ GET    /api/events
├─ GET    /api/events/:id
├─ POST   /api/events (organizer)
├─ PUT    /api/events/:id (organizer)
├─ DELETE /api/events/:id (organizer)
├─ GET    /api/bookings
├─ POST   /api/bookings
├─ PUT    /api/bookings/:id
├─ DELETE /api/bookings/:id
├─ GET    /api/users/:userId
├─ PUT    /api/users/:userId
└─ GET    /api/bookings/event/:eventId

             │
    ┌────────┼────────┬───────────┐
    │        │        │           │
    ▼        ▼        ▼           ▼
┌─────────┐ ┌─────────┐ ┌────────────┐
│Firestore│ │Realtime │ │Razorpay    │
│Database │ │Database │ │Payment API │
└─────────┘ └─────────┘ └────────────┘

Firestore Collections:
├─ users (10 documents)
│  └─ uid, email, name, userType, etc.
├─ events (2 documents)
│  └─ eventId, name, category, price, etc.
├─ bookings (3 documents)
│  └─ bookingId, eventId, userId, status, etc.
└─ pendingBookings (3 documents)
   └─ pendingId, eventId, userId, status, etc.

Realtime DB:
├─ /bookings (mirrors Firestore)
├─ /events (mirrors Firestore)
├─ /users (mirrors Firestore)
└─ /pendingBookings (mirrors Firestore)

External APIs:
├─ Razorpay (Payment processing)
├─ Firebase Auth (User authentication)
├─ Nominatim OSM (Location reverse geocoding)
└─ Geolocation API (Browser geolocation)

```

### 📝 **Description:**

**Purpose:** Show data flow between frontend, backend, and databases

**Architecture:**
1. **Frontend Layer (React + Vite):**
   - 14 page components
   - Reusable components (Header, Footer, Cards, Forms)
   - AuthContext for state management
   - Custom hooks (useAuth, useBookings, useEvents)

2. **Backend Layer (Express + Node.js):**
   - 4 route files handling different resources
   - Middleware for authentication
   - Request validation
   - Business logic

3. **Database Layer:**
   - **Firestore:** Primary database for structured queries
     - Collections: users, events, bookings, pendingBookings
     - Documents: User profiles, event details, booking records
   - **Realtime Database:** For real-time updates
     - Mirrored data from Firestore
     - Instant notifications for booking updates

4. **External Services:**
   - **Razorpay:** Secure payment processing
   - **Firebase Auth:** User authentication and JWT tokens
   - **Nominatim:** Location reverse geocoding
   - **Browser Geolocation API:** User location detection

**Data Flow:**
- User actions in React → HTTP request with JWT token
- Backend validates and processes
- Data stored/retrieved from Firestore and Realtime DB
- Response sent back to frontend
- Frontend updates UI with new data

---

## 8️⃣ **Complete User Journey Timeline**

```
┌──────────────────────────────────────────────────────────────────┐
│           COMPLETE USER JOURNEY - CUSTOMER                       │
└──────────────────────────────────────────────────────────────────┘

STEP 1: DISCOVERY
        ↓
    Visit Website (Home.jsx)
    └─ See carousel of featured events
    └─ View "Events Near You" section
    └─ Search by location (Geolocation)

STEP 2: REGISTRATION
        ↓
    Click "Sign Up" (SignupForm.jsx)
    └─ Enter email, password, name
    └─ Select userType: "customer"
    └─ Create Firebase account
    └─ JWT token stored locally
    └─ Redirect to Home/Browse Events

STEP 3: BROWSING
        ↓
    Click "Browse Events" (BrowseEvents.jsx)
    └─ See all available events
    └─ Apply filters (category, price, date)
    └─ Sort results
    └─ Click event card to view details

STEP 4: EVENT DETAILS
        ↓
    View EventDetails.jsx
    └─ Event name, date, venue
    └─ Organizer information
    └─ Ticket price and availability
    └─ Event description
    └─ Customer reviews/ratings
    └─ Click "Book Now" button

STEP 5: BOOKING
        ↓
    Fill EventBooking.jsx form
    └─ Select number of tickets
    └─ Enter attendee details (name, email, phone)
    └─ Answer custom event questions
    └─ Review total amount (price + fee + tax)

STEP 6: PAYMENT
        ↓
    Razorpay Payment Gateway (Payment.jsx)
    └─ Select payment method (UPI, Card, Wallet)
    └─ Complete payment
    └─ Receive payment confirmation

STEP 7: CONFIRMATION
        ↓
    Booking confirmed & saved to Firestore
    └─ Booking ID generated
    └─ Confirmation email sent
    └─ Redirect to "My Bookings"

STEP 8: PROFILE MANAGEMENT
        ↓
    View Profile.jsx
    └─ Update profile information
    └─ Change password
    └─ View verification status

STEP 9: BOOKING MANAGEMENT
        ↓
    View "My Bookings" (Bookings.jsx)
    └─ See upcoming events
    └─ See past events
    └─ Download ticket/QR code
    └─ Cancel booking if allowed
    └─ Leave review/rating

STEP 10: COMPLETION
        ↓
    Attend event → Leave review
    └─ Rate event
    └─ Share experience
    └─ Recommend to friends

┌──────────────────────────────────────────────────────────────────┐
│           COMPLETE USER JOURNEY - ORGANIZER                      │
└──────────────────────────────────────────────────────────────────┘

STEP 1: REGISTRATION
        ↓
    Sign Up as Organizer (SignupForm.jsx)
    └─ Enter email, password, name
    └─ Select userType: "organiser"
    └─ Create Firebase account

STEP 2: VERIFICATION
        ↓
    Complete KYC (OrganizerVerification.jsx)
    └─ Verify phone (OTP)
    └─ Verify email (Confirmation link)
    └─ Enter business information
    └─ Pay ₹999 verification fee (Razorpay)
    └─ Status: "organiserVerified: true"

STEP 3: EVENT CREATION
        ↓
    Navigate to "Host Event" (HostEvent.jsx)
    └─ Fill event details form:
       ├─ Event name
       ├─ Date & time (start & end)
       ├─ Venue name & address
       ├─ Category (Comedy, Art, etc.)
       ├─ Ticket quantity & price
       ├─ Description
       ├─ Custom questions for attendees
       ├─ Event image/poster
       └─ Event type (In-person/Online)
    └─ Create event (Status: "draft")

STEP 4: PUBLISH EVENT
        ↓
    Review event details
    └─ Preview event page
    └─ Publish event (Status: "published")
    └─ Event visible to all users
    └─ Bookings start coming in

STEP 5: DASHBOARD
        ↓
    View OrganizerDashboard.jsx
    └─ List of created events
    └─ Booking statistics
    └─ Revenue summary
    └─ Attendee list

STEP 6: BOOKING MANAGEMENT
        ↓
    Monitor incoming bookings
    └─ See new bookings in real-time
    └─ View attendee details
    └─ Track payment status
    └─ Download attendee list

STEP 7: EVENT MANAGEMENT
        ↓
    Edit or manage event details
    └─ Update event information
    └─ Change pricing if needed
    └─ Add more details
    └─ Cancel event if needed
    └─ Manage refunds

STEP 8: REVENUE TRACKING
        ↓
    Monitor earnings
    └─ View total bookings
    └─ Track revenue collected
    └─ See pending payments
    └─ Download revenue reports

STEP 9: COMPLETION
        ↓
    Event date arrives → Host event
    └─ Verify attendees
    └─ Manage event setup
    └─ Collect feedback
    └─ Process any refunds

```

---

## 🎯 **Key Features Summary**

| Feature | Page | Users | Purpose |
|---------|------|-------|---------|
| Authentication | Login.jsx | All | User sign in/sign up |
| Home Page | Home.jsx | All | Featured events & location search |
| Browse Events | BrowseEvents.jsx | All | Discover events with filters |
| Event Details | EventDetails.jsx | All | View full event information |
| Book Event | EventBooking.jsx | Customers | Select tickets & attendees |
| Payment | Payment.jsx | Customers | Process payment via Razorpay |
| Profile | Profile.jsx | All | Manage account information |
| My Bookings | Bookings.jsx | Customers | View booking history |
| Host Event | HostEvent.jsx | Organizers | Create new events |
| Dashboard | OrganizerDashboard.jsx | Organizers | Monitor events & bookings |
| Verification | OrganizerVerification.jsx | New Organizers | KYC & payment for verification |
| About Us | AboutUs.jsx | All | Company information |
| Contact Us | ContactUs.jsx | All | Customer support |
| Privacy Policy | PrivacyPolicy.jsx | All | Data privacy information |
| Terms | TermsConditions.jsx | All | Terms of service |

---

## 🔌 **API Endpoints Overview**

```
Authentication Routes
├─ POST   /api/auth/signup         - Register new user
├─ POST   /api/auth/login          - Login user
└─ GET    /api/auth/verify-token   - Verify JWT token

Event Routes
├─ GET    /api/events              - List all events
├─ GET    /api/events/:id          - Get event details
├─ POST   /api/events              - Create event (organizer)
├─ PUT    /api/events/:id          - Update event (organizer)
└─ DELETE /api/events/:id          - Delete event (organizer)

Booking Routes
├─ GET    /api/bookings            - List all bookings
├─ GET    /api/bookings/:id        - Get booking details
├─ GET    /api/bookings/my-bookings/:userId  - User's bookings
├─ POST   /api/bookings            - Create booking
├─ PUT    /api/bookings/:id        - Update booking status
└─ DELETE /api/bookings/:id        - Cancel booking

User Routes
├─ GET    /api/users/:userId       - Get user profile
├─ PUT    /api/users/:userId       - Update user profile
├─ GET    /api/users/:userId/verify - Check verification status
└─ PUT    /api/users/:userId/verify - Update verification details
```

---

## 📊 **Technology Stack**

**Frontend:**
- React 18.2
- Vite (Build tool)
- React Router v6 (Navigation)
- Axios/Fetch (HTTP client)
- CSS/Responsive Design

**Backend:**
- Express.js (Web framework)
- Node.js (Runtime)
- Firebase Admin SDK
- JWT Authentication

**Database:**
- Firestore (Primary database)
- Realtime Database (Real-time updates)
- Firebase Authentication

**Payment:**
- Razorpay Payment Gateway
- Secure payment processing

**External APIs:**
- Geolocation API (Browser)
- Nominatim OSM (Location reverse geocoding)

---

**End of Activity Diagram Documentation**

*This document provides complete activity flows for all major user journeys in TalentConnect platform.*
