import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from '../components/context/AuthContext';
import '../components/styles/global.css';

const EventBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    termsAccepted: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEvent();
  }, [id, user]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const loadEvent = async () => {
    try {
      const db = getDatabase();
      const eventRef = ref(db, `events/${id}`);
      const snapshot = await get(eventRef);
      
      if (snapshot.exists()) {
        setEvent({ id: snapshot.key, ...snapshot.val() });
      } else {
        alert('Event not found!');
        navigate('/browse');
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const increaseTicket = () => {
    if (ticketCount < 10) {
      setTicketCount(ticketCount + 1);
    }
  };

  const decreaseTicket = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const calculatePricing = () => {
    const ticketPrice = parseInt(event?.ticketPrice) || 0;
    const subtotal = ticketPrice * ticketCount;
    const bookingFee = 50;
    const gst = Math.round((subtotal + bookingFee) * 0.18);
    const total = subtotal + bookingFee + gst;
    
    return { ticketPrice, subtotal, bookingFee, gst, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    setProcessing(true);

    const pricing = calculatePricing();
    
    // Prepare booking data for payment page
    const bookingData = {
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventTime: `${event.startTime} - ${event.endTime}`,
      eventVenue: `${event.venueName}, ${event.venueAddress}`,
      eventImage: event.image,
      eventCategory: event.category,
      ticketCount: ticketCount,
      ticketPrice: pricing.ticketPrice,
      subtotal: pricing.subtotal,
      bookingFee: pricing.bookingFee,
      gstAmount: pricing.gst,
      totalAmount: pricing.total,
      attendeeName: formData.name,
      attendeeEmail: formData.email,
      attendeePhone: formData.phone,
      bookingDate: new Date().toISOString()
    };

    // Store in localStorage for payment page
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Redirect to payment page
    setTimeout(() => {
      navigate('/payment');
    }, 500);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-container">
        <p>Event not found</p>
      </div>
    );
  }

  const pricing = calculatePricing();

  return (
    <div className="booking-page">
      <div className="container-booking">
        <div className="booking-wrapper">
          {/* Event Details */}
          <div className="event-details-card">
            <div className="event-image-container">
              <img 
                src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                alt={event.name}
                className="event-image"
              />
            </div>
            <h1 className="event-title">{event.name}</h1>
            
            <div className="event-meta-grid">
              <div className="event-meta-item">
                <i className="fas fa-calendar-alt"></i>
                <span>{event.date}</span>
              </div>
              
              <div className="event-meta-item">
                <i className="fas fa-clock"></i>
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              
              <div className="event-meta-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{event.venueName}, {event.venueAddress}</span>
              </div>
              
              <div className="event-meta-item">
                <i className="fas fa-tag"></i>
                <span>{event.category}</span>
              </div>
            </div>

            <div className="event-description">
              <h3>About this event</h3>
              <p>{event.description}</p>
            </div>

            <div className="event-highlights">
              <h4>Event Highlights</h4>
              <div className="highlight-item">
                <i className="fas fa-check-circle"></i>
                <span>Instant Confirmation</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-mobile-alt"></i>
                <span>Mobile Ticket</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Booking</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-card">
            <form onSubmit={handleSubmit} id="bookingForm">
              <div className="form-section">
                <h3>
                  <i className="fas fa-ticket-alt"></i>
                  Select Tickets
                </h3>
                <div className="ticket-selector">
                  <div>
                    <div style={{fontWeight: 600, marginBottom: '5px'}}>Number of Tickets</div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                      ₹<span id="ticketPrice">{pricing.ticketPrice}</span> per ticket
                    </div>
                  </div>
                  <div className="ticket-controls">
                    <button 
                      type="button" 
                      className="ticket-btn" 
                      onClick={decreaseTicket}
                      disabled={ticketCount <= 1}
                    >
                      -
                    </button>
                    <span className="ticket-count">{ticketCount}</span>
                    <button 
                      type="button" 
                      className="ticket-btn" 
                      onClick={increaseTicket}
                      disabled={ticketCount >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <i className="fas fa-user"></i>
                  Attendee Details
                </h3>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="price-breakdown">
                <h3 style={{marginBottom: '15px', color: '#5b21b6'}}>Price Breakdown</h3>
                <div className="price-row">
                  <span>Ticket Price × <span id="ticketMultiplier">{ticketCount}</span></span>
                  <span>₹<span id="subtotal">{pricing.subtotal}</span></span>
                </div>
                <div className="price-row">
                  <span>Booking Fee</span>
                  <span>₹50</span>
                </div>
                <div className="price-row">
                  <span>GST (18%)</span>
                  <span>₹<span id="gst">{pricing.gst}</span></span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹<span id="totalAmount">{pricing.total}</span></span>
                </div>
              </div>

              <div className="form-group checkbox-group" style={{marginTop: '20px'}}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    id="termsCheckbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    required
                  />
                  <span className="checkbox-text">
                    I agree to the <a href="/terms" target="_blank" className="terms-link">terms and conditions</a>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="book-button"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Proceed to Payment - ₹<span id="payAmount">{pricing.total}</span>
                  </>
                )}
              </button>

              <div className="secure-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Secure & encrypted payment</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {processing && (
        <div className="loading-overlay active">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p style={{marginTop: '15px', color: '#5b21b6', fontWeight: 600}}>Preparing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBooking;
