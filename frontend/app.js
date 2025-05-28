// ================ DOM Elements ================
const countrySelector = document.getElementById('country-select');
const cartCount = document.querySelector('.cart-count');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const nav = document.querySelector('nav');
const header = document.querySelector('header');
const newsletterForm = document.querySelector('.newsletter-form');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const wishlistButtons = document.querySelectorAll('.wishlist');
const viewAllBtn = document.querySelector('.btn[href="#"]');
const categoryCards = document.querySelectorAll('.category-card');
const productCards = document.querySelectorAll('.product-card');

// ================ Global Variables ================
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentCountry = 'US'; // Default country
let currencyRates = {
  US: { symbol: '$', rate: 1 },
  CA: { symbol: 'CA$', rate: 1.25 },
  UK: { symbol: '£', rate: 0.75 },
  AU: { symbol: 'A$', rate: 1.45 },
  DE: { symbol: '€', rate: 0.85 },
  FR: { symbol: '€', rate: 0.85 },
  AE: { symbol: 'AED', rate: 3.67 },
  ZA: { symbol: 'R', rate: 15.5 }
};

// Sample product data (would normally come from backend)
const products = [
  {
    id: 1,
    name: "Premium Basmati Rice (5kg)",
    price: 19.99,
    originalPrice: 24.99,
    category: "food",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e1ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.5,
    reviews: 42,
    badge: "Best Seller",
    badgeClass: ""
  },
  {
    id: 2,
    name: "Jaipur Blue Pottery Vase",
    price: 45.99,
    category: "gi-tagged",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
    rating: 4,
    reviews: 18,
    badge: "GI Tagged",
    badgeClass: "gi-tag"
  },
  {
    id: 3,
    name: "Oxidized Silver Bridal Set",
    price: 89.99,
    originalPrice: 120.00,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 5,
    reviews: 36,
    badge: "New",
    badgeClass: "new"
  },
  {
    id: 4,
    name: "Traditional Indian Spice Box",
    price: 32.50,
    category: "specialty",
    image: "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4,
    reviews: 25,
    badge: "",
    badgeClass: ""
  }
];

// ================ Initialize the Page ================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart count
  updateCartCount();
  
  // Set up event listeners
  setupEventListeners();
  
  // Animate elements on scroll
  setupScrollAnimations();
  
  // Load currency based on user's country (could use geolocation API)
  detectUserCountry();
});

// ================ Event Listeners Setup ================
function setupEventListeners() {
  // Country selector change
  countrySelector.addEventListener('change', handleCountryChange);
  
  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  
  // Newsletter form submission
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  
  // Add to cart buttons
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      addToCart(productId);
    });
  });
  
  // Wishlist buttons
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      toggleWishlist(productId, this);
    });
  });
  
  // View all products button
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // In a real app, this would navigate to products page
      alert('Navigating to all products page...');
    });
  }
  
  // Category cards
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const category = this.dataset.category;
      // In a real app, this would filter products by category
      alert(`Filtering products by ${category}...`);
    });
  });
  
  // Product cards
  productCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking on buttons inside the card
      if (!e.target.closest('.add-to-cart') && !e.target.closest('.wishlist')) {
        const productId = parseInt(this.dataset.productId);
        viewProductDetails(productId);
      }
    });
  });
  
  // Header scroll effect
  window.addEventListener('scroll', handleHeaderScroll);
}

// ================ Core Functions ================
function handleCountryChange() {
  currentCountry = this.value;
  updateCurrency();
  // In a real app, you might also update shipping options
  showToast(`Shipping country changed to: ${this.options[this.selectedIndex].text}`);
}

function toggleMobileMenu() {
  nav.classList.toggle('active');
  this.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = this.querySelector('input').value;
  
  if (validateEmail(email)) {
    // In a real app, you would send this to your backend
    showToast(`Thank you for subscribing with: ${email}`);
    this.reset();
  } else {
    showToast('Please enter a valid email address', 'error');
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (product) {
    // Check if product already in cart
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        ...product,
        quantity: 1
      });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Update UI
    updateCartCount();
    showToast(`${product.name} added to cart!`);
    
    // Animate cart icon
    animateCartIcon();
  }
}

