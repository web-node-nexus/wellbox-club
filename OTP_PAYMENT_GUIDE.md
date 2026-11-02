# OTP & Payment Integration - Quick Guide

## Changes Implemented

### 1. OTP-Based Login (No Password)
- Uses 2Factor.in API for SMS OTP
- Demo mode with auto-generated OTPs
- 5-minute OTP expiry
- Resend OTP functionality

### 2. Mandatory First Payment
- New members must pay minimum ₹1,000
- Payment via Razorpay
- Amount locked for 12 months
- Can only be used for gold purchase

## Files Created/Modified

1. `src/services/otpService.ts` - 2Factor API integration
2. `src/pages/Login.tsx` - OTP-based login flow
3. `src/pages/Register.tsx` - 3-step registration with payment
4. `src/context/AuthContext.tsx` - Updated login logic

## How It Works

### Login Flow
1. User enters mobile number
2. OTP sent via 2Factor API
3. User enters OTP
4. Login successful

### Registration Flow
1. User fills details + first investment amount (min ₹1,000)
2. OTP verification
3. Razorpay payment
4. Registration complete

## Demo Credentials

For testing, use these mobile numbers with any 6-digit OTP:
- Admin: 9876543210
- Leader: 9876543211
- Member: 9876543212
- Individual: 9876543213

## API Keys

2Factor API Key: 36a45c11-c185-11f1-af74-0200cd936042
Razorpay Key: rzp_test_Ttz1VV7B9WjAtO

## Build Status
✅ Build successful
