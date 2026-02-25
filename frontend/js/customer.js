// Customer Portal JavaScript

// Check if user is logged in for booking page
function checkGuestAuth() {
    // Only check on booking page
    if (window.location.pathname.includes('booking.html')) {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'GUEST') {
            // Get room type from URL if present
            const urlParams = new URLSearchParams(window.location.search);
            const roomType = urlParams.get('room');
            
            // Redirect to login with room type preserved
            alert('Please login or register to make a reservation');
            if (roomType) {
                window.location.href = `customer-login.html?room=${roomType}`;
            } else {
                window.location.href = 'customer-login.html';
            }
            return false;
        }
        
        // Show guest info in navigation
        showGuestInfo();
        
        // Pre-fill user data
        prefillUserData();
        return true;
    }
    return true;
}

// Show guest info in navigation
function showGuestInfo() {
    const fullName = localStorage.getItem('fullName');
    const guestInfoDiv = document.getElementById('guestInfo');
    const guestNameSpan = document.getElementById('guestName');
    const staffLoginBtn = document.getElementById('staffLoginBtn');
    
    if (guestInfoDiv && guestNameSpan && fullName) {
        guestNameSpan.textContent = fullName;
        guestInfoDiv.style.display = 'flex';
        if (staffLoginBtn) {
            staffLoginBtn.style.display = 'none';
        }
    }
}

// Pre-fill user data in booking form
function prefillUserData() {
    const fullName = localStorage.getItem('fullName');
    const username = localStorage.getItem('username');
    
    // Wait for form to be available
    setTimeout(() => {
        const guestNameField = document.getElementById('guestName');
        if (guestNameField && fullName) {
            guestNameField.value = fullName;
            guestNameField.readOnly = true;
        }
    }, 100);
}

// Logout function for guests
function guestLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = 'book.html';
}

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================
function toggleMobileMenu() {
    console.log('Toggle mobile menu called');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const body = document.body;
    
    if (mobileMenu && mobileMenuOverlay) {
        const isActive = mobileMenu.classList.contains('active');
        console.log('Menu is currently:', isActive ? 'active' : 'inactive');
        
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
            console.log('Menu opened');
        } else {
            body.style.overflow = '';
            console.log('Menu closed');
        }
    } else {
        console.error('Mobile menu elements not found');
    }
}

// Close mobile menu on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// Ensure menu is closed on page load
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
    }
    
    console.log('Mobile menu initialized');
});

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================
let currentSlide = 0;
let autoplayInterval;
const slides = [];
const indicators = [];

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for booking page
    if (!checkGuestAuth()) {
        return;
    }
    
    initCarousel();
    initRoomCarousels();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').setAttribute('min', today);
    document.getElementById('checkOutDate').setAttribute('min', today);

    // Add event listeners for date changes
    document.getElementById('checkInDate').addEventListener('change', calculatePrice);
    document.getElementById('checkOutDate').addEventListener('change', calculatePrice);
    document.getElementById('roomType').addEventListener('change', calculatePrice);

    // Form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
});

// Initialize carousel
function initCarousel() {
    const slideElements = document.querySelectorAll('.carousel-slide');
    const indicatorElements = document.querySelectorAll('.indicator');

    slideElements.forEach(slide => slides.push(slide));
    indicatorElements.forEach(indicator => indicators.push(indicator));

    // Start autoplay
    startAutoplay();

    // Add touch support for mobile
    addTouchSupport();

    // Pause autoplay on hover
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
}

// Change slide
function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    updateCarousel();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Update carousel display
function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

// Auto-play functionality
function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function pauseAutoplay() {
    clearInterval(autoplayInterval);
}

// Touch support for mobile swipe on hero carousel
function addTouchSupport() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// ============================================
// ROOM CAROUSEL FUNCTIONALITY
// ============================================

// Initialize all room carousels
function initRoomCarousels() {
    // Disabled - rooms now show single static images
    return;
    
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach((card, cardIndex) => {
        const carousel = card.querySelector('.room-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.room-carousel-slide');
        const dotsContainer = carousel.querySelector('.room-carousel-dots');
        
        // Create dots for each slide
        slides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.className = 'room-carousel-dot' + (index === 0 ? ' active' : '');
            dot.onclick = () => goToRoomSlide(carousel, index);
            dotsContainer.appendChild(dot);
        });
        
        // Add touch support for mobile swipe
        addRoomCarouselTouchSupport(carousel);
        
        // Start auto-rotation for this carousel
        startRoomAutoRotation(carousel, cardIndex);
    });
}

