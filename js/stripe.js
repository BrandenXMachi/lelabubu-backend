// Stripe Payment Integration

// Initialize Stripe with your publishable key
let stripe;
let elements;
let card;

try {
    stripe = Stripe('pk_live_51Rerp84RpqeAczydMUzeLHi8R8iK3K3ghT1OYPoEUoGCKoCaJ3nZAes4CgjpePcJKriFt317fjVxq7vdnosjBPEW00YaPDWkGK');
    console.log('Stripe initialized successfully');
} catch (error) {
    console.error('Stripe initialization failed:', error);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout button if we're on the cart page
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        initCheckoutButton();
    }
    
    // Initialize buy now buttons on product pages
    initBuyNowButtons();
});

// Initialize the checkout button on cart page
function initCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        // Remove any existing event listeners to prevent conflicts
        checkoutBtn.removeEventListener('click', handleCheckout);
        
        // Add event listener for checkout
        checkoutBtn.addEventListener('click', handleCheckout);
        console.log('Checkout button initialized successfully');
    }
}

// Handle checkout button click
function handleCheckout(e) {
    e.preventDefault();
    
    // Get cart data
    let cart = [];
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    
    if (!cart || cart.length === 0) {
        alert('Your cart is empty. Please add some products before checkout.');
        return;
    }
    
    // Show custom checkout modal instead of redirecting to Stripe
    showCustomCheckoutModal(cart);
}

// Legacy function for old checkout (kept for compatibility)
function handleOldCheckout(e) {
    e.preventDefault();
    
    // Get cart data
    let cart = [];
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    
    if (!cart || cart.length === 0) {
        alert('Your cart is empty. Please add some products before checkout.');
        return;
    }
    
    // Process checkout with Stripe
    processStripeCheckout(cart);
}

// Initialize buy now buttons on product pages
function initBuyNowButtons() {
    const buyNowButtons = document.querySelectorAll('.buy-now-btn, .btn-buy-now');
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from the button or nearby elements
            const productCard = this.closest('.product-card') || this.closest('.product-item');
            if (!productCard) return;
            
            const productName = productCard.querySelector('.product-name, .card-title')?.textContent || 'Labubu Product';
            const productPrice = productCard.querySelector('.product-price, .price')?.textContent?.replace(/[^0-9.]/g, '') || '20.00';
            const productImage = productCard.querySelector('.product-image img, .card-img-top')?.src || 'images/products/product-placeholder.jpg';
            
            // Create a single-item cart for immediate purchase
            const singleItemCart = [{
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1,
                image: productImage
            }];
            
            // Process checkout with Stripe
            processStripeCheckout(singleItemCart);
        });
    });
}

// Process checkout using Stripe Checkout
function processStripeCheckout(cartItems) {
    if (!stripe) {
        alert('Payment system is not available. Please try again later.');
        return;
    }
    
    // Show loading state
    const loadingOverlay = createLoadingOverlay();
    document.body.appendChild(loadingOverlay);
    
    // Prepare cart data for the server
    const checkoutData = {
        items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image ? (item.image.startsWith('http') ? item.image : window.location.origin + '/' + item.image) : null
        }))
    };
    
    // Send request to create checkout session
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
    })
    .then(response => response.json())
    .then(data => {
        // Remove loading overlay
        document.body.removeChild(loadingOverlay);
        
        if (data.error) {
            console.error('Error:', data.error);
            alert('There was an error processing your request. Please try again.');
            return;
        }
        
        // Redirect to Stripe Checkout
        return stripe.redirectToCheckout({ sessionId: data.id });
    })
    .then(result => {
        if (result && result.error) {
            console.error('Stripe error:', result.error);
            alert('There was an error redirecting to checkout: ' + result.error.message);
        }
    })
    .catch(error => {
        // Remove loading overlay if still present
        if (document.body.contains(loadingOverlay)) {
            document.body.removeChild(loadingOverlay);
        }
        console.error('Error:', error);
        alert('There was an error processing your request. Please try again.');
    });
}

// Create a loading overlay
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'stripe-loading-overlay';
    overlay.innerHTML = `
        <div class="stripe-loading-content">
            <div class="stripe-spinner"></div>
            <p>Redirecting to secure checkout...</p>
        </div>
    `;
    
    // Add styles for the loading overlay
    const style = document.createElement('style');
    style.textContent = `
        .stripe-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .stripe-loading-overlay.visible {
            opacity: 1;
        }
        
        .stripe-loading-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .stripe-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: stripe-spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes stripe-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .stripe-loading-content p {
            margin: 0;
            color: #333;
            font-size: 1.1rem;
        }
    `;
    
    if (!document.querySelector('style[data-stripe-loading]')) {
        style.setAttribute('data-stripe-loading', 'true');
        document.head.appendChild(style);
    }
    
    // Add visible class after a short delay for smooth animation
    setTimeout(() => {
        overlay.classList.add('visible');
    }, 10);
    
    return overlay;
}

