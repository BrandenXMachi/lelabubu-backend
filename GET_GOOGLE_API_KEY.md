# How to Get Your Google Places API Key - Step by Step

## The Issue
Your Google Places Autocomplete isn't working because you need a valid API key from Google Cloud Console.

## Step-by-Step Instructions

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create or Select a Project
- Click "Select a project" at the top
- Either select an existing project or click "New Project"
- If creating new: Give it a name like "LeLabubu Website"

### 3. Enable Required APIs
- In the left sidebar, go to "APIs & Services" → "Library"
- Search for and enable these APIs:
  - **Places API** (click Enable)
  - **Maps JavaScript API** (click Enable)

### 4. Create API Key
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "API Key"
- Copy the API key (starts with `AIza...`)

### 5. Secure Your API Key (IMPORTANT!)
- Click on your newly created API key
- Under "Application restrictions":
  - Select "HTTP referrers (web sites)"
  - Add these referrers:
    - `https://lelabubu.ca/*`
    - `https://www.lelabubu.ca/*`
    - `https://*.onrender.com/*`
    - `http://localhost:*` (for testing)

### 6. Set Up Billing (Required)
- Go to "Billing" in the left sidebar
- Add a payment method (Google requires this even for free tier)
- Don't worry - you get 1,000 free requests per month

### 7. Update Your Website
Replace the API key in your `cart.html` file:

**Find this line (around line 285):**
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOTI6srrmJRVKilFHvHV0dSBV1rgKJlb8&libraries=places&callback=initGooglePlaces"></script>
```

**Replace with your API key:**
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places&callback=initGooglePlaces"></script>
```

### 8. Deploy Changes
```bash
git add cart.html
git commit -m "Add valid Google Places API key"
git push origin main
```

## Expected Costs
- **Free Tier**: 1,000 requests/month
- **After Free Tier**: ~$0.017 per request
- **Typical Usage**: Most small e-commerce sites stay within free tier

## Testing
1. Go to your cart page
2. Add items and click "Proceed to Checkout"
3. Start typing in the address field
4. You should see Canadian address suggestions

## Troubleshooting
- **"InvalidKey" error**: Check API key is correct and APIs are enabled
- **No suggestions**: Verify billing is set up in Google Cloud
- **"Quota exceeded"**: You've hit the free limit, billing will handle overages

## Alternative Solution
If you can't set up Google Cloud right now, I can implement a simpler address validation system without Google Places API as a temporary solution.
