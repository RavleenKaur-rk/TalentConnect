# 🔧 Razorpay Troubleshooting & Receipt Guide

## ✅ Issues Fixed

### 1. **Razorpay Not Opening - FIXED**
**Problem:** Razorpay checkout modal was not opening when clicking Pay button.

**Solutions Implemented:**
- ✅ Added proper script loading verification
- ✅ Added `razorpayLoaded` state to track when script is ready
- ✅ Added `onload` and `onerror` handlers to script
- ✅ Added checks before opening Razorpay checkout
- ✅ Better error messages for loading failures
- ✅ Script cleanup to prevent duplicates

### 2. **Receipt Download - ADDED**
**New Feature:** Downloadable text receipt after successful payment.

**What's Included in Receipt:**
- ✅ Event details (name, date, time, venue)
- ✅ Attendee information (name, email, phone)
- ✅ Booking information (IDs, transaction ID, status)
- ✅ Payment breakdown (tickets, fees, GST, total)
- ✅ Professional ASCII-art border design
- ✅ Company contact information

---

## 🚀 How to Use

### Step 1: Setup Razorpay Keys
```env
# In your .env file
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_HERE
```

**Get Your Keys:**
1. Go to https://dashboard.razorpay.com/
2. Settings → API Keys
3. Generate Test Key
4. Copy the Key ID (starts with `rzp_test_`)

### Step 2: Restart Server
```powershell
# Stop server (Ctrl+C in terminal)
# Restart
npm run dev
```

### Step 3: Test Payment
1. Navigate to any event → Book Now
2. Fill booking form
3. Click "Pay ₹[amount]" button
4. **Razorpay modal should open immediately**
5. Use test card: `4111 1111 1111 1111`
6. Complete payment
7. Click "Download Receipt" on success screen

---

## 🐛 Common Issues & Solutions

### Issue 1: Razorpay Modal Not Opening
**Symptoms:**
- Clicking Pay button does nothing
- No modal appears
- Console shows "Razorpay is not defined"

**Solutions:**
1. **Check Browser Console (F12)**
   - Look for: "Razorpay script loaded successfully"
   - If you see "Failed to load Razorpay script":
     * Check internet connection
     * Disable ad blockers
     * Try different browser

2. **Verify Script Loading**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Reload page
   - Look for: `checkout.js` from `checkout.razorpay.com`
   - Status should be 200 (OK)

3. **Check for Conflicts**
   - Disable browser extensions (especially ad blockers)
   - Try in Incognito/Private mode
   - Clear browser cache (Ctrl+F5)

### Issue 2: "Payment gateway is still loading" Message
**Symptoms:**
- Alert appears when clicking Pay
- Button doesn't open modal

**Solutions:**
1. **Wait a few seconds**
   - Script may still be downloading
   - Slow internet connection
   - Try again after 3-5 seconds

2. **Check Script Status**
   ```javascript
   // Open browser console and type:
   window.Razorpay
   // Should return: function Razorpay()
   // If undefined, script didn't load
   ```

3. **Reload Page**
   - Press Ctrl+F5 to force reload
   - Script will load fresh

### Issue 3: Razorpay Key Error
**Symptoms:**
- Modal opens but shows "Invalid key_id"
- Payment fails immediately

**Solutions:**
1. **Verify .env File**
   ```env
   # Correct format:
   VITE_RAZORPAY_KEY_ID=rzp_test_aBcDeFgHiJkLmNoP
   
   # Wrong formats:
   VITE_RAZORPAY_KEY_ID = rzp_test_... (spaces)
   VITE_RAZORPAY_KEY_ID="rzp_test_..." (quotes)
   ```

2. **Check Key Format**
   - Test key starts with: `rzp_test_`
   - Live key starts with: `rzp_live_`
   - Length: about 28 characters

3. **Restart Server**
   - Environment variables only load on server start
   - Stop (Ctrl+C) and restart (`npm run dev`)

### Issue 4: Receipt Not Downloading
**Symptoms:**
- Click "Download Receipt" but nothing happens
- No file downloads

**Solutions:**
1. **Check Browser Settings**
   - Allow downloads from localhost
   - Disable "Ask where to save each file" (or check Downloads folder)
   - Check if browser blocked popup/download

2. **Verify Booking Data**
   - Open browser console
   - Should see no errors when clicking button
   - If error appears, booking data may be incomplete

3. **Try Different Browser**
   - Some browsers block programmatic downloads
   - Try Chrome, Firefox, or Edge

---

## 📝 Receipt Format

The receipt is a text file (`.txt`) with this structure:

