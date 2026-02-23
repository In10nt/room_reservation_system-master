# Configuration Guide

## Required Configuration Before Running

### 1. Database Configuration

**File**: `backend/src/main/resources/application.properties`

Update MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

### 2. JWT Secret Key

**File**: `backend/src/main/resources/application.properties`

Change the JWT secret to a strong random string:
```properties
jwt.secret=CHANGE_THIS_SECRET_KEY_IN_PRODUCTION_USE_STRONG_RANDOM_STRING
```

### 3. EmailJS Configuration

**File**: `frontend/js/view-reservations.js`

Sign up at https://www.emailjs.com/ and update:
```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID_HERE';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';
```

**Email Template**: Use the content from `EMAIL_TEMPLATE.html`

### 4. Database Setup

Run the SQL script to create database and tables:
```bash
mysql -u root -p < backend/COMPLETE_DATABASE_SETUP.sql
```

Or manually run the SQL file in MySQL Workbench.

### 5. Start Application

**Backend**:
```bash
cd backend
mvn spring-boot:run
```
Or double-click `START_BACKEND.bat`

**Frontend**:
Open `frontend/index.html` in browser or use `START_FRONTEND.bat`

## Default Login Credentials

After running database setup:

- **Admin**: admin / admin123
- **Receptionist**: receptionist / recep123
- **Manager**: manager / manager123

**⚠️ IMPORTANT**: Change these passwords in production!

## Security Notes

1. Never commit real credentials to GitHub
2. Use environment variables for sensitive data in production
3. Change default passwords immediately
4. Use strong JWT secret keys
5. Enable HTTPS in production

## Support

For issues or questions, check:
- `README.md` - Project overview
- `SWAGGER_TESTING_GUIDE.md` - API documentation
- `EMAIL_TEMPLATE.html` - Email template for EmailJS
