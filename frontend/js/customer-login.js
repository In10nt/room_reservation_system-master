// API Base URL
const API_BASE_URL = 'https://jewell-unperilous-gaily.ngrok-free.dev/api';

// Preserve room type in register link
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room');
    
    if (roomType) {
        const registerLink = document.querySelector('a[href="customer-register.html"]');
        if (registerLink) {
            registerLink.href = `customer-register.html?room=${roomType}`;
        }
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous error
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Check if user is a guest
            if (data.data.role !== 'GUEST') {
                errorMessage.textContent = 'This login is for guests only. Staff please use admin login.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Store user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('fullName', data.data.fullName);
            localStorage.setItem('email', data.data.email || '');
            localStorage.setItem('contactNumber', data.data.contactNumber || '');
            localStorage.setItem('address', data.data.address || '');
            localStorage.setItem('role', data.data.role);
            
            // Check if there's a return URL or room type in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('return');
            const roomType = urlParams.get('room');
            
            // Redirect to booking page
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if (roomType) {
                window.location.href = `booking.html?room=${roomType}`;
            } else {
                window.location.href = 'booking.html';
            }
        } else {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Unable to connect to server. Please try again.';
        errorMessage.style.display = 'block';
    }
});
