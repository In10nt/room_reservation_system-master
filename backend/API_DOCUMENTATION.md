# API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication

All endpoints except `/api/auth/**` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Authentication

#### Login
**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticate user and receive JWT token  
**Authentication:** Not required

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "fullName": "System Administrator",
    "role": "ADMIN",
    "message": "Login successful"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid username or password",
  "data": null
}
```

---

#### Get Help
**Endpoint:** `GET /api/auth/help`  
**Description:** Get system usage guidelines  
**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Help information",
  "data": "=== Ocean View Resort Reservation System - Help Guide ===\n..."
}
```

---

### 2. Reservations

#### Create Reservation
**Endpoint:** `POST /api/reservations`  
**Description:** Create a new room reservation  
**Authentication:** Required (ADMIN, RECEPTIONIST, MANAGER)

**Request Body:**
```json
{
  "guestName": "John Doe",
  "address": "123 Main St, Colombo",
  "contactNumber": "0771234567",
  "email": "john@example.com",
  "roomType": "DELUXE",
  "checkInDate": "2025-01-20",
  "checkOutDate": "2025-01-22",
  "numberOfGuests": 2,
  "specialRequests": "Late check-in"
}
```

**Field Validations:**
- `guestName`: Required, 2-100 characters
- `address`: Required
- `contactNumber`: Required, exactly 10 digits
- `email`: Required, valid email format
- `roomType`: Required, one of: STANDARD, DELUXE, SUITE, FAMILY, PRESIDENTIAL
- `checkInDate`: Required, today or future date
- `checkOutDate`: Required, after check-in date
- `numberOfGuests`: Required, 1-10
- `specialRequests`: Optional

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": 1,
    "reservationNumber": "RES1736524800000",
    "guestName": "John Doe",
    "address": "123 Main St, Colombo",
    "contactNumber": "0771234567",
    "email": "john@example.com",
    "roomType": "DELUXE",
    "checkInDate": "2025-01-20",
    "checkOutDate": "2025-01-22",
    "status": "CONFIRMED",
    "numberOfGuests": 2,
    "specialRequests": "Late check-in",
    "totalAmount": 16000.00,
    "numberOfNights": 2
  }
}
```

**Error Responses:**

*Validation Error (400 Bad Request):*
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "guestName": "Guest name is required",
    "contactNumber": "Contact number must be 10 digits"
  }
}
```

*No Rooms Available (400 Bad Request):*
```json
{
  "success": false,
  "message": "No rooms available for selected dates",
  "data": null
}
```

---

#### Get All Reservations
**Endpoint:** `GET /api/reservations`  
**Description:** Retrieve all reservations  
**Authentication:** Required (ADMIN, RECEPTIONIST, MANAGER)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservations retrieved successfully",
  "data": [
    {
      "id": 1,
      "reservationNumber": "RES1736524800000",
      "guestName": "John Doe",
      "address": "123 Main St, Colombo",
      "contactNumber": "0771234567",
      "email": "john@example.com",
      "roomType": "DELUXE",
      "checkInDate": "2025-01-20",
      "checkOutDate": "2025-01-22",
      "status": "CONFIRMED",
      "numberOfGuests": 2,
      "specialRequests": "Late check-in",
      "totalAmount": 16000.00,
      "numberOfNights": 2
    }
  ]
}
```

---

#### Get Reservation by Number
**Endpoint:** `GET /api/reservations/{reservationNumber}`  
**Description:** Retrieve specific reservation details  
**Authentication:** Required (ADMIN, RECEPTIONIST, MANAGER)

**Path Parameters:**
- `reservationNumber`: Unique reservation identifier (e.g., RES1736524800000)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation retrieved successfully",
  "data": {
    "id": 1,
    "reservationNumber": "RES1736524800000",
    "guestName": "John Doe",
    "address": "123 Main St, Colombo",
    "contactNumber": "0771234567",
    "email": "john@example.com",
    "roomType": "DELUXE",
    "checkInDate": "2025-01-20",
    "checkOutDate": "2025-01-22",
    "status": "CONFIRMED",
    "numberOfGuests": 2,
    "specialRequests": "Late check-in",
    "totalAmount": 16000.00,
    "numberOfNights": 2
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Reservation not found: RES123456",
  "data": null
}
```

---

#### Search Reservations
**Endpoint:** `GET /api/reservations/search?name={guestName}`  
**Description:** Search reservations by guest name  
**Authentication:** Required (ADMIN, RECEPTIONIST, MANAGER)

**Query Parameters:**
- `name`: Guest name to search (partial match, case-insensitive)

**Example:**
```
GET /api/reservations/search?name=John
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": 1,
      "reservationNumber": "RES1736524800000",
      "guestName": "John Doe",
      ...
    }
  ]
}
```

---

#### Update Reservation Status
**Endpoint:** `PUT /api/reservations/{reservationNumber}/status?status={newStatus}`  
**Description:** Update the status of a reservation  
**Authentication:** Required (ADMIN, RECEPTIONIST, MANAGER)

**Path Parameters:**
- `reservationNumber`: Unique reservation identifier

**Query Parameters:**
- `status`: New status (CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW)

**Example:**
```
PUT /api/reservations/RES1736524800000/status?status=CHECKED_IN
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation status updated successfully",
  "data": {
    "id": 1,
    "reservationNumber": "RES1736524800000",
    "status": "CHECKED_IN",
    ...
  }
}
```

---

#### Cancel Reservation
**Endpoint:** `PUT /api/reservations/{reservationNumber}/cancel`  
**Description:** Cancel a reservation  
**Authentication:** Required (ADMIN, MANAGER only)

**Path Parameters:**
- `reservationNumber`: Unique reservation identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "id": 1,
    "reservationNumber": "RES1736524800000",
    "status": "CANCELLED",
    ...
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```

---

## Data Models

### Room Types

| Type | Rate (LKR/night) | Description |
|------|------------------|-------------|
| STANDARD | 5,000 | Standard Room with basic amenities |
| DELUXE | 8,000 | Deluxe Room with ocean view |
| SUITE | 12,000 | Luxury Suite with premium amenities |
| FAMILY | 15,000 | Family Room with multiple beds |
| PRESIDENTIAL | 25,000 | Presidential Suite with exclusive services |

### Reservation Status

| Status | Description |
|--------|-------------|
| CONFIRMED | Reservation is confirmed |
| CHECKED_IN | Guest has checked in |
| CHECKED_OUT | Guest has checked out |
| CANCELLED | Reservation was cancelled |
| NO_SHOW | Guest did not show up |

### User Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Full system access |
| MANAGER | Create, view, update, cancel reservations |
| RECEPTIONIST | Create, view, update reservations |

---

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / Validation error |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per minute per user
- 1000 requests per hour per IP

---

## Postman Collection

Import this collection to test the API:

```json
{
  "info": {
    "name": "Ocean View Resort API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:8080/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "auth", "login"]
        }
      }
    }
  ]
}
```

---

## WebSocket Support

Currently not implemented. Future versions may include:
- Real-time reservation updates
- Live availability notifications
- Chat support

---

## Versioning

Current API Version: **v1.0.0**

Future versions will use URL versioning:
- `/api/v1/reservations`
- `/api/v2/reservations`

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
