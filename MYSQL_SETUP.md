# TalentConnect - MySQL Backend Setup

## Prerequisites
- Node.js installed
- MySQL installed and running
- MySQL credentials: root / 123456

## Step 1: Create MySQL Database

1. Open MySQL Command Line or MySQL Workbench
2. Run the schema file:

```sql
SOURCE E:/TalentConnect/server/database/schema.sql
```

Or manually copy and paste the SQL from `server/database/schema.sql` into MySQL Workbench and execute.

## Step 2: Install Backend Dependencies

```bash
cd E:\TalentConnect\server
npm install
```

## Step 3: Start Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on **http://localhost:5000**

## Step 4: Update Frontend Configuration

The frontend has been updated to use MySQL backend API instead of Firebase.

## Step 5: Start Frontend (in separate terminal)

```bash
cd E:\TalentConnect
npm run dev
```

The frontend will run on **http://localhost:5173** or **http://localhost:5174**

---

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/verify` - Verify token

### Events
- GET `/api/events` - Get all events (with filters)
- GET `/api/events/:id` - Get event by ID
- POST `/api/events` - Create event (protected)
- PUT `/api/events/:id` - Update event (protected)
- DELETE `/api/events/:id` - Delete event (protected)
- GET `/api/events/organizer/:organizerId` - Get organizer events

### Bookings
- GET `/api/bookings/user/:userId` - Get user bookings
- GET `/api/bookings/:id` - Get booking by ID
- POST `/api/bookings` - Create booking (protected)
- PUT `/api/bookings/:bookingId/cancel` - Cancel booking
- GET `/api/bookings` - Get all bookings (admin)

### Users
- GET `/api/users/:userId` - Get user profile
- PUT `/api/users/:userId` - Update user profile

---

## Database Structure

### Tables:
- **users** - User accounts (customers & organizers)
- **events** - All events
- **bookings** - All bookings with payment details

### Sample Credentials:
- Customer: customer@test.com / test123
- Organizer: organizer@test.com / test123

---

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running
- Check credentials in `server/.env` file
- Ensure database `talentconnect` exists

### Port Already in Use
- Change PORT in `server/.env` file
- Update API_BASE_URL in `src/components/services/mysqlApi.js`

### CORS Errors
- Backend has CORS enabled for all origins
- Check if backend server is running

---

## Testing the Backend

Visit: **http://localhost:5000/api/health**

You should see:
```json
{
  "status": "OK",
  "message": "TalentConnect API is running"
}
```

---

## Next Steps

1. Run MySQL schema to create tables
2. Install backend dependencies: `npm install`
3. Start backend: `npm start`
4. Update frontend to use new API
5. Start frontend: `npm run dev`

All Firebase code will be replaced with MySQL API calls automatically!
