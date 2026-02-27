// Load reports
async function loadReports() {
    console.log('Loading reports...');
    console.log('API URL:', API_BASE_URL);
    console.log('Token exists:', !!localStorage.getItem('token'));
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Response data:', data);
            
            const reservations = data.data || [];
            console.log('Reservations count:', reservations.length);
            
            if (reservations.length === 0) {
                showNoDataMessage();
            } else {
                // Calculate statistics
                calculateStatistics(reservations);
                calculateRevenue(reservations);
                displayRecentReservations(reservations);
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            showErrorMessage(`Failed to load reports: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        showErrorMessage('Failed to connect to server. Please ensure the backend is running.');
    }
}

// Show no data message
function showNoDataMessage() {
    const tbody = document.getElementById('recentReservations');
    tbody.innerHTML = `
        <tr>
            <td colspan="11" style="text-align: center; padding: 2rem; color: #666;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>No Reservations Found</h3>
                <p>There are no reservations in the system yet.</p>
                <p>Create a new reservation to see data here.</p>
            </td>
        </tr>
    `;
    
    // Set all stats to 0
    document.getElementById('totalBookings').textContent = '0';
    document.getElementById('confirmedCount').textContent = '0';
    document.getElementById('checkedInCount').textContent = '0';
    document.getElementById('cancelledCount').textContent = '0';
    document.getElementById('totalReservationsCount').textContent = '(0)';
    
    // Clear revenue table
    document.getElementById('revenueTable').innerHTML = `
        <tr>
            <td colspan="3" style="text-align: center; padding: 1rem; color: #666;">
                No revenue data available
            </td>
        </tr>
    `;
}

// Show error message
function showErrorMessage(message) {
    const tbody = document.getElementById('recentReservations');
    tbody.innerHTML = `
        <tr>
            <td colspan="11" style="text-align: center; padding: 2rem; color: #e74c3c;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3>Error Loading Reports</h3>
                <p>${message}</p>
                <button onclick="loadReports()" class="btn btn-primary" style="margin-top: 1rem;">
                    Try Again
                </button>
            </td>
        </tr>
    `;
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

// Download report as CSV
function downloadReportCSV() {
    console.log('Downloading report as CSV...');
    
    // Get all reservations from the table
    const table = document.querySelector('#recentReservations');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length === 0) {
        alert('No data to download');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Reservation Number,Guest Name,Email,Contact Number,Room Type,Check-in Date,Check-out Date,Nights,Guests,Total Amount,Status\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const rowData = [];
            cells.forEach((cell, index) => {
                // Skip the status badge HTML, get text only
                let text = cell.textContent.trim();
                // Escape commas and quotes
                if (text.includes(',') || text.includes('"')) {
                    text = '"' + text.replace(/"/g, '""') + '"';
                }
                rowData.push(text);
            });
            csvContent += rowData.join(',') + '\n';
        }
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Ocean_View_Resort_Report_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('CSV download initiated');
}

// Download detailed report with statistics
async function downloadDetailedReport() {
    console.log('Downloading detailed report...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservations = data.data || [];
            
            if (reservations.length === 0) {
                alert('No data to download');
                return;
            }
            
            // Calculate statistics
            const total = reservations.length;
            const confirmed = reservations.filter(r => r.status === 'CONFIRMED').length;
            const checkedIn = reservations.filter(r => r.status === 'CHECKED_IN').length;
            const checkedOut = reservations.filter(r => r.status === 'CHECKED_OUT').length;
            const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
            
            // Calculate revenue by room type
            const revenueByType = {};
            const countByType = {};
            let totalRevenue = 0;
            
            reservations.forEach(reservation => {
                const roomType = reservation.roomType;
                const amount = reservation.totalAmount || 0;
                totalRevenue += amount;
                
                if (!revenueByType[roomType]) {
                    revenueByType[roomType] = 0;
                    countByType[roomType] = 0;
                }
                
                revenueByType[roomType] += amount;
                countByType[roomType]++;
            });
            
            // Create detailed CSV content
            const date = new Date().toLocaleDateString('en-GB');
            let csvContent = `Ocean View Resort - Detailed Report\n`;
            csvContent += `Generated on: ${date}\n\n`;
            
            csvContent += `RESERVATION STATISTICS\n`;
            csvContent += `Total Bookings,${total}\n`;
            csvContent += `Confirmed,${confirmed}\n`;
            csvContent += `Checked In,${checkedIn}\n`;
            csvContent += `Checked Out,${checkedOut}\n`;
            csvContent += `Cancelled,${cancelled}\n\n`;
            
            csvContent += `REVENUE SUMMARY\n`;
            csvContent += `Room Type,Bookings,Total Revenue\n`;
            Object.keys(revenueByType).forEach(roomType => {
                csvContent += `${roomType},${countByType[roomType]},LKR ${revenueByType[roomType].toFixed(2)}\n`;
            });
            csvContent += `TOTAL REVENUE,,LKR ${totalRevenue.toFixed(2)}\n\n`;
            
            csvContent += `ALL RESERVATIONS\n`;
            csvContent += `Reservation Number,Guest Name,Email,Contact Number,Room Type,Check-in Date,Check-out Date,Nights,Guests,Total Amount,Status\n`;
            
            // Sort by ID descending
            const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);
            
            sortedReservations.forEach(reservation => {
                const row = [
                    reservation.reservationNumber,
                    reservation.guestName,
                    reservation.email || '',
                    reservation.contactNumber,
                    reservation.roomType,
                    formatDate(reservation.checkInDate),
                    formatDate(reservation.checkOutDate),
                    reservation.numberOfNights,
                    reservation.numberOfGuests || '',
                    `LKR ${reservation.totalAmount.toFixed(2)}`,
                    reservation.status
                ];
                
                // Escape commas and quotes
                const escapedRow = row.map(cell => {
                    const text = String(cell);
                    if (text.includes(',') || text.includes('"')) {
                        return '"' + text.replace(/"/g, '""') + '"';
                    }
                    return text;
                });
                
                csvContent += escapedRow.join(',') + '\n';
            });
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const downloadDate = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `Ocean_View_Resort_Detailed_Report_${downloadDate}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Detailed report download initiated');
        } else {
            alert('Failed to load data for report');
        }
    } catch (error) {
        console.error('Error downloading report:', error);
        alert('Failed to download report. Please try again.');
    }
}

// Load reports on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});
