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
            <td colspan="13" style="text-align: center; padding: 2rem; color: #666;">
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
            <td colspan="13" style="text-align: center; padding: 2rem; color: #e74c3c;">
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
            <td>${reservation.address || 'N/A'}</td>
            <td>${reservation.email || 'N/A'}</td>
            <td>${reservation.contactNumber}</td>
            <td>${reservation.roomType}</td>
            <td>${formatDate(reservation.checkInDate)}</td>
            <td>${formatDate(reservation.checkOutDate)}</td>
            <td>${reservation.numberOfNights}</td>
            <td>${reservation.numberOfGuests || 'N/A'}</td>
            <td>${reservation.specialRequests || 'None'}</td>
            <td>${formatCurrency(reservation.totalAmount)}</td>
            <td>${getStatusBadge(reservation.status)}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update total count
    document.getElementById('totalReservationsCount').textContent = `(${sortedReservations.length})`;
}

// Download report as PDF
function downloadPDF() {
    console.log('Downloading report as PDF...');
    
    // Use browser's print to PDF functionality
    // This is the most reliable cross-browser method
    alert('To save as PDF:\n\n1. Click OK\n2. In the print dialog, select "Save as PDF" or "Microsoft Print to PDF"\n3. Choose save location\n4. Click Save');
    
    window.print();
}

// Download report as Excel
async function downloadExcel() {
    console.log('Downloading report as Excel...');
    
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
            
            // Create Excel-compatible HTML
            let htmlContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta charset="utf-8">
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>Ocean View Report</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #667eea; color: white; font-weight: bold; }
                        .header { font-size: 18pt; font-weight: bold; margin-bottom: 10px; }
                        .section-title { font-size: 14pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; background-color: #f0f0f0; padding: 5px; }
                        .stat-table td { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <div class="header">Ocean View Resort - Management Report</div>
                    <div>Generated on: ${new Date().toLocaleDateString('en-GB')}</div>
                    <br>
                    
                    <div class="section-title">RESERVATION STATISTICS</div>
                    <table class="stat-table">
                        <tr><td><b>Total Bookings</b></td><td>${total}</td></tr>
                        <tr><td><b>Confirmed</b></td><td>${confirmed}</td></tr>
                        <tr><td><b>Checked In</b></td><td>${checkedIn}</td></tr>
                        <tr><td><b>Checked Out</b></td><td>${checkedOut}</td></tr>
                        <tr><td><b>Cancelled</b></td><td>${cancelled}</td></tr>
                    </table>
                    <br>
                    
                    <div class="section-title">REVENUE SUMMARY</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Room Type</th>
                                <th>Bookings</th>
                                <th>Total Revenue (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            Object.keys(revenueByType).forEach(roomType => {
                htmlContent += `
                    <tr>
                        <td>${roomType}</td>
                        <td>${countByType[roomType]}</td>
                        <td>${revenueByType[roomType].toFixed(2)}</td>
                    </tr>
                `;
            });
            
            htmlContent += `
                            <tr style="background-color: #f0f0f0; font-weight: bold;">
                                <td>TOTAL</td>
                                <td>${total}</td>
                                <td>${totalRevenue.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    
                    <div class="section-title">ALL RESERVATIONS</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Reservation #</th>
                                <th>Guest Name</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Room Type</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Nights</th>
                                <th>Guests</th>
                                <th>Special Requests</th>
                                <th>Amount (LKR)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            // Sort by ID descending
            const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);
            
            sortedReservations.forEach(reservation => {
                htmlContent += `
                    <tr>
                        <td>${reservation.reservationNumber}</td>
                        <td>${reservation.guestName}</td>
                        <td>${reservation.address || 'N/A'}</td>
                        <td>${reservation.email || 'N/A'}</td>
                        <td>${reservation.contactNumber}</td>
                        <td>${reservation.roomType}</td>
                        <td>${formatDate(reservation.checkInDate)}</td>
                        <td>${formatDate(reservation.checkOutDate)}</td>
                        <td>${reservation.numberOfNights}</td>
                        <td>${reservation.numberOfGuests || 'N/A'}</td>
                        <td>${reservation.specialRequests || 'None'}</td>
                        <td>${reservation.totalAmount.toFixed(2)}</td>
                        <td>${reservation.status}</td>
                    </tr>
                `;
            });
            
            htmlContent += `
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            
            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const downloadDate = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `Ocean_View_Resort_Report_${downloadDate}.xls`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Excel download initiated');
        } else {
            alert('Failed to load data for report');
        }
    } catch (error) {
        console.error('Error downloading Excel:', error);
        alert('Failed to download Excel report. Please try again.');
    }
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
    
    // Create CSV content with ALL fields
    let csvContent = 'Reservation Number,Guest Name,Address,Email,Contact Number,Room Type,Check-in Date,Check-out Date,Nights,Guests,Special Requests,Total Amount,Status\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const rowData = [];
            cells.forEach((cell, index) => {
                // Skip the status badge HTML, get text only
                let text = cell.textContent.trim();
                // Escape commas and quotes
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
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
            csvContent += `Reservation Number,Guest Name,Address,Email,Contact Number,Room Type,Check-in Date,Check-out Date,Nights,Guests,Special Requests,Total Amount,Status\n`;
            
            // Sort by ID descending
            const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);
            
            sortedReservations.forEach(reservation => {
                const row = [
                    reservation.reservationNumber,
                    reservation.guestName,
                    reservation.address || 'N/A',
                    reservation.email || 'N/A',
                    reservation.contactNumber,
                    reservation.roomType,
                    formatDate(reservation.checkInDate),
                    formatDate(reservation.checkOutDate),
                    reservation.numberOfNights,
                    reservation.numberOfGuests || 'N/A',
                    reservation.specialRequests || 'None',
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
    setReportDateTime();
});

// Set report date and time
function setReportDateTime() {
    const now = new Date();
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedDateTime = now.toLocaleString('en-US', dateOptions);
    
    const dateTimeElement = document.getElementById('reportDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = formattedDateTime;
    }
}

// Show date/time before printing
window.addEventListener('beforeprint', function() {
    const reportInfo = document.getElementById('reportGeneratedInfo');
    if (reportInfo) {
        reportInfo.style.display = 'block';
    }
    setReportDateTime(); // Update to current time
});

// Hide date/time after printing
window.addEventListener('afterprint', function() {
    const reportInfo = document.getElementById('reportGeneratedInfo');
    if (reportInfo) {
        reportInfo.style.display = 'none';
    }
});
