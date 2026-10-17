# 🚀 TalentConnect - Complete Project Running

## ✅ Status: All Services Online

### 🟢 Active Services
- **Frontend**: http://localhost:5173 (Vite React Dev Server)
- **Backend API**: http://localhost:5000 (Node.js/Express)
- **Database**: localhost:3306 (MySQL - talentconnect)

---

## 📊 Database Status

### Database Name: `talentconnect`
### Connection: root@localhost:3306

**Tables Created:**
- ✅ USER (5 sample users)
- ✅ ARTIST (3 artists)
- ✅ CLIENT (2 clients)
- ✅ CATEGORY (3 categories)
- ✅ EVENT (3 events)
- ✅ BOOKING (3 bookings)
- ✅ TRANSACTION (3 transactions)

**Additional Objects:**
- ✅ Views: vw_active_events, vw_booking_summary
- ✅ Indexes: 6 performance indexes
- ✅ Sample Data: Fully populated

---

## 🔐 Authentication & User Data

### Sample Users Available for Testing

**Organizers (Artists):**
1. **artist_sharma** - Classical musician
   - Email: sharma@example.com
   - Status: Verified
   - Rating: 4.5/5

2. **artist_khan** - Electronic DJ
   - Email: khan@example.com
   - Status: Verified
   - Rating: 4.8/5

3. **artist_verma** - Stand-up comedian
   - Email: verma@example.com
   - Status: Verified
   - Rating: 4.7/5

**Customers (Clients):**
1. **client_patel** - Premium member
   - Email: patel@example.com
   - Location: Delhi

2. **client_gupta** - Basic member
   - Email: gupta@example.com
   - Location: Mumbai

**Note:** Passwords are bcrypt hashed. Use signup to create new users.

---

## 📋 Available Events

| Event | Artist | Category | Date | Price | Capacity |
|-------|--------|----------|------|-------|----------|
| Classical Night | artist_sharma | Music | 2024-02-14 | ₹500 | 200 |
| Electronic Music Festival | artist_khan | Music | 2024-02-20 | ₹1500 | 500 |
| Stand Up Comedy Show | artist_verma | Comedy | 2024-02-25 | ₹299 | 150 |

---

## 🎯 Testing Workflow

### 1. **Signup (New User)**
```
POST http://localhost:5000/api/auth/signup
```
Create a new user account - data stored in MySQL USER table

### 2. **Login**
```
POST http://localhost:5000/api/auth/login
```
Get JWT token for authentication

### 3. **Browse Events**
```
GET http://localhost:5000/api/events
```
See all available events with filters:
- Category
- Location
- Price range
- Sort by date

### 4. **Book an Event**
```
POST http://localhost:5000/api/bookings
```
Create a booking - stored in MySQL BOOKING table

### 5. **View My Bookings**
```
GET http://localhost:5000/api/bookings/my-bookings
```
See all your confirmed bookings

### 6. **Payment**
Navigate to http://localhost:5173/payment.html
- Razorpay integration (test mode)
- After payment, booking status updates to CONFIRMED
- Transaction recorded in MySQL

---

## 📁 Project Structure

```
TalentConnect/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── auth/               # Login/Signup forms
│   │   ├── events/             # Event display & filters
│   │   ├── profile/            # User profile
│   │   └── common/             # Reusable components
│   ├── pages/                  # Route pages
│   ├── services/               # API service (mysqlApi.js)
│   └── App.jsx                 # Main app & routes
│
├── server/                       # Node.js Backend
│   ├── server.js               # Express app
│   ├── config/
│   │   └── database.js         # MySQL connection pool
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── events.js           # Event CRUD
│   │   ├── bookings.js         # Booking CRUD
│   │   └── users.js            # User profile
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   └── database/
│       └── schema-fixed.sql    # Complete schema
│
├── public/                       # Static files
│   ├── payment.html            # Razorpay payment page
│   └── About.html              # Static pages
│
└── package.json                # Dependencies
```

---

## 🔄 Data Flow

```
User Signup
    ↓
[MySQL USER table] ← Password hashed with bcrypt
    ↓
Login with credentials
    ↓
[JWT Token] Generated for authentication
    ↓
Browse Events (Filtered from EVENT table)
    ↓
Create Booking
    ↓
[MySQL BOOKING table] ← Booking stored
    ↓
Payment Processing
    ↓
[MySQL TRANSACTION table] ← Transaction stored
    ↓
[MySQL BOOKING table] ← Status updated to CONFIRMED
    ↓
View in "My Bookings" page
```

