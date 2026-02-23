# UML Diagrams Documentation

## 1. Use Case Diagram

### Actors

1. **Receptionist** - Front desk staff who manage daily reservations
2. **Manager** - Hotel manager with elevated privileges
3. **Admin** - System administrator with full access

### Use Cases

#### Primary Use Cases

1. **Login to System**
   - **Actor:** All users
   - **Description:** Authenticate using username and password
   - **Precondition:** User has valid credentials
   - **Postcondition:** User receives JWT token
   - **<<include>>:** Validate Credentials

2. **Create Reservation**
   - **Actor:** Receptionist, Manager, Admin
   - **Description:** Create new room reservation
   - **Precondition:** User is authenticated
   - **Postcondition:** Reservation is created with unique number
   - **<<include>>:** Validate Guest Information, Check Room Availability
   - **<<extend>>:** Calculate Bill

3. **View Reservation Details**
   - **Actor:** Receptionist, Manager, Admin
   - **Description:** Display complete reservation information
   - **Precondition:** Reservation exists
   - **Postcondition:** Reservation details displayed

4. **Search Reservations**
   - **Actor:** Receptionist, Manager, Admin
   - **Description:** Search reservations by guest name
   - **Precondition:** User is authenticated
   - **Postcondition:** Matching reservations displayed

5. **Update Reservation Status**
   - **Actor:** Receptionist, Manager, Admin
   - **Description:** Change reservation status (Confirmed, Checked-In, Checked-Out)
   - **Precondition:** Reservation exists
   - **Postcondition:** Status updated

6. **Cancel Reservation**
   - **Actor:** Manager, Admin
   - **Description:** Cancel existing reservation
   - **Precondition:** Reservation exists and not checked-out
   - **Postcondition:** Reservation marked as cancelled

7. **Calculate and Print Bill**
   - **Actor:** Receptionist, Manager, Admin
   - **Description:** Calculate total cost based on room type and nights
   - **Precondition:** Reservation exists
   - **Postcondition:** Bill amount calculated and displayed

8. **Access Help Section**
   - **Actor:** All users
   - **Description:** View system usage guidelines
   - **Precondition:** None
   - **Postcondition:** Help information displayed

### Use Case Relationships

- **<<include>>** relationships:
  - Login → Validate Credentials
  - Create Reservation → Validate Guest Information
  - Create Reservation → Check Room Availability

- **<<extend>>** relationships:
  - Calculate Bill ← Create Reservation
  - Calculate Bill ← Update Reservation Status

### Use Case Diagram (Text Representation)

```
                    Ocean View Resort Reservation System
                    
┌─────────────┐                                          ┌─────────────┐
│             │                                          │             │
│ Receptionist│──────────┐                      ┌───────│   Manager   │
│             │          │                      │       │             │
└─────────────┘          │                      │       └─────────────┘
                         │                      │
                         ▼                      ▼
                    ┌────────────────────────────────┐
                    │                                │
                    │  Login to System               │◄──────────┐
                    │  <<include>> Validate Creds    │           │
                    │                                │           │
                    └────────────────────────────────┘           │
                                 │                               │
                    ┌────────────┴────────────┐                 │
                    │                         │                 │
                    ▼                         ▼                 │
        ┌──────────────────────┐  ┌──────────────────────┐     │
        │                      │  │                      │     │
        │ Create Reservation   │  │ View Reservations    │     │
        │ <<include>> Validate │  │                      │     │
        │ <<include>> Check    │  └──────────────────────┘     │
        │    Availability      │                               │
        │ <<extend>> Calculate │                               │
        │    Bill              │                               │
        │                      │                               │
        └──────────────────────┘                               │
                    │                                           │
                    ▼                                           │
        ┌──────────────────────┐                               │
        │                      │                               │
        │ Search Reservations  │                               │
        │                      │                               │
        └──────────────────────┘                               │
                    │                                           │
                    ▼                                           │
        ┌──────────────────────┐                               │
        │                      │                               │
        │ Update Status        │                               │
        │                      │                               │
        └──────────────────────┘                               │
                    │                                           │
                    ▼                                           │
        ┌──────────────────────┐                               │
        │                      │                               │
        │ Cancel Reservation   │ (Manager/Admin only)          │
        │                      │                               │
        └──────────────────────┘                               │
                    │                                           │
                    ▼                                           │
        ┌──────────────────────┐                               │
        │                      │                               │
        │ Calculate Bill       │                               │
        │                      │                               │
        └──────────────────────┘                               │
                    │                                           │
                    ▼                                           │
        ┌──────────────────────┐                               │
        │                      │                               │
        │ Access Help          │───────────────────────────────┘
        │                      │
        └──────────────────────┘
                    ▲
                    │
                    │
              ┌─────────────┐
              │             │
              │    Admin    │
              │             │
              └─────────────┘
```

