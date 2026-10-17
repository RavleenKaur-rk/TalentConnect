# Razorpay Payment Integration Setup Guide

## 🚀 Complete Setup Instructions

### 1. Get Razorpay Credentials

#### Step 1: Sign Up for Razorpay
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account or log in to existing account
3. Complete KYC verification (required for production)

#### Step 2: Get API Keys
1. Navigate to **Settings** → **API Keys** in the dashboard
2. Click on **Generate Test Key** (for testing)
3. You'll receive:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this confidential)

#### Step 3: Note Your Credentials
```
Test Mode:
- Key ID: rzp_test_xxxxxxxxx
- Key Secret: xxxxxxxxxxxxxxxxx

Production Mode (after activation):
- Key ID: rzp_live_xxxxxxxxx
- Key Secret: xxxxxxxxxxxxxxxxx
```

---

### 2. Configure Environment Variables

Open your `.env` file and update the Razorpay credentials:

```env
# Razorpay Credentials
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
VITE_RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
```

**Important Notes:**
- Replace `YOUR_KEY_ID_HERE` with your actual Razorpay Key ID
- Replace `YOUR_SECRET_KEY_HERE` with your actual Secret Key
- Use **Test Keys** for development
- Use **Live Keys** only in production
- **Never commit** your `.env` file to version control

---

### 3. Update .gitignore

Ensure your `.env` file is not tracked:

```gitignore
# Environment Variables
.env
.env.local
.env.production
.env.test
```

---

### 4. Restart Development Server

After updating environment variables:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔧 Current Implementation

### Features Implemented
✅ **Razorpay Checkout Integration**
- Secure payment gateway popup
- Supports all payment methods:
  - Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
  - UPI (Google Pay, PhonePe, Paytm, etc.)
  - Net Banking (all major banks)
  - Wallets (Paytm, PhonePe, Amazon Pay)

✅ **Payment Flow**
1. User clicks "Pay" button
2. Order created with booking details
3. Razorpay checkout modal opens
4. User completes payment
5. Payment verified
6. Booking saved to Firebase
7. Success confirmation shown

✅ **Security Features**
- SSL encrypted transactions
- PCI DSS compliant
- Secure payment verification
- Transaction ID generation
- Payment status tracking

✅ **User Experience**
- Responsive design for all devices
- Loading states and animations
- Error handling
- Payment success/failure notifications
- Email confirmation (ready to integrate)

---

## 📝 Testing Payments

### Test Card Details (Razorpay Test Mode)

#### Successful Payment
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

#### Failed Payment
```
Card Number: 4111 1111 1111 1112
```

### Test UPI ID
```
success@razorpay
failure@razorpay
```

### Test Net Banking
- Select any bank from the list
- Use test credentials provided by Razorpay

---

## 🏗️ Production Deployment Checklist

### Before Going Live:

- [ ] **Complete KYC** on Razorpay dashboard
- [ ] **Activate Account** (wait for approval)
- [ ] **Switch to Live Keys**
  - Replace `rzp_test_` with `rzp_live_`
  - Update both Key ID and Secret
- [ ] **Set up Webhooks** (recommended)
  - URL: `https://yourdomain.com/api/razorpay/webhook`
  - Events: `payment.captured`, `payment.failed`
- [ ] **Configure Backend** (current: client-side only)
  - Create order API endpoint
  - Add payment verification endpoint
  - Implement webhook handler
- [ ] **Test thoroughly** in production environment
- [ ] **Set up SSL certificate** (required)
- [ ] **Configure proper error logging**

---

## 🔒 Security Best Practices

### Current Implementation (Client-Side)
⚠️ **Note:** Current implementation creates orders on client-side for demo purposes.

### Recommended Production Setup

#### 1. Create Backend API

**Create Order Endpoint (`/api/create-order`)**
```javascript
// Backend: Node.js example
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: receipt,
      payment_capture: 1
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Verify Payment Endpoint (`/api/verify-payment`)**
```javascript
const crypto = require('crypto');

app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  
  const isValid = expectedSignature === razorpay_signature;
  
  res.json({ success: isValid });
});
```

#### 2. Update Frontend Code

Replace the `createOrder` function in `Payment.jsx`:

```javascript
const createOrder = async () => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: bookingData.totalAmount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      })
    });
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

Replace the `verifyPayment` function:

```javascript
const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
```

---

## 📊 Payment Flow Diagram

```
User Clicks Pay
      ↓
Create Order (Backend API)
      ↓
Open Razorpay Checkout
      ↓
User Completes Payment
      ↓
Razorpay Processes Payment
      ↓
Payment Success/Failure
      ↓
Verify Signature (Backend API)
      ↓
Save to Database
      ↓
Show Confirmation
```

---

## 🐛 Troubleshooting

### Issue: "Razorpay is not defined"
**Solution:** Check if Razorpay script is loaded:
```html
<!-- Should be in index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: Payment modal doesn't open
**Solution:** 
1. Check browser console for errors
2. Verify Key ID is correct in `.env`
3. Ensure script is loaded before calling `new Razorpay()`

### Issue: "Invalid key_id"
**Solution:**
1. Check Key ID format (`rzp_test_` or `rzp_live_`)
2. Verify no extra spaces in `.env` file
3. Restart dev server after changing `.env`

### Issue: Payment succeeds but order not saved
**Solution:**
1. Check Firebase rules
2. Verify user authentication
3. Check browser console for errors
4. Check network tab for failed requests

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Checkout API](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Test Card Numbers](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Webhooks Setup](https://razorpay.com/docs/webhooks/)
- [Payment Verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/payment-verification/)

---

## 💡 Pro Tips

1. **Test Mode First:** Always test thoroughly in test mode before going live
2. **Error Handling:** Implement proper error handling for all scenarios
3. **User Feedback:** Show clear messages for success, failure, and pending payments
4. **Email Notifications:** Set up email confirmations using SendGrid or similar
5. **Transaction Logs:** Maintain detailed logs for debugging and auditing
6. **Refunds:** Implement refund functionality through Razorpay dashboard or API
7. **Invoice Generation:** Auto-generate invoices after successful payments
8. **Payment Reminders:** Send reminders for abandoned carts

---

## 🎯 Next Steps

1. ✅ Get Razorpay credentials
2. ✅ Update `.env` file
3. ✅ Test payment flow
4. 🔄 Set up backend API (recommended)
5. 🔄 Configure webhooks
6. 🔄 Add email notifications
7. 🔄 Deploy to production

---

## 📞 Support

- **Razorpay Support:** support@razorpay.com
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Developer Docs:** https://razorpay.com/docs/

---

**Created for:** TalentConnect Event Booking Platform  
**Last Updated:** January 2025  
**Version:** 1.0.0
