package com.oceanview.controller;

import com.oceanview.dto.ApiResponse;
import com.oceanview.dto.LoginRequest;
import com.oceanview.dto.LoginResponse;
import com.oceanview.dto.RegisterRequest;
import com.oceanview.model.User;
import com.oceanview.model.UserRole;
import com.oceanview.security.JwtUtil;
import com.oceanview.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles user login and authentication
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            User user = userService.findByUsername(request.getUsername());
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            
            LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getContactNumber(),
                user.getAddress(),
                user.getRole().name(),
                "Login successful"
            );
            
            log.info("Login successful for user: {}", request.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
            
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid username or password"));
        }
    }
    
    @PostMapping("/register")
    @Operation(summary = "Guest registration", description = "Register a new guest user")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for username: {}", request.getUsername());
        
        try {
            // Check if username already exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Username already exists"));
            }
            
            // Create new guest user
            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setFullName(request.getFullName());
            newUser.setEmail(request.getEmail());
            newUser.setContactNumber(request.getContactNumber());
            newUser.setAddress(request.getAddress());
            newUser.setRole(UserRole.GUEST);
            
            User savedUser = userService.createUser(newUser);
            
            // Generate token for auto-login
            String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole().name());
            
            LoginResponse response = new LoginResponse(
                token,
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getContactNumber(),
                savedUser.getAddress(),
                savedUser.getRole().name(),
                "Registration successful"
            );
            
            log.info("Registration successful for user: {}", request.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
            
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/help")
    @Operation(summary = "System help", description = "Get help information for using the system")
    public ResponseEntity<ApiResponse<String>> getHelp() {
        String helpText = """
            === Ocean View Resort Reservation System - Help Guide ===
            
            1. LOGIN:
               - Use your username and password to access the system
               - You will receive a JWT token for subsequent requests
               - Include token in Authorization header: Bearer <token>
            
            2. CREATE RESERVATION:
               - POST /api/reservations
               - Provide guest details, room type, and dates
               - System validates availability automatically
            
            3. VIEW RESERVATIONS:
               - GET /api/reservations - View all reservations
               - GET /api/reservations/{number} - View specific reservation
               - GET /api/reservations/search?name={name} - Search by guest name
            
            4. MANAGE RESERVATIONS:
               - PUT /api/reservations/{number}/status - Update status
               - PUT /api/reservations/{number}/cancel - Cancel reservation
            
            5. ROOM TYPES & RATES:
               - STANDARD: LKR 5,000/night
               - DELUXE: LKR 8,000/night
               - SUITE: LKR 12,000/night
               - FAMILY: LKR 15,000/night
               - PRESIDENTIAL: LKR 25,000/night
            
            For technical support, contact: support@oceanviewresort.lk
            """;
        
        return ResponseEntity.ok(ApiResponse.success("Help information", helpText));
    }
}