// Auto-rotation for room carousels
function startRoomAutoRotation(carousel, cardIndex) {
    // Stagger the start time for each carousel to create a wave effect
    const delay = cardIndex * 1000; // 1 second delay between each carousel start
    
    setTimeout(() => {
        const autoRotateInterval = setInterval(() => {
            const slides = carousel.querySelectorAll('.room-carousel-slide');
            let currentIndex = 0;
            
            slides.forEach((slide, index) => {
                if (slide.classList.contains('active')) {
                    currentIndex = index;
                }
            });
            
            let newIndex = currentIndex + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            
            updateRoomCarousel(carousel, newIndex);
        }, 4000); // Change image every 4 seconds
        
        // Store interval ID on carousel element for potential pause/resume
        carousel.autoRotateInterval = autoRotateInterval;
        
        // Pause auto-rotation on hover (desktop)
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carousel.autoRotateInterval);
        });
        
        // Resume auto-rotation on mouse leave
        carousel.addEventListener('mouseleave', () => {
            carousel.autoRotateInterval = setInterval(() => {
                const slides = carousel.querySelectorAll('.room-carousel-slide');
                let currentIndex = 0;
                
                slides.forEach((slide, index) => {
                    if (slide.classList.contains('active')) {
                        currentIndex = index;
                    }
                });
                
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) {
                    newIndex = 0;
                }
                
                updateRoomCarousel(carousel, newIndex);
            }, 4000);
        });
    }, delay);
}

// Change room slide
function changeRoomSlide(button, direction) {
    const carousel = button.closest('.room-carousel');
    const slides = carousel.querySelectorAll('.room-carousel-slide');
    const dots = carousel.querySelectorAll('.room-carousel-dot');
    
    let currentIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    let newIndex = currentIndex + direction;
    
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    updateRoomCarousel(carousel, newIndex);
}

// Go to specific room slide
function goToRoomSlide(carousel, index) {
    updateRoomCarousel(carousel, index);
}

// Update room carousel display
function updateRoomCarousel(carousel, newIndex) {
    const slides = carousel.querySelectorAll('.room-carousel-slide');
    const dots = carousel.querySelectorAll('.room-carousel-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === newIndex) {
            slide.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === newIndex) {
            dot.classList.add('active');
        }
    });
}

// Touch support for room carousel mobile swipe
function addRoomCarouselTouchSupport(carousel) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleRoomSwipe(carousel);
    }, false);
    
    function handleRoomSwipe(carousel) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const slides = carousel.querySelectorAll('.room-carousel-slide');
            let currentIndex = 0;
            slides.forEach((slide, index) => {
                if (slide.classList.contains('active')) {
                    currentIndex = index;
                }
            });
            
            if (diff > 0) {
                // Swipe left - next slide
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) newIndex = 0;
                updateRoomCarousel(carousel, newIndex);
            } else {
                // Swipe right - previous slide
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                updateRoomCarousel(carousel, newIndex);
            }
        }
    }
}

// ============================================
// ROOM BOOKING FUNCTIONALITY
// ============================================

// Room rates
const roomRates = {
    'STANDARD': 5000,
    'DELUXE': 8000,
    'SUITE': 12000,
    'FAMILY': 15000,
    'PRESIDENTIAL': 25000
};

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').setAttribute('min', today);
    document.getElementById('checkOutDate').setAttribute('min', today);
    
    // Add event listeners for date changes
    document.getElementById('checkInDate').addEventListener('change', calculatePrice);
    document.getElementById('checkOutDate').addEventListener('change', calculatePrice);
    document.getElementById('roomType').addEventListener('change', calculatePrice);
    document.getElementById('numberOfGuests').addEventListener('change', calculatePrice);
    
    // Form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
});

// Select room function
function selectRoom(roomType) {
    // Redirect to booking page with room type as URL parameter
    window.location.href = `booking.html?room=${roomType}`;
}

