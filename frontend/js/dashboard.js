// Check for new reservations
async function checkNewReservations() {
    try {
        const lastCheckTime = localStorage.getItem('lastReservationCheck') || '0';
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservations = data.data || [];
            
            // Count new reservations since last check
            const newReservations = reservations.filter(r => r.id > parseInt(lastCheckTime));
            
            if (newReservations.length > 0) {
                showNotificationBadge(newReservations.length);
            }
        }
    } catch (error) {
        console.error('Error checking new reservations:', error);
    }
}

// Show notification badge
function showNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    }
}

// Clear notification badge
function clearNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservations = data.data || [];
            
            // Calculate statistics
            const total = reservations.length;
            const confirmed = reservations.filter(r => r.status === 'CONFIRMED').length;
            const checkedIn = reservations.filter(r => r.status === 'CHECKED_IN').length;
            const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
            
            // Update UI
            document.getElementById('totalReservations').textContent = total;
            document.getElementById('confirmedReservations').textContent = confirmed;
            document.getElementById('checkedInReservations').textContent = checkedIn;
            document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
            
            // Check for new reservations
            checkNewReservations();
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    
    // Check for new reservations every 30 seconds
    setInterval(checkNewReservations, 30000);
});
