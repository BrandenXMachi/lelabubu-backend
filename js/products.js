// LeLabubu.ca - Product Data

// Product data array
const products = [
    // Authentic products
    {
        id: 9,
        name: "Labubu Monster Diary Series",
        price: 34.00,
        colors: ["purple", "multi-color"],
        sizes: ["small"],
        rating: 4.9,
        reviews: 18,
        inStock: true,
        description: "The charming Labubu Monster Diary Series features our beloved character in a playful ninja-inspired design. This special edition combines cute and mysterious elements with a vibrant purple color scheme and gold accents.",
        details: "Designed by Kasing Lung, this Labubu Monster Diary Series figure showcases the character in a unique ninja-inspired outfit. The purple and gold color scheme adds a touch of mystery and elegance to your collection. Each piece is carefully crafted with attention to detail and comes in special collector's packaging.",
        images: [
            "images/products/labubu-monster-diary.webp",
            "images/products/Labubu Monster Diary Series 0.jpg",
            "images/products/Labubu Monster Diary Series 1.webp",
            "images/products/Labubu Monster Diary Series 2.jpg"
        ],
        tags: ["purple", "limited", "diary", "monster", "ninja", "kasing lung"]
    },
    {
        id: 8,
        name: "Labubu Chinese Zodiac Series",
        price: 34.00,
        colors: ["multi-color"],
        sizes: ["small"],
        rating: 5.0,
        reviews: 22,
        inStock: false,
        description: "Celebrate Chinese culture with the Labubu Chinese Zodiac Series. This special collection features our beloved character reimagined with elements from the traditional Chinese zodiac, creating a perfect blend of contemporary art toy design and cultural heritage.",
        details: "Designed by Kasing Lung, this limited edition Labubu collection pays homage to Chinese zodiac traditions. Each figure is meticulously crafted with vibrant colors and intricate details representing different zodiac animals. These collectibles make perfect gifts for cultural celebrations or for fans looking to add a unique cultural piece to their collection.",
        images: [
            "images/products/labubu-chinese-zodiac.webp",
            "images/products/zodiac 1.webp",
            "images/products/zodiac 2.webp",
            "images/products/zodiac 3.webp"
        ],
        tags: ["multi-color", "limited", "zodiac", "chinese", "cultural", "kasing lung"]
    },
    {
        id: 1,
        name: "Big into Energy",
        price: 100.00,
        colors: ["blue"],
        sizes: ["medium"],
        rating: 4.5,
        reviews: 124,
        inStock: true,
        description: "The original Labubu doll in a vibrant blue color. This classic design features the iconic mischievous expression that has made Labubu dolls famous worldwide. Each doll is crafted with high-quality vinyl and stands approximately 8 inches tall.",
        details: "Designed by Kasing Lung, this Labubu doll captures the perfect blend of cute and creepy that has made the character so beloved by collectors. The blue variant is one of the most popular colorways in the classic line.",
        images: [
            "images/products/labubu-image-2.webp",
            "images/products/big into energy 3.webp",
            "images/products/big into energy 1.webp"
        ],
        tags: ["blue", "classic", "vinyl", "kasing lung"]
    },
    {
        id: 2,
        name: "Exciting Macaron",
        price: 83.00,
        colors: ["red"],
        sizes: ["medium"],
        rating: 4.7,
        reviews: 98,
        inStock: true,
        description: "The original Labubu doll in a striking red color. This classic design features the iconic mischievous expression that has made Labubu dolls famous worldwide. Each doll is crafted with high-quality vinyl and stands approximately 8 inches tall.",
        details: "Designed by Kasing Lung, this Labubu doll captures the perfect blend of cute and creepy that has made the character so beloved by collectors. The red variant adds a bold, eye-catching element to any collection.",
        images: [
            "images/products/labubu-image-3.webp",
            "images/products/exciting macaron 1.webp",
            "images/products/exciting macaron 2.webp",
            "images/products/exciting macaron 4.webp"
        ],
        tags: ["red", "classic", "vinyl", "kasing lung"]
    },
    {
        id: 3,
        name: "The Monsters Classic Series",
        price: 54.00,
        colors: ["red"],
        sizes: ["small"],
        rating: 4.6,
        reviews: 65,
        inStock: true,
        description: "A smaller version of the beloved Labubu doll in a striking red color. The Mini Labubu maintains all the charm of the original in a more compact size, perfect for collectors with limited display space or those who want to create multi-character scenes.",
        details: "Standing at approximately 4 inches tall, the Mini Labubu is crafted with the same attention to detail and high-quality materials as its larger counterpart. The red Mini Labubu adds a bold pop of color to any collection.",
        images: [
            "images/products/labubu-image-8.webp",
            "images/products/labubu image 10.webp"
        ],
        tags: ["red", "mini", "small", "vinyl", "kasing lung"]
    },
    {
        id: 4,
        name: "Have A Seat",
        price: 78.00,
        colors: ["multi-color"],
        sizes: ["medium"],
        rating: 4.8,
        reviews: 45,
        inStock: true,
        description: "A charming Labubu doll that invites you to take a seat and relax. This delightful design features the iconic character in a comfortable seated position, perfect for display on shelves, desks, or any special spot in your collection.",
        details: "Designed by Kasing Lung, this Labubu doll captures a moment of relaxation while maintaining the character's signature charm. The multi-colored design adds a vibrant touch to any collection and makes for an eye-catching display piece.",
        images: [
            "images/products/have-a-seat.jpg",
            "images/products/Have A Seat 2.jpg",
            "images/products/Have A Seat 1.jpg",
            "images/products/Have A Seat 3.jpg"
        ],
        tags: ["multi-color", "classic", "vinyl", "kasing lung", "seated"]
    },
    {
        id: 5,
        name: "Full-size 'Fall in Wild' Series",
        price: 405.00,
        colors: ["multi-color"],
        sizes: ["large"],
        rating: 4.9,
        reviews: 32,
        inStock: true,
        description: "The stunning 'Fall in Wild' Series features a full-size Labubu doll in a nature-inspired design. This special edition captures the essence of wilderness with its unique color palette and detailed craftsmanship.",
        details: "Designed by Kasing Lung, this full-size Labubu doll stands taller than the standard editions and showcases intricate details that highlight the character's playful yet mysterious nature. The 'Fall in Wild' Series is perfect for collectors looking for statement pieces that celebrate the beauty of the natural world.",
        images: [
            "images/products/big fall 0.webp",
            "images/products/big fall 1.webp",
            "images/products/big fall 2.webp"
        ],
        tags: ["multi-color", "classic", "vinyl", "kasing lung", "nature", "full-size", "wild"]
    },
    {
        id: 6,
        name: "Pendant keychain 'Fall in Wild' Series",
        price: 119.50,
        colors: ["multi-color"],
        sizes: ["one-size"],
        rating: 4.8,
        reviews: 28,
        inStock: true,
        description: "A beautiful pendant keychain from the 'Fall in Wild' Series. This miniature accessory captures all the charm and detail of the full-size figure in a convenient keychain format that you can take with you anywhere.",
        details: "Part of the popular 'Fall in Wild' Series designed by Kasing Lung, this pendant keychain features the same nature-inspired design elements as the larger figures. Made from high-quality materials with a secure metal keyring, it's perfect for collectors who want to showcase their love for Labubu on the go.",
        images: [
            "images/products/wind-pendant.webp",
            "images/products/mini fall 0.webp"
        ],
        tags: ["keychain", "pendant", "accessories", "multi-color", "vinyl", "kasing lung", "wild"]
    },
    {
        id: 7,
        name: "Labubu Pirate Treasure Series",
        price: 58.75,
        colors: ["multi-color"],
        sizes: ["medium"],
        rating: 4.9,
        reviews: 23,
        inStock: true,
        description: "Join Labubu on a swashbuckling adventure with the Pirate Treasure Series. This special edition features our favorite character dressed as a pirate, complete with themed accessories and a treasure chest display base.",
        details: "Designed by Kasing Lung, this limited edition Labubu captures the spirit of adventure on the high seas. The detailed pirate costume includes a hat, eye patch, and other accessories that transform the character into a charming buccaneer. The special display base resembles a treasure chest, making this piece a true collector's treasure.",
        images: [
            "images/products/the-monsters-one-piece-series-01.webp"
        ],
        tags: ["multi-color", "limited", "vinyl", "kasing lung", "pirate", "treasure", "one piece"]
    },
    
];

