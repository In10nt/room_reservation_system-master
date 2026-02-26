// EmailJS Configuration
// Replace these with your EmailJS credentials from https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'KNbxeKMVPoi2pxoqa';
const EMAILJS_SERVICE_ID = 'service_5ocwwbk';
const EMAILJS_TEMPLATE_ID = 'template_ypgz73l';

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            console.log('EmailJS initialized successfully');
            console.log('Service ID:', EMAILJS_SERVICE_ID);
            console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    } else {
        console.error('EmailJS library not loaded. Check internet connection.');
    }
});

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
    
    // Sort reservations by ID descending (newest first)
    const sortedReservations = [...reservations].sort((a, b) => b.id - a.id);
    
    sortedReservations.forEach(reservation => {
        const row = document.createElement('tr');
        
        // Generate action buttons based on status
        let actionButtons = `<button onclick="viewDetails('${reservation.reservationNumber}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">View</button>`;
        
        if (reservation.status === 'CONFIRMED') {
            actionButtons += `<button onclick="checkIn('${reservation.reservationNumber}')" class="btn btn-success" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Check In</button>`;
            actionButtons += `<button onclick="editReservation('${reservation.reservationNumber}')" class="btn btn-warning" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Edit</button>`;
            actionButtons += `<button onclick="deleteReservation('${reservation.reservationNumber}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem; background: #dc3545;">Delete</button>`;
        } else if (reservation.status === 'CHECKED_IN') {
            actionButtons += `<button onclick="checkOut('${reservation.reservationNumber}')" class="btn btn-warning" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">Check Out</button>`;
        } else if (reservation.status === 'CHECKED_OUT') {
            actionButtons += `<button onclick="viewBillHistory('${reservation.reservationNumber}')" class="btn btn-success" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0.2rem;">View Bill</button>`;
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
        // First, get the reservation details
        const detailsResponse = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}`, {
            headers: getAuthHeaders()
        });
        
        if (!detailsResponse.ok) {
            throw new Error('Failed to load reservation details');
        }
        
        const detailsData = await detailsResponse.json();
        const reservation = detailsData.data;
        
        // Update status to checked out
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}/status?status=CHECKED_OUT`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            alert('Guest checked out successfully!');
            
            // Show bill options
            showBillOptions(reservation, false);
            
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

// Show bill options modal
function showBillOptions(reservation) {
    const billHTML = generateBillHTML(reservation);
    
    const modalHTML = `
        <div id="billModal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close" onclick="closeBillModal()">&times;</span>
                <h2>Checkout Bill</h2>
                <div id="billContent">
                    ${billHTML}
                </div>
                <div class="modal-actions" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="printBill()" class="btn btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Print Bill
                    </button>
                    <button onclick="emailBill('${reservation.email}', '${reservation.reservationNumber}')" class="btn btn-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email to Guest
                    </button>
                    <button onclick="closeBillModal()" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing bill modal if any
    const existingModal = document.getElementById('billModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Generate bill HTML
function generateBillHTML(reservation) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const checkInDate = formatDate(reservation.checkInDate);
    const checkOutDate = formatDate(reservation.checkOutDate);
    
    // Calculate breakdown
    const pricePerNight = reservation.totalAmount / reservation.numberOfNights / reservation.numberOfGuests;
    const subtotal = reservation.totalAmount;
    const tax = subtotal * 0.12; // 12% tax
    const total = subtotal + tax;
    
    return `
        <div class="bill-container" style="background: white; padding: 2rem; border: 2px solid #667eea; border-radius: 10px;">
            <div class="bill-header" style="text-align: center; margin-bottom: 2rem; border-bottom: 3px solid #667eea; padding-bottom: 1rem;">
                <h1 style="color: #667eea; margin: 0; font-size: 2rem;">Ocean View Resort</h1>
                <p style="margin: 0.5rem 0 0 0; color: #666;">123 Beach Road, Colombo, Sri Lanka</p>
                <p style="margin: 0.25rem 0 0 0; color: #666;">Tel: +94 11 234 5678 | Email: info@oceanviewresort.lk</p>
            </div>
            
            <div class="bill-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="color: #667eea; margin-bottom: 0.5rem;">Guest Information</h3>
                    <p style="margin: 0.25rem 0;"><strong>Name:</strong> ${reservation.guestName}</p>
                    <p style="margin: 0.25rem 0;"><strong>Email:</strong> ${reservation.email}</p>
                    <p style="margin: 0.25rem 0;"><strong>Contact:</strong> ${reservation.contactNumber}</p>
                    <p style="margin: 0.25rem 0;"><strong>Address:</strong> ${reservation.address}</p>
                </div>
                <div>
                    <h3 style="color: #667eea; margin-bottom: 0.5rem;">Reservation Details</h3>
                    <p style="margin: 0.25rem 0;"><strong>Reservation #:</strong> ${reservation.reservationNumber}</p>
                    <p style="margin: 0.25rem 0;"><strong>Bill Date:</strong> ${currentDate}</p>
                    <p style="margin: 0.25rem 0;"><strong>Room Type:</strong> ${reservation.roomType}</p>
                    <p style="margin: 0.25rem 0;"><strong>Number of Guests:</strong> ${reservation.numberOfGuests}</p>
                </div>
            </div>
            
            <div class="bill-details" style="margin-bottom: 2rem;">
                <h3 style="color: #667eea; margin-bottom: 1rem;">Stay Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f7fa; border-bottom: 2px solid #667eea;">
                            <th style="padding: 0.75rem; text-align: left;">Description</th>
                            <th style="padding: 0.75rem; text-align: center;">Quantity</th>
                            <th style="padding: 0.75rem; text-align: right;">Rate</th>
                            <th style="padding: 0.75rem; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 0.75rem;">
                                <strong>${reservation.roomType} Room</strong><br>
                                <small style="color: #666;">Check-in: ${checkInDate}</small><br>
                                <small style="color: #666;">Check-out: ${checkOutDate}</small>
                            </td>
                            <td style="padding: 0.75rem; text-align: center;">
                                ${reservation.numberOfNights} nights × ${reservation.numberOfGuests} guests
                            </td>
                            <td style="padding: 0.75rem; text-align: right;">
                                ${formatCurrency(pricePerNight)}
                            </td>
                            <td style="padding: 0.75rem; text-align: right;">
                                ${formatCurrency(subtotal)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="bill-summary" style="margin-left: auto; max-width: 400px; border-top: 2px solid #667eea; padding-top: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Tax (12%):</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: bold; color: #667eea; padding-top: 0.5rem; border-top: 2px solid #667eea;">
                    <span>Total Amount:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
            </div>
            
            <div class="bill-footer" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
                <p style="margin: 0.25rem 0;">Thank you for staying with us!</p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem;">We hope to see you again soon.</p>
            </div>
        </div>
    `;
}

// Print bill
function printBill() {
    const billContent = document.getElementById('billContent').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - Ocean View Resort</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            ${billContent}
            <script>
                window.onload = function() {
                    window.print();
                    // Uncomment the line below if you want to close the window after printing
                    // window.onafterprint = function() { window.close(); }
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Email bill to guest
async function emailBill(guestEmail, reservationNumber) {
    // Check if EmailJS is configured
    if (typeof emailjs === 'undefined') {
        alert('EmailJS library not loaded. Please check your internet connection and refresh the page.');
        return;
    }
    
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        alert('EmailJS is not configured yet.\n\nPlease follow these steps:\n1. Sign up at https://www.emailjs.com/\n2. Get your Public Key, Service ID, and Template ID\n3. Update the configuration in view-reservations.js\n\nSee EMAILJS_SETUP_GUIDE.md for detailed instructions.');
        return;
    }
    
    const emailInput = prompt(`Send bill to email address:`, guestEmail);
    
    if (!emailInput) {
        return; // User cancelled
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    let originalButton = null;
    let originalText = '';
    
    try {
        // Get reservation details
        const reservation = allReservations.find(r => r.reservationNumber === reservationNumber);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        
        // Show loading message
        try {
            originalButton = event.target.closest('button');
            if (originalButton) {
                originalText = originalButton.innerHTML;
                originalButton.disabled = true;
                originalButton.innerHTML = 'Sending...';
            }
        } catch (e) {
            console.log('Could not update button state:', e);
        }
        
        // Calculate bill details
        const subtotal = reservation.totalAmount;
        const tax = subtotal * 0.12;
        const total = subtotal + tax;
        const pricePerNight = subtotal / reservation.numberOfNights / reservation.numberOfGuests;
        
        // Prepare email parameters
        const templateParams = {
            to_email: emailInput,
            guest_name: reservation.guestName,
            reservation_number: reservation.reservationNumber,
            guest_email: reservation.email,
            guest_contact: reservation.contactNumber,
            guest_address: reservation.address,
            room_type: reservation.roomType,
            number_of_guests: reservation.numberOfGuests,
            check_in_date: formatDate(reservation.checkInDate),
            check_out_date: formatDate(reservation.checkOutDate),
            number_of_nights: reservation.numberOfNights,
            price_per_night: formatCurrency(pricePerNight),
            subtotal: formatCurrency(subtotal),
            tax: formatCurrency(tax),
            total_amount: formatCurrency(total),
            bill_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        
        console.log('Sending email with params:', templateParams);
        console.log('Service ID:', EMAILJS_SERVICE_ID);
        console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        
        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('EmailJS response:', response);
        
        // Restore button
        if (originalButton) {
            originalButton.disabled = false;
            originalButton.innerHTML = originalText;
        }
        
        if (response.status === 200) {
            alert(`✓ Bill has been sent successfully to ${emailInput}`);
        } else {
            throw new Error('Failed to send email - Status: ' + response.status);
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            message: error.message,
            text: error.text,
            status: error.status
        });
        
        // Restore button if it exists
        if (originalButton) {
            originalButton.disabled = false;
            originalButton.innerHTML = originalText;
        }
        
        let errorMessage = 'Failed to send email';
        if (error.text) {
            errorMessage += ': ' + error.text;
        } else if (error.message) {
            errorMessage += ': ' + error.message;
        }
        
        alert(errorMessage + '\n\nPlease check:\n1. Internet connection\n2. EmailJS configuration\n3. Browser console for details\n\nOr try printing the bill instead.');
    }
}

// Close bill modal
function closeBillModal() {
    const modal = document.getElementById('billModal');
    if (modal) {
        modal.remove();
    }
}

// View bill history for checked-out reservations
async function viewBillHistory(reservationNumber) {
    try {
        // Get reservation details
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationNumber}`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to load reservation details');
        }
        
        const detailsData = await response.json();
        const reservation = detailsData.data;
        
        // Show bill with history information
        showBillOptions(reservation, true);
        
    } catch (error) {
        console.error('Error loading bill history:', error);
        alert('Unable to load bill history. Please try again.');
    }
}

// Modified showBillOptions to support history view
function showBillOptions(reservation, isHistory = false) {
    const billHTML = generateBillHTML(reservation);
    
    const historyBadge = isHistory ? '<span style="background: #28a745; color: white; padding: 0.5rem 1rem; border-radius: 5px; font-size: 0.875rem; margin-left: 1rem;">Checkout History</span>' : '';
    
    const modalHTML = `
        <div id="billModal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close" onclick="closeBillModal()">&times;</span>
                <h2>Checkout Bill ${historyBadge}</h2>
                ${isHistory ? '<p style="color: #666; margin-bottom: 1rem;">This guest has been checked out. Below is the final bill.</p>' : ''}
                <div id="billContent">
                    ${billHTML}
                </div>
                <div class="modal-actions" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="printBill()" class="btn btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Print Bill
                    </button>
                    ${!isHistory ? `<button onclick="emailBill('${reservation.email}', '${reservation.reservationNumber}')" class="btn btn-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email to Guest
                    </button>` : `<button onclick="emailBill('${reservation.email}', '${reservation.reservationNumber}')" class="btn btn-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Resend Email
                    </button>`}
                    <button onclick="closeBillModal()" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing bill modal if any
    const existingModal = document.getElementById('billModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
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
