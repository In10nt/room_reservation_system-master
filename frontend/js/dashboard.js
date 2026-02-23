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
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
});