// Calculate price
function calculatePrice() {
    const roomType = document.getElementById('roomType').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value) || 1;
    
    if (roomType && checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkOutDate <= checkInDate) {
            showError('Check-out date must be after check-in date');
            document.getElementById('priceCalculation').style.display = 'none';
            return;
        }
        
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const rate = roomRates[roomType];
        const pricePerPersonPerNight = rate / numberOfGuests;
        const total = nights * rate;
        
        document.getElementById('pricePerNight').textContent = `LKR ${rate.toLocaleString()}`;
        document.getElementById('guestCount').textContent = numberOfGuests;
        document.getElementById('pricePerPersonPerNight').textContent = `LKR ${pricePerPersonPerNight.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
        document.getElementById('nightsCount').textContent = nights;
        document.getElementById('totalPrice').textContent = `LKR ${total.toLocaleString()}`;
        document.getElementById('priceCalculation').style.display = 'block';
    }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Get form data
    const formData = {
        guestName: document.getElementById('guestName').value,
        email: document.getElementById('email').value,
        contactNumber: document.getElementById('contactNumber').value,
        numberOfGuests: parseInt(document.getElementById('numberOfGuests').value),
        address: document.getElementById('address').value,
        roomType: document.getElementById('roomType').value,
        checkInDate: document.getElementById('checkInDate').value,
        checkOutDate: document.getElementById('checkOutDate').value,
        specialRequests: document.getElementById('specialRequests').value || null
    };
    
    // Validate dates
    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);
    
    if (checkOutDate <= checkInDate) {
        showError('Check-out date must be after check-in date');
        return;
    }
    
    // Validate contact number
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
        showError('Contact number must be exactly 10 digits');
        return;
    }
    
    try {
        // Change button text
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Debug: Log token and role
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        console.log('Submitting reservation with role:', role);
        console.log('Token exists:', !!token);
        
        const response = await fetch('https://jewell-unperilous-gaily.ngrok-free.dev/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server error (${response.status}): ${text || response.statusText}`);
        }
        
        if (response.ok && data.success) {
            showSuccess(`Reservation request submitted successfully! Your reservation number is: ${data.data.reservationNumber}. Our team will contact you shortly to confirm.`);
            document.getElementById('bookingForm').reset();
            document.getElementById('priceCalculation').style.display = 'none';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            showError(data.message || 'Failed to submit reservation request. Please try again.');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Booking error:', error);
        showError('An unexpected error occurred: ' + (error.message || 'Unable to connect to server. Please try again later.'));
        
        // Reset button
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.textContent = 'Submit Reservation Request';
        submitBtn.disabled = false;
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.customer-nav');
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    // Add scrolled class to nav
    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});


// ============================================
// ROOMS CAROUSEL SCROLL FUNCTIONALITY
// ============================================
let roomsAutoScrollInterval;
let currentRoomIndex = 0;

function scrollRooms(direction) {
    const carousel = document.getElementById('roomsCarousel');
    const cardWidth = 380 + 32; // card width + gap
    const scrollAmount = cardWidth * direction;
    
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function autoScrollRooms() {
    const carousel = document.getElementById('roomsCarousel');
    if (!carousel) return;
    
    const cardWidth = 380 + 32; // card width + gap
    const totalCards = carousel.children.length;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    currentRoomIndex++;
    
    // Reset to beginning if reached the end
    if (currentRoomIndex >= totalCards) {
        currentRoomIndex = 0;
        carousel.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
    } else {
        carousel.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    }
}

function startRoomsAutoScroll() {
    // Auto-scroll every 4 seconds
    roomsAutoScrollInterval = setInterval(autoScrollRooms, 4000);
}

function stopRoomsAutoScroll() {
    clearInterval(roomsAutoScrollInterval);
}

// Add touch swipe support for rooms carousel
document.addEventListener('DOMContentLoaded', function() {
    const roomsCarousel = document.getElementById('roomsCarousel');
    if (!roomsCarousel) return;
    
    // Start auto-scrolling
    startRoomsAutoScroll();
    
    // Pause auto-scroll on hover
    roomsCarousel.addEventListener('mouseenter', stopRoomsAutoScroll);
    roomsCarousel.addEventListener('mouseleave', startRoomsAutoScroll);
    
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    
    roomsCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - roomsCarousel.offsetLeft;
        scrollLeft = roomsCarousel.scrollLeft;
        roomsCarousel.style.cursor = 'grabbing';
        stopRoomsAutoScroll();
    });
    
    roomsCarousel.addEventListener('mouseleave', () => {
        isDown = false;
        roomsCarousel.style.cursor = 'grab';
    });
    
    roomsCarousel.addEventListener('mouseup', () => {
        isDown = false;
        roomsCarousel.style.cursor = 'grab';
        setTimeout(startRoomsAutoScroll, 3000); // Resume after 3 seconds
    });
    
    roomsCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - roomsCarousel.offsetLeft;
        const walk = (x - startX) * 2;
        roomsCarousel.scrollLeft = scrollLeft - walk;
    });
    
    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;
    
    roomsCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = roomsCarousel.scrollLeft;
        stopRoomsAutoScroll();
    }, { passive: true });
    
    roomsCarousel.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 1.5;
        roomsCarousel.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });
    
    roomsCarousel.addEventListener('touchend', () => {
        setTimeout(startRoomsAutoScroll, 3000); // Resume after 3 seconds
    }, { passive: true });
});


// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

// Check for saved dark mode preference or default to light mode
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon();
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
    
    updateDarkModeIcon();
}

// Update dark mode icon
function updateDarkModeIcon() {
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (!darkModeBtn) return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        // Sun icon for light mode
        darkModeBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
    } else {
        // Moon icon for dark mode
        darkModeBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});
