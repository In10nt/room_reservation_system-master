// Load reports
async function loadReports() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservations = data.data || [];
            
            // Calculate statistics
            calculateStatistics(reservations);
            calculateRevenue(reservations);
            displayRecentReservations(reservations);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Calculate statistics
function calculateStatistics(reservations) {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'CONFIRMED').length;
    const checkedIn = reservations.filter(r => r.status === 'CHECKED_IN').length;
    const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
    
    document.getElementById('totalBookings').textContent = total;
    document.getElementById('confirmedCount').textContent = confirmed;
    document.getElementById('checkedInCount').textContent = checkedIn;
    document.getElementById('cancelledCount').textContent = cancelled;
}

// Calculate revenue by room type
function calculateRevenue(reservations) {
    const revenueByType = {};
    const countByType = {};
    
    reservations.forEach(reservation => {
        const roomType = reservation.roomType;
        const amount = reservation.totalAmount || 0;
        
        if (!revenueByType[roomType]) {
            revenueByType[roomType] = 0;
            countByType[roomType] = 0;
        }
        
        revenueByType[roomType] += amount;
        countByType[roomType]++;
    });
    
    const tbody = document.getElementById('revenueTable');
    tbody.innerHTML = '';
    
    Object.keys(revenueByType).forEach(roomType => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${roomType}</td>
            <td>${countByType[roomType]}</td>
            <td>${formatCurrency(revenueByType[roomType])}</td>
        `;
        tbody.appendChild(row);
    });
}

// Display recent reservations
function displayRecentReservations(reservations) {
    const tbody = document.getElementById('recentReservations');
    tbody.innerHTML = '';
    
    // Sort by ID descending (newest first) and show ALL reservations
    const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);
    
    sortedReservations.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.reservationNumber}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.email}</td>
            <td>${reservation.contactNumber}</td>
            <td>${reservation.roomType}</td>
            <td>${formatDate(reservation.checkInDate)}</td>
            <td>${formatDate(reservation.checkOutDate)}</td>
            <td>${reservation.numberOfNights}</td>
            <td>${reservation.numberOfGuests}</td>
            <td>${formatCurrency(reservation.totalAmount)}</td>
            <td>${getStatusBadge(reservation.status)}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update total count
    document.getElementById('totalReservationsCount').textContent = sortedReservations.length;
}

// Print report
function printReport() {
    window.print();
}

// Load reports on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});