---

## 2. Class Diagram

### Core Classes

#### Entity Classes (Model Layer)

**1. User**
```
┌─────────────────────────────┐
│         User                │
├─────────────────────────────┤
│ - id: Long                  │
│ - username: String          │
│ - password: String          │
│ - fullName: String          │
│ - role: UserRole            │
│ - active: boolean           │
│ - createdAt: LocalDateTime  │
├─────────────────────────────┤
│ + getId(): Long             │
│ + setId(Long): void         │
│ + getUsername(): String     │
│ + setUsername(String): void │
│ + getPassword(): String     │
│ + setPassword(String): void │
│ + getRole(): UserRole       │
│ + setRole(UserRole): void   │
└─────────────────────────────┘
```

**2. Reservation**
```
┌──────────────────────────────────────┐
│         Reservation                  │
├──────────────────────────────────────┤
│ - id: Long                           │
│ - reservationNumber: String          │
│ - guestName: String                  │
│ - address: String                    │
│ - contactNumber: String              │
│ - email: String                      │
│ - roomType: RoomType                 │
│ - checkInDate: LocalDate             │
│ - checkOutDate: LocalDate            │
│ - status: ReservationStatus          │
│ - numberOfGuests: Integer            │
│ - specialRequests: String            │
│ - totalAmount: BigDecimal            │
│ - createdAt: LocalDateTime           │
│ - updatedAt: LocalDateTime           │
├──────────────────────────────────────┤
│ + calculateTotalAmount(): void       │
│ + getNumberOfNights(): long          │
│ + generateReservationNumber(): String│
│ + onCreate(): void                   │
│ + onUpdate(): void                   │
│ + getId(): Long                      │
│ + getReservationNumber(): String     │
│ + setGuestName(String): void         │
│ + getRoomType(): RoomType            │
│ + setStatus(ReservationStatus): void │
└──────────────────────────────────────┘
```

#### Enumeration Classes

**3. RoomType**
```
┌─────────────────────────────┐
│      <<enumeration>>        │
│         RoomType            │
├─────────────────────────────┤
│ STANDARD                    │
│ DELUXE                      │
│ SUITE                       │
│ FAMILY                      │
│ PRESIDENTIAL                │
├─────────────────────────────┤
│ - ratePerNight: BigDecimal  │
│ - description: String       │
├─────────────────────────────┤
│ + getRatePerNight(): BigDecimal│
│ + getDescription(): String  │
└─────────────────────────────┘
```

**4. ReservationStatus**
```
┌─────────────────────────────┐
│      <<enumeration>>        │
│    ReservationStatus        │
├─────────────────────────────┤
│ CONFIRMED                   │
│ CHECKED_IN                  │
│ CHECKED_OUT                 │
│ CANCELLED                   │
│ NO_SHOW                     │
└─────────────────────────────┘
```

**5. UserRole**
```
┌─────────────────────────────┐
│      <<enumeration>>        │
│         UserRole            │
├─────────────────────────────┤
│ ADMIN                       │
│ RECEPTIONIST                │
│ MANAGER                     │
└─────────────────────────────┘
```

#### Repository Layer (DAO Pattern)

