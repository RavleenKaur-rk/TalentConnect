import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { getDatabase, ref, get, update } from 'firebase/database';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrganizerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', phone: '', organization: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const db = getDatabase();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserProfile();
  }, [user, navigate]);

  const loadUserProfile = async () => {
    try {
      const userRef = ref(db, 'users/' + user.uid);
      const snapshot = await get(userRef);
      const data = snapshot.val();
      
      if (!data) {
        showToast('User data not found', 'error');
        navigate('/login');
        return;
      }

      if (data.userType !== 'organiser') {
        showToast('Access denied. This page is for organizers only.', 'error');
        navigate('/');
        return;
      }

      setUserData(data);
      setSettingsForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        organization: data.organization || ''
      });

      await loadDashboardData(user.uid);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast('Error loading profile', 'error');
      setLoading(false);
    }
  };

  const loadDashboardData = async (uid) => {
    try {
      // Load events first, then bookings
      await loadEvents(uid);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadEvents = async (uid) => {
    try {
      const eventsRef = ref(db, 'events');
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        const events = [];
        snapshot.forEach((childSnapshot) => {
          const event = { id: childSnapshot.key, ...childSnapshot.val() };
          if (event.organizerId === uid) {
            events.push(event);
          }
        });
        setUserEvents(events);
        
        // Load bookings after events are loaded
        await loadBookings(uid, events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadBookings = async (uid, events) => {
    try {
      const allBookingsRef = ref(db, 'allBookings');
      const snapshot = await get(allBookingsRef);
      
      if (snapshot.exists()) {
        const bookings = [];
        const attendeeMap = new Map();
        
        snapshot.forEach((childSnapshot) => {
          const booking = { id: childSnapshot.key, ...childSnapshot.val() };
          
          // Check if this booking belongs to any of the organizer's events
          const event = events.find(e => e.id === booking.eventId);
          
          if (event) {
            bookings.push(booking);
            
            // Track attendees
            if (booking.userId && !attendeeMap.has(booking.userId)) {
              attendeeMap.set(booking.userId, {
                userId: booking.userId,
                userName: booking.userName || 'Unknown',
                userEmail: booking.userEmail || '',
                totalBookings: 0,
                totalSpent: 0
              });
            }
            
            if (booking.userId) {
              const attendee = attendeeMap.get(booking.userId);
              attendee.totalBookings += 1;
              attendee.totalSpent += parseInt(booking.totalAmount || 0);
            }
          }
        });
        
        setUserBookings(bookings);
        setAllAttendees(Array.from(attendeeMap.values()));
        console.log('Loaded bookings:', bookings.length);
        console.log('Loaded attendees:', attendeeMap.size);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const saveSettings = async () => {
    if (!settingsForm.name) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      await update(ref(db, 'users/' + user.uid), {
        name: settingsForm.name,
        phone: settingsForm.phone,
        organization: settingsForm.organization
      });

      setUserData(prev => ({ ...prev, ...settingsForm }));
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast('Error logging out', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <LoadingSpinner />;

  const activeEvents = userEvents.filter(e => e.status === 'published' || e.status === 'active').length;
  const totalBookings = userBookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = userBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
  const totalAttendees = allAttendees.length;

  const firstName = userData?.name?.split(' ')[0] || 'User';
  const initials = userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-wrapper" style={{ marginTop: '20px' }}>
        {/* Sidebar */}
        <aside className={`navigation-sidebar ${showSidebar ? 'open' : ''}`}>
          <div className="nav-menu">
            <a className={`nav-link ${currentSection === 'overview' ? 'current' : ''}`} onClick={() => setCurrentSection('overview')}>
              <i className="fas fa-th-large icon"></i> Overview
            </a>
            <a className="nav-link" onClick={() => navigate('/host-event')}>
              <i className="fas fa-plus-circle icon"></i> Host Event
            </a>
            <a className={`nav-link ${currentSection === 'events' ? 'current' : ''}`} onClick={() => setCurrentSection('events')}>
              <i className="fas fa-calendar-alt icon"></i> My Events
            </a>
            <a className={`nav-link ${currentSection === 'bookings' ? 'current' : ''}`} onClick={() => setCurrentSection('bookings')}>
              <i className="fas fa-ticket-alt icon"></i> Bookings
            </a>
            <a className={`nav-link ${currentSection === 'analytics' ? 'current' : ''}`} onClick={() => setCurrentSection('analytics')}>
              <i className="fas fa-chart-line icon"></i> Analytics
            </a>
            <a className={`nav-link ${currentSection === 'revenue' ? 'current' : ''}`} onClick={() => setCurrentSection('revenue')}>
              <i className="fas fa-rupee-sign icon"></i> Revenue
            </a>
            <a className={`nav-link ${currentSection === 'attendees' ? 'current' : ''}`} onClick={() => setCurrentSection('attendees')}>
              <i className="fas fa-users icon"></i> Attendees
            </a>
            <a className="nav-link" onClick={() => navigate('/organizer-verification')}>
              <i className="fas fa-shield-alt icon"></i> Verification
            </a>
            <a className={`nav-link ${currentSection === 'settings' ? 'current' : ''}`} onClick={() => setCurrentSection('settings')}>
              <i className="fas fa-cog icon"></i> Settings
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          {/* Overview Section */}
          {currentSection === 'overview' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Welcome back, {firstName}! 👋</h1>
                <p>Here's what's happening with your events today</p>
              </div>

              <div className="stats-container">
                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{activeEvents}</div>
                      <div className="stat-title">Active Events</div>
                    </div>
                    <div className="stat-badge purple-bg">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {activeEvents > 0 ? '12% from last month' : 'No events yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalBookings}</div>
                      <div className="stat-title">Total Bookings</div>
                    </div>
                    <div className="stat-badge orange-bg">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalBookings > 0 ? '8% from last month' : 'No bookings yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="stat-title">Total Revenue</div>
                    </div>
                    <div className="stat-badge green-bg">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalRevenue > 0 ? '15% from last month' : 'No revenue yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalAttendees}</div>
                      <div className="stat-title">Total Attendees</div>
                    </div>
                    <div className="stat-badge blue-bg">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalAttendees > 0 ? '5% from last month' : 'No attendees yet'}
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Quick Actions</h2>
                </div>
                <div className="card-content">
                  <div className="quick-access">
                    <div className="access-card" onClick={() => navigate('/host-event')}>
                      <div className="icon"><i className="fas fa-plus-circle"></i></div>
                      <h3>Create Event</h3>
                      <p>Start organizing a new event</p>
                    </div>
                    <div className="access-card" onClick={() => setCurrentSection('events')}>
                      <div className="icon"><i className="fas fa-calendar-alt"></i></div>
                      <h3>View Events</h3>
                      <p>Manage your existing events</p>
                    </div>
                    <div className="access-card" onClick={() => setCurrentSection('bookings')}>
                      <div className="icon"><i className="fas fa-ticket-alt"></i></div>
                      <h3>View Bookings</h3>
                      <p>Check recent bookings</p>
                    </div>
                    <div className="access-card" onClick={() => setCurrentSection('analytics')}>
                      <div className="icon"><i className="fas fa-chart-bar"></i></div>
                      <h3>Analytics</h3>
                      <p>View performance metrics</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Recent Events</h2>
                  <button className="action-btn secondary" onClick={() => setCurrentSection('events')}>View All</button>
                </div>
                <div className="card-content">
                  {userEvents.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-calendar-times"></i></div>
                      <h3>No Events Yet</h3>
                      <p>Start by creating your first event</p>
                      <button className="action-btn primary" onClick={() => navigate('/host-event')} style={{ marginTop: '20px' }}>
                        <i className="fas fa-plus"></i> Create Event
                      </button>
                    </div>
                  ) : (
                    userEvents.slice(0, 3).map(event => {
                      const eventBookings = userBookings.filter(b => b.eventId === event.id && b.status === 'confirmed').length;
                      return (
                        <div key={event.id} className="event-card">
                          <div className="event-header">
                            <div className="event-info">
                              <h3>{event.title || event.name}</h3>
                              <div className="event-meta">
                                <span><i className="far fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
                                <span><i className="far fa-clock"></i> {event.time}</span>
                                <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                              </div>
                            </div>
                            <div>
                              <span className="event-badge active">Active</span>
                            </div>
                          </div>
                          <div className="event-meta">
                            <span><strong>Bookings:</strong> {eventBookings}</span>
                            <span><strong>Capacity:</strong> {event.capacity || event.totalTickets}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events Section */}
          {currentSection === 'events' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>My Events</h1>
                <p>Manage all your events</p>
              </div>
              <div className="dashboard-card">
                <div className="card-top">
                  <h2>All Events</h2>
                  <button className="action-btn primary" onClick={() => navigate('/host-event')}>
                    <i className="fas fa-plus"></i> Create Event
                  </button>
                </div>
                <div className="card-content">
                  {userEvents.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-calendar-times"></i></div>
                      <h3>No Events Created</h3>
                      <p>Create your first event to get started</p>
                    </div>
                  ) : (
                    userEvents.map(event => {
                      const eventBookings = userBookings.filter(b => b.eventId === event.id && b.status === 'confirmed');
                      const bookingCount = eventBookings.length;
                      const revenue = eventBookings.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
                      
                      return (
                        <div key={event.id} className="event-card">
                          <div className="event-header">
                            <div className="event-info">
                              <h3>{event.title || event.name}</h3>
                              <div className="event-meta">
                                <span><i className="far fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
                                <span><i className="far fa-clock"></i> {event.time}</span>
                                <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                              </div>
                            </div>
                            <span className="event-badge active">Active</span>
                          </div>
                          <div className="event-meta">
                            <span><strong>Bookings:</strong> {bookingCount}</span>
                            <span><strong>Revenue:</strong> ₹{revenue.toLocaleString('en-IN')}</span>
                            <span><strong>Capacity:</strong> {event.capacity || event.totalTickets}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {currentSection === 'bookings' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Bookings</h1>
                <p>View all bookings for your events</p>
              </div>
              <div className="dashboard-card">
                <div className="card-top">
                  <h2>All Bookings</h2>
                </div>
                <div className="card-content">
                  {userBookings.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-ticket-alt"></i></div>
                      <h3>No Bookings Yet</h3>
                      <p>Bookings will appear here once people start registering for your events</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Event</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.map(booking => {
                          const event = userEvents.find(e => e.id === booking.eventId);
                          return (
                            <tr key={booking.id}>
                              <td>#{booking.id.substring(0, 8)}</td>
                              <td>{event?.title || event?.name || 'Unknown Event'}</td>
                              <td>{booking.userName || 'Unknown'}</td>
                              <td>{new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</td>
                              <td>₹{parseInt(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
                              <td><span className={`status-badge ${booking.status || 'pending'}`}>{booking.status || 'Pending'}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {currentSection === 'analytics' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Analytics</h1>
                <p>Track your event performance</p>
              </div>

              <div className="stats-container">
                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{activeEvents}</div>
                      <div className="stat-title">Active Events</div>
                    </div>
                    <div className="stat-badge purple-bg">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalBookings}</div>
                      <div className="stat-title">Total Bookings</div>
                    </div>
                    <div className="stat-badge orange-bg">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="stat-title">Total Revenue</div>
                    </div>
                    <div className="stat-badge green-bg">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalAttendees}</div>
                      <div className="stat-title">Total Attendees</div>
                    </div>
                    <div className="stat-badge blue-bg">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Event Performance</h2>
                </div>
                <div className="card-content">
                  {userEvents.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-chart-line"></i></div>
                      <h3>No Analytics Data</h3>
                      <p>Create events to see analytics</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Bookings</th>
                          <th>Attendees</th>
                          <th>Revenue</th>
                          <th>Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userEvents.map(event => {
                          const eventBookings = userBookings.filter(b => b.eventId === event.id && b.status === 'confirmed');
                          const bookingCount = eventBookings.length;
                          const attendeeCount = eventBookings.reduce((sum, b) => sum + (parseInt(b.ticketCount || b.tickets) || 1), 0);
                          const revenue = eventBookings.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
                          const capacity = event.capacity || event.totalTickets || 0;
                          const fillRate = capacity > 0 ? ((attendeeCount / capacity) * 100).toFixed(0) : 0;
                          
                          return (
                            <tr key={event.id}>
                              <td>{event.title || event.name}</td>
                              <td>{new Date(event.date).toLocaleDateString()}</td>
                              <td>{bookingCount}</td>
                              <td>
                                {attendeeCount} 
                                {capacity > 0 && <span style={{ color: '#6b7280', fontSize: '12px' }}> ({fillRate}%)</span>}
                              </td>
                              <td style={{ color: '#10b981', fontWeight: '600' }}>₹{revenue.toLocaleString('en-IN')}</td>
                              <td>{capacity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Section */}
          {currentSection === 'revenue' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Revenue</h1>
                <p>Track your earnings from events</p>
              </div>

              <div className="stats-container">
                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="stat-title">Total Revenue</div>
                    </div>
                    <div className="stat-badge green-bg">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalRevenue > 0 ? '15% from last month' : 'No revenue yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalBookings}</div>
                      <div className="stat-title">Paid Bookings</div>
                    </div>
                    <div className="stat-badge blue-bg">
                      <i className="fas fa-check-circle"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalBookings > 0 ? '8% from last month' : 'No bookings yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">₹{totalRevenue > 0 ? Math.round(totalRevenue / totalBookings).toLocaleString('en-IN') : '0'}</div>
                      <div className="stat-title">Avg. Booking Value</div>
                    </div>
                    <div className="stat-badge purple-bg">
                      <i className="fas fa-chart-line"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> Stable
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{activeEvents}</div>
                      <div className="stat-title">Revenue Events</div>
                    </div>
                    <div className="stat-badge orange-bg">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> Active
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Revenue by Event</h2>
                </div>
                <div className="card-content">
                  {userEvents.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-rupee-sign"></i></div>
                      <h3>No Revenue Data</h3>
                      <p>Create and sell tickets to see revenue</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Bookings</th>
                          <th>Ticket Price</th>
                          <th>Total Revenue</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userEvents.map(event => {
                          const eventBookings = userBookings.filter(b => b.eventId === event.id && b.status === 'confirmed');
                          const bookingCount = eventBookings.length;
                          const revenue = eventBookings.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
                          const ticketPrice = event.ticketPrice || event.price || 0;
                          
                          return (
                            <tr key={event.id}>
                              <td>{event.title || event.name}</td>
                              <td>{new Date(event.date).toLocaleDateString()}</td>
                              <td>{bookingCount}</td>
                              <td>₹{parseInt(ticketPrice).toLocaleString('en-IN')}</td>
                              <td style={{ color: '#10b981', fontWeight: '700', fontSize: '16px' }}>₹{revenue.toLocaleString('en-IN')}</td>
                              <td><span className="status-badge confirmed">Paid</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Recent Transactions</h2>
                </div>
                <div className="card-content">
                  {userBookings.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-receipt"></i></div>
                      <h3>No Transactions Yet</h3>
                      <p>Transactions will appear here once bookings are confirmed</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Customer</th>
                          <th>Event</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.slice(0, 10).map(booking => {
                          const event = userEvents.find(e => e.id === booking.eventId);
                          return (
                            <tr key={booking.id}>
                              <td>#{booking.razorpayPaymentId?.substring(0, 12) || booking.id.substring(0, 8)}</td>
                              <td>{booking.userName || 'Unknown'}</td>
                              <td>{event?.title || event?.name || 'Unknown Event'}</td>
                              <td>{new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</td>
                              <td style={{ color: '#10b981', fontWeight: '600' }}>₹{parseInt(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
                              <td>{booking.paymentMethod || 'Razorpay'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Attendees Section */}
          {currentSection === 'attendees' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Attendees</h1>
                <p>Manage your event attendees</p>
              </div>

              <div className="stats-container">
                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalAttendees}</div>
                      <div className="stat-title">Total Attendees</div>
                    </div>
                    <div className="stat-badge blue-bg">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> {totalAttendees > 0 ? '5% from last month' : 'No attendees yet'}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalBookings}</div>
                      <div className="stat-title">Total Registrations</div>
                    </div>
                    <div className="stat-badge purple-bg">
                      <i className="fas fa-user-check"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> Growing
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{activeEvents}</div>
                      <div className="stat-title">Active Events</div>
                    </div>
                    <div className="stat-badge orange-bg">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> Active
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-top">
                    <div>
                      <div className="stat-number">{totalAttendees > 0 ? Math.round(totalBookings / totalAttendees * 10) / 10 : '0'}</div>
                      <div className="stat-title">Avg. Bookings per User</div>
                    </div>
                    <div className="stat-badge green-bg">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                  </div>
                  <div className="stat-trend up">
                    <i className="fas fa-arrow-up"></i> Engagement
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>All Attendees</h2>
                </div>
                <div className="card-content">
                  {allAttendees.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-users"></i></div>
                      <h3>No Attendees Yet</h3>
                      <p>Attendees will appear here once bookings are made</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Total Bookings</th>
                          <th>Total Spent</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allAttendees.map((attendee, index) => (
                          <tr key={attendee.userId || index}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                  width: '36px', 
                                  height: '36px', 
                                  borderRadius: '50%', 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: '600',
                                  fontSize: '14px'
                                }}>
                                  {attendee.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                {attendee.userName}
                              </div>
                            </td>
                            <td>{attendee.userEmail}</td>
                            <td>{attendee.totalBookings}</td>
                            <td style={{ color: '#10b981', fontWeight: '600' }}>₹{attendee.totalSpent.toLocaleString('en-IN')}</td>
                            <td><span className="status-badge confirmed">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-top">
                  <h2>Attendees by Event</h2>
                </div>
                <div className="card-content">
                  {userEvents.length === 0 ? (
                    <div className="no-data">
                      <div className="icon"><i className="fas fa-calendar-times"></i></div>
                      <h3>No Events Yet</h3>
                      <p>Create events to see attendees</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Registered</th>
                          <th>Attendees</th>
                          <th>Capacity</th>
                          <th>Fill Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userEvents.map(event => {
                          const eventBookings = userBookings.filter(b => b.eventId === event.id && b.status === 'confirmed');
                          const registered = eventBookings.length;
                          const attendees = eventBookings.reduce((sum, b) => sum + (parseInt(b.ticketCount || b.tickets) || 1), 0);
                          const capacity = event.capacity || event.totalTickets || 0;
                          const fillRate = capacity > 0 ? ((attendees / capacity) * 100).toFixed(0) : 0;
                          
                          return (
                            <tr key={event.id}>
                              <td>{event.title || event.name}</td>
                              <td>{new Date(event.date).toLocaleDateString()}</td>
                              <td>{registered}</td>
                              <td>{attendees}</td>
                              <td>{capacity}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{
                                    width: '60px',
                                    height: '8px',
                                    background: '#e5e7eb',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                  }}>
                                    <div style={{
                                      width: `${fillRate}%`,
                                      height: '100%',
                                      background: fillRate >= 80 ? '#10b981' : fillRate >= 50 ? '#f59e0b' : '#667eea',
                                      transition: 'width 0.3s'
                                    }}></div>
                                  </div>
                                  <span style={{ fontWeight: '600', color: '#374151' }}>{fillRate}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {currentSection === 'settings' && (
            <div className="section-content active">
              <div className="welcome-section">
                <h1>Settings</h1>
                <p>Manage your account settings</p>
              </div>
              <div className="settings-card">
                <h3>Profile Settings</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={settingsForm.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settingsForm.organization}
                    onChange={(e) => setSettingsForm({ ...settingsForm, organization: e.target.value })}
                  />
                </div>
                <div className="settings-actions">
                  <button className="action-btn primary" onClick={saveSettings}>Save Changes</button>
                  <button className="action-btn secondary" onClick={() => setSettingsForm({
                    name: userData?.name || '',
                    email: userData?.email || '',
                    phone: userData?.phone || '',
                    organization: userData?.organization || ''
                  })}>Reset</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`toast-message visible ${toast.type === 'success' ? 'success-msg' : 'error-msg'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className={`fas fa-${toast.type === 'success' ? 'check' : 'exclamation'}-circle`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
