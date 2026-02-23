# Ocean View Resort Reservation System

A complete hotel reservation management system with separate frontend and backend.

## 📁 Project Structure

```
ocean-view-resort/
├── backend/                    # Spring Boot Backend API
│   ├── src/                   # Java source code
│   ├── pom.xml               # Maven configuration
│   ├── run-application.bat   # Backend startup script
│   └── COMPLETE_DATABASE_SETUP.sql  # Database setup script
│
├── frontend/                   # Frontend Application
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   ├── images/                # Images
│   ├── customer/              # Customer pages
│   └── *.html                 # HTML pages
│
├── START_BACKEND.bat          # Quick start backend
└── START_FRONTEND.bat         # Quick start frontend
```

## 🚀 Quick Start

### Step 1: Setup MySQL Database

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install and set root password

2. **Create Database and Tables**
   - Open MySQL Command Line Client or MySQL Workbench
   - Login with your root credentials
   - Run the SQL script:
   
   ```bash
   mysql -u root -p < backend/COMPLETE_DATABASE_SETUP.sql
   ```
   
   OR manually copy and paste the contents of `backend/COMPLETE_DATABASE_SETUP.sql` into MySQL

3. **Configure Backend Connection**
   - Open: `backend/src/main/resources/application.properties`
   - Find the MySQL section (currently commented out)
   - Uncomment MySQL lines and comment out H2 lines
   - Update your MySQL password:
   
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### Step 2: Start Backend

**Option A - Using batch file:**
```bash
START_BACKEND.bat
```

**Option B - Manual:**
```bash
cd backend
run-application.bat
```

**Option C - Using Maven:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Backend will start on: **http://localhost:8081**

### Step 3: Start Frontend

**Option A - Using batch file:**
```bash
START_FRONTEND.bat
```

**Option B - Double click:**
- Navigate to `frontend` folder
- Double-click `index.html`

**Option C - Using Live Server (VS Code):**
- Open `frontend` folder in VS Code
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

✅ Frontend will open in your browser

## 🔑 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Receptionist | receptionist | recep123 |
| Manager | manager | manager123 |

## 📊 Database Tables

### Users Table
- Stores system users (admin, receptionist, manager)
- Fields: id, username, password, full_name, role, active, created_at

### Reservations Table
- Stores hotel reservations
- Fields: id, reservation_number, guest_name, address, contact_number, email, room_type, check_in_date, check_out_date, status, number_of_guests, special_requests, total_amount, created_at, updated_at

## 💰 Room Types & Pricing

| Room Type | Price per Night |
|-----------|----------------|
| STANDARD | LKR 5,000 |
| DELUXE | LKR 8,000 |
| SUITE | LKR 12,000 |
| FAMILY | LKR 15,000 |
| PRESIDENTIAL | LKR 25,000 |

## 🌐 API Endpoints

### Base URL
```
http://localhost:8081/api
```

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Reservations
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Delete reservation
- `GET /api/reservations/search` - Search reservations
- `POST /api/reservations/public` - Public booking

### API Documentation
- Swagger UI: http://localhost:8081/swagger-ui.html
- API Docs: http://localhost:8081/api-docs

## 🔧 Configuration

### Backend Configuration
File: `backend/src/main/resources/application.properties`

**Current Setup (H2 - Temporary):**
```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:ocean_view_resort
```

**MySQL Setup (Production):**
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/ocean_view_resort
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Frontend Configuration
File: `frontend/js/common.js`

```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot 3.4.1
- Spring Security (JWT Authentication)
- Spring Data JPA
- MySQL / H2 Database
- Maven
- Swagger/OpenAPI

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- No frameworks (pure JS)

## 📝 Features

### Admin Features
- Dashboard with statistics
- Manage all reservations
- View reports
- User management

### Receptionist Features
- Create new reservations
- View reservations
- Update reservation status
- Search reservations

### Manager Features
- View all reservations
- Generate reports
- Monitor system activity

### Customer Features
- Public booking interface
- View available rooms
- Make reservations

## ❗ Troubleshooting

### Backend won't start

**Problem:** Port 8081 already in use
- **Solution:** Change port in `application.properties`

**Problem:** MySQL connection error
- **Solution:** 
  1. Check if MySQL is running
  2. Verify database exists: `SHOW DATABASES;`
  3. Check username/password in application.properties

**Problem:** Build fails
- **Solution:** 
  1. Check Java version: `java -version` (need 17+)
  2. Clean build: `mvn clean install`

### Frontend issues

**Problem:** Can't connect to backend
- **Solution:** 
  1. Verify backend is running on port 8081
  2. Check browser console for errors
  3. Verify API_BASE_URL in `frontend/js/common.js`

**Problem:** Login not working
- **Solution:** 
  1. Check backend logs
  2. Verify database has users
  3. Clear browser localStorage

### Database issues

**Problem:** Tables not created
- **Solution:** Run `backend/COMPLETE_DATABASE_SETUP.sql`

**Problem:** Can't login with default users
- **Solution:** 
  1. Check if users exist: `SELECT * FROM users;`
  2. Re-run the INSERT statements from SQL script

## 📞 Support

For issues or questions:
1. Check backend logs in console
2. Check browser console (F12) for frontend errors
3. Verify MySQL is running
4. Ensure all configurations are correct

## 🔄 Switching from H2 to MySQL

Currently using H2 (in-memory database) for testing. To switch to MySQL:

1. Install and setup MySQL
2. Run `backend/COMPLETE_DATABASE_SETUP.sql`
3. Edit `backend/src/main/resources/application.properties`:
   - Comment out H2 section
   - Uncomment MySQL section
   - Update password
4. Restart backend

## 📄 License

This project is for educational purposes.
