import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { getDatabase, ref, get, set } from 'firebase/database';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '', userType: '', rememberMe: false });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', userType: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, color: '#ddd', text: '', class: '' });
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ show: false, icon: '', title: '', message: '', buttons: [] });
  
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();
  const db = getDatabase();

  // Load saved login
  useState(() => {
    const savedEmail = localStorage.getItem('talentConnectEmail');
    const savedUserType = localStorage.getItem('talentConnectUserType');
    if (savedEmail) {
      setLoginData(prev => ({ ...prev, email: savedEmail, userType: savedUserType || '', rememberMe: true }));
    }
  }, []);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { percentage: 0, color: '#ddd', text: '', class: '' };
    
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    
    if (score < 40) {
      return { percentage: score, color: '#ef4444', text: 'Weak password', class: 'strength-weak' };
    } else if (score < 70) {
      return { percentage: score, color: '#f59e0b', text: 'Medium strength', class: 'strength-medium' };
    } else {
      return { percentage: score, color: '#10b981', text: 'Strong password', class: 'strength-strong' };
    }
  };

  const showDialog = (icon, title, message, buttons = []) => {
    setDialog({ show: true, icon, title, message, buttons });
    if (buttons.length === 0) {
      setTimeout(() => setDialog({ show: false, icon: '', title: '', message: '', buttons: [] }), 2000);
    }
  };

  const closeDialog = () => {
    setDialog({ show: false, icon: '', title: '', message: '', buttons: [] });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.userType) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Select User Type',
        'Please select whether you are logging in as a Customer or Event Organiser.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(loginData.email, loginData.password);
      const uid = userCredential.user.uid;
      
      let userData = null;
      try {
        const userRef = ref(db, 'users/' + uid);
        const snapshot = await get(userRef);
        userData = snapshot.val();
      } catch (dbError) {
        console.warn('Could not fetch user data from database:', dbError);
      }

      // If no user data in database, create default data
      if (!userData) {
        userData = {
          name: userCredential.user.displayName || loginData.email.split('@')[0],
          email: userCredential.user.email,
          userType: loginData.userType
        };
        
        // Try to save it for future use
        try {
          await set(ref(db, 'users/' + uid), {
            ...userData,
            createdAt: new Date().toISOString()
          });
        } catch (saveError) {
          console.warn('Could not save user data:', saveError);
        }
      }

      if (userData.userType && userData.userType !== loginData.userType) {
        showDialog(
          '<i class="fas fa-exclamation-circle error"></i>',
          'Wrong User Type',
          `This account is registered as a ${userData.userType}, not a ${loginData.userType}. Please select the correct user type.`,
          [{ text: 'OK', primary: true }]
        );
        setLoading(false);
        return;
      }

      if (loginData.rememberMe) {
        localStorage.setItem('talentConnectEmail', loginData.email);
        localStorage.setItem('talentConnectUserType', loginData.userType);
      } else {
        localStorage.removeItem('talentConnectEmail');
        localStorage.removeItem('talentConnectUserType');
      }

      showDialog(
        '<i class="fas fa-check-circle success"></i>',
        'Welcome Back!',
        `You have successfully signed in as ${userData.name}. Redirecting...`,
        []
      );

      setTimeout(() => {
        if (loginData.userType === 'organiser') {
          navigate('/organizer-dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Login Failed',
        errorMessage,
        [{ text: 'OK', primary: true }]
      );
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Password Mismatch',
        'The passwords you entered do not match. Please try again.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    if (!signupData.userType) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Select User Type',
        'Please select whether you are registering as a Customer or Event Organiser.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    if (signupData.password.length < 6) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Password Too Short',
        'Password must be at least 6 characters long.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    setLoading(true);
    try {
      console.log('Starting signup process...');
      const userCredential = await signup(signupData.email, signupData.password, signupData.name);
      const uid = userCredential.user.uid;
      console.log('User created successfully:', uid);
      
      // Try to save user data to database, but don't fail if permission denied
      try {
        await set(ref(db, 'users/' + uid), {
          name: signupData.name,
          email: signupData.email,
          userType: signupData.userType,
          createdAt: new Date().toISOString()
        });
        console.log('User data saved to database');

        const emailKey = signupData.email.replace(/[.#$[\]]/g, '_');
        await set(ref(db, 'userEmails/' + emailKey + '/' + signupData.userType), uid);
        console.log('Email mapping saved');
      } catch (dbError) {
        console.warn('Database write failed (this is okay):', dbError);
        // Continue anyway - user is still created in Firebase Auth
      }

      showDialog(
        '<i class="fas fa-check-circle success"></i>',
        'Account Created!',
        'Your TalentConnect account has been successfully created. Redirecting...',
        []
      );

      setTimeout(() => {
        if (signupData.userType === 'organiser') {
          navigate('/organizer-verification');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
        errorMessage = 'Account created but unable to save additional data. You can still login.';
      }
      
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Signup Failed',
        errorMessage,
        [{ text: 'OK', primary: true }]
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(resetEmail);
      showDialog(
        '<i class="fas fa-check-circle success"></i>',
        'Reset Email Sent',
        'A password reset link has been sent to your email address. Please check your inbox.',
        [{ text: 'OK', primary: true, onclick: () => setActiveTab('login') }]
      );
      setResetEmail('');
      setLoading(false);
    } catch (error) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Reset Failed',
        error.message,
        [{ text: 'OK', primary: true }]
      );
      setLoading(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <h1>Welcome to TalentConnect</h1>
        <p>Sign in to access your account and manage your events</p>
      </section>

      <section className="auth-container">
        <div className="auth-box">
          {activeTab !== 'forgot' && (
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </div>
              <div 
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </div>
            </div>
          )}
          
          {/* Login Form */}
          <form 
            className={`auth-form ${activeTab === 'login' ? 'active' : ''}`} 
            onSubmit={handleLogin}
          >
            <h2>Sign In to Your Account</h2>
            
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                placeholder="Your email address"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <div className="password-input">
                <input
                  type={showPassword.loginPassword ? 'text' : 'password'}
                  id="loginPassword"
                  placeholder="Your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <span className="toggle-password" onClick={() => togglePassword('loginPassword')}>
                  <i className={`far fa-eye${showPassword.loginPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="loginUserType">Login As</label>
              <select
                id="loginUserType"
                value={loginData.userType}
                onChange={(e) => setLoginData({ ...loginData, userType: e.target.value })}
                required
              >
                <option value="">Select user type</option>
                <option value="customer">Customer</option>
                <option value="organiser">Event Organiser</option>
              </select>
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginData.rememberMe}
                onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
              />
              <label htmlFor="rememberMe" style={{ marginBottom: 0 }}>Remember me</label>
            </div>
            
            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setActiveTab('forgot'); }}>Forgot password?</a>
            <button type="submit" className="auth-submit" disabled={loading}>Sign In</button>
            <div className="auth-switch">Don't have an account? <a onClick={() => setActiveTab('signup')}>Sign up now</a></div>
          </form>
          
          {/* Signup Form */}
          <form 
            className={`auth-form ${activeTab === 'signup' ? 'active' : ''}`}
            onSubmit={handleSignup}
          >
            <h2>Create Your Account</h2>
            
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                placeholder="Your full name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signupEmail">Email Address</label>
              <input
                type="email"
                id="signupEmail"
                placeholder="Your email address"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <div className="password-input">
                <input
                  type={showPassword.signupPassword ? 'text' : 'password'}
                  id="signupPassword"
                  placeholder="Create a password (min 6 characters)"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  minLength="6"
                />
                <span className="toggle-password" onClick={() => togglePassword('signupPassword')}>
                  <i className={`far fa-eye${showPassword.signupPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                />
                <span className="toggle-password" onClick={() => togglePassword('confirmPassword')}>
                  <i className={`far fa-eye${showPassword.confirmPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="signupUserType">Register As</label>
              <select
                id="signupUserType"
                value={signupData.userType}
                onChange={(e) => setSignupData({ ...signupData, userType: e.target.value })}
                required
              >
                <option value="">Select user type</option>
                <option value="customer">Customer</option>
                <option value="organiser">Event Organiser</option>
              </select>
            </div>
            
            <button type="submit" className="auth-submit" disabled={loading}>Create Account</button>
            <div className="auth-switch">Already have an account? <a onClick={() => setActiveTab('login')}>Sign in</a></div>
          </form>

          {/* Forgot Password Form */}
          <form 
            className={`auth-form ${activeTab === 'forgot' ? 'active' : ''}`}
            onSubmit={handleForgotPassword}
          >
            <h2>Reset Your Password</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px' }}>Enter your email address and we'll send you a password reset link.</p>
            
            <div className="form-group">
              <label htmlFor="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                placeholder="Your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-submit" disabled={loading}>Send Reset Link</button>
            <div className="auth-switch"><a onClick={() => setActiveTab('login')}>Back to Login</a></div>
          </form>
        </div>
      </section>

      {/* Dialog */}
      {dialog.show && (
        <div className="custom-dialog active">
          <div className="dialog-content">
            <div className="dialog-icon" dangerouslySetInnerHTML={{ __html: dialog.icon }}></div>
            <h3 className="dialog-title">{dialog.title}</h3>
            <p className="dialog-message">{dialog.message}</p>
            <div className="dialog-buttons">
              {dialog.buttons.map((btn, idx) => (
                <button
                  key={idx}
                  className={`dialog-button ${btn.primary ? 'primary' : 'secondary'}`}
                  onClick={() => {
                    closeDialog();
                    if (btn.onclick) btn.onclick();
                  }}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