**6. ReservationRepository**
```
┌──────────────────────────────────────────────┐
│      <<interface>>                           │
│    ReservationRepository                     │
│    extends JpaRepository                     │
├──────────────────────────────────────────────┤
│ + findByReservationNumber(String): Optional  │
│ + findByGuestNameContaining(String): List    │
│ + findByStatus(ReservationStatus): List      │
│ + findByRoomType(RoomType): List             │
│ + findByCheckInDateBetween(Date, Date): List │
│ + countOverlappingReservations(...): long    │
└──────────────────────────────────────────────┘
```

**7. UserRepository**
```
┌──────────────────────────────────────────────┐
│      <<interface>>                           │
│         UserRepository                       │
│    extends JpaRepository                     │
├──────────────────────────────────────────────┤
│ + findByUsername(String): Optional<User>     │
│ + existsByUsername(String): boolean          │
└──────────────────────────────────────────────┘
```

#### Service Layer

**8. ReservationService**
```
┌──────────────────────────────────────────────┐
│       ReservationService                     │
├──────────────────────────────────────────────┤
│ - reservationRepository: ReservationRepository│
├──────────────────────────────────────────────┤
│ + createReservation(Request): Response       │
│ + getReservationByNumber(String): Response   │
│ + getAllReservations(): List<Response>       │
│ + searchByGuestName(String): List<Response>  │
│ + updateReservationStatus(...): Response     │
│ + cancelReservation(String): Response        │
│ - validateReservationDates(...): void        │
│ - checkRoomAvailability(...): void           │
│ - mapToEntity(Request): Reservation          │
│ - mapToResponse(Reservation): Response       │
└──────────────────────────────────────────────┘
```

#### Controller Layer

**9. ReservationController**
```
┌──────────────────────────────────────────────┐
│       ReservationController                  │
├──────────────────────────────────────────────┤
│ - reservationService: ReservationService     │
├──────────────────────────────────────────────┤
│ + createReservation(Request): ResponseEntity │
│ + getAllReservations(): ResponseEntity       │
│ + getReservation(String): ResponseEntity     │
│ + searchReservations(String): ResponseEntity │
│ + updateStatus(...): ResponseEntity          │
│ + cancelReservation(String): ResponseEntity  │
└──────────────────────────────────────────────┘
```

### Class Relationships

```
Reservation "1" ──> "1" RoomType : uses
Reservation "1" ──> "1" ReservationStatus : has
User "1" ──> "1" UserRole : has

ReservationRepository "1" ──> "*" Reservation : manages
UserRepository "1" ──> "*" User : manages

ReservationService "1" ──> "1" ReservationRepository : uses
ReservationController "1" ──> "1" ReservationService : uses

AuthController "1" ──> "1" UserService : uses
UserService "1" ──> "1" UserRepository : uses
```

---

## 3. Sequence Diagrams

### Sequence Diagram 1: User Login

```
Actor          AuthController    AuthenticationManager    UserService    JwtUtil
  │                  │                    │                   │            │
  │──Login Request──>│                    │                   │            │
  │                  │                    │                   │            │
  │                  │──Authenticate────>│                   │            │
  │                  │                    │                   │            │
  │                  │                    │──Find User──────>│            │
  │                  │                    │                   │            │
  │                  │                    │<──User Details───│            │
  │                  │                    │                   │            │
  │                  │<──Authentication──│                   │            │
  │                  │     Success        │                   │            │
  │                  │                    │                   │            │
  │                  │──Generate Token──────────────────────>│            │
  │                  │                    │                   │            │
  │                  │<──JWT Token───────────────────────────│            │
  │                  │                    │                   │            │
  │<──Login Response─│                    │                   │            │
  │   (with token)   │                    │                   │            │
```

### Sequence Diagram 2: Create Reservation