---

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-token` - Verify JWT token

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (artists only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

---

## 📱 Frontend Features

✅ **Navigation Bar**
- Consistent across all pages
- Different menu for organizers vs customers
- User dropdown with profile & logout

✅ **Home Page**
- Featured events
- Quick navigation

✅ **Browse Events**
- Advanced filtering (category, location, price)
- Real-time search
- Sort options

✅ **Event Booking**
- Dynamic pricing calculator
- Seat selection
- Booking confirmation

✅ **My Bookings**
- View confirmed bookings
- Cancel bookings
- Download confirmation

✅ **Payment Integration**
- Razorpay payment gateway
- Test mode credentials provided
- Payment status updates

---

## 🗄 MySQL Database Schema (30 Topics Covered)

### DDL (Data Definition Language)
- CREATE TABLE (7 tables)
- ALTER TABLE
- INDEX creation
- Foreign key constraints

### DML (Data Manipulation Language)
- INSERT (15+ sample records)
- UPDATE (booking status)
- DELETE (with cascades)
- SELECT (with joins)

### Views
- vw_active_events
- vw_booking_summary

### Stored Procedures (with Loops & Conditionals)
- sp_check_discount() - IF-ELSE logic
- sp_generate_reports() - WHILE loop with cursor
- sp_create_booking() - Validation logic

### Triggers
- trg_before_booking_insert - Data validation
- trg_after_booking_insert - Capacity update
- trg_after_transaction_insert - Booking confirmation
- trg_before_booking_delete - Capacity restoration

### Indexes
- idx_email
- idx_username
- idx_event_date
- idx_booking_date
- idx_booking_status
- idx_payment_status

### DCL (Data Control Language)
- User creation with roles
- GRANT/REVOKE permissions
- app_user (SELECT, INSERT, UPDATE, DELETE)
- report_user (SELECT only)

### Constraints
- NOT NULL
- UNIQUE
- PRIMARY KEY
- FOREIGN KEY
- CHECK constraints
- DEFAULT values

### Transactions
- ACID compliance
- Multi-table operations

---

## 🧪 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### Get All Events
```bash
curl http://localhost:5000/api/events
```

### Create New User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "password123",
    "userType": "CLIENT"
  }'
```

---

## 📝 Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=talentconnect
PORT=5000
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🎯 What's Implemented

### Database
✅ Complete schema with all 30 topics
✅ Sample data (users, events, bookings)
✅ Triggers for automation
✅ Views for data abstraction
✅ Stored procedures with business logic
✅ Proper indexing for performance

### Backend
✅ Express.js REST API
✅ MySQL database integration
✅ JWT authentication
✅ Bcrypt password hashing
✅ CORS enabled
✅ Error handling
✅ Input validation
✅ Transaction support

### Frontend
✅ React components
✅ Event browsing with filters
✅ Booking system
✅ Payment integration (Razorpay)
✅ User authentication
✅ My Bookings page
✅ Persistent navigation
✅ Responsive design

---

## 🚀 Next Steps

1. **Test Signup**: Go to http://localhost:5173 and create a new account
   - Data will be saved to MySQL USER table

2. **Browse Events**: See all available events with filters

3. **Make a Booking**: Select an event and complete booking
   - Data saved to MySQL BOOKING table

4. **Process Payment**: Complete payment on payment.html
   - Transaction saved to TRANSACTION table
   - Booking status updated to CONFIRMED

5. **View Bookings**: See your confirmed bookings

---

## 📞 Troubleshooting

### Backend not responding
```bash
# Check if port 5000 is in use
Get-NetTCPConnection -LocalPort 5000
# Kill process if needed
Stop-Process -Id <PID> -Force
# Restart backend
cd server && node server.js
```

### Frontend not loading
```bash
# Clear cache and restart
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Database connection issues
```bash
# Verify MySQL is running
mysql -u root -p123456 -e "SELECT 1;"
# If needed, reinitialize
node init-db-simple.js
```

---

## 🎉 Success!

Your TalentConnect application is now:
- ✅ Running on port 5173 (Frontend)
- ✅ Running on port 5000 (Backend)
- ✅ Connected to MySQL database
- ✅ Ready for full user data persistence

**All user data (login, signup, bookings, events) is now stored in MySQL database!**

Start exploring at: **http://localhost:5173**

---

*Generated: 2024*
*Project: TalentConnect Event Booking Platform*
