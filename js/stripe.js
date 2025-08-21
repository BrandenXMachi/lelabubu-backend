// Modern Stripe Checkout System
// Delivery Fees: $40 International, $25 Canada, FREE Montreal

// Initialize Stripe with live publishable key
const stripe = Stripe('pk_live_51RerovGA2nd66MJcvgzUEOzkTjpZf0ok3uuM1HQjmauoNHi6O90EJSjnpTZu6wRlfTeqyjqfUuCELGdz7BJTD5Ep00YVowW7gx');

// Global variables
let currentCart = [];
let deliveryFee = 0;
let currentLocation = { country: '', province: '', city: '' };

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckoutSystem();
});

function initializeCheckoutSystem() {
    // Initialize checkout buttons on cart page
    if (window.location.pathname.includes('cart.html')) {
        initCartCheckout();
    }
    
    // Initialize buy now buttons on product pages
    initBuyNowButtons();
    
    console.log('Modern checkout system initialized');
}

// Also initialize when Stripe script loads
if (typeof Stripe !== 'undefined') {
    console.log('Stripe initialized successfully - LIVE MODE');
    console.log('Stripe integration loaded successfully');
}

// Initialize cart checkout functionality
function initCartCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCartCheckout);
    }
}

// Initialize buy now buttons
function initBuyNowButtons() {
    const buyNowButtons = document.querySelectorAll('.buy-now-btn, .btn-buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', handleBuyNow);
    });
}

// Handle cart checkout
function handleCartCheckout(e) {
    e.preventDefault();
    
    // Load cart from localStorage
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        currentCart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        currentCart = [];
    }
    
    if (currentCart.length === 0) {
        showAlert('Your cart is empty. Please add some products before checkout.', 'warning');
        return;
    }
    
    showCheckoutModal(currentCart);
}

// Handle buy now button clicks
function handleBuyNow(e) {
    e.preventDefault();
    
    const productCard = e.target.closest('.product-card') || e.target.closest('.product-item');
    if (!productCard) return;
    
    const productName = productCard.querySelector('.product-name, .card-title')?.textContent || 'Labubu Product';
    const priceText = productCard.querySelector('.product-price, .price')?.textContent || '$20.00';
    const productPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 20.00;
    const productImage = productCard.querySelector('.product-image img, .card-img-top')?.src || 'images/products/product-placeholder.jpg';
    
    const singleItem = [{
        name: productName,
        price: productPrice,
        quantity: 1,
        image: productImage
    }];
    
    showCheckoutModal(singleItem);
}