```
╔══════════════════════════════════════════════════════════╗
║              TALENTCONNECT BOOKING RECEIPT                 ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  Event Details:                                            ║
║  [Event Name]                                              ║
║                                                            ║
║  Date: [Date]                                              ║
║  Time: [Time]                                              ║
║  Venue: [Venue]                                            ║
║                                                            ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  Attendee Information:                                     ║
║  Name: [Name]                                              ║
║  Email: [Email]                                            ║
║  Phone: [Phone]                                            ║
║                                                            ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  Booking Information:                                      ║
║  Booking ID: [ID]                                          ║
║  Transaction ID: [TXN ID]                                  ║
║  Booking Date: [Date & Time]                               ║
║  Payment Method: [Method]                                  ║
║  Status: CONFIRMED                                         ║
║                                                            ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  Payment Details:                                          ║
║  Ticket Price × [count]: ₹[amount]                         ║
║  Booking Fee: ₹[amount]                                    ║
║  GST (18%): ₹[amount]                                      ║
║  ───────────────────────────────────────────────────────  ║
║  TOTAL PAID: ₹[amount]                                     ║
║                                                            ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  This is a computer-generated receipt.                     ║
║  No signature required.                                    ║
║                                                            ║
║  For support: support@talentconnect.com                    ║
║  Website: www.talentconnect.com                            ║
║                                                            ║
╚══════════════════════════════════════════════════════════╝
```

**Filename Format:** `TalentConnect_Receipt_[TransactionID].txt`

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Razorpay test key added to `.env`
- [ ] Server restarted after adding key
- [ ] Browser console open (F12)
- [ ] Internet connection stable

### During Test:
- [ ] Navigate to event page
- [ ] Click "Book Now"
- [ ] Fill all booking form fields
- [ ] Payment page loads correctly
- [ ] Click "Pay" button
- [ ] **Razorpay modal opens** ✓
- [ ] Fill payment details (test card)
- [ ] Complete payment
- [ ] Success modal appears
- [ ] Click "Download Receipt"
- [ ] **Receipt file downloads** ✓

### Test Cards (Razorpay Test Mode):
```
Success:
Card: 4111 1111 1111 1111
Expiry: Any future date (12/25)
CVV: Any 3 digits (123)

Failure (to test error handling):
Card: 4111 1111 1111 1112
```

---

## 🔍 Debug Console Commands

Open browser console (F12) and try these:

### Check Razorpay Status:
```javascript
// Should return function, not undefined
window.Razorpay

// Should return your key
import.meta.env.VITE_RAZORPAY_KEY_ID
```

### Check Script Element:
```javascript
// Should show script tag
document.querySelector('script[src*="razorpay"]')
```

### View Environment Variables:
```javascript
// Shows all VITE_ variables
import.meta.env
```

---

## 📊 What Changed

### Files Modified:
1. **`src/pages/Payment.jsx`**
   - Added `razorpayLoaded` state
   - Added script load verification
   - Added `onload` and `onerror` handlers
   - Added pre-flight checks before opening modal
   - Added `completedBooking` state
   - Added `generateReceipt()` function
   - Added `downloadReceipt()` function
   - Updated `saveBooking()` to return booking data
   - Added "Download Receipt" button to success modal

2. **`src/components/styles/global.css`**
   - Enhanced `.btn-primary-modal` with ripple effect
   - Added `::before` pseudo-element for hover animation
   - Improved button z-index for proper layering

---

## 🎯 Expected Behavior

### Correct Flow:
```
1. User clicks "Pay ₹[amount]"
   ↓
2. Button shows "Opening Razorpay Checkout..."
   ↓
3. Razorpay modal opens immediately (popup)
   ↓
4. User selects payment method
   ↓
5. User enters payment details
   ↓
6. User clicks Pay in Razorpay modal
   ↓
7. Payment processes
   ↓
8. Success modal appears with:
   - Animated checkmark
   - Transaction details
   - Download Receipt button
   - View My Bookings button
   - Browse More Events button
   ↓
9. User clicks "Download Receipt"
   ↓
10. Text file downloads to Downloads folder
```

---

## 💡 Pro Tips

### 1. **Testing Without Razorpay Account**
If you don't have Razorpay credentials yet:
- The modal won't open (expected)
- You'll see: "Payment gateway failed to load"
- **Solution:** Sign up at https://dashboard.razorpay.com/

### 2. **Receipt Customization**
To customize receipt format, edit `generateReceipt()` function in `Payment.jsx`:
- Change ASCII borders
- Add more details
- Modify layout
- Change filename format

### 3. **Multiple Downloads**
Receipt can be downloaded multiple times from success modal before closing.

### 4. **Receipt Location**
Downloaded files go to browser's default Downloads folder:
- Windows: `C:\Users\[YourName]\Downloads\`
- Check browser settings for custom location

---

## 🆘 Still Having Issues?

### Quick Fixes:
1. **Clear everything and restart:**
   ```powershell
   # Stop server
   Ctrl+C
   
   # Clear node modules cache
   npm cache clean --force
   
   # Restart
   npm run dev
   ```

2. **Try different browser:**
   - Chrome (recommended)
   - Firefox
   - Edge

3. **Check firewall/antivirus:**
   - May block Razorpay script loading
   - Temporarily disable and test

4. **Verify localhost access:**
   - Try: http://localhost:5176
   - Try: http://127.0.0.1:5176

### Get Console Logs:
When reporting issues, include:
1. Browser console output (F12 → Console tab)
2. Network tab status for `checkout.js`
3. Environment check: `import.meta.env`

---

## 📞 Support Resources

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Razorpay Support:** support@razorpay.com
- **Dashboard:** https://dashboard.razorpay.com/

---

**Last Updated:** November 19, 2025  
**Status:** ✅ Ready to Test  
**Next Step:** Add your Razorpay test key and try a payment!
