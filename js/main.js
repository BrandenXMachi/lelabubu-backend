// LeLabubu.ca - Main JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the shopping cart
    initCart();
    
    // Initialize the search form
    initSearch();
    
    // Initialize product display on relevant pages
    initProductDisplay();
    
    // Initialize add to cart buttons
    initAddToCartButtons();
    
    // Initialize the newsletter form
    initNewsletterForm();
});

// Cart functionality
let cart = [];

// Cookie helper functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                const cookieValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
                console.log('Raw cookie value:', cookieValue);
                return JSON.parse(cookieValue);
            } catch (e) {
                console.error("Error parsing cookie:", e);
                return null;
            }
        }
    }
    return null;
}

// Initialize the shopping cart
function initCart() {
    // Try multiple storage methods in order of preference
    let cartData = null;
    
    // 1. Try localStorage
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        if (savedCart) {
            cartData = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    
    // 2. Try cookies if localStorage failed
    if (!cartData) {
        try {
            cartData = getCookie('lelabubuCart');
            if (cartData) {
                console.log('Cart loaded from cookie');
            }
        } catch (error) {
            console.error('Error loading cart from cookie:', error);
        }
    }
    
    // 3. Use the cart data if we found it
    if (cartData && Array.isArray(cartData)) {
        cart = cartData;
    }
    
    // Update cart count in the UI
    updateCartCount();
    
    // Initialize cart page if we're on it
    // Check both pathname and href to handle both http:// and file:// protocols
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        displayCartItems();
    }
    
    // For debugging
    console.log('Cart initialized:', cart);
}

// Add a product to the cart
function addToCart(productId, quantity = 1, color = null, size = null) {
    const product = getProductById(parseInt(productId));
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && 
        item.color === color && 
        item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if the product is already in the cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to the cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            color: color || (product.colors.length > 0 ? product.colors[0] : null),
            size: size || (product.sizes.length > 0 ? product.sizes[0] : null)
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count in the UI
    updateCartCount();
    
    // Show confirmation message
    showCartConfirmation(product.name);
}

// Save cart to multiple storage methods for redundancy
function saveCart() {
    // Try to save to localStorage
    try {
        localStorage.setItem('lelabubuCart', JSON.stringify(cart));
        console.log('Cart saved to localStorage');
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
    
    // Also save to cookie as a backup
    try {
        setCookie('lelabubuCart', cart, 7); // Save for 7 days
        console.log('Cart saved to cookie');
    } catch (error) {
        console.error('Error saving cart to cookie:', error);
    }
    
    // For debugging
    console.log('Cart saved:', cart);
}

// Update the cart count in the UI
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    
    if (!cartCountElement) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCountElement.textContent = totalItems;
        cartCountElement.classList.remove('d-none');
    } else {
        cartCountElement.classList.add('d-none');
    }
}

