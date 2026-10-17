import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import BrowseEvents from './pages/BrowseEvents';
import EventBooking from './pages/EventBooking';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import HostEvent from './pages/HostEvent';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Global styles
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { currentUser, userData } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userData?.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest Route Component (redirects logged-in users)
const GuestRoute = ({ children }) => {
  const { currentUser, userData } = useAuth();
  
  if (currentUser) {
    if (userData?.userType === 'organiser') {
      return <Navigate to="/organizer-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/browse-events" element={<BrowseEvents />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      
      {/* Guest Only Routes */}
      <Route 
        path="/login" 
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } 
      />
      
      {/* Protected Customer Routes */}
      <Route 
        path="/book-event" 
        element={
          <ProtectedRoute allowedUserTypes={['customer']}>
            <EventBooking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <ProtectedRoute allowedUserTypes={['customer']}>
            <Payment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedUserTypes={['customer']}>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute allowedUserTypes={['customer']}>
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Organizer Routes */}
      <Route 
        path="/host-event" 
        element={
          <ProtectedRoute allowedUserTypes={['organiser']}>
            <HostEvent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizer-dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['organiser']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;