import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { getDatabase, ref, set, get } from 'firebase/database';

const HostEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [draftId, setDraftId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventCategory: '',
    eventImage: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    eventType: 'In-Person',
    venueName: '',
    venueAddress: '',
    ticketType: 'Free',
    ticketPrice: '0',
    totalTickets: '',
    customQuestions: '',
    requirePhone: 'No'
  });

  const db = getDatabase();
  const steps = ['Event Details', 'Date & Time', 'Location', 'Tickets', 'Questions', 'Review', 'Publish'];
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check verification status
    checkVerificationStatus();

    // Initialize draft ID
    const savedDraftId = localStorage.getItem('currentDraftId');
    if (savedDraftId) {
      setDraftId(savedDraftId);
      loadDraft(savedDraftId);
    } else {
      const newDraftId = 'draft_' + Date.now();
      setDraftId(newDraftId);
      localStorage.setItem('currentDraftId', newDraftId);
    }
  }, [user, navigate]);

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setIsVerified(userData.organizerVerified === true);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  const loadDraft = async (id) => {
    try {
      const draftRef = ref(db, 'drafts/' + id);
      const snapshot = await get(draftRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const autoSaveDraft = async () => {
    if (!draftId) return;
    
    try {
      const draftRef = ref(db, 'drafts/' + draftId);
      await set(draftRef, formData);
      setAutoSaveMessage('Auto-saved to draft');
      setTimeout(() => setAutoSaveMessage(''), 1800);
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (draftId) autoSaveDraft();
    }, 700);
    return () => clearTimeout(timer);
  }, [formData, draftId]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.eventName && formData.eventDescription && formData.eventCategory;
      case 1:
        return formData.eventDate && formData.startTime && formData.endTime;
      case 2:
        return formData.eventType && formData.venueName && formData.venueAddress;
      case 3:
        if (formData.ticketType === 'Paid') {
          return formData.totalTickets && Number(formData.ticketPrice) > 0;
        }
        return formData.totalTickets;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    // Check if organizer is verified
    if (!isVerified) {
      setShowVerificationModal(true);
      return;
    }

    // Validate all steps
    for (let i = 0; i <= 4; i++) {
      if (!validateStep(i)) {
        alert('Please complete all required fields in all steps.');
        setCurrentStep(i);
        return;
      }
    }

    setLoading(true);
    try {
      const eventId = 'event_' + Date.now();
      const eventData = {
        ...formData,
        name: formData.eventName,
        description: formData.eventDescription,
        category: formData.eventCategory,
        image: formData.eventImage,
        date: formData.eventDate,
        status: 'published',
        publishedDate: new Date().toISOString(),
        organizerId: user.uid,
        bookings: 0
      };

      await set(ref(db, 'events/' + eventId), eventData);
      
      // Clear draft
      if (draftId) {
        await set(ref(db, 'drafts/' + draftId), null);
        localStorage.removeItem('currentDraftId');
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error publishing event:', error);
      alert('Failed to publish event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (stepIndex) => {
    // Allow navigation to any step that is completed or the current step
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      // Check if all previous steps are completed
      let canNavigate = true;
      for (let i = 0; i < stepIndex; i++) {
        if (!completedSteps.includes(i)) {
          canNavigate = false;
          break;
        }
      }
      
      if (canNavigate) {
        setCurrentStep(stepIndex);
      } else {
        alert('Please complete previous steps first.');
      }
    }
  };

  const handleSaveDraft = () => {
    autoSaveDraft();
    setShowDraftModal(true);
  };

  if (!user) {
    return null;
  }

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <div className="progress-bar-host">
        <div className="progress-bar-fill-host" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="page-header-host">
        <h1>Create Your Event</h1>
        <p>Set up your event in simple guided steps — everything auto-saves</p>
      </div>

      <div className="main-host">
        <div className="sidebar-host">
          <h2>Steps</h2>
          <ul className="step-list-host">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`${currentStep === index ? 'active' : ''} ${completedSteps.includes(index) ? 'completed' : ''}`}
                onClick={() => goToStep(index)}
                style={{ cursor: 'pointer' }}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="content-host">
          {/* Step 0: Event Details */}
          {currentStep === 0 && (
            <div className="section-host active">
              <h3>Event Details</h3>
              <div className="form-group-host">
                <label>Event Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => handleChange('eventName', e.target.value)}
                  placeholder="e.g., Summer Music Festival"
                />
              </div>
              <div className="form-group-host">
                <label>Event Description <span className="required">*</span></label>
                <textarea
                  rows="5"
                  value={formData.eventDescription}
                  onChange={(e) => handleChange('eventDescription', e.target.value)}
                  placeholder="Describe your event..."
                />
              </div>
              <div className="form-group-host">
                <label>Event Category <span className="required">*</span></label>
                <select value={formData.eventCategory} onChange={(e) => handleChange('eventCategory', e.target.value)}>
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group-host">
                <label>Event Image URL</label>
                <input
                  type="url"
                  value={formData.eventImage}
                  onChange={(e) => handleChange('eventImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="navigation-host">
                <button className="draft-btn-host" onClick={handleSaveDraft}>Save Draft</button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(0)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Date & Time */}
          {currentStep === 1 && (
            <div className="section-host active">
              <h3>Date & Time</h3>
              <div className="form-group-host">
                <label>Event Date <span className="required">*</span></label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                />
              </div>
              <div className="form-group-host">
                <label>Start Time <span className="required">*</span></label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
              <div className="form-group-host">
                <label>End Time <span className="required">*</span></label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(1)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="section-host active">
              <h3>Location</h3>
              <div className="form-group-host">
                <label>Event Type <span className="required">*</span></label>
                <select value={formData.eventType} onChange={(e) => handleChange('eventType', e.target.value)}>
                  <option value="In-Person">In-Person</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group-host">
                <label>Venue Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => handleChange('venueName', e.target.value)}
                  placeholder="e.g., City Convention Center"
                />
              </div>
              <div className="form-group-host">
                <label>Venue Address <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.venueAddress}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                  placeholder="Full address or online link"
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(2)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Tickets */}
          {currentStep === 3 && (
            <div className="section-host active">
              <h3>Tickets & Pricing</h3>
              <div className="form-group-host">
                <label>Ticket Type <span className="required">*</span></label>
                <select value={formData.ticketType} onChange={(e) => handleChange('ticketType', e.target.value)}>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              {formData.ticketType === 'Paid' && (
                <div className="form-group-host">
                  <label>Ticket Price (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ticketPrice}
                    onChange={(e) => handleChange('ticketPrice', e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
              <div className="form-group-host">
                <label>Total Tickets <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalTickets}
                  onChange={(e) => handleChange('totalTickets', e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(3)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Questions */}
          {currentStep === 4 && (
            <div className="section-host active">
              <h3>Registration Questions</h3>
              <div className="form-group-host">
                <label>Custom Questions</label>
                <textarea
                  rows="4"
                  value={formData.customQuestions}
                  onChange={(e) => handleChange('customQuestions', e.target.value)}
                  placeholder="Add any custom questions (one per line)"
                />
              </div>
              <div className="form-group-host">
                <label>Require Phone Number?</label>
                <select value={formData.requirePhone} onChange={(e) => handleChange('requirePhone', e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="section-host active">
              <h3>Review Your Event</h3>
              <div className="review-summary">
                <div className="review-item">
                  <strong>Event Name:</strong> {formData.eventName}
                </div>
                <div className="review-item">
                  <strong>Description:</strong> {formData.eventDescription}
                </div>
                <div className="review-item">
                  <strong>Category:</strong> {formData.eventCategory}
                </div>
                <div className="review-item">
                  <strong>Date:</strong> {formData.eventDate}
                </div>
                <div className="review-item">
                  <strong>Time:</strong> {formData.startTime} - {formData.endTime}
                </div>
                <div className="review-item">
                  <strong>Type:</strong> {formData.eventType}
                </div>
                <div className="review-item">
                  <strong>Venue:</strong> {formData.venueName}
                </div>
                <div className="review-item">
                  <strong>Address:</strong> {formData.venueAddress}
                </div>
                <div className="review-item">
                  <strong>Ticket Type:</strong> {formData.ticketType}
                </div>
                {formData.ticketType === 'Paid' && (
                  <div className="review-item">
                    <strong>Price:</strong> ₹{formData.ticketPrice}
                  </div>
                )}
                <div className="review-item">
                  <strong>Total Tickets:</strong> {formData.totalTickets}
                </div>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Publish */}
          {currentStep === 6 && (
            <div className="section-host active">
              <h3>Publish Your Event</h3>
              <div style={{ textAlign: 'center', padding: '36px' }}>
                <i className="fas fa-rocket" style={{ fontSize: '64px', color: '#5b21b6', marginBottom: '20px' }}></i>
                <h2 style={{ color: '#5b21b6', marginBottom: '12px' }}>Ready to Go Live?</h2>
                <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '30px' }}>
                  Your event will be visible to attendees immediately after publishing.
                </p>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="publish-btn-host" onClick={handlePublish} disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish Event'} <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '64px', marginBottom: '14px' }}></i>
            <h2>Event Published!</h2>
            <p>Your event is now live and visible to attendees.</p>
            <button onClick={() => navigate('/browse')}>View Events</button>
            <button onClick={() => navigate('/organizer-dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <i className="fas fa-save" style={{ color: '#6b7280', fontSize: '64px', marginBottom: '14px' }}></i>
            <h2>Draft Saved!</h2>
            <p>You can continue editing it later.</p>
            <button onClick={() => setShowDraftModal(false)}>Continue Editing</button>
          </div>
        </div>
      )}

      {/* Verification Required Modal */}
      {showVerificationModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <i className="fas fa-exclamation-triangle" style={{ color: '#f97316', fontSize: '64px', marginBottom: '14px' }}></i>
            <h2>Verification Required</h2>
            <p>You need to complete organizer verification before publishing events.</p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
              This ensures trust and security for event attendees.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate('/organizer-verification')}
                style={{
                  background: '#5b21b6',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Complete Verification
              </button>
              <button 
                onClick={() => setShowVerificationModal(false)}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-save Indicator */}
      {autoSaveMessage && (
        <div className="auto-save-indicator-host">
          <i className="fas fa-check"></i> {autoSaveMessage}
        </div>
      )}
    </>
  );
};

export default HostEvent;
