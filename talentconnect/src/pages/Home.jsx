import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1800&auto=format&fit=crop',
      title: 'Discover, Book & Experience Events Effortlessly',
      description: 'Join thousands who trust TalentConnect to find and host incredible experiences.'
    },
    {
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1800&auto=format&fit=crop',
      title: 'Easy Booking. Seamless Payments.',
      description: 'Book concerts, workshops, and entertainment with just one click.'
    },
    {
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1800&auto=format&fit=crop',
      title: 'Host With Confidence',
      description: 'Create, promote, and manage your event — all in one platform.'
    }
  ];

  useEffect(() => {
    loadEvents();
    
    // Auto-slide carousel
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    try {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        const eventsData = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
        setEvents(eventsData.slice(0, 6)); // Show first 6 events
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const detectLocation = () => {
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
          
          let city = data.address?.city || data.address?.town || data.address?.village || '';
          const cityMap = ['pinjore', 'panchkula', 'mohali', 'tricity'];
          
          if (cityMap.some(m => city.toLowerCase().includes(m))) {
            city = 'Chandigarh';
          }
          
          setLocationSearch(city);
        } catch (error) {
          console.error('Location detection error:', error);
          alert('Unable to detect location');
        }
      },
      () => alert('Location permission denied')
    );
  };

  const searchEvents = () => {
    if (locationSearch.trim()) {
      navigate(`/browse-events?search=${locationSearch}`);
    }
  };

  const bookEvent = (eventId) => {
    navigate(`/book-event?eventId=${eventId}`);
  };

  return (
    <div className="home-page">
      <Header />

      {/* Carousel */}
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === slideIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-content">
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === slideIndex ? 'active' : ''}`}
              onClick={() => setSlideIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Location Search */}
      <section className="detect-section">
        <h2>Find Events Happening Near You</h2>
        <div className="search-box">
          <input
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Find events near you..."
          />
          <button className="detect-btn" onClick={detectLocation}>
            📍 Detect Location
          </button>
          <button className="find-btn" onClick={searchEvents}>
            Find Events
          </button>
        </div>
      </section>

      {/* Events Near You */}
      <section>
        <h2>Events Near You</h2>
        <p className="section-desc">
          Hot events happening right now. Don't miss out!
        </p>
        <div className="event-cards">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'} alt={event.name} />
              <div className="event-card-content">
                <h3>{event.name}</h3>
                <div className="event-meta">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{event.date || 'TBA'}</span>
                </div>
                <div className="event-meta">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.venueName || 'Unknown'}</span>
                </div>
                <p>{(event.description || '').substring(0, 100)}...</p>
                <button 
                  className="btn-book" 
                  onClick={() => bookEvent(event.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: '#f9fafb' }}>
        <h2>Everything You Need to Host & Discover <span style={{ color: '#5b21b6' }}>Events</span></h2>
        <div className="AboutUs-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <h3>Easy Event Creation</h3>
            <p>Create and publish your event in minutes with our intuitive event builder.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bullhorn"></i>
            </div>
            <h3>Built-in Promotion</h3>
            <p>Your events get promoted to the right audience automatically.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Reach Your Audience</h3>
            <p>Connect with thousands of potential attendees in your local community.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;