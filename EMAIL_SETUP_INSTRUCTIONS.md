# Email Order Notifications Setup Guide

Your checkout system is already configured to send order confirmation emails, but you need to complete the setup with your actual credentials.

## 🔧 Required Setup Steps

### 1. Get Your Email Password

You need the password for your `contact@lelabubu.ca` email account. This should be:
- Your email account password (if using regular authentication)
- An app-specific password (if using 2FA)

### 2. Get Your Stripe Webhook Secret

1. **Login to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Go to Developers > Webhooks**
3. **Find your webhook endpoint** (should be `https://lelabubu.ca/stripe-webhook`)
4. **If no webhook exists, create one:**
   - Click "Add endpoint"
   - URL: `https://lelabubu.ca/stripe-webhook`
   - Events to send: Select `checkout.session.completed`
   - Click "Add endpoint"
5. **Copy the webhook secret** (starts with `whsec_`)

### 3. Update Environment Variables

You need to update these values in your `.env` file:

```env
# Replace with your actual webhook secret from Stripe
STRIPE_ENDPOINT_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE

# Replace with your actual email password
MAIL_PASSWORD=YOUR_ACTUAL_EMAIL_PASSWORD_HERE

# Replace with a secure random string
SECRET_KEY=your_actual_super_secret_key_here
```

### 4. Update Render Environment Variables

Since you're using Render, you need to set these environment variables in your Render dashboard:

1. **Go to your Render dashboard**
2. **Select your web service**
3. **Go to Environment tab**
4. **Add/Update these variables:**
   - `STRIPE_ENDPOINT_SECRET` = `whsec_your_actual_webhook_secret`
   - `MAIL_PASSWORD` = `your_actual_email_password`
   - `SECRET_KEY` = `your_actual_secret_key`
   - `MAIL_SERVER` = `smtp.networksolutions.com`
   - `MAIL_PORT` = `465`
   - `MAIL_USE_TLS` = `false`
   - `MAIL_USE_SSL` = `true`
   - `MAIL_USERNAME` = `contact@lelabubu.ca`
   - `MAIL_DEFAULT_SENDER` = `contact@lelabubu.ca`
   - `FLASK_ENV` = `production`

## 📧 What Happens After Setup

Once configured, when someone completes a purchase:

1. **Stripe processes the payment**
2. **Stripe sends a webhook to your server**
3. **Your server automatically sends you an email with:**
   - Order ID and amount
   - Customer name and email
   - Shipping address
   - Items purchased
   - Payment status

## 🧪 Testing the Email System

After setup, you can test by:

1. **Making a test purchase** on your site
2. **Checking your contact@lelabubu.ca inbox** for the order notification
3. **Checking Render logs** for any email sending errors

## 🔍 Troubleshooting

### If emails aren't sending:

1. **Check Render logs** for error messages
2. **Verify email credentials** are correct
3. **Check spam folder** for order notifications
4. **Verify webhook is receiving events** in Stripe dashboard

### Common Issues:

- **Wrong email password**: Update `MAIL_PASSWORD` in Render
- **Webhook not configured**: Set up webhook in Stripe dashboard
- **Wrong webhook secret**: Update `STRIPE_ENDPOINT_SECRET` in Render

## 📋 Current Email Template

Your order emails will look like this:

```
🎉 NEW ORDER RECEIVED - LeLabubu.ca

ORDER DETAILS:
Order ID: cs_test_123...
Amount: $73.99 CAD
Date: 1692564789

CUSTOMER INFORMATION:
Name: John Doe
Email: customer@example.com

SHIPPING INFORMATION:
Ship to: John Doe
Address:
123 Main Street
Montreal, QC
H1A 1A1
Canada

ITEMS ORDERED:
• Labubu Monster Diary Series x 1 - $33.99 CAD
• Canada Delivery (1-2 weeks) x 1 - $25.00 CAD

PAYMENT STATUS: ✅ PAID

---
Login to your Stripe dashboard for full order details:
https://dashboard.stripe.com/payments/cs_test_123...
```

## ⚡ Quick Setup Checklist

- [ ] Get email password for contact@lelabubu.ca
- [ ] Get Stripe webhook secret from dashboard
- [ ] Update environment variables in Render
- [ ] Deploy changes
- [ ] Test with a purchase
- [ ] Check email inbox for order notification

Once you complete these steps, you'll automatically receive detailed order notifications for every purchase!
