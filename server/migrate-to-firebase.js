const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData() {
  console.log('🔄 Migrating data to Firebase...\n');

  try {
    // Sample Users Data
    const users = [
      {
        uid: 'artist_sharma_001',
        username: 'artist_sharma',
        email: 'sharma@example.com',
        userType: 'ARTIST',
        contact: '9876543210',
        location: 'Mumbai',
        createdAt: new Date('2024-01-01')
      },
      {
        uid: 'client_patel_001',
        username: 'client_patel',
        email: 'patel@example.com',
        userType: 'CLIENT',
        contact: '9876543211',
        location: 'Delhi',
        createdAt: new Date('2024-01-02')
      },
      {
        uid: 'artist_khan_001',
        username: 'artist_khan',
        email: 'khan@example.com',
        userType: 'ARTIST',
        contact: '9876543212',
        location: 'Bangalore',
        createdAt: new Date('2024-01-03')
      },
      {
        uid: 'client_gupta_001',
        username: 'client_gupta',
        email: 'gupta@example.com',
        userType: 'CLIENT',
        contact: '9876543213',
        location: 'Mumbai',
        createdAt: new Date('2024-01-04')
      },
      {
        uid: 'artist_verma_001',
        username: 'artist_verma',
        email: 'verma@example.com',
        userType: 'ARTIST',
        contact: '9876543214',
        location: 'Pune',
        createdAt: new Date('2024-01-05')
      }
    ];

    // Sample Events Data
    const events = [
      {
        name: 'Classical Night',
        category: 'Music',
        date: '2024-02-14',
        time: '19:00:00',
        location: 'Mumbai',
        capacity: 200,
        price: 500,
        description: 'Evening classical music performance',
        artistId: 'artist_sharma_001',
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-10')
      },
      {
        name: 'Electronic Music Festival',
        category: 'Music',
        date: '2024-02-20',
        time: '20:00:00',
        location: 'Delhi',
        capacity: 500,
        price: 1500,
        description: 'All night electronic music festival',
        artistId: 'artist_khan_001',
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-11')
      },
      {
        name: 'Stand Up Comedy Show',
        category: 'Comedy',
        date: '2024-02-25',
        time: '21:00:00',
        location: 'Bangalore',
        capacity: 150,
        price: 299,
        description: 'Hilarious comedy performances',
        artistId: 'artist_verma_001',
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-12')
      }
    ];

    // Sample Bookings Data
    const bookings = [
      {
        clientId: 'client_patel_001',
        eventId: null, // Will be set after events are created
        eventName: 'Classical Night',
        seats: 2,
        amount: 1000,
        status: 'CONFIRMED',
        confirmationCode: 'CONF001',
        createdAt: new Date('2024-01-15')
      },
      {
        clientId: 'client_patel_001',
        eventId: null, // Will be set after events are created
        eventName: 'Stand Up Comedy Show',
        seats: 1,
        amount: 299,
        status: 'CONFIRMED',
        confirmationCode: 'CONF002',
        createdAt: new Date('2024-01-16')
      },
      {
        clientId: 'client_gupta_001',
        eventId: null, // Will be set after events are created
        eventName: 'Electronic Music Festival',
        seats: 3,
        amount: 4500,
        status: 'PENDING',
        confirmationCode: 'CONF003',
        createdAt: new Date('2024-01-17')
      }
    ];

    // Sample Transactions Data
    const transactions = [
      {
        bookingId: null, // Will be set after bookings are created
        amount: 1000,
        paymentStatus: 'SUCCESS',
        paymentMethod: 'CARD',
        razorpayOrderId: 'order_001',
        razorpayPaymentId: 'pay_001',
        createdAt: new Date('2024-01-15')
      },
      {
        bookingId: null, // Will be set after bookings are created
        amount: 299,
        paymentStatus: 'SUCCESS',
        paymentMethod: 'UPI',
        razorpayOrderId: 'order_002',
        razorpayPaymentId: 'pay_002',
        createdAt: new Date('2024-01-16')
      },
      {
        bookingId: null, // Will be set after bookings are created
        amount: 4500,
        paymentStatus: 'PENDING',
        paymentMethod: 'CARD',
        razorpayOrderId: 'order_003',
        razorpayPaymentId: null,
        createdAt: new Date('2024-01-17')
      }
    ];

    // Add Users
    console.log('📝 Adding users...');
    const userRefs = {};
    for (const user of users) {
      const docRef = await db.collection('users').add(user);
      userRefs[user.uid] = docRef.id;
      console.log(`   ✓ ${user.username}`);
    }

    // Add Events
    console.log('\n📝 Adding events...');
    const eventRefs = {};
    let eventIndex = 0;
    for (const event of events) {
      const docRef = await db.collection('events').add(event);
      eventRefs[eventIndex] = docRef.id;
      console.log(`   ✓ ${event.name}`);
      eventIndex++;
    }

    // Add Bookings
    console.log('\n📝 Adding bookings...');
    const bookingRefs = {};
    let bookingIndex = 0;
    for (let i = 0; i < bookings.length; i++) {
      bookings[i].eventId = Object.values(eventRefs)[i % Object.values(eventRefs).length];
      const docRef = await db.collection('bookings').add(bookings[i]);
      bookingRefs[bookingIndex] = docRef.id;
      console.log(`   ✓ Booking #${i + 1} - ${bookings[i].confirmationCode}`);
      bookingIndex++;
    }

    // Add Transactions
    console.log('\n📝 Adding transactions...');
    for (let i = 0; i < transactions.length; i++) {
      transactions[i].bookingId = Object.values(bookingRefs)[i];
      await db.collection('transactions').add(transactions[i]);
      console.log(`   ✓ Transaction #${i + 1} - ₹${transactions[i].amount}`);
    }

    // Add Categories
    console.log('\n📝 Adding categories...');
    const categories = [
      { name: 'Music', description: 'Live music performances' },
      { name: 'Comedy', description: 'Stand-up comedy shows' },
      { name: 'Dance', description: 'Dance performances and workshops' }
    ];
    for (const category of categories) {
      await db.collection('categories').add(category);
      console.log(`   ✓ ${category.name}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DATA MIGRATION COMPLETE!');
    console.log('='.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   ✓ ${users.length} Users added`);
    console.log(`   ✓ ${events.length} Events added`);
    console.log(`   ✓ ${bookings.length} Bookings added`);
    console.log(`   ✓ ${transactions.length} Transactions added`);
    console.log(`   ✓ ${categories.length} Categories added`);

    console.log('\n🔗 View your data at:');
    console.log('   https://console.firebase.google.com/project/YOUR_PROJECT/firestore/data');

    console.log('\n💾 Collections in Firestore:');
    console.log('   • users - All user profiles');
    console.log('   • events - All events');
    console.log('   • bookings - All bookings');
    console.log('   • transactions - All payments');
    console.log('   • categories - Event categories\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrateData();
