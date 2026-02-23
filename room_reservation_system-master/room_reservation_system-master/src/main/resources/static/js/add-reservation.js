// Set minimum dates
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').setAttribute('min', today);
    document.getElementById('checkOutDate').setAttribute('min', today);
    
    // Add event listeners for date and room type changes
    document.getElementById('checkInDate').addEventListener('change', updateCalculation);
    document.getElementById('checkOutDate').addEventListener('change', updateCalculation);
    document.getElementById('roomType').addEventListener('change', updateCalculation);
    document.getElementById('numberOfGuests').addEventListener('change', updateCalculation);
    
    // Check if editing
    const urlParams = new URLSearchParams(window.location.search);
    const editReservationNumber = urlParams.get('edit');
    
    if (editReservationNumber) {
        loadReservationForEdit(editReservationNumber);
    }
});

// Room type pricing
const roomPrices = {
    'STANDARD': 5000,
    'DELUXE': 8000,
    'SUITE': 12000,
    'FAMILY': 15000,
    'PRESIDENTIAL': 25000
};

// Update calculation
function updateCalculation() {
    const roomType = document.getElementById('roomType').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const numberOfGuests = parseInt(document.getElementById('numberOfGuests').value) || 1;
    
    if (roomType && checkIn && checkOut) {
        const nights = calculateNights(checkIn, checkOut);
        const pricePerNight = roomPrices[roomType];
        const pricePerPersonPerNight = pricePerNight / numberOfGuests;
        const total = pricePerNight * nights;
        
        document.getElementById('pricePerNight').textContent = formatCurrency(pricePerNight);
        document.getElementById('displayGuests').textContent = numberOfGuests;
        document.getElementById('pricePerPersonPerNight').textContent = formatCurrency(pricePerPersonPerNight);
        document.getElementById('numberOfNights').textContent = nights;
        document.getElementById('totalAmount').textContent = formatCurrency(total);
        document.getElementById('calculatedAmount').style.display = 'block';
    }
}

// Reset form
function resetForm() {
    document.getElementById('reservationForm').reset();
    document.getElementById('calculatedAmount').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Handle form submission
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        guestName: document.getElementById('guestName').value,
        address: document.getElementById('address').value,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value,
        roomType: document.getElementById('roomType').value,
        checkInDate: document.getElementById('checkInDate').value,
        checkOutDate: document.getElementById('checkOutDate').value,
        numberOfGuests: parseInt(document.getElementById('numberOfGuests').value),
        specialRequests: document.getElementById('specialRequests').value
    };
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const editReservationNumber = urlParams.get('edit');
        
        let url = `${API_BASE_URL}/reservations`;
        let method = 'POST';
        let successMessage = 'Reservation created successfully!';
        
        if (editReservationNumber) {
            url = `${API_BASE_URL}/reservations/${editReservationNumber}`;
            method = 'PUT';
            successMessage = 'Reservation updated successfully!';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showSuccess('successMessage', `${successMessage} Reservation Number: ${data.data.reservationNumber}`);
            setTimeout(() => {
                window.location.href = 'view-reservations.html';
            }, 2000);
        } else {
            showError('errorMessage', data.message || 'Failed to save reservation');
        }
    } catch (error) {
        console.error('Error saving reservation:', error);
        showError('errorMessage', 'Unable to save reservation. Please try again.');
    }
});


// Load reservation for editing
async function loadReservationForEdit(reservationNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            const reservation = data.data;
            
            // Update page title
            document.getElementById('pageTitle').textContent = `Edit Reservation - ${reservationNumber}`;
            document.getElementById('submitBtn').textContent = 'Update Reservation';
            
            // Populate form with current data
            document.getElementById('guestName').value = reservation.guestName;
            document.getElementById('address').value = reservation.address;
            document.getElementById('contactNumber').value = reservation.contactNumber;
            document.getElementById('email').value = reservation.email;
            document.getElementById('roomType').value = reservation.roomType;
            document.getElementById('checkInDate').value = reservation.checkInDate;
            document.getElementById('checkOutDate').value = reservation.checkOutDate;
            document.getElementById('numberOfGuests').value = reservation.numberOfGuests;
            document.getElementById('specialRequests').value = reservation.specialRequests || '';
            
            // Trigger calculation to show current pricing
            updateCalculation();
        } else {
            showError('errorMessage', 'Failed to load reservation for editing');
        }
    } catch (error) {
        console.error('Error loading reservation:', error);
        showError('errorMessage', 'Unable to load reservation. Please try again.');
    }
}
