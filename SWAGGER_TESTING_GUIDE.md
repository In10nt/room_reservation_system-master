# Swagger API Testing Guide

## 🔐 How to Test Protected APIs in Swagger

### Step 1: Get JWT Token

1. Open Swagger UI: http://localhost:8081/swagger-ui.html
2. Find **POST /api/auth/login** endpoint
3. Click "Try it out"
4. Enter request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
5. Click "Execute"
6. Copy the token from response: `data.token`

### Step 2: Authorize Swagger

1. Click the **"Authorize"** button (🔒 icon) at the top right
2. In the "Value" field, enter: `Bearer YOUR_TOKEN_HERE`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
3. Click "Authorize"
4. Click "Close"

### Step 3: Test APIs

Now you can test all protected endpoints!

---

## 📋 API Endpoints

### Public Endpoints (No Auth Required)

#### Login
- **POST /api/auth/login**
- Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Public Reservation
- **POST /api/reservations/public**
- Request:
```json
{
  "guestName": "John Doe",
  "email": "john@example.com",
  "contactNumber": "0771234567",
  "address": "123 Main St, Colombo",
  "roomType": "DELUXE",
  "checkInDate": "2026-03-01",
  "checkOutDate": "2026-03-05",
  "numberOfGuests": 2,
  "specialRequests": "Late check-in"
}
```

### Protected Endpoints (Auth Required)

#### Get All Reservations
- **GET /api/reservations**
- Requires: JWT Token
- Roles: ADMIN, RECEPTIONIST, MANAGER

#### Create Reservation
- **POST /api/reservations**
- Requires: JWT Token
- Roles: ADMIN, RECEPTIONIST, MANAGER
- Request: Same as public reservation

#### Get Reservation by Number
- **GET /api/reservations/{reservationNumber}**
- Requires: JWT Token
- Example: `/api/reservations/RES1001`

#### Search Reservations
- **GET /api/reservations/search?name=John**
- Requires: JWT Token

#### Update Reservation Status
- **PUT /api/reservations/{reservationNumber}/status?status=CHECKED_IN**
- Requires: JWT Token
- Status values: CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW

#### Cancel Reservation
- **PUT /api/reservations/{reservationNumber}/cancel**
- Requires: JWT Token
- Roles: ADMIN, MANAGER only

#### Update Reservation
- **PUT /api/reservations/{reservationNumber}**
- Requires: JWT Token

---

## 🔑 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Receptionist | receptionist | recep123 |
| Manager | manager | manager123 |

---

## 💡 Tips

1. **Token Expires**: JWT tokens expire after 24 hours. Get a new token if APIs stop working.
2. **Authorization Header**: Always include `Bearer ` before the token.
3. **Test Public APIs First**: Test login and public reservation without auth to verify backend is working.
4. **Check Response**: Look at the response body for error messages if something fails.

---

## 🐛 Common Issues

### Issue: "Unauthorized" or 403 Error
**Solution**: You need to authorize with JWT token first.

### Issue: "Invalid username or password"
**Solution**: Check credentials. Use: admin/admin123

### Issue: "Token expired"
**Solution**: Login again to get a new token.

### Issue: APIs not working at all
**Solution**: 
1. Check backend is running: http://localhost:8081/swagger-ui.html
2. Check server URL in Swagger shows: http://localhost:8081

---

## 📞 Need Help?

- Backend URL: http://localhost:8081
- Swagger UI: http://localhost:8081/swagger-ui.html
- Frontend: http://localhost:3000
- Navigation Hub: http://localhost:3000/navigation.html
