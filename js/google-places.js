// Google Places Address Autocomplete
// Restricts suggestions to Canada only

let autocomplete;
let addressComponents = {};

// Initialize Google Places Autocomplete
function initAutocomplete() {
    const input = document.getElementById('autocomplete');
    
    if (!input) {
        console.warn('Autocomplete input not found');
        return;
    }

    // Create autocomplete object, restricting the search predictions to Canada
    autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'ca' }, // Restrict to Canada
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address'] // Only show address suggestions
    });

    // Add listener for when a place is selected
    autocomplete.addListener('place_changed', onPlaceChanged);
    
    console.log('Google Places Autocomplete initialized for Canada');
}

// Handle place selection
function onPlaceChanged() {
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
        console.log("No details available for input: '" + place.name + "'");
        return;
    }

    // Reset address components
    addressComponents = {
        street_number: '',
        route: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        country: ''
    };

    // Parse address components
    for (let i = 0; i < place.address_components.length; i++) {
        const addressType = place.address_components[i].types[0];
        
        switch (addressType) {
            case 'street_number':
                addressComponents.street_number = place.address_components[i].long_name;
                break;
            case 'route':
                addressComponents.route = place.address_components[i].long_name;
                break;
            case 'locality':
                addressComponents.locality = place.address_components[i].long_name;
                break;
            case 'administrative_area_level_1':
                addressComponents.administrative_area_level_1 = place.address_components[i].short_name;
                break;
            case 'postal_code':
                addressComponents.postal_code = place.address_components[i].long_name;
                break;
            case 'country':
                addressComponents.country = place.address_components[i].short_name;
                break;
        }
    }

    // Create full address
    const fullAddress = {
        formatted_address: place.formatted_address,
        street_address: `${addressComponents.street_number} ${addressComponents.route}`.trim(),
        city: addressComponents.locality,
        province: addressComponents.administrative_area_level_1,
        postal_code: addressComponents.postal_code,
        country: addressComponents.country,
        coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
    };

    // Log the full address to console
    console.log('Selected Address:', fullAddress);

    // Store in hidden input (if it exists)
    const hiddenInput = document.getElementById('selected-address');
    if (hiddenInput) {
        hiddenInput.value = JSON.stringify(fullAddress);
    }

    // Auto-fill form fields if they exist
    fillAddressFields(fullAddress);
    
    // Trigger custom event for other parts of the application
    const addressSelectedEvent = new CustomEvent('addressSelected', {
        detail: fullAddress
    });
    document.dispatchEvent(addressSelectedEvent);
}

// Auto-fill address form fields
function fillAddressFields(address) {
    // Fill common form fields if they exist
    const fields = {
        'address1': address.street_address,
        'city': address.city,
        'province': address.province,
        'postalCode': address.postal_code,
        'country': 'CA' // Always Canada since we restricted to Canada
    };

    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && fields[fieldId]) {
            field.value = fields[fieldId];
            
            // Trigger change event to update any listeners
            const changeEvent = new Event('change', { bubbles: true });
            field.dispatchEvent(changeEvent);
            
            // Trigger input event for real-time validation
            const inputEvent = new Event('input', { bubbles: true });
            field.dispatchEvent(inputEvent);
        }
    });

    console.log('Address fields auto-filled:', fields);
}

// Initialize when Google Maps API is loaded
function initGooglePlaces() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocomplete();
    } else {
        console.error('Google Maps Places API not loaded');
    }
}

// Export functions for global use
window.initGooglePlaces = initGooglePlaces;
window.initAutocomplete = initAutocomplete;

// Auto-initialize if Google Maps is already loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Google Maps to load if it's loading
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            initAutocomplete();
        }
    }, 1000);
});

console.log('Google Places autocomplete script loaded');