// Show modern checkout modal
function showCheckoutModal(items) {
    currentCart = items;
    
    const modalHTML = `
        <div class="modal fade" id="modernCheckoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="checkoutModalLabel">
                            <i class="fas fa-shopping-cart me-2"></i>Secure Checkout
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div class="row g-0">
                            <!-- Left Panel - Shipping Information -->
                            <div class="col-lg-8 p-4">
                                <div class="checkout-section">
                                    <h6 class="section-title">
                                        <i class="fas fa-truck me-2 text-primary"></i>
                                        Shipping Information
                                    </h6>
                                    
                                    <form id="shippingForm" class="needs-validation" novalidate>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="firstName" class="form-label">First Name *</label>
                                                <input type="text" class="form-control" id="firstName" required>
                                                <div class="invalid-feedback">Please provide your first name.</div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="lastName" class="form-label">Last Name *</label>
                                                <input type="text" class="form-control" id="lastName" required>
                                                <div class="invalid-feedback">Please provide your last name.</div>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="email" class="form-label">Email Address *</label>
                                            <input type="email" class="form-control" id="email" required>
                                            <div class="invalid-feedback">Please provide a valid email address.</div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="country" class="form-label">Country *</label>
                                                <select class="form-select" id="country" required>
                                                    <option value="">Select Country</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="US">United States</option>
                                                    <option value="GB">United Kingdom</option>
                                                    <option value="FR">France</option>
                                                    <option value="DE">Germany</option>
                                                    <option value="AU">Australia</option>
                                                    <option value="JP">Japan</option>
                                                    <option value="CN">China</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                                <div class="invalid-feedback">Please select your country.</div>
                                            </div>
                                            <div class="col-md-6 mb-3" id="provinceContainer" style="display: none;">
                                                <label for="province" class="form-label">Province *</label>
                                                <select class="form-select" id="province">
                                                    <option value="">Select Province</option>
                                                    <option value="AB">Alberta</option>
                                                    <option value="BC">British Columbia</option>
                                                    <option value="MB">Manitoba</option>
                                                    <option value="NB">New Brunswick</option>
                                                    <option value="NL">Newfoundland and Labrador</option>
                                                    <option value="NS">Nova Scotia</option>
                                                    <option value="ON">Ontario</option>
                                                    <option value="PE">Prince Edward Island</option>
                                                    <option value="QC">Quebec</option>
                                                    <option value="SK">Saskatchewan</option>
                                                    <option value="NT">Northwest Territories</option>
                                                    <option value="NU">Nunavut</option>
                                                    <option value="YT">Yukon</option>
                                                </select>
                                                <div class="invalid-feedback">Please select your province.</div>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="city" class="form-label">City *</label>
                                            <input type="text" class="form-control" id="city" required>
                                            <div class="invalid-feedback">Please provide your city.</div>
                                            <div id="cityHint" class="form-text text-success" style="display: none;">
                                                <i class="fas fa-gift me-1"></i>Free shipping to Montreal!
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-8 mb-3">
                                                <label for="address" class="form-label">Street Address *</label>
                                                <input type="text" class="form-control" id="address" placeholder="123 Main Street" required>
                                                <div class="invalid-feedback">Please provide your street address.</div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="apartment" class="form-label">Apt/Unit</label>
                                                <input type="text" class="form-control" id="apartment" placeholder="4B">
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="postalCode" class="form-label">Postal Code *</label>
                                            <input type="text" class="form-control" id="postalCode" required>
                                            <div class="invalid-feedback">Please provide your postal code.</div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                            <!-- Right Panel - Order Summary -->
                            <div class="col-lg-4 bg-light p-4">
                                <div class="checkout-section">
                                    <h6 class="section-title">
                                        <i class="fas fa-receipt me-2 text-primary"></i>
                                        Order Summary
                                    </h6>
                                    
                                    <div id="orderItems" class="mb-3"></div>
                                    
                                    <div class="pricing-breakdown">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <span id="subtotalAmount">$0.00</span>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between mb-2" id="deliveryRow">
                                            <span>Delivery:</span>
                                            <span id="deliveryAmount">Enter address</span>
                                        </div>
                                        
                                        <hr>
                                        
                                        <div class="d-flex justify-content-between mb-3">
                                            <strong>Total:</strong>
                                            <strong id="totalAmount">$0.00</strong>
                                        </div>
                                        
                                        <div id="deliveryInfo" class="alert alert-info" style="display: none;">
                                            <small>
                                                <i class="fas fa-info-circle me-1"></i>
                                                <span id="deliveryMessage"></span>
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <button type="button" class="btn btn-primary btn-lg w-100" id="proceedToPayment" disabled>
                                        <i class="fas fa-credit-card me-2"></i>
                                        Proceed to Payment
                                    </button>
                                    
                                    <div class="security-badges mt-3 text-center">
                                        <small class="text-muted">
                                            <i class="fas fa-shield-alt me-1"></i>
                                            Secured by Stripe
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('modernCheckoutModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize modal
    const modal = new bootstrap.Modal(document.getElementById('modernCheckoutModal'));
    
    // Setup order summary
    setupOrderSummary();
    
    // Setup event listeners
    setupModalEventListeners();
    
    // Show modal
    modal.show();
    
    // Add custom styles
    addCheckoutStyles();
}

// Setup order summary display
function setupOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const deliveryAmount = document.getElementById('deliveryAmount');
    const totalAmount = document.getElementById('totalAmount');
    
    let subtotal = 0;
    let itemsHTML = '';
    
    currentCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="order-item d-flex justify-content-between align-items-center mb-2">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <small class="text-muted">Qty: ${item.quantity} × $${item.price.toFixed(2)}</small>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHTML;
    subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    
    // Set default international shipping of $40
    deliveryFee = 40;
    deliveryAmount.textContent = `$${deliveryFee.toFixed(2)}`;
    
    // Update total with default delivery fee
    const total = subtotal + deliveryFee;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Setup modal event listeners
function setupModalEventListeners() {
    const countrySelect = document.getElementById('country');
    const provinceContainer = document.getElementById('provinceContainer');
    const provinceSelect = document.getElementById('province');
    const cityInput = document.getElementById('city');
    const form = document.getElementById('shippingForm');
    const proceedBtn = document.getElementById('proceedToPayment');
    
    // Country change handler
    countrySelect.addEventListener('change', function() {
        if (this.value === 'CA') {
            provinceContainer.style.display = 'block';
            provinceSelect.required = true;
        } else {
            provinceContainer.style.display = 'none';
            provinceSelect.required = false;
            provinceSelect.value = '';
        }
        updateLocation();
        calculateDelivery();
        validateForm();
    });
    
    // Province change handler
    provinceSelect.addEventListener('change', function() {
        updateLocation();
        calculateDelivery();
        validateForm();
    });
    
    // City input handler
    cityInput.addEventListener('input', function() {
        updateLocation();
        calculateDelivery();
        validateForm();
        
        // Show Montreal hint
        const cityHint = document.getElementById('cityHint');
        const city = this.value.toLowerCase().trim();
        if ((city.includes('montreal') || city.includes('montréal')) && countrySelect.value === 'CA') {
            cityHint.style.display = 'block';
        } else {
            cityHint.style.display = 'none';
        }
    });
    
    // Form validation
    form.addEventListener('input', validateForm);
    
    // Proceed to payment button
    proceedBtn.addEventListener('click', proceedToStripeCheckout);
}

// Update current location
function updateLocation() {
    currentLocation = {
        country: document.getElementById('country').value,
        province: document.getElementById('province').value,
        city: document.getElementById('city').value.toLowerCase().trim()
    };
}

// Calculate delivery fee
function calculateDelivery() {
    const deliveryAmount = document.getElementById('deliveryAmount');
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryMessage = document.getElementById('deliveryMessage');
    
    // If no country or city selected, keep default $40
    if (!currentLocation.country || !currentLocation.city) {
        // Keep default $40 international shipping
        deliveryFee = 40;
        deliveryAmount.textContent = `$${deliveryFee.toFixed(2)}`;
        deliveryInfo.style.display = 'none';
        updateTotal();
        return;
    }
    
    let fee = 40; // Default international
    let message = '';
    let alertClass = 'alert-warning';
    
    // Check delivery zones
    if ((currentLocation.city.includes('montreal') || currentLocation.city.includes('montréal')) && currentLocation.country === 'CA') {
        fee = 0;
        message = '🎉 Free delivery to Montreal! Estimated delivery: 1-2 weeks';
        alertClass = 'alert-success';
    } else if (currentLocation.country === 'CA') {
        fee = 25;
        message = `📦 Canada delivery: $${fee}. Estimated delivery: 1-2 weeks`;
        alertClass = 'alert-info';
    } else {
        fee = 40;
        message = `🌍 International delivery: $${fee}. Estimated delivery: 2-3 weeks`;
        alertClass = 'alert-warning';
    }
    
    deliveryFee = fee;
    deliveryAmount.textContent = fee === 0 ? 'FREE' : `$${fee.toFixed(2)}`;
    deliveryMessage.textContent = message;
    deliveryInfo.className = `alert ${alertClass}`;
    deliveryInfo.style.display = 'block';
    
    updateTotal();
}

// Update total amount
function updateTotal() {
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

// Validate form
function validateForm() {
    const form = document.getElementById('shippingForm');
    const proceedBtn = document.getElementById('proceedToPayment');
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });
    
    // Special validation for province when Canada is selected
    if (document.getElementById('country').value === 'CA' && !document.getElementById('province').value) {
        isValid = false;
    }
    
    proceedBtn.disabled = !isValid;
}

// Proceed to Stripe checkout
function proceedToStripeCheckout() {
    const form = document.getElementById('shippingForm');
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Show loading
    const proceedBtn = document.getElementById('proceedToPayment');
    const originalText = proceedBtn.innerHTML;
    proceedBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    proceedBtn.disabled = true;
    
    // Prepare checkout data
    const apartment = document.getElementById('apartment').value;
    const address = document.getElementById('address').value;
    const fullAddress = apartment ? `${address}, ${apartment}` : address;
    
    const checkoutData = {
        items: currentCart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            address: {
                line1: fullAddress,
                city: document.getElementById('city').value,
                state: document.getElementById('province').value || '',
                postal_code: document.getElementById('postalCode').value,
                country: document.getElementById('country').value
            }
        },
        deliveryFee: deliveryFee
    };
    
    // Create Stripe checkout session
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Redirect to Stripe checkout
        return stripe.redirectToCheckout({ sessionId: data.id });
    })
    .then(result => {
        if (result && result.error) {
            throw new Error(result.error.message);
        }
    })
    .catch(error => {
        console.error('Checkout error:', error);
        showAlert('There was an error processing your checkout. Please try again.', 'danger');
        
        // Restore button
        proceedBtn.innerHTML = originalText;
        proceedBtn.disabled = false;
    });
}

// Add custom styles for the checkout modal
function addCheckoutStyles() {
    if (document.querySelector('style[data-modern-checkout]')) return;
    
    const styles = document.createElement('style');
    styles.setAttribute('data-modern-checkout', 'true');
    styles.textContent = `
        .checkout-section {
            margin-bottom: 2rem;
        }
        
        .section-title {
            color: #333;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e9ecef;
        }
        
        .order-item {
            padding: 0.75rem 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .item-name {
            font-weight: 500;
            color: #333;
        }
        
        .item-total {
            font-weight: 600;
            color: #007bff;
        }
        
        .pricing-breakdown {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin-bottom: 1.5rem;
        }
        
        .security-badges {
            padding: 1rem 0;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            border: none;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }
        
        .alert {
            border: none;
            border-radius: 8px;
        }
        
        .alert-success {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724;
        }
        
        .alert-info {
            background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
            color: #0c5460;
        }
        
        .alert-warning {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            color: #856404;
        }
        
        #cityHint {
            font-weight: 600;
        }
        
        .modal-xl {
            max-width: 1200px;
        }
        
        @media (max-width: 768px) {
            .modal-xl {
                max-width: 95%;
                margin: 1rem auto;
            }
            
            .row.g-0 {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Export functions for global use
window.buyProduct = function(name, price, image) {
    const item = [{
        name: name,
        price: parseFloat(price),
        quantity: 1,
        image: image || 'images/products/product-placeholder.jpg'
    }];
    showCheckoutModal(item);
};

window.showCheckoutModal = showCheckoutModal;

console.log('Modern Stripe checkout system loaded successfully');
