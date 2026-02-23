// Customer Portal JavaScript

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================
let currentSlide = 0;
let autoplayInterval;
const slides = [];
const indicators = [];

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
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
    document.getElementById('roomType').value = roomType;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    calculatePrice();
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
        
        const response = await fetch('/api/reservations/public', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
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
        showError('Unable to connect to server. Please try again later.');
        
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
