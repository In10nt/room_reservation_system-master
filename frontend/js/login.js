// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const selectedRole = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous error
    errorMessage.style.display = 'none';
    
    // Validate role selection
    if (!selectedRole) {
        errorMessage.textContent = 'Please select your role first';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validate no spaces in username or password
    if (username.includes(' ') || password.includes(' ')) {
        errorMessage.textContent = 'Username and password cannot contain spaces';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('https://jewell-unperilous-gaily.ngrok-free.dev/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Check if the user's role matches the selected role
            if (data.data.role !== selectedRole) {
                errorMessage.textContent = `Access denied. These credentials are not valid for ${selectedRole} role.`;
                errorMessage.style.display = 'block';
                return;
            }
            
            // Store user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('fullName', data.data.fullName);
            localStorage.setItem('role', data.data.role);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password for the selected role';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Unable to connect to server. Please try again.';
        errorMessage.style.display = 'block';
    }
});