// Handle simple product purchases (for quick buy buttons)
function buyProduct(productName, productPrice, productImage = null) {
    const singleItemCart = [{
        name: productName,
        price: parseFloat(productPrice),
        quantity: 1,
        image: productImage || 'images/products/product-placeholder.jpg'
    }];
    
    processStripeCheckout(singleItemCart);
}

// Utility function to add product to cart and checkout immediately
function addToCartAndCheckout(productData) {
    // Add to cart
    let cart = [];
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === productData.name);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += productData.quantity || 1;
    } else {
        cart.push({
            name: productData.name,
            price: productData.price,
            quantity: productData.quantity || 1,
            image: productData.image || 'images/products/product-placeholder.jpg'
        });
    }
    
    // Save updated cart
    try {
        localStorage.setItem('lelabubuCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
    
    // Proceed to checkout
    processStripeCheckout(cart);
}

// Show custom checkout modal with address collection and dynamic shipping
function showCustomCheckoutModal(cartItems) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="customCheckoutModal" tabindex="-1" aria-labelledby="customCheckoutModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="customCheckoutModalLabel">Secure Checkout</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-7">
                                <h6 class="mb-3">Shipping Information</h6>
                                <form id="checkoutForm">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="firstName" class="form-label">First Name *</label>
                                            <input type="text" class="form-control" id="firstName" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="lastName" class="form-label">Last Name *</label>
                                            <input type="text" class="form-control" id="lastName" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email Address *</label>
                                        <input type="email" class="form-control" id="email" required>
                                    </div>
                                    
                                    <!-- Address fields in correct order: Country, Province, City, Address, Postal Code -->
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
                                                <option value="OTHER">Other</option>
                                            </select>
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
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="city" class="form-label">City *</label>
                                        <input type="text" class="form-control" id="city" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="address1" class="form-label">Address Line 1 *</label>
                                        <input type="text" class="form-control" id="address1" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="address2" class="form-label">Address Line 2</label>
                                        <input type="text" class="form-control" id="address2">
                                    </div>
                                    <div class="mb-3">
                                        <label for="postalCode" class="form-label">Postal Code *</label>
                                        <input type="text" class="form-control" id="postalCode" required maxlength="7" placeholder="A1A 1A1">
                                    </div>
                                </form>
                                
                                <!-- Enhanced Payment Information Section -->
                                <div class="payment-section mt-4">
                                    <div class="payment-header mb-3 p-3 bg-light rounded">
                                        <h6 class="mb-0 d-flex align-items-center">
                                            <i class="fas fa-credit-card me-2 text-primary"></i>
                                            Payment Information
                                            <i class="fas fa-lock ms-2 text-success" title="Secure Payment"></i>
                                        </h6>
                                        <small class="text-muted">Your payment information is encrypted and secure</small>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="cardholderName" class="form-label d-flex align-items-center">
                                            <i class="fas fa-user me-2"></i>
                                            Name as seen on card *
                                        </label>
                                        <input type="text" class="form-control" id="cardholderName" required placeholder="Emma Dilamma">
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-12 mb-3">
                                            <label for="cardNumber" class="form-label d-flex align-items-center">
                                                <i class="fas fa-credit-card me-2"></i>
                                                Card Number *
                                            </label>
                                            <div id="card-number-element" class="form-control payment-card-element">
                                                <!-- Stripe card number element -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="cardExpiry" class="form-label d-flex align-items-center">
                                                <i class="fas fa-calendar me-2"></i>
                                                Expiry Date *
                                            </label>
                                            <div id="card-expiry-element" class="form-control payment-card-element">
                                                <!-- Stripe expiry element -->
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="cardCvc" class="form-label d-flex align-items-center">
                                                <i class="fas fa-lock me-2"></i>
                                                CVC *
                                            </label>
                                            <div id="card-cvc-element" class="form-control payment-card-element">
                                                <!-- Stripe CVC element -->
                                            </div>
                                        </div>
                                    </div>
                                    <div id="card-errors" role="alert" class="text-danger mt-2"></div>
                                    
                                    <div class="payment-security-info mt-3 p-2 bg-success bg-opacity-10 rounded">
                                        <small class="text-success d-flex align-items-center">
                                            <i class="fas fa-shield-alt me-2"></i>
                                            Secured by Stripe • SSL Encrypted • PCI Compliant
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <h6 class="mb-3">Order Summary</h6>
                                <div id="orderSummary"></div>
                                <div class="shipping-calculation mt-3 p-3 bg-light rounded" style="display: none;">
                                    <div class="d-flex justify-content-between">
                                        <span>Shipping:</span>
                                        <span id="shippingCost">Calculating...</span>
                                    </div>
                                    <div id="shippingMessage" class="text-success mt-2"></div>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between">
                                    <strong>Total:</strong>
                                    <strong id="finalTotal">$0.00</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="completePayment" disabled>Complete Payment</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('customCheckoutModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize the modal
    const modal = new bootstrap.Modal(document.getElementById('customCheckoutModal'));
    
    // Setup order summary
    setupOrderSummary(cartItems);
    
    // Setup Stripe Elements
    setupStripeElements();
    
    // Setup event listeners
    setupCheckoutEventListeners(cartItems);
    
    // Show modal
    modal.show();
}

// Setup order summary in checkout modal
function setupOrderSummary(cartItems) {
    const orderSummary = document.getElementById('orderSummary');
    let subtotal = 0;
    let summaryHTML = '';
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        summaryHTML += `
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <div>${item.name}</div>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <div>$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    summaryHTML += `
        <hr>
        <div class="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    
    // Update final total initially (without shipping)
    document.getElementById('finalTotal').textContent = `$${subtotal.toFixed(2)}`;
}

// Setup Stripe Elements for card input
function setupStripeElements() {
    if (!stripe) return;
    
    elements = stripe.elements();
    
    const elementStyle = {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
    };
    
    // Create separate elements for card number, expiry, and CVC
    const cardNumber = elements.create('cardNumber', { style: elementStyle });
    const cardExpiry = elements.create('cardExpiry', { style: elementStyle });
    const cardCvc = elements.create('cardCvc', { style: elementStyle });
    
    // Mount elements to their respective containers
    cardNumber.mount('#card-number-element');
    cardExpiry.mount('#card-expiry-element');
    cardCvc.mount('#card-cvc-element');
    
    // Handle real-time validation errors
    function handleChange(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }
    
    // Add event listeners for all card elements
    cardNumber.on('change', handleChange);
    cardExpiry.on('change', handleChange);
    cardCvc.on('change', handleChange);
    
    // Store card number element globally (primary element for payment method creation)
    card = cardNumber;
    
    // Store all elements globally for access in payment processing
    window.stripeCardElements = {
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        cardCvc: cardCvc
    };
}

// Setup event listeners for checkout modal
function setupCheckoutEventListeners(cartItems) {
    // Country change handler
    document.getElementById('country').addEventListener('change', function() {
        const provinceContainer = document.getElementById('provinceContainer');
        const province = document.getElementById('province');
        
        if (this.value === 'CA') {
            provinceContainer.style.display = 'block';
            province.required = true;
        } else {
            provinceContainer.style.display = 'none';
            province.required = false;
        }
        
        // Calculate shipping when address changes
        calculateShippingCost(cartItems);
    });
    
    // City change handler
    document.getElementById('city').addEventListener('input', function() {
        calculateShippingCost(cartItems);
    });
    
    // Province change handler
    document.getElementById('province').addEventListener('change', function() {
        calculateShippingCost(cartItems);
    });
    
    // Complete payment button
    document.getElementById('completePayment').addEventListener('click', function() {
        processCustomCheckout(cartItems);
    });
    
    // Form validation
    const form = document.getElementById('checkoutForm');
    const cardholderName = document.getElementById('cardholderName');
    
    function validateForm() {
        const isFormValid = form.checkValidity() && cardholderName.value.trim() !== '';
        document.getElementById('completePayment').disabled = !isFormValid;
    }
    
    // Add validation listeners
    form.addEventListener('input', validateForm);
    cardholderName.addEventListener('input', validateForm);
    
    // Postal code formatting for Canadian postal codes
    document.getElementById('postalCode').addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Format Canadian postal code (A1A 1A1)
        if (value.length > 3) {
            value = value.substring(0, 3) + ' ' + value.substring(3, 6);
        }
        
        e.target.value = value;
        
        // Trigger shipping calculation if we have enough info
        if (value.length >= 6) {
            calculateShippingCost(cartItems);
        }
    });
    
    // Add custom styles for the payment section
    if (!document.querySelector('style[data-payment-styles]')) {
        const paymentStyles = document.createElement('style');
        paymentStyles.setAttribute('data-payment-styles', 'true');
        paymentStyles.textContent = `
            .payment-card-element {
                height: 50px !important;
                padding: 12px !important;
                border: 1px solid #ced4da;
                border-radius: 0.375rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            
            .payment-card-element:focus-within {
                border-color: #86b7fe;
                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
            }
            
            .payment-header {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-left: 4px solid #007bff;
            }
            
            .payment-security-info {
                border-left: 3px solid #198754;
            }
            
            .form-label i {
                color: #6c757d;
                width: 16px;
            }
            
            .shipping-calculation {
                border-left: 3px solid #0dcaf0;
            }
            
            .text-success i {
                color: #198754 !important;
            }
            
            .text-primary i {
                color: #0d6efd !important;
            }
        `;
        document.head.appendChild(paymentStyles);
    }
}

