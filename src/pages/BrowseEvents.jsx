import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../components/services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    price: '',
    sort: 'date'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const events = await fetchEvents();
      const formattedEvents = events.map(event => ({
        ...event,
        displayDate: `${event.date} • ${event.startTime}`,
        displayLocation: `${event.venueName}, ${event.venueAddress}`,
        numericPrice: parseInt(event.ticketPrice) || 0
      }));
      
      // Sort by date (newest first)
      formattedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let processed = allEvents.filter(event => {
      if (filters.category && event.category?.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.location && !event.displayLocation.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      if (filters.price) {
        const price = event.numericPrice;
        if (filters.price === 'free' && price !== 0) return false;
        if (filters.price === 'under-500' && (price === 0 || price > 500)) return false;
        if (filters.price === '500-1000' && (price < 500 || price > 1000)) return false;
        if (filters.price === '1000-2000' && (price < 1000 || price > 2000)) return false;
        if (filters.price === '2000+' && price < 2000) return false;
      }
      
      return true;
    });
    
    // Apply sorting
    if (filters.sort === 'price-low') {
      processed.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (filters.sort === 'price-high') {
      processed.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (filters.sort === 'name') {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === 'date') {
      processed.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    setCurrentPage(1);
    setFilteredEvents(processed);
  };

  const resetFilters = () => {
    setFilters({ category: '', location: '', price: '', sort: 'date' });
    setCurrentPage(1);
    setFilteredEvents(allEvents);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Auto-apply filters when they change
  useEffect(() => {
    if (allEvents.length > 0) {
      applyFiltersAndSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const bookEvent = (eventId) => {
    navigate(`/booking/${eventId}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

  return (
    <div className="browse-events-page">
      <section className="page-header">
        <h1>Discover Amazing <span>Events</span></h1>
        <p>Find events that match your interests and preferences</p>
      </section>

      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts & Culture">Arts & Culture</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Conference">Conferences</option>
              <option value="Workshop">Workshops</option>
              <option value="Comedy">Comedy</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              placeholder="City or venue"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="price">Price Range</label>
            <select 
              id="price"
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="free">Free</option>
              <option value="under-500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="2000+">Over ₹2000</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="reset-btn" onClick={resetFilters} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)';
            }}>
              <i className="fas fa-redo-alt" style={{ marginRight: '8px' }}></i>
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      <section className="events-grid-section">
        <div className="events-header">
          <h2>All <span>Events</span> (<span>{filteredEvents.length}</span>)</h2>
          
          <div className="sort-options">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="date">Date (Newest First)</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
        
        <div className="events-grid">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner"></i>
              <p>Loading events from Firebase...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No events found</h3>
              <p>Try adjusting your filters or check back later for new events.</p>
            </div>
          ) : (
            eventsToDisplay.map((event, index) => (
              <div 
                key={event.id} 
                className="event-card"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(91, 33, 182, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(91, 33, 182, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  paddingTop: '65%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                }}>
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                    alt={event.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  />
                  
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: event.numericPrice === 0 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {event.numericPrice === 0 ? (
                      <>
                        <i className="fas fa-gift"></i>
                        FREE
                      </>
                    ) : (
                      <>
                        <i className="fas fa-tag"></i>
                        ₹{event.numericPrice}
                      </>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  {event.category && (
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#5b21b6',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <i className="fas fa-bookmark"></i>
                      {event.category}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="event-card-content" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  gap: '16px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0,
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '56px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#5b21b6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                  >{event.name}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="event-meta" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      color: '#6b7280',
                      fontSize: '14px',
                      padding: '8px 12px',
                      background: 'rgba(91, 33, 182, 0.04)',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(91, 33, 182, 0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(91, 33, 182, 0.04)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <i className="fas fa-calendar-alt" style={{ 
                        color: '#5b21b6', 
                        fontSize: '16px',
                        flexShrink: 0
                      }}></i>
                      <span style={{ flex: 1, lineHeight: '1.5', fontWeight: '500' }}>{event.displayDate}</span>
                    </div>
                    
                    <div className="event-meta" style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px',
                      color: '#6b7280',
                      fontSize: '14px',
                      padding: '8px 12px',
                      background: 'rgba(249, 115, 22, 0.04)',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.04)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <i className="fas fa-map-marker-alt" style={{ 
                        color: '#f97316', 
                        fontSize: '16px',
                        marginTop: '2px',
                        flexShrink: 0
                      }}></i>
                      <span style={{ 
                        flex: 1, 
                        lineHeight: '1.5',
                        fontWeight: '500',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{event.displayLocation}</span>
                    </div>
                  </div>

                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                    minHeight: '63px'
                  }}>{event.description || 'Join us for an amazing event experience! Don\'t miss out on this incredible opportunity.'}</p>
                  
                  <button 
                    className={`btn ${event.status === 'upcoming' ? 'btn-ghost' : ''}`}
                    onClick={() => bookEvent(event.id)}
                    disabled={event.status === 'upcoming'}
                    style={{
                      width: '100%',
                      padding: '14px 28px',
                      background: event.status === 'upcoming' 
                        ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)' 
                        : 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: event.status === 'upcoming' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: event.status === 'upcoming' 
                        ? 'none' 
                        : '0 4px 15px rgba(91, 33, 182, 0.3)',
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (event.status !== 'upcoming') {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(91, 33, 182, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (event.status !== 'upcoming') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(91, 33, 182, 0.3)';
                      }
                    }}
                  >
                    {event.status === 'upcoming' ? (
                      <>
                        <i className="far fa-clock"></i>
                        Coming Soon
                      </>
                    ) : (
                      <>
                        <i className="fas fa-ticket-alt"></i>
                        Book Tickets
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BrowseEvents;
