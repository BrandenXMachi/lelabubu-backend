// Stripe Payment Integration

// Initialize Stripe with your publishable key
let stripe;

try {
    stripe = Stripe('pk_test_51Rerp84RpqeAczydMUzeLHi8R8iK3K3ghT1OYPoEUoGCKoCaJ3nZAes4CgjpePcJKriFt317fjVxq7vdnosjBPEW00YaPDWkGK');
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
        checkoutBtn.addEventListener('click', function(e) {
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
        });
    }
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

// Export functions for global use
window.buyProduct = buyProduct;
window.addToCartAndCheckout = addToCartAndCheckout;
window.processStripeCheckout = processStripeCheckout;

console.log('Stripe integration loaded successfully');
