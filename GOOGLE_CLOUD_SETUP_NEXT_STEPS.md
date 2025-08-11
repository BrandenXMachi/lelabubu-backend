# Google Cloud Setup - Next Steps for Your Project

Great! You already have a Google Cloud project set up:
- **Project ID**: `lelabubu-address-autocomplete`
- **Project Number**: `272574499410`

## Next Steps to Get Google Places Working:

### 1. Enable Required APIs
In your Google Cloud Console (you should already be there):

1. **Go to APIs & Services → Library**
2. **Search for and enable these APIs:**
   - **Places API** (click "Enable")
   - **Maps JavaScript API** (click "Enable")

### 2. Create API Key
1. **Go to APIs & Services → Credentials**
2. **Click "Create Credentials" → "API Key"**
3. **Copy the API key** (starts with `AIza...`)

### 3. Secure Your API Key (IMPORTANT!)
1. **Click on your newly created API key**
2. **Under "Application restrictions":**
   - Select **"HTTP referrers (web sites)"**
   - Add these referrers:
     - `https://lelabubu.ca/*`
     - `https://www.lelabubu.ca/*`
     - `https://*.onrender.com/*`
     - `http://localhost:*` (for testing)

### 4. Set Up Billing (Required)
1. **Go to "Billing" in the left sidebar**
2. **Add a payment method** (Google requires this even for free tier)
3. **Don't worry** - you get 1,000 free requests per month

### 5. Update Your Website
Once you have your API key, I'll help you add it to your website:

**In cart.html, change this line:**
```html
<!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initGooglePlaces"></script> -->
```

**To this (with your real API key):**
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places&callback=initGooglePlaces"></script>
```

## What to Do Right Now:

1. **Enable the APIs** (Places API + Maps JavaScript API)
2. **Create the API key**
3. **Set up the restrictions**
4. **Add billing info**
5. **Let me know when you have the API key** and I'll update your website

## Expected Timeline:
- **API setup**: 5-10 minutes
- **Website update**: 2 minutes
- **Deployment**: 3 minutes
- **Total**: ~15 minutes to have Google Places autocomplete working!

Let me know when you have the API key and I'll immediately update your website!
