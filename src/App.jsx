import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import BrowseEvents from './pages/BrowseEvents';
import EventDetails from './components/events/EventDetails';
import EventBooking from './pages/EventBooking';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import HostEvent from './pages/HostEvent';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerVerification from './pages/OrganizerVerification';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Bookings from './pages/Bookings';

// Import global styles
import './components/styles/global.css';

function AppContent() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/browse" element={<BrowseEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/booking/:id" element={<EventBooking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/host-event" element={<HostEvent />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer-verification" element={<OrganizerVerification />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