```
Actor    ReservationController    ReservationService    ReservationRepository    Database
  │              │                        │                      │                  │
  │──POST────────>│                        │                      │                  │
  │ /reservations│                        │                      │                  │
  │              │                        │                      │                  │
  │              │──createReservation────>│                      │                  │
  │              │                        │                      │                  │
  │              │                        │──validateDates()     │                  │
  │              │                        │                      │                  │
  │              │                        │──checkAvailability──>│                  │
  │              │                        │                      │                  │
  │              │                        │                      │──Query───────────>│
  │              │                        │                      │                  │
  │              │                        │                      │<──Count──────────│
  │              │                        │                      │                  │
  │              │                        │<──Available──────────│                  │
  │              │                        │                      │                  │
  │              │                        │──mapToEntity()       │                  │
  │              │                        │                      │                  │
  │              │                        │──save()─────────────>│                  │
  │              │                        │                      │                  │
  │              │                        │                      │──Insert──────────>│
  │              │                        │                      │                  │
  │              │                        │                      │<──Success────────│
  │              │                        │                      │                  │
  │              │                        │<──Reservation────────│                  │
  │              │                        │                      │                  │
  │              │                        │──mapToResponse()     │                  │
  │              │                        │                      │                  │
  │              │<──Response─────────────│                      │                  │
  │              │                        │                      │                  │
  │<──201 Created│                        │                      │                  │
  │   Response   │                        │                      │                  │
```

### Sequence Diagram 3: View Reservation Details

```
Actor    ReservationController    ReservationService    ReservationRepository    Database
  │              │                        │                      │                  │
  │──GET─────────>│                        │                      │                  │
  │ /reservations│                        │                      │                  │
  │ /{number}    │                        │                      │                  │
  │              │                        │                      │                  │
  │              │──getReservationByNumber>│                      │                  │
  │              │                        │                      │                  │
  │              │                        │──findByReservationNumber>│              │
  │              │                        │                      │                  │
  │              │                        │                      │──SELECT──────────>│
  │              │                        │                      │                  │
  │              │                        │                      │<──Reservation────│
  │              │                        │                      │                  │
  │              │                        │<──Optional<Reservation>│                │
  │              │                        │                      │                  │
  │              │                        │──mapToResponse()     │                  │
  │              │                        │                      │                  │
  │              │<──Response─────────────│                      │                  │
  │              │                        │                      │                  │
  │<──200 OK─────│                        │                      │                  │
  │   Response   │                        │                      │                  │
```

---

## Design Decisions & Justifications

### 1. Three-Tier Architecture
**Decision:** Separate Presentation, Business Logic, and Data Access layers  
**Justification:**
- Improves maintainability
- Enables independent testing
- Supports scalability
- Follows industry best practices

### 2. Repository Pattern (DAO)
**Decision:** Use Spring Data JPA repositories  
**Justification:**
- Abstracts database operations
- Reduces boilerplate code
- Provides query generation
- Supports multiple databases

### 3. DTO Pattern
**Decision:** Separate DTOs from entities  
**Justification:**
- Decouples API from database schema
- Enables API versioning
- Improves security (no password exposure)
- Validates input data

### 4. Enumeration for Constants
**Decision:** Use enums for RoomType, Status, Role  
**Justification:**
- Type-safe constants
- Prevents invalid values
- Self-documenting code
- Easy to extend

### 5. JWT Authentication
**Decision:** Token-based authentication  
**Justification:**
- Stateless authentication
- Scalable for distributed systems
- Secure token transmission
- Industry standard

### 6. Validation Annotations
**Decision:** Use Jakarta Bean Validation  
**Justification:**
- Declarative validation
- Reduces code duplication
- Consistent error messages
- Framework integration

---

## Assumptions

1. **Room Capacity:**
   - Standard: 20 rooms
   - Deluxe: 15 rooms
   - Suite: 10 rooms
   - Family: 8 rooms
   - Presidential: 3 rooms

2. **Business Rules:**
   - Check-in date must be today or future
   - Check-out must be after check-in
   - Minimum stay: 1 night
   - Maximum guests per reservation: 10

3. **User Roles:**
   - Receptionist: Create, view, update reservations
   - Manager: All receptionist rights + cancel
   - Admin: Full system access

4. **Reservation Status Flow:**
   - CONFIRMED → CHECKED_IN → CHECKED_OUT
   - Any status → CANCELLED
   - CONFIRMED → NO_SHOW

5. **Security:**
   - JWT tokens expire after 24 hours
   - Passwords encrypted with BCrypt
   - HTTPS required in production

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Created By:** Development Team
