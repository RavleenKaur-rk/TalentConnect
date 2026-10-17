import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDatabase, ref, get } from 'firebase/database';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const db = getDatabase();
          const userRef = ref(db, 'users/' + user.uid);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          
          if (userData) {
            setUserType(userData.userType);
            setIsVerified(userData.organizerVerified || false);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUserType(null);
        setIsVerified(false);
      }
    };
    
    loadUserData();
  }, [user]);

  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <span className="logo-text">Talent</span>
        <img src="/logo.svg" alt="TalentConnect Logo" />
        <span className="logo-text">Connect</span>
      </Link>
      
      <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`nav ${menuOpen ? 'active' : ''}`}>
        <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/browse" className={isActive('/browse') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Browse Events</Link>
        <a href="/About.html" onClick={() => setMenuOpen(false)}>About</a>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Contact</Link>
        {user && userType === 'organiser' && (
          <>
            <Link to="/host-event" className={isActive('/host-event') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Host Event</Link>
            <Link to="/organizer-dashboard" className={isActive('/organizer-dashboard') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </>
        )}
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div className={`user-welcome ${user ? 'active' : ''}`} onClick={toggleDropdown}>
            <i className="fas fa-user-circle"></i>
            <span>{user.displayName || 'User'}</span>
            <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
            
            <div className={`user-dropdown ${dropdownOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="user-dropdown-header">
                <h4>{user.displayName || 'User'}</h4>
                <p>{user.email}</p>
              </div>
              <div className="user-dropdown-menu">
                <Link to="/profile" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </Link>
                <Link to="/bookings" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-ticket-alt"></i>
                  <span>My Bookings</span>
                </Link>
                {userType === 'organiser' && (
                  <Link to="/host-event" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-plus-circle"></i>
                    <span>Host Event</span>
                  </Link>
                )}
                {userType === 'organiser' && (
                  <Link to="/organizer-dashboard" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-chart-line"></i>
                    <span>Dashboard</span>
                  </Link>
                )}
                {userType === 'organiser' && (
                  <Link to="/organizer-verification" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-shield-alt"></i>
                    <span>Verification</span>
                  </Link>
                )}
                <div className="user-dropdown-divider"></div>
                <a href="#" className="user-dropdown-item danger" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn login">Login</Link>
            <Link to="/login?signup=true" className="btn signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
