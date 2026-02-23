// Search reservations
async function searchReservations() {
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (!searchInput) {
        alert('Please enter a guest name to search');
        return;
    }
    
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/search?name=${encodeURIComponent(searchInput)}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservations = data.data || [];
            
            if (reservations.length === 0) {
                document.getElementById('noResults').style.display = 'block';
            } else {
                displaySearchResults(reservations);
            }
        } else {
            throw new Error('Search failed');
        }
    } catch (error) {
        console.error('Error searching reservations:', error);
        showError('errorMessage', 'Unable to search reservations. Please try again.');
    }
}

// Display search results
function displaySearchResults(reservations) {
    const tbody = document.getElementById('searchResultsBody');
    tbody.innerHTML = '';
    
    reservations.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.reservationNumber}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.contactNumber}</td>
            <td>${reservation.roomType}</td>
            <td>${formatDate(reservation.checkInDate)}</td>
            <td>${formatDate(reservation.checkOutDate)}</td>
            <td>${getStatusBadge(reservation.status)}</td>
            <td>
                <button onclick="viewReservation('${reservation.reservationNumber}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('searchResults').style.display = 'block';
}

// View reservation (redirect to view page)
function viewReservation(reservationNumber) {
    window.location.href = `view-reservations.html?reservation=${reservationNumber}`;
}

// Handle Enter key press in search input
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        searchReservations();
    }
}
