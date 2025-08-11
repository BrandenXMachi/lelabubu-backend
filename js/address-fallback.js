// Address Fallback System - Works without Google Places API
// Provides basic Canadian address validation and postal code formatting

// Canadian postal code validation
function validateCanadianPostalCode(postalCode) {
    // Canadian postal code format: A1A 1A1
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return canadianPostalRegex.test(postalCode);
}

// Format Canadian postal code
function formatCanadianPostalCode(input) {
    // Remove all non-alphanumeric characters
    let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Format as A1A 1A1
    if (cleaned.length >= 6) {
        return cleaned.substring(0, 3) + ' ' + cleaned.substring(3, 6);
    } else if (cleaned.length > 3) {
        return cleaned.substring(0, 3) + ' ' + cleaned.substring(3);
    }
    return cleaned;
}

// Canadian provinces
const canadianProvinces = {
    'AB': 'Alberta',
    'BC': 'British Columbia', 
    'MB': 'Manitoba',
    'NB': 'New Brunswick',
    'NL': 'Newfoundland and Labrador',
    'NS': 'Nova Scotia',
    'ON': 'Ontario',
    'PE': 'Prince Edward Island',
    'QC': 'Quebec',
    'SK': 'Saskatchewan',
    'NT': 'Northwest Territories',
    'NU': 'Nunavut',
    'YT': 'Yukon'
};

// Major Canadian cities for basic validation
const majorCanadianCities = [
    'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa',
    'winnipeg', 'quebec city', 'hamilton', 'kitchener', 'london', 'victoria',
    'halifax', 'oshawa', 'windsor', 'saskatoon', 'st. catharines', 'regina',
    'sherbrooke', 'barrie', 'kelowna', 'abbotsford', 'kingston', 'sudbury',
    'trois-rivières', 'guelph', 'cambridge', 'whitby', 'brantford', 'ajax'
];

// Initialize address fallback system
function initAddressFallback() {
    console.log('Initializing address fallback system (no Google Places API required)');
    
    // Find the address input field
    const addressInput = document.getElementById('autocomplete');
    if (!addressInput) {
        console.log('Address input not found for fallback system');
        return;
    }
    
    // Add placeholder text to indicate manual entry
    addressInput.placeholder = 'Enter your street address (e.g., 123 Main St)';
    
    // Add basic address validation
    addressInput.addEventListener('blur', function() {
        const address = this.value.trim();
        if (address.length < 5) {
            this.style.borderColor = '#dc3545';
            showAddressError('Please enter a complete street address');
        } else {
            this.style.borderColor = '#28a745';
            hideAddressError();
        }
    });
    
    // Setup postal code formatting and validation
    const postalCodeInput = document.getElementById('postalCode');
    if (postalCodeInput) {
        postalCodeInput.addEventListener('input', function(e) {
            const formatted = formatCanadianPostalCode(e.target.value);
            e.target.value = formatted;
            
            if (formatted.length >= 6) {
                if (validateCanadianPostalCode(formatted)) {
                    e.target.style.borderColor = '#28a745';
                    hidePostalCodeError();
                } else {
                    e.target.style.borderColor = '#dc3545';
                    showPostalCodeError('Please enter a valid Canadian postal code (A1A 1A1)');
                }
            }
        });
    }
    
    // Setup city validation
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.addEventListener('blur', function() {
            const city = this.value.toLowerCase().trim();
            if (city.length < 2) {
                this.style.borderColor = '#dc3545';
                showCityError('Please enter a valid city name');
            } else {
                this.style.borderColor = '#28a745';
                hideCityError();
                
                // Provide helpful suggestions for major cities
                if (majorCanadianCities.includes(city)) {
                    console.log(`Recognized major Canadian city: ${city}`);
                }
            }
        });
    }
    
    // Setup country/province logic
    const countrySelect = document.getElementById('country');
    const provinceContainer = document.getElementById('provinceContainer');
    const provinceSelect = document.getElementById('province');
    
    if (countrySelect && provinceContainer && provinceSelect) {
        countrySelect.addEventListener('change', function() {
            if (this.value === 'CA') {
                provinceContainer.style.display = 'block';
                provinceSelect.required = true;
                console.log('Canada selected - showing provinces');
            } else {
                provinceContainer.style.display = 'none';
                provinceSelect.required = false;
                console.log('Non-Canada selected - hiding provinces');
            }
        });
    }
    
    console.log('Address fallback system initialized successfully');
}

// Error display functions
function showAddressError(message) {
    hideAddressError();
    const addressInput = document.getElementById('autocomplete');
    if (addressInput) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'address-error';
        errorDiv.className = 'text-danger mt-1';
        errorDiv.innerHTML = `<small><i class="fas fa-exclamation-triangle"></i> ${message}</small>`;
        addressInput.parentNode.appendChild(errorDiv);
    }
}

function hideAddressError() {
    const errorDiv = document.getElementById('address-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showPostalCodeError(message) {
    hidePostalCodeError();
    const postalCodeInput = document.getElementById('postalCode');
    if (postalCodeInput) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'postal-code-error';
        errorDiv.className = 'text-danger mt-1';
        errorDiv.innerHTML = `<small><i class="fas fa-exclamation-triangle"></i> ${message}</small>`;
        postalCodeInput.parentNode.appendChild(errorDiv);
    }
}

function hidePostalCodeError() {
    const errorDiv = document.getElementById('postal-code-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showCityError(message) {
    hideCityError();
    const cityInput = document.getElementById('city');
    if (cityInput) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'city-error';
        errorDiv.className = 'text-danger mt-1';
        errorDiv.innerHTML = `<small><i class="fas fa-exclamation-triangle"></i> ${message}</small>`;
        cityInput.parentNode.appendChild(errorDiv);
    }
}

function hideCityError() {
    const errorDiv = document.getElementById('city-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure other scripts have loaded
    setTimeout(() => {
        // Only initialize fallback if Google Places isn't working
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
            console.log('Google Places API not available, using fallback system');
            initAddressFallback();
        } else {
            console.log('Google Places API available, fallback not needed');
        }
    }, 2000);
});

// Also initialize when checkout modal is shown
document.addEventListener('DOMContentLoaded', function() {
    // Listen for modal events
    const checkoutModal = document.getElementById('customCheckoutModal');
    if (checkoutModal) {
        checkoutModal.addEventListener('shown.bs.modal', function() {
            setTimeout(() => {
                if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                    initAddressFallback();
                }
            }, 500);
        });
    }
});

console.log('Address fallback system loaded');
