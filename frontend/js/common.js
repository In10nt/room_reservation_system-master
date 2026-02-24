// API Base URL
const API_BASE_URL = 'https://jewell-unperilous-gaily.ngrok-free.dev/api';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Display user info
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const fullName = localStorage.getItem('fullName') || username;
        const role = localStorage.getItem('role') || '';
        userInfoElement.textContent = `${fullName} (${role})`;
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Format currency
function formatCurrency(amount) {
    if (!amount) return 'LKR 0';
    return `LKR ${parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClasses = {
        'CONFIRMED': 'status-confirmed',
        'CHECKED_IN': 'status-checked-in',
        'CHECKED_OUT': 'status-checked-out',
        'CANCELLED': 'status-cancelled',
        'NO_SHOW': 'status-cancelled'
    };
    
    const statusClass = statusClasses[status] || 'status-confirmed';
    return `<span class="status-badge ${statusClass}">${status.replace('_', ' ')}</span>`;
}

// Calculate nights between dates
function calculateNights(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get room rate
function getRoomRate(roomType) {
    const rates = {
        'STANDARD': 5000,
        'DELUXE': 8000,
        'SUITE': 12000,
        'FAMILY': 15000,
        'PRESIDENTIAL': 25000
    };
    return rates[roomType] || 0;
}

// Calculate total amount
function calculateTotalAmount(roomType, checkIn, checkOut) {
    const nights = calculateNights(checkIn, checkOut);
    const rate = getRoomRate(roomType);
    return nights * rate;
}

// Initialize page (check auth on page load)
document.addEventListener('DOMContentLoaded', function() {
    // Only check auth if not on login page
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
    }
});