function toggleWishlist(productId, button) {
  const product = products.find(p => p.id === productId);
  
  if (product) {
    const index = wishlistItems.findIndex(item => item.id === productId);
    
    if (index > -1) {
      // Remove from wishlist
      wishlistItems.splice(index, 1);
      button.innerHTML = '<i class="far fa-heart"></i>';
      showToast(`${product.name} removed from wishlist`);
    } else {
      // Add to wishlist
      wishlistItems.push(product);
      button.innerHTML = '<i class="fas fa-heart"></i>';
      showToast(`${product.name} added to wishlist!`);
    }
    
    // Update localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    
    // Animate heart icon
    animateWishlistIcon(button);
  }
}

function viewProductDetails(productId) {
  // In a real app, this would navigate to product detail page
  const product = products.find(p => p.id === productId);
  if (product) {
    showModal(product);
  }
}

function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// ================ UI Update Functions ================
function updateCartCount() {
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function updateCurrency() {
  const currency = currencyRates[currentCountry];
  
  // Update all product prices
  document.querySelectorAll('.current-price').forEach(priceEl => {
    const productId = parseInt(priceEl.closest('.product-card').dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const convertedPrice = (product.price * currency.rate).toFixed(2);
      priceEl.textContent = `${currency.symbol}${convertedPrice}`;
      
      // Update original price if it exists
      const originalPriceEl = priceEl.nextElementSibling;
      if (originalPriceEl && originalPriceEl.classList.contains('original-price') && product.originalPrice) {
        const convertedOriginalPrice = (product.originalPrice * currency.rate).toFixed(2);
        originalPriceEl.textContent = `${currency.symbol}${convertedOriginalPrice}`;
      }
    }
  });
  
  // Update currency selector display
  const selectedOption = countrySelector.querySelector(`option[value="${currentCountry}"]`);
  if (selectedOption) {
    countrySelector.previousElementSibling.textContent = `Ship to: ${selectedOption.textContent}`;
  }
}

function animateCartIcon() {
  const cartIcon = cartCount.closest('.cart-icon');
  cartIcon.classList.add('animate');
  setTimeout(() => {
    cartIcon.classList.remove('animate');
  }, 1000);
}

function animateWishlistIcon(button) {
  button.classList.add('animate');
  setTimeout(() => {
    button.classList.remove('animate');
  }, 1000);
}

// ================ Helper Functions ================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function showModal(product) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="modal-body">
        <div class="modal-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info">
          <h2>${product.name}</h2>
          ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
          <div class="modal-price">
            <span class="current-price">${currencyRates[currentCountry].symbol}${(product.price * currencyRates[currentCountry].rate).toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">${currencyRates[currentCountry].symbol}${(product.originalPrice * currencyRates[currentCountry].rate).toFixed(2)}</span>` : ''}
          </div>
          <div class="modal-rating">
            ${generateStarRating(product.rating)}
            <span>(${product.reviews} reviews)</span>
          </div>
          <p class="modal-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          <div class="modal-actions">
            <button class="btn add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            <button class="wishlist" data-product-id="${product.id}">
              ${wishlistItems.some(item => item.id === product.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.classList.add('no-scroll');
  
  // Close modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.classList.remove('no-scroll');
  });
  
  // Add to cart from modal
  modal.querySelector('.add-to-cart').addEventListener('click', function() {
    addToCart(product.id);
  });
  
  // Wishlist from modal
  modal.querySelector('.wishlist').addEventListener('click', function() {
    toggleWishlist(product.id, this);
  });
  
  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.classList.remove('no-scroll');
    }
  });
}

