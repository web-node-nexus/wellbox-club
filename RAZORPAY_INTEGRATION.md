# Razorpay Payment Gateway Integration

## Overview
This project is now integrated with Razorpay payment gateway for secure online payments.

## Configuration

### API Keys
- **Key ID**: `rzp_test_Ttz1VV7B9WjAtO` (Test Mode)
- **Key Secret**: `55IjzQ8aWfyav9ZlXBJFagaJ` (Backend only - never expose in frontend)

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_Ttz1VV7B9WjAtO
# Note: Secret key should only be used in backend
```

## Features

### 1. Payment Modal Component
- Located at: `src/components/PaymentModal.tsx`
- Supports multiple payment methods:
  - UPI
  - Credit/Debit Cards
  - Net Banking
  - Wallets

### 2. Razorpay Service
- Located at: `src/services/razorpayService.ts`
- Functions:
  - `initiatePayment()` - Start payment process
  - `verifyPayment()` - Verify payment signature (backend)
  - `createOrder()` - Create order (backend)
  - `formatAmount()` - Format currency display
  - `isRazorpayAvailable()` - Check SDK availability

### 3. Integration Points

#### Wallet Page (`src/pages/Wallet.tsx`)
- Added "Add Funds" button in commission wallet
- Users can add funds to their wallet via Razorpay
- Payment amount: Default ₹1,000 (customizable)

#### Individual Dashboard (`src/pages/IndividualDashboard.tsx`)
- Can be integrated for gold order payments
- Payment verification and order confirmation

## Usage

### Basic Payment Flow

```typescript
import PaymentModal from '../components/PaymentModal';

<PaymentModal
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  amount={1000} // Amount in INR
  description="Add funds to wallet"
  onSuccess={(response) => {
    console.log('Payment successful:', response);
    // Handle success
  }}
  onFailure={(error) => {
    console.error('Payment failed:', error);
    // Handle failure
  }}
/>
```

### Direct Service Usage

```typescript
import { initiatePayment } from '../services/razorpayService';

await initiatePayment({
  amount: 1000,
  description: 'Payment for gold order',
  prefill: {
    name: 'John Doe',
    email: 'john@example.com',
    contact: '9876543210'
  },
  onSuccess: (response) => {
    console.log('Payment ID:', response.razorpay_payment_id);
  },
  onFailure: (error) => {
    console.error('Payment failed:', error);
  }
});
```

## Backend Integration (Required for Production)

### 1. Create Order API
```javascript
// Backend endpoint: POST /api/create-order
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  
  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency || 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  
  const order = await razorpay.orders.create(options);
  res.json(order);
});
```

### 2. Verify Payment API
```javascript
// Backend endpoint: POST /api/verify-payment
const crypto = require('crypto');

app.post('/api/verify-payment', (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex');
  
  if (expectedSign === razorpay_signature) {
    // Payment verified successfully
    res.json({ verified: true });
  } else {
    // Invalid signature
    res.status(400).json({ verified: false });
  }
});
```

## Testing

### Test Mode
- Current setup is in **TEST MODE**
- Use test card details:
  - Card Number: `4111 1111 1111 1111`
  - CVV: Any 3 digits
  - Expiry: Any future date
  - Name: Any name

### Test UPI
- UPI ID: `success@razorpay` (for successful payment)
- UPI ID: `failure@razorpay` (for failed payment)

## Security Notes

⚠️ **IMPORTANT**: 
- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify payment signatures on backend
- Use HTTPS in production
- Store sensitive data securely

## Production Checklist

Before going live:

- [ ] Switch to live API keys (from Razorpay Dashboard)
- [ ] Implement backend order creation API
- [ ] Implement backend payment verification API
- [ ] Add payment history storage in database
- [ ] Set up webhooks for payment events
- [ ] Enable HTTPS on your domain
- [ ] Update environment variables with live keys
- [ ] Test thoroughly in test mode first
- [ ] Set up proper error handling
- [ ] Add payment receipts/invoices

## Troubleshooting

### Payment not opening
- Check if Razorpay script is loaded
- Verify API key is correct
- Check browser console for errors

### Payment failed
- Verify amount is in rupees (not paise) in frontend
- Check network connectivity
- Verify backend APIs are working

### Signature verification failed
- Ensure order_id, payment_id, and signature are correct
- Check if secret key is correct on backend
- Verify HMAC SHA256 algorithm is used

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Dashboard: https://dashboard.razorpay.com/
- Test Mode Guide: https://razorpay.com/docs/testing/

## Files Modified/Created

1. ✅ `src/services/razorpayService.ts` - Payment service
2. ✅ `src/components/PaymentModal.tsx` - Payment UI component
3. ✅ `src/types/razorpay.d.ts` - TypeScript definitions
4. ✅ `src/vite-env.d.ts` - Environment variables types
5. ✅ `src/pages/Wallet.tsx` - Integrated payment in wallet
6. ✅ `.env` - Environment configuration
7. ✅ `RAZORPAY_INTEGRATION.md` - This documentation

## Next Steps

1. Implement backend APIs for order creation and verification
2. Add payment history to database
3. Integrate payment in gold order flow
4. Add webhook handlers for payment events
5. Test thoroughly before going live
6. Switch to production keys when ready

---

**Integration Status**: ✅ Complete (Frontend)
**Backend Status**: ⏳ Pending (Order creation & verification APIs needed)
**Testing Status**: ✅ Ready for testing in test mode
