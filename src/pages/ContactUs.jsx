import { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageBox, setMessageBox] = useState({ show: false, type: '', text: '' });

  const emailJsConfig = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    ownerEmail: import.meta.env.VITE_CONTACT_OWNER_EMAIL || 'pranjal.kwatra@gmail.com'
  };

  const clearMessageAfterDelay = (delay) => {
    window.setTimeout(() => {
      setMessageBox({ show: false, type: '', text: '' });
    }, delay);
  };

  const isEmailJsConfigured = Object.values(emailJsConfig).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!isEmailJsConfigured) {
      setMessageBox({
        show: true,
        type: 'error',
        text: 'Contact form is not configured yet. Add your EmailJS service, template, public key, and owner email to the Vite environment variables.'
      });
      clearMessageAfterDelay(7000);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(form);

      const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        reply_to: formData.get('email'),
        subject: formData.get('user_subject'),
        message: formData.get('message'),
        to_email: emailJsConfig.ownerEmail,
        website_name: 'TalentConnect'
      };

      const result = await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        templateParams,
        {
          publicKey: emailJsConfig.publicKey
        }
      );

      if (result.status === 200) {
        setMessageBox({
          show: true,
          type: 'success',
          text: 'Thank you for your message! We\'ll get back to you within 24 hours.'
        });
        form.reset();
        clearMessageAfterDelay(5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      const errorDetails = error?.text || error?.message || 'Unknown EmailJS error';
      setMessageBox({
        show: true,
        type: 'error',
        text: `Failed to send message (${errorDetails}). Please try again or email us directly at ${emailJsConfig.ownerEmail}`
      });
      clearMessageAfterDelay(7000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (e) => {
    const question = e.currentTarget;
    const answer = question.nextElementSibling;
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(ans => {
      if (ans !== answer) ans.classList.remove('active');
    });
    document.querySelectorAll('.faq-question').forEach(q => {
      if (q !== question) q.classList.remove('active');
    });
    
    // Toggle current FAQ
    question.classList.toggle('active');
    answer.classList.toggle('active');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Let us know how we can help you with your event planning needs.</p>
      </section>

      {/* Contact Content */}
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Address</h3>
                <p>123 Event Street<br />Mumbai, Maharashtra 400001<br />India</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>+91 9876543210</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>pranjal.kwatra@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="contact-text">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div className="social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>
          
          {messageBox.show && (
            <div className={`message-box ${messageBox.type} show`}>
              {messageBox.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="user_subject">Subject</label>
              <input
                type="text"
                id="user_subject"
                name="user_subject"
                placeholder="Subject"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>How do I create an event on TalentConnect?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>To create an event, simply sign up for a host account, click on "Host Your Event" and follow the step-by-step process to add your event details, set ticket prices, and publish your event.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>What payment methods do you accept?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>We accept all major credit/debit cards, net banking, UPI, and popular digital wallets like Paytm, Google Pay, and PhonePe.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>How can I contact customer support?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Our customer support team is available via email at pranjal.kwatra@gmail.com or by phone at +91 9876543210 during business hours. You can also use the contact form on this page.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>Can I get a refund for my tickets?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Refund policies vary by event. Please check the specific event's refund policy. Generally, refunds are available if requested at least 48 hours before the event, unless otherwise stated.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