function generateStarRating(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

function setupScrollAnimations() {
  const animateElements = document.querySelectorAll('.category-card, .product-card, .feature-card, .section-title');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animateElements.forEach((element, index) => {
    element.classList.add(`delay-${index % 4}`);
    observer.observe(element);
  });
}

function detectUserCountry() {
  // In a real app, you would use geolocation API or IP detection
  // This is a simplified version that checks browser language
  const userLanguage = navigator.language || navigator.userLanguage;
  
  if (userLanguage.includes('en-US')) {
    currentCountry = 'US';
  } else if (userLanguage.includes('en-GB')) {
    currentCountry = 'UK';
  } else if (userLanguage.includes('en-CA')) {
    currentCountry = 'CA';
  } else if (userLanguage.includes('en-AU')) {
    currentCountry = 'AU';
  } else if (userLanguage.includes('de')) {
    currentCountry = 'DE';
  } else if (userLanguage.includes('fr')) {
    currentCountry = 'FR';
  }
  
  // Set the selector to detected country
  countrySelector.value = currentCountry;
  updateCurrency();
}

// ================ Add CSS for Dynamic Elements ================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  /* Toast Notifications */
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
    max-width: 90%;
    text-align: center;
  }
  
  .toast.show {
    opacity: 1;
  }
  
  .toast.success {
    background-color: var(--success-color);
  }
  
  .toast.error {
    background-color: var(--primary-color);
  }
  
  /* Modal Styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .modal.show {
    opacity: 1;
    visibility: visible;
  }
  
  .modal-content {
    background-color: white;
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: translateY(20px);
    transition: transform 0.3s ease;
  }
  
  .modal.show .modal-content {
    transform: translateY(0);
  }
  
  .close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
    transition: var(--transition);
  }
  
  .close-modal:hover {
    color: var(--primary-color);
  }
  
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .modal-image {
    height: 400px;
    overflow: hidden;
    border-radius: var(--border-radius);
  }
  
  .modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .modal-info {
    display: flex;
    flex-direction: column;
  }
  
  .modal-price {
    margin: 1rem 0;
  }
  
  .modal-description {
    margin: 1rem 0;
    line-height: 1.7;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: auto;
  }
  
  /* Cart Icon Animation */
  .cart-icon.animate .cart-count {
    animation: bounce 0.5s ease;
  }
  
  /* Wishlist Animation */
  .wishlist.animate {
    animation: pulse 0.5s ease;
  }
  
  /* No Scroll Class */
  .no-scroll {
    overflow: hidden;
  }
  
  /* Animations */
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  /* Mobile Menu Active State */
  .mobile-menu-toggle.active {
    color: white;
  }
  
  @media (max-width: 768px) {
    .modal-body {
      grid-template-columns: 1fr;
    }
    
    .modal-image {
      height: 250px;
    }
  }
`;
document.head.appendChild(dynamicStyles);

// ================ Initialize Product Data Attributes ================
// This would normally come from backend API
document.querySelectorAll('.product-card').forEach((card, index) => {
  if (products[index]) {
    card.dataset.productId = products[index].id;
    const addToCartBtn = card.querySelector('.add-to-cart');
    const wishlistBtn = card.querySelector('.wishlist');
    
    if (addToCartBtn) addToCartBtn.dataset.productId = products[index].id;
    if (wishlistBtn) wishlistBtn.dataset.productId = products[index].id;
    
    // Check if product is in wishlist
    if (wishlistItems.some(item => item.id === products[index].id)) {
      wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
  }
});

// Initialize category cards
document.querySelectorAll('.category-card').forEach((card, index) => {
  const categories = ['food', 'jewelry', 'clothing', 'gi-tagged', 'specialty'];
  if (categories[index]) {
    card.dataset.category = categories[index];
  }
});
// Checkout functionality
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async function() {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    try {
      // Create order on backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: getShippingAddress(),
          paymentMethod: getPaymentMethod()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Process payment
        if (data.paymentMethod === 'stripe') {
          const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId
          });

          if (error) {
            showToast(error.message, 'error');
          }
        } else {
          // Cash on delivery or other payment methods
          showToast('Order placed successfully!', 'success');
          clearCart();
          window.location.href = '/order-confirmation.html?id=' + data.order._id;
        }
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Checkout failed. Please try again.', 'error');
      console.error(err);
    }
  });
}

function getShippingAddress() {
  return {
    name: document.getElementById('shipping-name').value,
    street: document.getElementById('shipping-street').value,
    city: document.getElementById('shipping-city').value,
    state: document.getElementById('shipping-state').value,
    zip: document.getElementById('shipping-zip').value,
    country: countrySelector.value
  };
}

function getPaymentMethod() {
  return document.querySelector('input[name="payment-method"]:checked').value;
}

function clearCart() {
  cartItems = [];
  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartCount();
}
