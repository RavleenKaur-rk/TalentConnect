import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { ref, get } from 'firebase/database';
import { db } from '../components/services/firebase';
import { formatCurrency } from '../components/utils/helpers';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user data from Firebase
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        setUserData(userSnapshot.val());
      }

      // Load bookings
      const bookingsRef = ref(db, `bookings/${user.uid}`);
      const bookingsSnapshot = await get(bookingsRef);
      
      if (bookingsSnapshot.exists()) {
        const bookingsData = bookingsSnapshot.val();
        const bookingsArray = Object.entries(bookingsData).map(([id, data]) => ({
          id,
          ...data
        }));

        // Calculate stats
        const today = new Date();
        const upcoming = bookingsArray.filter(b => {
          const eventDate = new Date(b.eventDate);
          return eventDate > today && b.status !== 'cancelled';
        });
        const completed = bookingsArray.filter(b => {
          const eventDate = new Date(b.eventDate);
          return eventDate <= today && b.status !== 'cancelled';
        });
        const totalSpent = bookingsArray
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        setStats({
          totalBookings: bookingsArray.length,
          upcomingEvents: upcoming.length,
          completedEvents: completed.length,
          totalSpent
        });

        // Get recent bookings (last 3)
        setRecentBookings(bookingsArray.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getMemberSince = () => {
    if (!user?.metadata?.creationTime) return '';
    const date = new Date(user.metadata.creationTime);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-page-new">
      {/* Profile Header with Cover */}
      <div className="profile-cover">
        <div className="cover-gradient"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder-large">
                {getInitials(user?.displayName || userData?.name)}
              </div>
            )}
            <div className="avatar-badge">
              <i className="fas fa-check"></i>
            </div>
          </div>
          <div className="profile-header-info">
            <h1>{user?.displayName || userData?.name || 'User'}</h1>
            <p className="profile-email">
              <i className="fas fa-envelope"></i> {user?.email}
            </p>
            <p className="profile-member-since">
              <i className="fas fa-calendar-alt"></i> Member since {getMemberSince()}
            </p>
            {userData?.userType && (
              <span className="user-type-badge">
                <i className={userData.userType === 'organiser' ? 'fas fa-theater-masks' : 'fas fa-ticket-alt'}></i>
                {userData.userType === 'organiser' ? 'Organizer' : 'Customer'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content-wrapper">
        {/* Stats Cards */}
        <section className="profile-stats-section">
          <div className="stats-row">
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper purple">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper blue">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.upcomingEvents}</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.completedEvents}</h3>
                <p>Events Attended</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper orange">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="stat-details">
                <h3>{formatCurrency(stats.totalSpent)}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="profile-grid-layout">
          {/* Left Column - Account Info */}
          <div className="profile-left-column">
            <div className="profile-card">
              <div className="card-header">
                <h2>Account Information</h2>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-user"></i> Full Name
                  </span>
                  <span className="info-value">{user?.displayName || userData?.name || 'Not Set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-envelope"></i> Email
                  </span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-phone"></i> Phone
                  </span>
                  <span className="info-value">{userData?.phone || 'Not Set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-theater-masks"></i> Account Type
                  </span>
                  <span className="info-value">{userData?.userType || 'Customer'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-shield-alt"></i> Email Verified
                  </span>
                  <span className="info-value">
                    {user?.emailVerified ? 
                      <span style={{color: '#10b981'}}><i className="fas fa-check-circle"></i> Yes</span> : 
                      <span style={{color: '#ef4444'}}><i className="fas fa-times-circle"></i> No</span>
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="card-body">
                <button className="action-btn" onClick={() => navigate('/browse')}>
                  <i className="fas fa-search"></i>
                  <span>Browse Events</span>
                </button>
                <button className="action-btn" onClick={() => navigate('/bookings')}>
                  <i className="fas fa-ticket-alt"></i>
                  <span>View All Bookings</span>
                </button>
                {userData?.userType === 'organiser' && (
                  <>
                    <button className="action-btn" onClick={() => navigate('/host-event')}>
                      <i className="fas fa-plus-circle"></i>
                      <span>Host New Event</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/organizer-dashboard')}>
                      <i className="fas fa-chart-line"></i>
                      <span>Organizer Dashboard</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="profile-right-column">
            <div className="profile-card">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <button className="view-all-link" onClick={() => navigate('/bookings')}>
                  View All →
                </button>
              </div>
              <div className="card-body">
                {recentBookings.length > 0 ? (
                  <div className="activity-list">
                    {recentBookings.map(booking => (
                      <div key={booking.id} className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="activity-details">
                          <h4>{booking.eventName}</h4>
                          <p className="activity-meta">
                            <i className="fas fa-users"></i> {booking.ticketCount} {booking.ticketCount > 1 ? 'tickets' : 'ticket'} 
                            <span className="separator">•</span>
                            <i className="fas fa-rupee-sign"></i> {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="activity-date">
                            <i className="fas fa-clock"></i> {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`activity-status ${booking.status}`}>
                          {booking.status === 'confirmed' ? 
                            <i className="fas fa-check-circle"></i> : 
                            booking.status === 'cancelled' ? 
                            <i className="fas fa-times-circle"></i> : 
                            <i className="fas fa-clock"></i>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-activity">
                    <i className="fas fa-inbox empty-icon"></i>
                    <p>No bookings yet</p>
                    <button className="btn-primary-small" onClick={() => navigate('/browse')}>
                      <i className="fas fa-search"></i> Browse Events
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-card">
              <div className="card-header">
                <h2>Achievements</h2>
              </div>
              <div className="card-body">
                <div className="achievements-grid">
                  <div className={`achievement-badge ${stats.totalBookings >= 1 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-star"></i>
                    </span>
                    <p>First Booking</p>
                  </div>
                  <div className={`achievement-badge ${stats.totalBookings >= 5 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-medal"></i>
                    </span>
                    <p>Event Explorer</p>
                  </div>
                  <div className={`achievement-badge ${stats.totalBookings >= 10 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-crown"></i>
                    </span>
                    <p>VIP Member</p>
                  </div>
                  <div className={`achievement-badge ${stats.completedEvents >= 5 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-theater-masks"></i>
                    </span>
                    <p>Show Regular</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