// Calculate shipping cost based on address
function calculateShippingCost(cartItems) {
    const city = document.getElementById('city').value.toLowerCase().trim();
    const country = document.getElementById('country').value;
    const province = document.getElementById('province').value;
    
    if (!city || !country) {
        return;
    }
    
    const shippingCalculation = document.querySelector('.shipping-calculation');
    const shippingCost = document.getElementById('shippingCost');
    const shippingMessage = document.getElementById('shippingMessage');
    const finalTotal = document.getElementById('finalTotal');
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let shipping = 0;
    let message = '';
    let deliveryTime = '';
    
    // Check if it's Montreal (free shipping)
    if ((city === 'montreal' || city === 'montréal') && country === 'CA') {
        shipping = 0;
        message = '🎉 Free shipping to Montreal!';
        deliveryTime = '1-2 weeks';
    }
    // Check if it's elsewhere in Canada ($25 shipping)
    else if (country === 'CA') {
        shipping = 25;
        message = 'Canada shipping';
        deliveryTime = '1-2 weeks';
    }
    // International shipping ($40)
    else {
        shipping = 40;
        message = 'International shipping';
        deliveryTime = '2-3 weeks';
    }
    
    // Update display
    shippingCalculation.style.display = 'block';
    shippingCost.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    shippingMessage.innerHTML = `${message}<br><small>Delivery: ${deliveryTime}</small>`;
    shippingMessage.className = shipping === 0 ? 'text-success mt-2' : 'text-info mt-2';
    
    // Update final total
    const total = subtotal + shipping;
    finalTotal.textContent = `$${total.toFixed(2)}`;
}

