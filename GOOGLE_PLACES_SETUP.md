# Google Places API Setup Instructions

## Overview
The LeLabubu.ca website includes Google Places address autocomplete functionality that provides Canadian address suggestions during checkout. This feature is currently disabled until you add your Google Places API key.

## Features
- ✅ Canada-only address suggestions
- ✅ Real-time address autocomplete
- ✅ Auto-fills all address fields (street, city, province, postal code)
- ✅ Console logging for debugging
- ✅ Compatible with both old and new Google Places API

## Setup Instructions

### 1. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **Places API** and **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key (starts with `AIza...`)

### 2. Secure Your API Key (Recommended)
1. In Google Cloud Console, click on your API key
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domains:
   - `https://lelabubu.ca/*`
   - `https://www.lelabubu.ca/*`
   - `http://localhost:*` (for testing)

### 3. Enable the API Key in Your Website
1. Open `cart.html`
2. Find this commented line:
   ```html
   <!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initGooglePlaces"></script> -->
   ```
3. Replace `YOUR_API_KEY` with your actual API key:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOTI6srrmJRVKilFHvHV0dSBV1rgKJlb8&libraries=places&callback=initGooglePlaces"></script>
   ```
4. Uncomment the line (remove `<!-- -->`)

### 4. Test the Feature
1. Go to your cart page
2. Click "Proceed to Checkout"
3. Start typing a Canadian address in the "Address Line 1" field
4. You should see address suggestions appear
5. Select an address and watch it auto-fill all fields
6. Check browser console for address data logging

## How It Works

### Address Input Field
The autocomplete looks for an input with ID `autocomplete` in your checkout modal:
```html
<input type="text" class="form-control" id="autocomplete" placeholder="Start typing your address..." required>
```

### Auto-Fill Fields
When an address is selected, it automatically fills:
- `address1` - Street address
- `city` - City name
- `province` - Province/state code
- `postalCode` - Postal/ZIP code
- `country` - Always "CA" for Canada

### Console Logging
Selected addresses are logged to the browser console with full details:
```javascript
{
  formatted_address: "123 Main St, Montreal, QC H1A 1A1, Canada",
  street_address: "123 Main St",
  city: "Montreal",
  province: "QC",
  postal_code: "H1A 1A1",
  country: "CA",
  coordinates: { lat: 45.5017, lng: -73.5673 }
}
```

## API Costs
- Google Places API has a free tier: 1,000 requests/month
- After free tier: ~$0.017 per request
- For most small e-commerce sites, costs are minimal

## Troubleshooting

### "Autocomplete input not found"
- Check that your checkout modal has an input with ID `autocomplete`
- The script tries multiple IDs: `autocomplete`, `address1`, `addressLine1`

### "InvalidKey" Error
- Verify your API key is correct
- Check that Places API is enabled in Google Cloud Console
- Ensure domain restrictions allow your website

### No Address Suggestions
- Verify the API key is active and has billing enabled
- Check browser console for error messages
- Ensure you're testing with Canadian addresses

## Files Modified
- `js/google-places.js` - Main autocomplete functionality
- `js/stripe.js` - Integration with checkout modal
- `cart.html` - Script includes and API key

## Support
If you need help setting this up, the Google Places API documentation is available at:
https://developers.google.com/maps/documentation/places/web-service/overview
