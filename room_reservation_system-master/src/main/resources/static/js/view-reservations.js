let allReservations = [];

// Load all reservations
async function loadReservations() {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('reservationsTable').style.display = 'none';
    document.getElementById('noReservations').style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            allReservations = data.data || [];
            
            document.getElementById('loadingMessage').style.display = 'none';
            
            if (allReservations.length === 0) {
                document.getElementById('noReservations').style.display = 'block';
            } else {
                displayReservations(allReservations);
            }
        } else {
            throw new Error('Failed to load reservations');
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        document.getElementById('loadingMessage').style.display = 'none';
        showError('errorMessage', 'Unable to load reservations. Please try again.');
    }
}

// Display reservations in table
function displayReservations(reservations) {
    const tbody = document.getElementById('reservationsBody');
    tbody.innerHTML = '';
    
    reservations.forEach(reservation => {
        const row = document.createElement('tr');
        
        // Generate action buttons based on status
        let actionButtons = `<button onclick="viewDetails('${reservation.reservationNumber}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">View</button>`;
        
        if (reservation.status === 'CONFIRMED') {
            actionButtons += `<button onclick="checkIn('${reservation.reservationNumber}')" class="btn btn-success" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Check In</button>`;
            actionButtons += `<button onclick="editReservation('${reservation.reservationNumber}')" class="btn btn-warning" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Edit</button>`;
            actionButtons += `<button onclick="deleteReservation('${reservation.reservationNumber}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem; background: #dc3545;">Delete</button>`;
        } else if (reservation.status === 'CHECKED_IN') {
            actionButtons += `<button onclick="checkOut('${reservation.reservationNumber}')" class="btn btn-warning" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Check Out</button>`;
        }
        
        row.innerHTML = `
            <td>${reservation.reservationNumber}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.contactNumber}</td>
            <td>${reservation.roomType}</td>
            <td>${formatDate(reservation.checkInDate)}</td>
            <td>${formatDate(reservation.checkOutDate)}</td>
            <td>${reservation.numberOfNights}</td>
            <td>${formatCurrency(reservation.totalAmount)}</td>
            <td>${getStatusBadge(reservation.status)}</td>
            <td style="white-space: nowrap;">
                ${actionButtons}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('reservationsTable').style.display = 'block';
}

// Filter reservations by status
function filterReservations() {
    const statusFilter = document.getElementById('statusFilter').value;
    
    if (statusFilter === '') {
        displayReservations(allReservations);
    } else {
        const filtered = allReservations.filter(r => r.status === statusFilter);
        displayReservations(filtered);
    }
}

// View reservation details
async function viewDetails(reservationNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservation = data.data;
            
            const detailsHTML = `
                <div class="reservation-details">
                    <p><strong>Reservation Number:</strong> ${reservation.reservationNumber}</p>
                    <p><strong>Guest Name:</strong> ${reservation.guestName}</p>
                    <p><strong>Address:</strong> ${reservation.address}</p>
                    <p><strong>Contact Number:</strong> ${reservation.contactNumber}</p>
                    <p><strong>Email:</strong> ${reservation.email}</p>
                    <p><strong>Room Type:</strong> ${reservation.roomType}</p>
                    <p><strong>Check-in Date:</strong> ${formatDate(reservation.checkInDate)}</p>
                    <p><strong>Check-out Date:</strong> ${formatDate(reservation.checkOutDate)}</p>
                    <p><strong>Number of Nights:</strong> ${reservation.numberOfNights}</p>
                    <p><strong>Number of Guests:</strong> ${reservation.numberOfGuests}</p>
                    <p><strong>Special Requests:</strong> ${reservation.specialRequests || 'None'}</p>
                    <p><strong>Total Amount:</strong> ${formatCurrency(reservation.totalAmount)}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(reservation.status)}</p>
                </div>
            `;
            
            document.getElementById('reservationDetails').innerHTML = detailsHTML;
            document.getElementById('detailsModal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading reservation details:', error);
        alert('Unable to load reservation details');
    }
}

// Close modal
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Check in a reservation
async function checkIn(reservationNumber) {
    if (!confirm(`Check in guest for reservation ${reservationNumber}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}/status?status=CHECKED_IN`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            alert('Guest checked in successfully!');
            loadReservations(); // Reload the list
        } else {
            const error = await response.json();
            alert('Failed to check in: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error checking in:', error);
        alert('Unable to check in. Please try again.');
    }
}

// Check out a reservation
async function checkOut(reservationNumber) {
    if (!confirm(`Check out guest for reservation ${reservationNumber}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}/status?status=CHECKED_OUT`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            alert('Guest checked out successfully!');
            loadReservations(); // Reload the list
        } else {
            const error = await response.json();
            alert('Failed to check out: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error checking out:', error);
        alert('Unable to check out. Please try again.');
    }
}

// Load reservations on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
});

// Edit reservation
async function editReservation(reservationNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservation = data.data;
            
            // Store reservation data in sessionStorage for editing
            sessionStorage.setItem('editReservation', JSON.stringify(reservation));
            
            // Redirect to add-reservation page with edit mode
            window.location.href = `add-reservation.html?edit=${reservationNumber}`;
        }
    } catch (error) {
        console.error('Error loading reservation for edit:', error);
        alert('Unable to load reservation for editing');
    }
}

// Delete reservation
async function deleteReservation(reservationNumber) {
    if (!confirm(`Are you sure you want to delete reservation ${reservationNumber}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            alert('Reservation deleted successfully!');
            loadReservations(); // Reload the list
        } else {
            const error = await response.json();
            alert('Failed to delete reservation: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Unable to delete reservation. Please try again.');
    }
}
