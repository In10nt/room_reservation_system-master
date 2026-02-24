// Update new reservations count
function updateNewReservationsCount(reservations) {
    // Count CONFIRMED reservations (new requests)
    const newReservations = reservations.filter(r => r.status === 'CONFIRMED');
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
        if (newReservations.length > 0) {
            badge.textContent = newReservations.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
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
            
            // Update new reservations count
            updateNewReservationsCount(reservations);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    
    // Refresh stats every 30 seconds
    setInterval(loadDashboardStats, 30000);
});
