# 🔧 Fix Stripe Key Mismatch on Render

## The Issue
Backend is using TEST Stripe keys while frontend uses LIVE keys.

## Solution Steps

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Find your "lelabubu-backend" service

### 2. Update Environment Variable
- Go to **Environment** → **Environment Variables**
- Find or add `STRIPE_SECRET_KEY`
- Set it to your LIVE secret key (from your local .env file)
- The key should start with `sk_live_` NOT `sk_test_`

### 3. Test the Fix
- Visit: https://lelabubu.ca/test-stripe-mode.html
- Should show "Mode: LIVE" after deployment

## What's Been Fixed
✅ Removed duplicate checkout system
✅ Added shipping options (Free Montreal, $25 Canada, $40 International)
✅ Province selection for Canadian addresses
✅ Debugging to identify key type

## Final Result
Once the environment variable is updated, you'll have:
- Secure Stripe-hosted checkout
- Proper shipping rate calculation
- Province selection for Canada
- Email notifications for orders
