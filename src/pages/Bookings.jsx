import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  useEffect(() => {
    filterBookings(currentFilter);
  }, [bookings, currentFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      // Static demo booking for Stand Up Comedy event from Browse Events
      const demoBooking = {
        id: 'BK1732099200000',
        bookingId: 'BK1732099200000',
        eventId: '-O7hKlMnP9qRsT8uVwXy',
        eventTitle: 'Stand Up Comedy',
        eventName: 'Stand Up Comedy',
        eventDate: '2025-10-22',
        eventTime: '7:00 PM - 10:00 PM',
        eventVenue: 'Tagore Theatre, sector 18',
        eventLocation: 'Tagore Theatre, sector 18',
        eventImage: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
        eventCategory: 'Comedy',
        ticketCount: 2,
        tickets: 2,
        ticketPrice: 400,
        pricePerTicket: 400,
        bookingFee: 50,
        platformFee: 50,
        gstAmount: 162,
        totalAmount: 1062,
        totalPrice: 1062,
        razorpayPaymentId: 'pay_OctComedy456789',
        transactionId: 'pay_OctComedy456789',
        userId: user?.uid,
        userEmail: user?.email,
        userName: user?.displayName || 'Demo User',
        customerName: user?.displayName || 'Demo User',
        customerEmail: user?.email,
        paymentMethod: 'razorpay',
        paymentStatus: 'success',
        bookingDate: '2025-10-15T14:20:00.000Z',
        status: 'confirmed'
      };
      
      const db = getDatabase();
      const bookingsRef = ref(db, `bookings/${user.uid}`);
      const snapshot = await get(bookingsRef);

      let bookingsArray = [demoBooking]; // Start with demo booking

      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        const firebaseBookings = Object.entries(bookingsData).map(([id, data]) => ({
          id,
          ...data
        }));
        bookingsArray = [...bookingsArray, ...firebaseBookings];
      }
      
      // Sort by booking date (newest first)
      bookingsArray.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(bookingsArray);
    } catch (error) {
      console.error('Error loading bookings:', error);
      // If error, still show demo booking
      const demoBooking = {
        id: 'BK1732099200000',
        eventTitle: 'Stand Up Comedy',
        eventDate: '2025-10-22',
        eventTime: '7:00 PM - 10:00 PM',
        eventLocation: 'Tagore Theatre, sector 18',
        eventImage: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
        tickets: 2,
        totalPrice: 1062,
        bookingDate: '2025-10-15T14:20:00.000Z',
        status: 'confirmed',
        razorpayPaymentId: 'pay_OctComedy456789',
        ticketPrice: 400,
        pricePerTicket: 400,
        bookingFee: 50,
        gstAmount: 162
      };
      setBookings([demoBooking]);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (booking) => {
    if (booking.status === 'cancelled') return 'cancelled';
    
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) return 'completed';
    return 'upcoming';
  };

  const filterBookings = (filter) => {
    setCurrentFilter(filter);
    
    if (filter === 'all') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => getBookingStatus(booking) === filter);
      setFilteredBookings(filtered);
    }
  };

  const handleCancelClick = (bookingId) => {
    setBookingToCancel(bookingId);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel || !user) return;

    try {
      const db = getDatabase();
      await update(ref(db, `bookings/${user.uid}/${bookingToCancel}`), {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      await update(ref(db, `allBookings/${bookingToCancel}`), {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      await loadBookings();
      setCancelModalOpen(false);
      setBookingToCancel(null);
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const downloadReceipt = (booking) => {
    const receiptContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TALENTCONNECT
       BOOKING RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${booking.id}
Date of Booking: ${new Date(booking.bookingDate).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: ${booking.eventTitle || booking.eventName || 'N/A'}
Date: ${booking.eventDate || 'TBA'}
Time: ${booking.eventTime || 'TBA'}
Location: ${booking.eventLocation || booking.eventVenue || 'TBA'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Number of Tickets: ${booking.tickets || booking.ticketCount || 1}
Price per Ticket: ₹${booking.pricePerTicket || booking.ticketPrice || 0}
${booking.gstAmount ? `GST (18%): ₹${booking.gstAmount}\n` : ''}
${booking.platformFee || booking.bookingFee ? `Platform Fee: ₹${booking.platformFee || booking.bookingFee}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT: ₹${booking.totalPrice || booking.totalAmount || 0}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${booking.paymentMethod || 'Razorpay'}
Payment Status: ${booking.paymentStatus || 'Completed'}
Transaction ID: ${booking.transactionId || booking.razorpayPaymentId || booking.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${booking.customerName || booking.userName || 'N/A'}
Email: ${booking.customerEmail || booking.userEmail || user.email}
Phone: ${booking.customerPhone || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${getBookingStatus(booking).toUpperCase()}

Thank you for booking with TalentConnect!
For support, contact: support@talentconnect.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TalentConnect_Receipt_${booking.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', color: '#1f2937', marginBottom: '10px' }}>My Bookings</h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>View and manage all your event bookings</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '30px', 
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'all', label: 'All Bookings', icon: 'list' },
          { id: 'upcoming', label: 'Upcoming', icon: 'clock' },
          { id: 'completed', label: 'Completed', icon: 'check-circle' },
          { id: 'cancelled', label: 'Cancelled', icon: 'times-circle' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => filterBookings(filter.id)}
            style={{
              padding: '14px 24px',
              background: 'none',
              border: 'none',
              color: currentFilter === filter.id ? '#5b21b6' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: `3px solid ${currentFilter === filter.id ? '#5b21b6' : 'transparent'}`,
              marginBottom: '-2px',
              transition: '0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={`fas fa-${filter.icon}`} style={{ marginRight: '8px' }}></i>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-calendar-times" style={{ fontSize: '72px', color: '#d1d5db', marginBottom: '20px' }}></i>
          <h3 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '10px' }}>
            {currentFilter === 'all' ? 'No Bookings Yet' : `No ${currentFilter} bookings`}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {currentFilter === 'all' ? "You haven't booked any events yet. Start exploring amazing events!" : `You don't have any ${currentFilter} bookings.`}
          </p>
          <button 
            onClick={() => navigate('/browse')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
            Browse Events
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredBookings.map(booking => {
            const status = getBookingStatus(booking);
            const canCancel = status === 'upcoming' && booking.status !== 'cancelled';

            return (
              <div 
                key={booking.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: '0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
              >
                {/* Event Image */}
                <div style={{
                  width: '100%',
                  height: '160px',
                  background: booking.eventImage 
                    ? `url(${booking.eventImage}) center/cover` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '48px'
                }}>
                  {!booking.eventImage && <i className="fas fa-calendar-alt"></i>}
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  {/* Status Badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    background: status === 'upcoming' ? '#dbeafe' : status === 'completed' ? '#d1fae5' : '#fee2e2',
                    color: status === 'upcoming' ? '#1e40af' : status === 'completed' ? '#065f46' : '#991b1b'
                  }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>

                  <h3 style={{ color: '#1f2937', fontSize: '20px', marginBottom: '12px' }}>
                    {booking.eventTitle || booking.eventName || 'Event'}
                  </h3>

                  {/* Event Details */}
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>{booking.eventDate || 'Date TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-clock" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>{booking.eventTime || 'Time TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>{booking.eventLocation || booking.eventVenue || 'Location TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-ticket-alt" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>{booking.tickets || booking.ticketCount || 1} Ticket(s)</span>
                  </div>

                  {/* Price */}
                  <div style={{
                    background: '#f3f4f6',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: 600,
                    marginTop: '12px'
                  }}>
                    Total: ₹{booking.totalPrice || booking.totalAmount || 0}
                  </div>

                  {/* Booking ID */}
                  <div style={{
                    background: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280',
                    fontFamily: 'monospace',
                    marginTop: '12px'
                  }}>
                    ID: {booking.id.substring(0, 16)}...
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      onClick={() => downloadReceipt(booking)}
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        background: '#5b21b6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: '0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#5b21b6'}
                    >
                      <i className="fas fa-download" style={{ marginRight: '6px' }}></i>
                      Receipt
                    </button>
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      disabled={!canCancel}
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        background: canCancel ? '#fee2e2' : '#f3f4f6',
                        color: canCancel ? '#991b1b' : '#9ca3af',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: canCancel ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        transition: '0.3s',
                        opacity: canCancel ? 1 : 0.5
                      }}
                      onMouseEnter={(e) => {
                        if (canCancel) e.currentTarget.style.background = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        if (canCancel) e.currentTarget.style.background = '#fee2e2';
                      }}
                    >
                      <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setCancelModalOpen(false)}
        >
          <div 
            style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1f2937', fontSize: '24px', margin: 0 }}>Cancel Booking</h2>
              <button
                onClick={() => setCancelModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancelModalOpen(false)}
                style={{
                  padding: '10px 24px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e5e7eb'}
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  padding: '10px 24px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
