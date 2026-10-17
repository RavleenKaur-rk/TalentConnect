import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchEventById } from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login?redirect=/events/' + id);
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-details-page">
      <div className="event-header">
        <img src={event.imageUrl} alt={event.title} className="event-banner" />
        <div className="event-header-overlay">
          <div className="container">
            <span className="event-badge">{event.type}</span>
            <h1>{event.title}</h1>
            <div className="event-meta">
              <span>📅 {formatDateTime(event.date)}</span>
              <span>📍 {event.location}</span>
              <span>By {event.organizerName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="event-details-content">
          <div className="event-main">
            <section>
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </section>

            <section>
              <h2>Event Details</h2>
              <ul className="details-list">
                <li><strong>Category:</strong> {event.category}</li>
                <li><strong>Type:</strong> {event.type}</li>
                <li><strong>Capacity:</strong> {event.capacity} attendees</li>
                <li><strong>Available Seats:</strong> {event.availableSeats}</li>
              </ul>
            </section>
          </div>

          <div className="event-sidebar">
            <div className="booking-card">
              <div className="price-tag">
                {event.price === 0 ? 'Free' : formatCurrency(event.price)}
              </div>
              <button 
                className="btn btn-primary btn-block"
                onClick={handleBookNow}
                disabled={event.availableSeats === 0}
              >
                {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
              </button>
              <p className="seats-info">
                {event.availableSeats} of {event.capacity} seats available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
