import { useEffect } from 'react';

const Payment = () => {
  useEffect(() => {
    // Redirect to the standalone HTML payment page
    window.location.replace('/payment.html');
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '18px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', marginBottom: '20px' }}></i>
        <p>Redirecting to payment page...</p>
      </div>
    </div>
  );
};

export default Payment;
