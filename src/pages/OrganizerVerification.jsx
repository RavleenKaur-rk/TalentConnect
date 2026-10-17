import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { getDatabase, ref, get, set } from 'firebase/database';
import { sendEmailVerification } from 'firebase/auth';

const OrganizerVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    phoneNumber: '',
    otp: '',
    organization: '',
    businessType: 'individual',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [dialog, setDialog] = useState({ show: false, type: '', title: '', message: '' });
  const db = getDatabase();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    checkVerificationStatus();
  }, [user, navigate]);

  const checkVerificationStatus = async () => {
    try {
      let userData = null;
      try {
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);
        userData = snapshot.val();
      } catch (dbError) {
        console.warn('Could not fetch user data:', dbError);
      }

      if (userData && userData.userType !== 'organiser') {
        showDialog('error', 'Access Denied', 'This page is only for event organizers.');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      setEmailVerified(user.emailVerified);
      if (userData?.phoneVerified) setPhoneVerified(true);
      if (userData?.paymentComplete) setPaymentComplete(true);
      
      // Determine current step
      if (!user.emailVerified) {
        setStep(1);
      } else if (!userData?.phoneVerified) {
        setStep(2);
      } else if (!userData?.paymentComplete) {
        setStep(3);
      } else {
        setStep(4);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const showDialog = (type, title, message) => {
    setDialog({ show: true, type, title, message });
    setTimeout(() => setDialog({ show: false, type: '', title: '', message: '' }), 3000);
  };

  const handleSendEmailVerification = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + '/organizer-verification',
        handleCodeInApp: false
      });
      showDialog('success', 'Email Sent Successfully!', `Verification email has been sent to ${user.email}. Please check your inbox (and spam folder) and click the verification link. The link will open in your browser.`);
    } catch (error) {
      console.error('Email verification error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/user-token-expired') {
        errorMessage = 'Your session has expired. Please log out and log in again.';
      }
      
      showDialog('error', 'Failed to Send Email', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailVerification = async () => {
    setLoading(true);
    try {
      // Force refresh the user's token to get latest email verification status
      await user.reload();
      
      // Get the refreshed user from auth
      const refreshedUser = user;
      
      if (refreshedUser.emailVerified) {
        setEmailVerified(true);
        
        // Save email verification status to database
        try {
          await set(ref(db, 'users/' + user.uid + '/emailVerified'), true);
          await set(ref(db, 'users/' + user.uid + '/emailVerifiedDate'), new Date().toISOString());
        } catch (dbError) {
          console.warn('Could not save email verification to database:', dbError);
          localStorage.setItem('emailVerified_' + user.uid, 'true');
        }
        
        setStep(2);
        showDialog('success', 'Email Verified', 'Your email has been verified successfully! Proceeding to phone verification...');
        
        // Automatically move to step 2 after 2 seconds
        setTimeout(() => {
          setStep(2);
        }, 2000);
      } else {
        showDialog('error', 'Not Verified Yet', 'Your email is not verified yet. Please check your inbox (and spam folder) and click the verification link, then try again.');
      }
    } catch (error) {
      console.error('Verification check error:', error);
      showDialog('error', 'Error', error.message || 'Failed to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!verificationData.phoneNumber || verificationData.phoneNumber.length < 10) {
      showDialog('error', 'Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending (in production, use SMS service like Twilio)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('phoneOTP_' + user.uid, otpCode);
      setOtpSent(true);
      showDialog('success', 'OTP Sent', `OTP sent to ${verificationData.phoneNumber}. (Demo: ${otpCode})`);
    } catch (error) {
      showDialog('error', 'Error', 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    setLoading(true);
    try {
      const savedOTP = localStorage.getItem('phoneOTP_' + user.uid);
      
      if (verificationData.otp === savedOTP) {
        try {
          await set(ref(db, 'users/' + user.uid + '/phoneNumber'), verificationData.phoneNumber);
          await set(ref(db, 'users/' + user.uid + '/phoneVerified'), true);
        } catch (dbError) {
          console.warn('Could not save to database:', dbError);
          // Store in localStorage as fallback
          localStorage.setItem('phoneVerified_' + user.uid, 'true');
          localStorage.setItem('phoneNumber_' + user.uid, verificationData.phoneNumber);
        }
        
        setPhoneVerified(true);
        setStep(3);
        showDialog('success', 'Phone Verified', 'Phone number verified successfully!');
        localStorage.removeItem('phoneOTP_' + user.uid);
      } else {
        showDialog('error', 'Invalid OTP', 'The OTP you entered is incorrect.');
      }
    } catch (error) {
      showDialog('error', 'Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const businessInfo = {
        organization: verificationData.organization,
        businessType: verificationData.businessType,
        taxId: verificationData.taxId,
        address: verificationData.address,
        city: verificationData.city,
        state: verificationData.state,
        zipCode: verificationData.zipCode,
        country: verificationData.country
      };

      // Try to save business information
      try {
        await set(ref(db, 'users/' + user.uid + '/businessInfo'), businessInfo);
      } catch (dbError) {
        console.warn('Could not save business info to database:', dbError);
        localStorage.setItem('businessInfo_' + user.uid, JSON.stringify(businessInfo));
      }

      // Simulate payment processing (in production, integrate with Razorpay/Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        await set(ref(db, 'users/' + user.uid + '/paymentComplete'), true);
        await set(ref(db, 'users/' + user.uid + '/verificationFee'), 999);
        await set(ref(db, 'users/' + user.uid + '/paymentDate'), new Date().toISOString());
      } catch (dbError) {
        console.warn('Could not save payment info to database:', dbError);
        localStorage.setItem('paymentComplete_' + user.uid, 'true');
        localStorage.setItem('verificationFee_' + user.uid, '999');
        localStorage.setItem('paymentDate_' + user.uid, new Date().toISOString());
      }

      setPaymentComplete(true);
      setStep(4);
      showDialog('success', 'Payment Successful', 'Verification fee paid successfully!');
    } catch (error) {
      showDialog('error', 'Payment Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteVerification = async () => {
    setLoading(true);
    try {
      try {
        await set(ref(db, 'users/' + user.uid + '/organizerVerified'), true);
        await set(ref(db, 'users/' + user.uid + '/verifiedDate'), new Date().toISOString());
      } catch (dbError) {
        console.warn('Could not save verification status to database:', dbError);
        localStorage.setItem('organizerVerified_' + user.uid, 'true');
        localStorage.setItem('verifiedDate_' + user.uid, new Date().toISOString());
      }

      showDialog('success', 'Verification Complete', 'Your organizer account is now verified!');
      
      setTimeout(() => {
        navigate('/organizer-dashboard');
      }, 2000);
    } catch (error) {
      showDialog('error', 'Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-header">
          <h1>Organizer Verification</h1>
          <p>Complete the verification process to start hosting events</p>
        </div>

        {/* Progress Indicator */}
        <div className="verification-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${emailVerified ? 'completed' : ''}`}>
            <div className="step-circle">
              {emailVerified ? <i className="fas fa-check"></i> : '1'}
            </div>
            <span>Email</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${phoneVerified ? 'completed' : ''}`}>
            <div className="step-circle">
              {phoneVerified ? <i className="fas fa-check"></i> : '2'}
            </div>
            <span>Phone</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''} ${paymentComplete ? 'completed' : ''}`}>
            <div className="step-circle">
              {paymentComplete ? <i className="fas fa-check"></i> : '3'}
            </div>
            <span>Payment</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <div className="verification-step">
            <div className="step-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h2>Verify Your Email</h2>
            <p>We need to verify your email address: <strong>{user.email}</strong></p>
            <p>Click the button below to receive a verification email.</p>
            <button 
              className="btn-primary" 
              onClick={handleSendEmailVerification}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>
            <p className="note">After clicking the link in the email, click the button below to verify.</p>
            <button className="btn-secondary" onClick={handleCheckEmailVerification} disabled={loading}>
              {loading ? 'Checking...' : "I've Verified My Email"}
            </button>
          </div>
        )}

        {/* Step 2: Phone Verification */}
        {step === 2 && (
          <div className="verification-step">
            <div className="step-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h2>Verify Your Phone Number</h2>
            <p>Enter your phone number to receive a verification code</p>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={verificationData.phoneNumber}
                onChange={(e) => setVerificationData({ ...verificationData, phoneNumber: e.target.value })}
                maxLength="10"
              />
            </div>

            {!otpSent ? (
              <button 
                className="btn-primary" 
                onClick={handleSendPhoneOTP}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={verificationData.otp}
                    onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                    maxLength="6"
                  />
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleVerifyPhoneOTP}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button className="btn-secondary" onClick={handleSendPhoneOTP}>
                  Resend OTP
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Payment & Business Info */}
        {step === 3 && (
          <div className="verification-step">
            <div className="step-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h2>Business Information & Payment</h2>
            <p>Complete your business details and pay the one-time verification fee</p>

            <form onSubmit={handlePaymentSubmit} className="business-form">
              <div className="form-group">
                <label>Organization Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Your company or organization name"
                  value={verificationData.organization}
                  onChange={(e) => setVerificationData({ ...verificationData, organization: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Business Type <span className="required">*</span></label>
                <select
                  value={verificationData.businessType}
                  onChange={(e) => setVerificationData({ ...verificationData, businessType: e.target.value })}
                  required
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="nonprofit">Non-Profit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tax ID / GST Number</label>
                <input
                  type="text"
                  placeholder="Optional for individuals"
                  value={verificationData.taxId}
                  onChange={(e) => setVerificationData({ ...verificationData, taxId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={verificationData.address}
                  onChange={(e) => setVerificationData({ ...verificationData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input
                    type="text"
                    value={verificationData.city}
                    onChange={(e) => setVerificationData({ ...verificationData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <input
                    type="text"
                    value={verificationData.state}
                    onChange={(e) => setVerificationData({ ...verificationData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code <span className="required">*</span></label>
                  <input
                    type="text"
                    value={verificationData.zipCode}
                    onChange={(e) => setVerificationData({ ...verificationData, zipCode: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country <span className="required">*</span></label>
                  <select
                    value={verificationData.country}
                    onChange={(e) => setVerificationData({ ...verificationData, country: e.target.value })}
                    required
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-row">
                  <span>Verification Fee</span>
                  <span>₹999</span>
                </div>
                <div className="summary-row">
                  <span>GST (18%)</span>
                  <span>₹180</span>
                </div>
                <div className="summary-row total">
                  <span><strong>Total Amount</strong></span>
                  <span><strong>₹1,179</strong></span>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing Payment...' : 'Pay & Complete Verification'}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Completion */}
        {step === 4 && (
          <div className="verification-step">
            <div className="step-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Verification Complete!</h2>
            <p>All steps completed successfully. Click below to activate your organizer account.</p>
            
            <div className="completion-checklist">
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Email Verified</span>
              </div>
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Phone Verified</span>
              </div>
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Payment Complete</span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleCompleteVerification}
              disabled={loading}
            >
              {loading ? 'Activating Account...' : 'Activate Organizer Account'}
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialog.show && (
        <div className="verification-dialog">
          <div className={`dialog-content ${dialog.type}`}>
            <i className={`fas fa-${dialog.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerVerification;
