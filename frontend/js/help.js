// Default help content
const defaultHelpContent = `
<h2>Login</h2>
<p>Use your assigned username and password to access the system. Contact your administrator if you've forgotten your credentials.</p>
<p><strong>Default Accounts:</strong></p>
<ul>
    <li>Admin: admin / admin123</li>
    <li>Receptionist: receptionist / recep123</li>
    <li>Manager: manager / manager123</li>
</ul>

<h2>Creating a New Reservation</h2>
<ol>
    <li>Click on "New Reservation" in the menu</li>
    <li>Fill in all required fields marked with *</li>
    <li>Select the room type and dates</li>
    <li>The system will automatically calculate the total amount</li>
    <li>Click "Create Reservation" to save</li>
</ol>
<p><strong>Important:</strong> Contact number must be exactly 10 digits.</p>

<h2>Viewing Reservations</h2>
<p>Click on "View Reservations" to see all bookings. You can:</p>
<ul>
    <li>Filter by status (Confirmed, Checked In, etc.)</li>
    <li>View detailed information by clicking on a reservation</li>
    <li>Update reservation status</li>
    <li>Cancel reservations (Manager/Admin only)</li>
</ul>

<h2>Searching for Reservations</h2>
<p>Use the Search function to find reservations by guest name. The search is case-insensitive and will show all matching results.</p>

<h2>Reports</h2>
<p>The Reports section provides:</p>
<ul>
    <li>Overall booking statistics</li>
    <li>Revenue summary by room type</li>
    <li>Recent reservation activity</li>
    <li>Printable reports</li>
</ul>

<h2>Room Types & Rates</h2>
<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th>Room Type</th>
                <th>Rate per Night</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Standard</td>
                <td>LKR 5,000</td>
                <td>Standard Room with basic amenities</td>
            </tr>
            <tr>
                <td>Deluxe</td>
                <td>LKR 8,000</td>
                <td>Deluxe Room with ocean view</td>
            </tr>
            <tr>
                <td>Suite</td>
                <td>LKR 12,000</td>
                <td>Luxury Suite with premium amenities</td>
            </tr>
            <tr>
                <td>Family</td>
                <td>LKR 15,000</td>
                <td>Family Room with multiple beds</td>
            </tr>
            <tr>
                <td>Presidential</td>
                <td>LKR 25,000</td>
                <td>Presidential Suite with exclusive services</td>
            </tr>
        </tbody>
    </table>
</div>

<h2>Need More Help?</h2>
<p>Contact your system administrator or IT support for additional assistance.</p>
<p>Email: support@oceanviewresort.lk</p>
`;

let isEditMode = false;
let originalContent = '';

// Load help content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadHelpContent();
    checkAdminAccess();
});

// Check if user is admin and show edit controls
function checkAdminAccess() {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
        document.getElementById('adminControls').style.display = 'flex';
    }
}

// Load help content from localStorage or use default
function loadHelpContent() {
    const savedContent = localStorage.getItem('helpGuideContent');
    const content = savedContent || defaultHelpContent;
    document.getElementById('helpContent').innerHTML = content;
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = true;
    originalContent = document.getElementById('helpContent').innerHTML;
    
    // Make content editable
    const helpContent = document.getElementById('helpContent');
    helpContent.contentEditable = true;
    helpContent.style.border = '2px dashed #007bff';
    helpContent.style.padding = '20px';
    helpContent.style.minHeight = '400px';
    
    // Show save/cancel buttons, hide edit button
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('saveBtn').style.display = 'inline-flex';
    document.getElementById('cancelBtn').style.display = 'inline-flex';
    
    // Show notification
    showNotification('Edit mode enabled. Click anywhere in the content to make changes.', 'info');
}

// Save help content
function saveHelpContent() {
    const helpContent = document.getElementById('helpContent');
    const newContent = helpContent.innerHTML;
    
    // Save to localStorage
    localStorage.setItem('helpGuideContent', newContent);
    
    // Exit edit mode
    exitEditMode();
    
    showNotification('Help guide updated successfully!', 'success');
}

// Cancel edit
function cancelEdit() {
    // Restore original content
    document.getElementById('helpContent').innerHTML = originalContent;
    exitEditMode();
    showNotification('Changes cancelled', 'info');
}

// Exit edit mode
function exitEditMode() {
    isEditMode = false;
    const helpContent = document.getElementById('helpContent');
    helpContent.contentEditable = false;
    helpContent.style.border = 'none';
    helpContent.style.padding = '0';
    
    // Show edit button, hide save/cancel buttons
    document.getElementById('editBtn').style.display = 'inline-flex';
    document.getElementById('saveBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    #helpContent[contenteditable="true"]:focus {
        outline: none;
    }
    
    #helpContent[contenteditable="true"] h2 {
        cursor: text;
    }
    
    #helpContent[contenteditable="true"] p,
    #helpContent[contenteditable="true"] li {
        cursor: text;
    }
`;
document.head.appendChild(style);
