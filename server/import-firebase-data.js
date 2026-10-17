/**
 * Firebase Data Import Script
 * Imports sample data from JSON file to Firebase Firestore and Realtime Database
 * 
 * Usage: node import-firebase-data.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, 'firebase-key.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: firebase-key.json not found at', serviceAccountPath);
  console.log('\n📝 To create firebase-key.json:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('2. Select your project (talent-f474d)');
  console.log('3. Go to Project Settings → Service Accounts');
  console.log('4. Click "Generate New Private Key"');
  console.log('5. Save the JSON file as "server/firebase-key.json"\n');
  process.exit(1);
}

try {
  const serviceAccount = require('./firebase-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://talent-f474d-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const realtimeDb = admin.database();

// Load data from the provided JSON file
const jsonDataPath = path.join(__dirname, '../talent-f474d-default-rtdb-export.json');

let data = {
  bookings: {
    "TC1762573303800": {
      "UserId": "JxhsJqd3qEYqEYpmUanBuHxqpBi2",
      "bookingDate": "2025-11-08T03:41:43.800Z",
      "bookingId": "TC1762573303800",
      "email": "kjjklknlkn@gdfdg",
      "eventId": "event_1761887353854",
      "eventName": "Stand Up Comedy",
      "fullName": "ugkj",
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "paymentMethod": "wallet",
      "phone": "896968968",
      "status": "confirmed",
      "ticketCount": 2,
      "ticketPrice": 400,
      "totalAmount": "1003"
    },
    "TC1762578205011": {
      "bookingDate": "2025-11-08T05:03:25.011Z",
      "bookingId": "TC1762578205011",
      "email": "ravleenk49@gmail.com",
      "eventId": "event_1761835128854",
      "eventName": "painting exhibition",
      "fullName": "Ravleen Kaur",
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "paymentMethod": "upi",
      "phone": "9872430644",
      "status": "confirmed",
      "ticketCount": 5,
      "ticketPrice": 50,
      "totalAmount": "354",
      "userId": "tn5kQWmVTCeLMe22bPPo5nF7npk2"
    },
    "TC1762766414506": {
      "bookingDate": "2025-11-10T09:20:14.506Z",
      "bookingId": "TC1762766414506",
      "email": "fghfh@gmail.com",
      "eventId": "event_1761887353854",
      "eventName": "Stand Up Comedy",
      "fullName": "hvvh",
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "paymentMethod": "wallet",
      "phone": "7657576588",
      "status": "confirmed",
      "ticketCount": 2,
      "ticketPrice": 400,
      "totalAmount": "1003",
      "userId": "24t7lnUlDieX4IR4LwPzxIBMmrY2"
    }
  },
  events: {
    "event_1761887353854": {
      "category": "comedy",
      "createdAt": "2025-10-31T05:09:13.854Z",
      "customQuestions": "Are you excited for show?",
      "date": "2025-10-22",
      "description": "Stand-up comedy is live, punchy storytelling packed with jokes, truth, and laughter. One mice, endless laughs.",
      "endTime": "15:30",
      "eventType": "In-person",
      "name": "Stand Up Comedy",
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "publishedDate": "2025-10-31T05:09:13.854Z",
      "requirePhone": "Yes",
      "startTime": "12:30",
      "status": "published",
      "ticketPrice": "400",
      "ticketType": "Paid",
      "totalTickets": "500",
      "venueAddress": "Tagore Theatre, sector 18",
      "venueName": "Tagore Theatre"
    },
    "event_1762956779473": {
      "category": "Art",
      "createdAt": "2025-11-12T14:12:59.473Z",
      "customQuestions": "How much excited for this?",
      "date": "2025-11-30",
      "description": "🎨 Step into a world of color and creativity at our Painting Exhibition, where every canvas tells a story. Discover stunning works by emerging and established artists, celebrating imagination, emotion, and technique.",
      "endTime": "06:00",
      "eventType": "In-person",
      "image": "https://news.eastriding.gov.uk/images/eryc_directory/corp_news/2753/open_art_1.jpg",
      "lastModified": "2025-11-12T14:12:59.473Z",
      "name": "Painting Exhibition",
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "publishedDate": "2025-11-12T14:12:59.473Z",
      "requirePhone": "No",
      "startTime": "09:00",
      "status": "published",
      "ticketPrice": "80",
      "ticketType": "Paid",
      "totalTickets": "500",
      "venueAddress": "Rose Garden, sector 16,chandigarh",
      "venueName": "Rose Garden"
    }
  },
  pendingBookings: {
    "PB1762756835482": {
      "bookingFee": 50,
      "createdAt": "2025-11-10T06:40:35.482Z",
      "email": "ranjan29@gamil.com",
      "eventDate": "2025-10-22",
      "eventId": "event_1761887353854",
      "eventName": "Stand Up Comedy",
      "eventTime": "12:30 - 15:30",
      "eventVenue": "Tagore Theatre, Tagore Theatre, sector 18",
      "fullName": "ranjan",
      "gstAmount": 153,
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "pendingBookingId": "PB1762756835482",
      "phone": "2365758453",
      "status": "pending",
      "ticketCount": 2,
      "ticketPrice": 400,
      "totalAmount": 1003,
      "userId": "SUMPPaOAUqWrnON6OV9nRhXZ30s2"
    },
    "PB1762756861971": {
      "bookingFee": 50,
      "createdAt": "2025-11-10T06:41:01.971Z",
      "email": "ranjan29@gamil.com",
      "eventDate": "2025-10-22",
      "eventId": "event_1761887353854",
      "eventName": "Stand Up Comedy",
      "eventTime": "12:30 - 15:30",
      "eventVenue": "Tagore Theatre, Tagore Theatre, sector 18",
      "fullName": "ranjan",
      "gstAmount": 81,
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "pendingBookingId": "PB1762756861971",
      "phone": "2365758453",
      "status": "pending",
      "ticketCount": 1,
      "ticketPrice": 400,
      "totalAmount": 531,
      "userId": "SUMPPaOAUqWrnON6OV9nRhXZ30s2"
    },
    "PB1762874025209": {
      "bookingFee": 50,
      "createdAt": "2025-11-11T15:13:45.209Z",
      "email": "surya23@gmail.com",
      "eventDate": "2025-10-22",
      "eventId": "event_1761887353854",
      "eventName": "Stand Up Comedy",
      "eventTime": "12:30 - 15:30",
      "eventVenue": "Tagore Theatre, Tagore Theatre, sector 18",
      "fullName": "surya",
      "gstAmount": 81,
      "organizerId": "U2OFI9PctDfc9THWlf7OvUXvZo23",
      "pendingBookingId": "PB1762874025209",
      "phone": "35454545456",
      "status": "pending",
      "ticketCount": 1,
      "ticketPrice": 400,
      "totalAmount": 531,
      "userId": "24t7lnUlDieX4IR4LwPzxIBMmrY2"
    }
  },
  users: {
    "24t7lnUlDieX4IR4LwPzxIBMmrY2": {
      "createdAt": "2025-11-11T14:35:03.391Z",
      "email": "he@gmail.com",
      "name": "he",
      "userType": "customer"
    },
    "7LitcldLCDOCnegKCPj1QzEObj13": {
      "createdAt": "2025-11-19T16:17:29.370Z",
      "email": "pranjal0659.becse24@chitkara.edu.in",
      "name": "Shabnam",
      "userType": "customer"
    },
    "8SqxBg32c7TXh4qYBMDFtrRTyH72": {
      "createdAt": "2025-11-12T13:32:53.334Z",
      "email": "hkaulakh@29gmail.com",
      "name": "Harman",
      "userType": "organiser"
    },
    "AcJ1VlYEMFcX7fK5dBtYbWzUgE32": {
      "businessInfo": {
        "address": "1097 dharampur colony",
        "businessType": "company",
        "city": "Panchkula",
        "country": "India",
        "organization": "chitkara university",
        "state": "Haryana",
        "taxId": "",
        "zipCode": "134102"
      },
      "createdAt": "2025-11-09T16:26:49.961Z",
      "email": "pranjal.kwatra@gmail.com",
      "emailVerified": true,
      "emailVerifiedDate": "2025-11-19T16:38:05.655Z",
      "name": "pranjal",
      "organizerVerified": true,
      "paymentComplete": true,
      "paymentDate": "2025-11-19T16:41:51.757Z",
      "phoneNumber": "7496814577",
      "phoneVerified": true,
      "userType": "organiser",
      "verificationFee": 999,
      "verifiedDate": "2025-11-19T16:41:56.668Z"
    },
    "JxhsJqd3qEYqEYpmUanBuHxqpBi2": {
      "createdAt": "2025-11-09T16:28:23.033Z",
      "email": "kwatrapranjal@gmail.com",
      "name": "pranjal",
      "userType": "customer"
    },
    "NQ8hW21qk2eagenO6capCec6z1p1": {
      "createdAt": "2025-11-10T10:04:48.030Z",
      "email": "rkaulakh29@gmail.com",
      "name": "Raman",
      "userType": "organiser"
    },
    "SUMPPaOAUqWrnON6OV9nRhXZ30s2": {
      "createdAt": "2025-11-10T06:12:48.737Z",
      "email": "rkaulakh2986@gmail.com",
      "name": "Raman Kaur",
      "userType": "customer"
    },
    "U2OFI9PctDfc9THWlf7OvUXvZo23": {
      "createdAt": "2025-11-10T06:32:03.489Z",
      "email": "ravleenk49@gmail.com",
      "name": "Ravleen Kaur",
      "userType": "organiser"
    },
    "tn5kQWmVTCeLMe22bPPo5nF7npk2": {
      "createdAt": "2025-11-10T03:55:37.578Z",
      "email": "ravleen0680.becse24@chitkara.edu.in",
      "name": "Ravleen Kaur",
      "userType": "customer"
    },
    "vyECHtUF4ec9RNqX9lWFqyDwYLC2": {
      "createdAt": "2025-11-11T14:45:57.852Z",
      "email": "priya@gmail.com",
      "name": "Priya",
      "userType": "organiser"
    },
    "xiuzMwLNBGPJv73hhTowVndPdwZ2": {
      "createdAt": "2025-11-10T06:20:02.810Z",
      "email": "rupalimangla.9842@gmail.com",
      "name": "Rupali Mangla",
      "userType": "organiser"
    }
  }
};

// Check if the external JSON file exists and load it
if (fs.existsSync(jsonDataPath)) {
  try {
    const fileContent = fs.readFileSync(jsonDataPath, 'utf8');
    data = JSON.parse(fileContent);
    console.log('✅ Loaded data from external JSON file');
  } catch (error) {
    console.log('⚠️  Using built-in data (external JSON file parsing failed)');
  }
} else {
  console.log('⚠️  External JSON file not found, using built-in data');
}

async function importData() {
  try {
    console.log('\n🔄 Starting Firebase data import...\n');

    // Import Users to Firestore
    console.log('📝 Importing users...');
    const usersData = data.users || {};
    for (const [userId, userData] of Object.entries(usersData)) {
      if (userId !== 'role') { // Skip the 'role' field
        await db.collection('users').doc(userId).set(userData);
        console.log(`  ✓ User: ${userData.name} (${userData.email})`);
      }
    }

    // Import Events to Firestore
    console.log('\n📝 Importing events...');
    const eventsData = data.events || {};
    for (const [eventId, eventData] of Object.entries(eventsData)) {
      await db.collection('events').doc(eventId).set(eventData);
      console.log(`  ✓ Event: ${eventData.name}`);
    }

    // Import Bookings to Firestore
    console.log('\n📝 Importing bookings...');
    const bookingsData = data.bookings || {};
    for (const [bookingId, bookingData] of Object.entries(bookingsData)) {
      await db.collection('bookings').doc(bookingId).set(bookingData);
      console.log(`  ✓ Booking: ${bookingId}`);
    }

    // Import Pending Bookings to Firestore
    console.log('\n📝 Importing pending bookings...');
    const pendingData = data.pendingBookings || {};
    for (const [pendingId, pendingData] of Object.entries(pendingData)) {
      await db.collection('pendingBookings').doc(pendingId).set(pendingData);
      console.log(`  ✓ Pending Booking: ${pendingId}`);
    }

    // Also import to Realtime Database for real-time updates
    console.log('\n📝 Syncing to Realtime Database...');
    await realtimeDb.ref('/bookings').set(bookingsData);
    console.log('  ✓ Bookings synced');
    
    await realtimeDb.ref('/events').set(eventsData);
    console.log('  ✓ Events synced');
    
    await realtimeDb.ref('/users').set(usersData);
    console.log('  ✓ Users synced');
    
    await realtimeDb.ref('/pendingBookings').set(pendingData);
    console.log('  ✓ Pending bookings synced');

    console.log('\n✅ Data import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${Object.keys(usersData).filter(k => k !== 'role').length}`);
    console.log(`   • Events: ${Object.keys(eventsData).length}`);
    console.log(`   • Bookings: ${Object.keys(bookingsData).length}`);
    console.log(`   • Pending Bookings: ${Object.keys(pendingData).length}`);

  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the import
importData();