// Process custom checkout
async function processCustomCheckout(cartItems) {
    if (!stripe || !card) {
        alert('Payment system is not available. Please try again later.');
        return;
    }
    
    const completePaymentBtn = document.getElementById('completePayment');
    completePaymentBtn.disabled = true;
    completePaymentBtn.textContent = 'Processing...';
    
    try {
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            address: {
                line1: document.getElementById('address1').value,
                line2: document.getElementById('address2').value,
                city: document.getElementById('city').value,
                state: document.getElementById('province').value || '',
                postal_code: document.getElementById('postalCode').value,
                country: document.getElementById('country').value
            },
            cardholderName: document.getElementById('cardholderName').value
        };
        
        // Calculate total
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const city = formData.address.city.toLowerCase();
        const country = formData.address.country;
        
        let shippingCost = 0;
        if ((city === 'montreal' || city === 'montréal') && country === 'CA') {
            shippingCost = 0;
        } else if (country === 'CA') {
            shippingCost = 25;
        } else {
            shippingCost = 40;
        }
        
        const total = subtotal + shippingCost;
        
        // Create payment method
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                name: formData.cardholderName,
                email: formData.email,
                address: {
                    line1: formData.address.line1,
                    line2: formData.address.line2,
                    city: formData.address.city,
                    state: formData.address.state,
                    postal_code: formData.address.postal_code,
                    country: formData.address.country
                }
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Send payment to server
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cartItems,
                customer: formData,
                payment_method_id: paymentMethod.id
            })
        });
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        if (result.success) {
            // Payment successful
            alert('Payment successful! Thank you for your order.');
            
            // Clear cart
            localStorage.removeItem('lelabubuCart');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('customCheckoutModal'));
            modal.hide();
            
            // Redirect to success page
            window.location.href = '/success.html';
        } else {
            throw new Error('Payment failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed: ' + error.message);
    } finally {
        completePaymentBtn.disabled = false;
        completePaymentBtn.textContent = 'Complete Payment';
    }
}

// Export functions for global use
window.buyProduct = buyProduct;
window.addToCartAndCheckout = addToCartAndCheckout;
window.processStripeCheckout = processStripeCheckout;

console.log('Stripe integration loaded successfully');
