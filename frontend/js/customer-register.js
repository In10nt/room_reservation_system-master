// API Base URL
const API_BASE_URL = 'https://jewell-unperilous-gaily.ngrok-free.dev/api';

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const address = document.getElementById('address').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validate contact number
    if (!/^[0-9]{10}$/.test(contactNumber)) {
        errorMessage.textContent = 'Contact number must be exactly 10 digits';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                username,
                password,
                fullName,
                email,
                contactNumber,
                address
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Store user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('fullName', data.data.fullName);
            localStorage.setItem('role', data.data.role);
            
            successMessage.textContent = 'Registration successful! Redirecting...';
            successMessage.style.display = 'block';
            
            // Redirect to booking page
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 1500);
        } else {
            errorMessage.textContent = data.message || 'Registration failed. Please try again.';
            errorMessage.style.display = 'block';
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = 'Unable to connect to server. Please try again.';
        errorMessage.style.display = 'block';
        
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.textContent = 'Register';
        submitBtn.disabled = false;
    }
});
