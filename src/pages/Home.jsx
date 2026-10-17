import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../components/services/api';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationSearch, setLocationSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1800&auto=format&fit=crop',
      title: 'Discover, Book & Experience Events Effortlessly',
      subtitle: 'Join thousands who trust TalentConnect to find and host incredible experiences.'
    },
    {
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1800&auto=format&fit=crop',
      title: 'Easy Booking. Seamless Payments.',
      subtitle: 'Book concerts, workshops, and entertainment with just one click.'
    },
    {
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1800&auto=format&fit=crop',
      title: 'Host With Confidence',
      subtitle: 'Create, promote, and manage your event — all in one platform.'
    }
  ];

  useEffect(() => {
    loadEvents();
    const saved = localStorage.getItem('userCity');
    if (saved && saved !== 'Unknown') {
      setLocationSearch(saved);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadEvents = async (location = null) => {
    try {
      setLoading(true);
      const filters = location ? { location } : {};
      const data = await fetchEvents(filters);
      
      // Format events data to ensure consistent field names
      const formattedEvents = data.map(event => ({
        ...event,
        title: event.name || event.title,
        price: parseInt(event.ticketPrice) || parseInt(event.price) || 0,
        location: event.venueAddress || event.location,
        availableSeats: event.availableSeats || event.totalCapacity || 100,
        imageUrl: event.image || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        type: event.category || event.type || 'Event'
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectUserCity = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const addr = data.address || {};
          let city = (addr.city || addr.town || addr.village || addr.county || addr.state || '').trim();
          
          const tricity = ['pinjore', 'panchkula', 'mohali', 'tricity'];
          if (tricity.some(m => city.toLowerCase().includes(m))) {
            city = 'Chandigarh';
          }
          
          if (!city) city = addr.county || addr.state || 'Unknown';
          
          setLocationSearch(city);
          localStorage.setItem('userCity', city);
          loadEvents(city);
        } catch (error) {
          console.error('Error detecting location:', error);
          alert('Unable to detect city');
        }
      },
      () => alert('Location permission denied'),
      { timeout: 10000 }
    );
  };

  const searchEvents = () => {
    if (!locationSearch.trim()) {
      alert('Enter a city or event name');
      return;
    }
    loadEvents(locationSearch);
  };

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Location Detection Section */}
      <section className="detect-section">
        <div className="container">
          <h2>Find Events Happening Near You</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Find events near you..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchEvents()}
            />
            <button className="detect-btn" onClick={detectUserCity}>
              📍 Detect Location
            </button>
            <button className="find-btn" onClick={searchEvents}>
              Find Events
            </button>
          </div>
        </div>
      </section>

      {/* Events Near You */}
      <section>
        <div className="container">
          <h2>Events Near You</h2>
          <p className="section-desc">
            Hot events happening right now. Don't miss out — filter by city or event name.
          </p>
          {loading ? (
            <LoadingSpinner />
          ) : events.length > 0 ? (
            <div className="events-grid">
              {events.slice(0, 6).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>No events available.</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: '#f9fafb' }}>
        <div className="container">
          <h2>Everything You Need to Host & Discover <span style={{ color: '#5b21b6' }}>Events</span></h2>
          <p className="section-desc">
            Whether you're hosting a concert or looking for your next adventure, we've got you covered with powerful tools and seamless experiences.
          </p>
          <div className="AboutUs-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Event Creation</h3>
              <p>Create and publish your event in minutes with our intuitive event builder.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📢</div>
              <h3>Built-in Promotion</h3>
              <p>Your events get promoted to the right audience automatically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Reach Your Audience</h3>
              <p>Connect with thousands of potential attendees in your local community.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Booking Protection</h3>
              <p>Both hosts and attendees are protected with our booking guarantee.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>We handle all payments securely, so you can focus on your event.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Bookings</h3>
              <p>Customers can book and pay instantly with just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="container">
          <h2>How <span style={{ color: '#5b21b6' }}>It Works</span></h2>
          <p className="section-desc">Simple steps to find and book the perfect event for you</p>
          <div className="steps">
            <div className="step">
              <div className="step-icon">🔍</div>
              <h3>1. Search</h3>
              <p>Browse events by location, date, and category to find what interests you.</p>
            </div>
            <div className="step">
              <div className="step-icon">✓</div>
              <h3>2. Select</h3>
              <p>Choose from a variety of events that match your preferences and budget.</p>
            </div>
            <div className="step">
              <div className="step-icon">💳</div>
              <h3>3. Book & Pay</h3>
              <p>Secure your spot with our trusted payment system.</p>
            </div>
            <div className="step">
              <div className="step-icon">😊</div>
              <h3>4. Enjoy</h3>
              <p>Attend the event and create unforgettable memories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Host Your Own Event?</h2>
          <p>Create memorable experiences and reach thousands of potential attendees</p>
          <Link to="/host-event" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