// Show a confirmation message when a product is added to the cart
function showCartConfirmation(productName) {
    // Create confirmation element if it doesn't exist
    let confirmationElement = document.getElementById('cartConfirmation');
    
    if (!confirmationElement) {
        confirmationElement = document.createElement('div');
        confirmationElement.id = 'cartConfirmation';
        confirmationElement.className = 'cart-confirmation alert alert-success';
        confirmationElement.style.position = 'fixed';
        confirmationElement.style.top = '20px';
        confirmationElement.style.right = '20px';
        confirmationElement.style.zIndex = '1000';
        confirmationElement.style.maxWidth = '300px';
        confirmationElement.style.display = 'none';
        document.body.appendChild(confirmationElement);
    }
    
    // Update confirmation message
    confirmationElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <div>
                <strong>${productName}</strong> has been added to your cart.
                <div class="mt-2">
                    <button class="btn btn-sm btn-primary me-2" onclick="location.href='cart.html'">View Cart</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('cartConfirmation').style.display = 'none';">Continue Shopping</button>
                </div>
            </div>
        </div>
    `;
    
    // Show confirmation
    confirmationElement.style.display = 'block';
    
    // Hide confirmation after 5 seconds
    setTimeout(() => {
        confirmationElement.style.display = 'none';
    }, 5000);
    
    // Update cart count in the UI
    updateCartCount();
    
    // For debugging
    console.log('Product added to cart:', productName);
    console.log('Current cart:', cart);
}

// Display cart items on the cart page
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return;
    
    // Reload cart data from storage to ensure we have the latest data
    // This is especially important when navigating between pages
    let cartLoaded = false;
    
    // Try localStorage first
    try {
        const savedCart = localStorage.getItem('lelabubuCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart reloaded from localStorage for display:', cart);
            cartLoaded = true;
        }
    } catch (error) {
        console.error('Error loading cart from localStorage for display:', error);
    }
    
    // Try cookies as fallback if localStorage failed
    if (!cartLoaded) {
        try {
            const cookieCart = getCookie('lelabubuCart');
            if (cookieCart) {
                cart = cookieCart;
                console.log('Cart reloaded from cookie for display:', cart);
                cartLoaded = true;
            }
        } catch (error) {
            console.error('Error loading cart from cookie for display:', error);
        }
    }
    
    console.log('Final cart data for display:', cart);
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
        console.error('Cart is not an array, resetting to empty array');
        cart = [];
    }
    
    if (!cart || cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <h3 data-translate="cart_empty">Your cart is empty</h3>
                <p data-translate="cart_empty_message">Looks like you haven't added any products to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary mt-3" data-translate="continue_shopping">Continue Shopping</a>
            </div>
        `;
        
        // Hide cart summary
        if (cartSummary) {
            cartSummary.classList.add('d-none');
        }
        
        // Apply translations to the newly added elements
        if (typeof applyTranslation === 'function' && typeof currentLanguage !== 'undefined') {
            applyTranslation(currentLanguage);
        }
        
        return;
    }
    
    // Show cart summary
    if (cartSummary) {
        cartSummary.classList.remove('d-none');
    }
    
    // Generate HTML for cart items
    let cartItemsHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItemsHTML += `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2 col-4">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid cart-item-image">
                    </div>
                    <div class="col-md-4 col-8">
                        <h5 class="cart-item-title">${item.name}</h5>
                        <p class="mb-0 text-muted small">
                            ${item.color ? `Color: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}` : ''}
                            ${item.size ? `Size: ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}` : ''}
                        </p>
                    </div>
                    <div class="col-md-2 col-5 mt-3 mt-md-0">
                        <span class="cart-item-price d-block mb-2 mb-md-0">${formatPrice(item.price)}</span>
                    </div>
                    <div class="col-md-2 col-7 mt-3 mt-md-0">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="quantity-controls">
                                <button class="btn update-quantity" data-index="${index}" data-action="decrease">−</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="btn update-quantity" data-index="${index}" data-action="increase">+</button>
                            </div>
                            <button class="cart-item-remove ms-2" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-12 mt-3 mt-md-0 text-md-end text-start">
                        <span class="cart-item-total">${formatPrice(itemTotal)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update cart items container
    cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Calculate shipping and total
    // Note: This is a simplified calculation for display purposes
    // The actual shipping cost will be calculated on the server based on the customer's address
    let shipping = 0;
    
    // For display purposes, we'll show estimated shipping costs
    // The actual cost will be determined during checkout based on the shipping address
    if (subtotal < 100) {
        // Show estimated shipping (will be updated during checkout)
        shipping = 25; // Default to Canada shipping estimate
    }
    
    const total = subtotal + shipping;
    
    // Update cart summary
    if (cartSummary) {
        const subtotalElement = cartSummary.querySelector('.cart-subtotal');
        const shippingElement = cartSummary.querySelector('.cart-shipping');
        const totalElement = cartSummary.querySelector('.cart-total');
        
        if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
        if (totalElement) totalElement.textContent = formatPrice(total);
    }
    
    // Add event listeners for quantity updates and item removal
    document.querySelectorAll('.update-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const action = this.dataset.action;
            
            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            }
            
            saveCart();
            displayCartItems();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.cart-item-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            const quantity = parseInt(this.value);
            
            if (quantity >= 1) {
                cart[index].quantity = quantity;
                saveCart();
                displayCartItems();
                updateCartCount();
            } else {
                this.value = cart[index].quantity;
            }
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            saveCart();
            displayCartItems();
            updateCartCount();
        });
    });
    
    // Checkout button is handled by stripe.js
    // No need to initialize it here as it's already handled there
}

// Initialize search functionality
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('input[name="search"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Redirect to shop page with search parameter
                window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

// Initialize product display on relevant pages
function initProductDisplay() {
    // Check which page we're on
    const path = window.location.pathname;
    const href = window.location.href;
    
    if (path.includes('index.html') || path === '/' || path === '' || href.endsWith('/') || href.endsWith('index.html')) {
        // Home page
        displayFeaturedProducts();
        displayNewArrivals();
        displayBestSellers();
    } else if (path.includes('shop.html') || href.includes('shop.html')) {
        // Shop page
        displayShopProducts();
    } else if (path.includes('product.html') || href.includes('product.html')) {
        // Product detail page
        displayProductDetails();
    }
}

// Display featured products on the home page
function displayFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured-products .row');
    
    if (!featuredContainer) return;
    
    const featured = getFeaturedProducts();
    let featuredHTML = '';
    
    featured.forEach(product => {
        featuredHTML += generateProductCard(product);
    });
    
    featuredContainer.innerHTML = featuredHTML;
}

// Display new arrivals on the home page
function displayNewArrivals() {
    const newArrivalsContainer = document.querySelector('.new-arrivals .row');
    
    if (!newArrivalsContainer) return;
    
    const newArrivalsProducts = getNewArrivals();
    let newArrivalsHTML = '';
    
    newArrivalsProducts.forEach(product => {
        newArrivalsHTML += generateProductCard(product);
    });
    
    newArrivalsContainer.innerHTML = newArrivalsHTML;
}

// Display best sellers on the home page
function displayBestSellers() {
    const bestSellersContainer = document.querySelector('.best-sellers .row');
    
    if (!bestSellersContainer) return;
    
    const bestSellersProducts = getBestSellers();
    let bestSellersHTML = '';
    
    bestSellersProducts.forEach(product => {
        bestSellersHTML += generateProductCard(product);
    });
    
    bestSellersContainer.innerHTML = bestSellersHTML;
}

// Display products on the shop page
function displayShopProducts(category = null) {
    const productsContainer = document.querySelector('.shop-products');
    const productCountElement = document.querySelector('.product-count');
    
    if (!productsContainer) return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category') || category;
    
    // Get products based on parameters
    let displayProducts = [];
    
    if (searchParam) {
        // Search results
        displayProducts = searchProducts(searchParam);
        
        // Update page title
        const shopTitle = document.querySelector('.shop-title');
        if (shopTitle) {
            shopTitle.textContent = `Search Results for "${searchParam}"`;
        }
    } else {
        // All products or filtered by category
        if (categoryParam && categoryParam !== 'all') {
            displayProducts = getProductsByCategory(categoryParam);
            
            // Update page title
            const shopTitle = document.querySelector('.shop-title');
            if (shopTitle) {
                if (categoryParam === 'authentic') {
                    shopTitle.textContent = 'Authentic Products';
                } else if (categoryParam === 'replica') {
                    shopTitle.textContent = 'LaFuFus';
                }
            }
        } else {
            displayProducts = [...products];
            
            // Update page title for "All Products"
            const shopTitle = document.querySelector('.shop-title');
            if (shopTitle) {
                shopTitle.textContent = 'All Products';
            }
        }
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sortBy')?.value || 'featured';
    displayProducts = sortProducts(displayProducts, sortBy);
    
    // Update product count
    if (productCountElement) {
        productCountElement.textContent = `${displayProducts.length} products`;
    }
    
    // Generate HTML for products
    let productsHTML = '';
    
    if (displayProducts.length === 0) {
        productsHTML = `
            <div class="col-12 text-center py-5">
                <h3>No products found</h3>
                <p>Try adjusting your search terms.</p>
            </div>
        `;
    } else {
        displayProducts.forEach(product => {
            productsHTML += generateProductCard(product);
        });
    }
    
    productsContainer.innerHTML = productsHTML;
    
    // Initialize sort dropdown
    initSortDropdown();
}

// Initialize sort dropdown
function initSortDropdown() {
    // Sort by dropdown
    const sortBySelect = document.getElementById('sortBy');
    
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            displayShopProducts();
        });
    }
}

// Filter products by category
function filterProductsByCategory(category) {
    // Update URL parameter
    const url = new URL(window.location);
    
    if (category && category !== 'all') {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    
    window.history.pushState({}, '', url);
    
    // Display products with the selected category
    displayShopProducts(category);
}

// Display product details on the product page
function displayProductDetails() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        console.error('No product ID found in URL');
        // Show error message instead of defaulting to first product
        const content = document.querySelector('.product-info-content');
        const loadingIndicator = document.querySelector('.product-info-loading');
        
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.innerHTML = `
                <div class="text-center py-5">
                    <h3>Product Not Found</h3>
                    <p>The product you're looking for could not be found.</p>
                    <a href="shop.html" class="btn btn-primary">Browse All Products</a>
                </div>
            `;
        }
        return;
    }
    
    displayProductById(productId);
}

// Helper function to display product by ID
function displayProductById(productId) {
    const product = getProductById(parseInt(productId));
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Update page title
    document.title = `${product.name} - LeLabubu.ca`;
    
    // Hide loading indicator and show content
    const loadingIndicator = document.querySelector('.product-info-loading');
    const content = document.querySelector('.product-info-content');
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (content) content.style.display = 'block';

    // Update product details
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const productDescription = document.querySelectorAll('.product-description');
    const productRating = document.querySelector('.product-rating');
    const reviewCount = document.querySelector('.review-count');
    const productSKU = document.querySelector('.product-sku');
    const productCategory = document.querySelectorAll('.product-category');
    const stockStatus = document.querySelector('.stock-status');
    const mainImage = document.querySelector('.main-product-image');
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    const colorOptions = document.querySelector('.color-options');
    const sizeOptions = document.querySelector('.size-options');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const relatedProductsContainer = document.querySelector('.related-products .row');
    
    // Update basic product info
    if (productTitle) productTitle.textContent = product.name;
    if (productPrice) productPrice.textContent = formatPrice(product.price);
    
    productDescription.forEach(el => {
        el.textContent = product.description;
    });
    
    if (productRating) {
        productRating.innerHTML = generateRatingStars(product.rating);
    }
    
    if (reviewCount) {
        reviewCount.textContent = `(${product.reviews} reviews)`;
    }
    
    if (productSKU) {
        productSKU.textContent = `SKU-${product.id.toString().padStart(3, '0')}`;
    }
    
    productCategory.forEach(el => {
        el.textContent = "Authentic";
    });
    
    
    if (stockStatus) {
        if (product.inStock) {
            stockStatus.textContent = 'In Stock';
            stockStatus.classList.remove('out-of-stock');
        } else {
            stockStatus.textContent = 'Out of Stock';
            stockStatus.classList.add('out-of-stock');
        }
    }
    
    // Update product images
    if (mainImage) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
        mainImage.style.display = 'block'; // Show the image once it's loaded with correct product
    }
    
    if (thumbnailsContainer) {
        let thumbnailsHTML = '';
        
        product.images.forEach((image, index) => {
            thumbnailsHTML += `
                <div class="col-3 mb-3">
                    <img src="${image}" alt="${product.name} - Image ${index + 1}" 
                        class="img-fluid ${index === 0 ? 'active' : ''}" 
                        data-image="${image}">
                </div>
            `;
        });
        
        thumbnailsContainer.innerHTML = thumbnailsHTML;
        
        // Add click event to thumbnails
        thumbnailsContainer.querySelectorAll('img').forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.dataset.image;
                
                // Update active class
                thumbnailsContainer.querySelectorAll('img').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }
    
    // Update color options
    if (colorOptions && product.colors.length > 0) {
        let colorsHTML = '';
        
        product.colors.forEach((color, index) => {
            // Map color names to CSS colors
            let bgColor;
            switch(color) {
                case 'blue':
                    bgColor = '#4285F4';
                    break;
                case 'red':
                    bgColor = '#EA4335';
                    break;
                case 'purple':
                    bgColor = '#9C27B0';
                    break;
                case 'multi-color':
                    bgColor = 'linear-gradient(135deg, #FF5722, #FFEB3B, #4CAF50, #2196F3, #9C27B0)';
                    break;
                default:
                    bgColor = color; // Use the color name as fallback
            }
            
            colorsHTML += `
                <div class="color-option ${index === 0 ? 'active' : ''}" 
                    style="background: ${bgColor};" 
                    data-color="${color}">
                    <span class="color-name">${color.charAt(0).toUpperCase() + color.slice(1)}</span>
                </div>
            `;
        });
        
        colorOptions.innerHTML = colorsHTML;
        
        // Add click event to color options
        colorOptions.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                // Update active class
                colorOptions.querySelectorAll('.color-option').forEach(o => {
                    o.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }
    
    // Update size options
    if (sizeOptions && product.sizes.length > 0) {
        let sizesHTML = '';
        
        product.sizes.forEach((size, index) => {
            sizesHTML += `
                <div class="size-option ${index === 0 ? 'active' : ''}" 
                    data-size="${size}">
                    ${size.charAt(0).toUpperCase() + size.slice(1)}
                </div>
            `;
        });
        
        sizeOptions.innerHTML = sizesHTML;
        
        // Add click event to size options
        sizeOptions.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                // Update active class
                sizeOptions.querySelectorAll('.size-option').forEach(o => {
                    o.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }
    
    // Add to cart button
    if (addToCartBtn) {
        if (product.inStock) {
            addToCartBtn.addEventListener('click', function() {
                const quantity = parseInt(document.getElementById('quantity').value) || 1;
                const color = colorOptions?.querySelector('.color-option.active')?.dataset.color;
                const size = sizeOptions?.querySelector('.size-option.active')?.dataset.size;
                
                addToCart(product.id, quantity, color, size);
            });
        } else {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
        }
    }

    // Initialize quantity buttons
    const quantityDecrease = document.getElementById('quantity-decrease');
    const quantityIncrease = document.getElementById('quantity-increase');
    const quantityInput = document.getElementById('quantity');

    if (quantityDecrease && quantityIncrease && quantityInput) {
        quantityDecrease.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        quantityIncrease.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
    
    // Display related products
    if (relatedProductsContainer) {
        const relatedProducts = getRelatedProducts(product.id);
        let relatedHTML = '';
        
        relatedProducts.forEach(relatedProduct => {
            relatedHTML += generateProductCard(relatedProduct);
        });
        
        relatedProductsContainer.innerHTML = relatedHTML;
    }
}

// Initialize add to cart buttons
function initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('form.row.g-3');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real application, this would submit to a server
                alert(`Thank you for subscribing with ${email}! You'll now receive updates on new releases and promotions.`);
                emailInput.value = '';
            }
        });
    });
}
