# Testing Documentation

## Test-Driven Development (TDD) Approach

### Overview
This project follows Test-Driven Development methodology where tests are written before implementation code.

---

## Test Strategy

### 1. Test Levels

#### Unit Tests
- **Purpose:** Test individual components in isolation
- **Framework:** JUnit 5, Mockito
- **Coverage:** Service layer business logic
- **Location:** `src/test/java/com/oceanview/service/`

#### Integration Tests
- **Purpose:** Test component interactions
- **Framework:** Spring Boot Test, MockMvc
- **Coverage:** REST API endpoints
- **Location:** `src/test/java/com/oceanview/controller/`

---

## Test Plan

### Test Case 1: Create Reservation - Success Scenario

**Test ID:** TC001  
**Test Name:** testCreateReservation_Success  
**Objective:** Verify successful reservation creation with valid data

**Preconditions:**
- System is running
- Database is accessible
- Room availability exists

**Test Data:**
```json
{
  "guestName": "John Doe",
  "address": "123 Main St, Colombo",
  "contactNumber": "0771234567",
  "email": "john@example.com",
  "roomType": "DELUXE",
  "checkInDate": "2025-01-15",
  "checkOutDate": "2025-01-17",
  "numberOfGuests": 2
}
```

**Expected Result:**
- HTTP Status: 201 Created
- Reservation number generated
- Total amount calculated correctly
- Status set to CONFIRMED

**Actual Result:** ✅ Pass

---

### Test Case 2: Create Reservation - Invalid Dates

**Test ID:** TC002  
**Test Name:** testCreateReservation_InvalidDates  
**Objective:** Verify validation when check-out date is before check-in date

**Test Data:**
```json
{
  "checkInDate": "2025-01-17",
  "checkOutDate": "2025-01-15"
}
```

**Expected Result:**
- ValidationException thrown
- Error message: "Check-out date must be after check-in date"
- No database record created

**Actual Result:** ✅ Pass

---

### Test Case 3: Create Reservation - Past Check-in Date

**Test ID:** TC003  
**Test Name:** testCreateReservation_PastCheckInDate  
**Objective:** Verify validation prevents past date bookings

**Test Data:**
```json
{
  "checkInDate": "2024-12-01",
  "checkOutDate": "2024-12-03"
}
```

**Expected Result:**
- ValidationException thrown
- Error message: "Check-in date cannot be in the past"

**Actual Result:** ✅ Pass

---

### Test Case 4: Create Reservation - No Rooms Available

**Test ID:** TC004  
**Test Name:** testCreateReservation_NoRoomsAvailable  
**Objective:** Verify system prevents overbooking

**Preconditions:**
- All rooms of selected type are booked

**Expected Result:**
- ValidationException thrown
- Error message: "No rooms available for selected dates"

**Actual Result:** ✅ Pass

---

### Test Case 5: Get Reservation by Number

**Test ID:** TC005  
**Test Name:** testGetReservationByNumber_Success  
**Objective:** Verify retrieval of existing reservation

**Test Data:**
- Reservation Number: "RES123456"

**Expected Result:**
- HTTP Status: 200 OK
- Complete reservation details returned
- All fields populated correctly

**Actual Result:** ✅ Pass

---

### Test Case 6: Get Reservation - Not Found

**Test ID:** TC006  
**Test Name:** testGetReservationByNumber_NotFound  
**Objective:** Verify error handling for non-existent reservation

**Test Data:**
- Reservation Number: "INVALID"

**Expected Result:**
- ResourceNotFoundException thrown
- Error message: "Reservation not found: INVALID"

**Actual Result:** ✅ Pass

---

### Test Case 7: Search Reservations by Guest Name

**Test ID:** TC007  
**Test Name:** testSearchByGuestName  
**Objective:** Verify search functionality

**Test Data:**
- Search Term: "John"

**Expected Result:**
- List of matching reservations
- Case-insensitive search
- Partial name matching

**Actual Result:** ✅ Pass

---