// Featured products (IDs of products to be featured on the homepage)
const featuredProducts = [1, 3, 5, 7, 8, 9];

// New arrivals (IDs of products to be displayed as new arrivals)
const newArrivals = [4, 5, 6, 7, 8, 9];

// Best sellers (IDs of products to be displayed as best sellers)
const bestSellers = [1, 2, 3, 5, 8, 9];

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get products by IDs
function getProductsByIds(ids) {
    return products.filter(product => ids.includes(product.id));
}

// Get featured products
function getFeaturedProducts() {
    return getProductsByIds(featuredProducts);
}

// Get new arrivals
function getNewArrivals() {
    return getProductsByIds(newArrivals);
}

// Get best sellers
function getBestSellers() {
    return getProductsByIds(bestSellers);
}

// Get related products (products in the same category, excluding the current product)
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    // Since categories are removed, we can suggest any other products as related
    return products
        .filter(p => p.id !== productId)
        .slice(0, limit);
}

// Search products by name or description
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
}

// Filter products by multiple criteria
function filterProducts(filters) {
    return products.filter(product => {
        // Filter by price range
        if (filters.minPrice && product.price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice && product.price > filters.maxPrice) {
            return false;
        }
        
        // Filter by color
        if (filters.color && filters.color.length > 0) {
            if (!product.colors.some(color => filters.color.includes(color))) {
                return false;
            }
        }
        
        // Filter by size
        if (filters.size && filters.size.length > 0) {
            if (!product.sizes.some(size => filters.size.includes(size))) {
                return false;
            }
        }
        
        // Filter by availability
        if (filters.inStock === true && !product.inStock) {
            return false;
        }
        
        return true;
    });
}

// Sort products by different criteria
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'featured':
        default:
            // For featured, we'll use a combination of rating and reviews
            return sortedProducts.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
    }
}

// Format price with currency symbol
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Generate star rating HTML
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Generate product card HTML
function generateProductCard(product) {
    return `
        <div class="col-md-3 mb-4">
            <div class="card product-card">
                <a href="product.html?id=${product.id}">
                    <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                </a>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h5>
                    <div class="rating mb-2">
                        ${generateRatingStars(product.rating)}
                        <small class="text-muted ml-2">(${product.reviews})</small>
                    </div>
                    <p class="price mb-2">${formatPrice(product.price)}</p>
                    ${product.inStock ? 
                        `<button class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}" data-translate="add_to_cart">
                            Add to Cart
                        </button>` : 
                        `<button class="btn btn-danger btn-sm" disabled>
                            Out of Stock
                        </button>`
                    }
                </div>
            </div>
        </div>
    `;
}
