import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest('.user-welcome')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header>
      <div className="logo-container" onClick={() => navigate('/')}>
        <span className="logo-text">Talent</span>
        <img src="/logo.png" alt="TalentConnect Logo" />
        <span className="logo-text">Connect</span>
      </div>

      <button 
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={menuOpen ? 'active' : ''}>
        <Link 
          to="/" 
          className={isActive('/') ? 'active' : ''}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          to="/browse-events" 
          className={isActive('/browse-events') ? 'active' : ''}
          onClick={() => setMenuOpen(false)}
        >
          Browse Events
        </Link>
        <Link 
          to="/about" 
          className={isActive('/about') ? 'active' : ''}
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={isActive('/contact') ? 'active' : ''}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
        {userData?.userType === 'organiser' && (
          <Link 
            to="/host-event" 
            className={isActive('/host-event') ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Host Event
          </Link>
        )}
      </nav>

      <div className="auth">
        {!currentUser ? (
          <>
            <button 
              className="login" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signup" 
              onClick={() => navigate('/login')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div 
            className="user-welcome active" 
            onClick={toggleDropdown}
          >
            <i className="fas fa-user-circle"></i>
            <span>{userData?.name || 'User'}</span>
            <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>

            <div className={`user-dropdown ${dropdownOpen ? 'active' : ''}`}>
              <div className="user-dropdown-header">
                <h4>{userData?.name}</h4>
                <p>{userData?.email}</p>
              </div>
              <div className="user-dropdown-menu">
                {userData?.userType === 'customer' && (
                  <>
                    <Link 
                      to="/profile" 
                      className="user-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-user"></i>
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="user-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-ticket-alt"></i>
                      <span>My Bookings</span>
                    </Link>
                  </>
                )}
                {userData?.userType === 'organiser' && (
                  <Link 
                    to="/organizer-dashboard" 
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="user-dropdown-divider"></div>
                <a 
                  href="#" 
                  className="user-dropdown-item danger" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;