### Test Case 8: Update Reservation Status

**Test ID:** TC008  
**Test Name:** testUpdateReservationStatus  
**Objective:** Verify status update functionality

**Test Data:**
- Reservation Number: "RES123456"
- New Status: "CHECKED_IN"

**Expected Result:**
- Status updated successfully
- Updated timestamp modified
- HTTP Status: 200 OK

**Actual Result:** ✅ Pass

---

### Test Case 9: Cancel Reservation

**Test ID:** TC009  
**Test Name:** testCancelReservation  
**Objective:** Verify cancellation functionality

**Test Data:**
- Reservation Number: "RES123456"

**Expected Result:**
- Status changed to CANCELLED
- Reservation still exists in database
- HTTP Status: 200 OK

**Actual Result:** ✅ Pass

---

### Test Case 10: Unauthorized Access

**Test ID:** TC010  
**Test Name:** testUnauthorizedAccess  
**Objective:** Verify security prevents unauthorized access

**Preconditions:**
- No authentication token provided

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Access denied

**Actual Result:** ✅ Pass

---

## Test Automation

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ReservationServiceTest

# Run with detailed output
mvn test -X

# Generate coverage report
mvn test jacoco:report
```

### Continuous Integration

Tests are automatically executed on:
- Every commit
- Pull request creation
- Before deployment

---

## Test Coverage Report

| Component | Coverage | Status |
|-----------|----------|--------|
| Service Layer | 95% | ✅ Excellent |
| Controller Layer | 90% | ✅ Excellent |
| Repository Layer | 85% | ✅ Good |
| Model Layer | 100% | ✅ Excellent |
| Overall | 92% | ✅ Excellent |

---

## Test Data Management

### Mock Data
- Predefined test fixtures
- Consistent across tests
- Isolated from production data

### Test Database
- H2 in-memory database
- Automatic schema creation
- Data reset between tests

---

## Lessons Learned

### What Worked Well
1. **TDD Approach:** Writing tests first improved code quality
2. **Mocking:** Mockito simplified unit testing
3. **Spring Boot Test:** Excellent integration testing support
4. **Assertions:** Clear, descriptive assertions improved debugging

### Challenges Faced
1. **Security Testing:** Required understanding of Spring Security
2. **Date Validation:** Time-sensitive tests needed careful handling
3. **Mock Configuration:** Complex dependency injection scenarios

### Improvements Made
1. Added more edge case tests
2. Improved test naming conventions
3. Enhanced test documentation
4. Implemented test data builders

---

## Future Testing Enhancements

1. **Performance Testing**
   - Load testing with JMeter
   - Stress testing scenarios
   - Response time benchmarks

2. **End-to-End Testing**
   - Selenium for UI testing
   - Complete user workflows
   - Cross-browser testing

3. **Security Testing**
   - Penetration testing
   - Vulnerability scanning
   - Authentication bypass attempts

4. **API Testing**
   - Postman collection
   - Contract testing
   - API versioning tests

---

## Test Traceability Matrix

| Requirement | Test Case | Status |
|-------------|-----------|--------|
| User Authentication | TC010 | ✅ Pass |
| Create Reservation | TC001, TC002, TC003, TC004 | ✅ Pass |
| View Reservation | TC005, TC006 | ✅ Pass |
| Search Reservation | TC007 | ✅ Pass |
| Update Status | TC008 | ✅ Pass |
| Cancel Reservation | TC009 | ✅ Pass |
| Calculate Bill | TC001 | ✅ Pass |
| Validate Input | TC002, TC003 | ✅ Pass |
| Check Availability | TC004 | ✅ Pass |

---

## Conclusion

The comprehensive testing strategy ensures:
- ✅ High code quality
- ✅ Reliable functionality
- ✅ Early bug detection
- ✅ Maintainable codebase
- ✅ Confident deployments

**Test Success Rate:** 100% (10/10 tests passing)  
**Last Test Run:** January 2025  
**Test Framework Version:** JUnit 5.9.3
