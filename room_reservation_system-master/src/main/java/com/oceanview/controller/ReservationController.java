package com.oceanview.controller;

import com.oceanview.dto.ApiResponse;
import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.model.ReservationStatus;
import com.oceanview.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Reservation Controller
 * RESTful API endpoints for reservation management
 */
@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Reservation management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ReservationController {
    
    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);
    
    private final ReservationService reservationService;
    
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    
    @PostMapping
    @Operation(summary = "Create new reservation", description = "Create a new room reservation")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @Valid @RequestBody ReservationRequest request) {
        
        log.info("Creating reservation for guest: {}", request.getGuestName());
        ReservationResponse response = reservationService.createReservation(request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Reservation created successfully", response));
    }
    
    @PostMapping("/public")
    @Operation(summary = "Create public reservation request", description = "Create a reservation request from customer portal (no authentication required)")
    public ResponseEntity<ApiResponse<ReservationResponse>> createPublicReservation(
            @Valid @RequestBody ReservationRequest request) {
        
        log.info("Creating public reservation request for guest: {}", request.getGuestName());
        ReservationResponse response = reservationService.createReservation(request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Reservation request submitted successfully. Our team will contact you shortly to confirm.", response));
    }
    
    @GetMapping
    @Operation(summary = "Get all reservations", description = "Retrieve all reservations")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations() {
        log.info("Fetching all reservations");
        List<ReservationResponse> reservations = reservationService.getAllReservations();
        
        return ResponseEntity.ok(
            ApiResponse.success("Reservations retrieved successfully", reservations)
        );
    }
    
    @GetMapping("/{reservationNumber}")
    @Operation(summary = "Get reservation by number", description = "Retrieve specific reservation details")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservation(
            @PathVariable String reservationNumber) {
        
        log.info("Fetching reservation: {}", reservationNumber);
        ReservationResponse response = reservationService.getReservationByNumber(reservationNumber);
        
        return ResponseEntity.ok(
            ApiResponse.success("Reservation retrieved successfully", response)
        );
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search reservations", description = "Search reservations by guest name")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> searchReservations(
            @RequestParam String name) {
        
        log.info("Searching reservations for guest: {}", name);
        List<ReservationResponse> reservations = reservationService.searchByGuestName(name);
        
        return ResponseEntity.ok(
            ApiResponse.success("Search completed successfully", reservations)
        );
    }
    
    @PutMapping("/{reservationNumber}/status")
    @Operation(summary = "Update reservation status", description = "Update the status of a reservation")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(
            @PathVariable String reservationNumber,
            @RequestParam ReservationStatus status) {
        
        log.info("Updating reservation {} to status: {}", reservationNumber, status);
        ReservationResponse response = reservationService.updateReservationStatus(reservationNumber, status);
        
        return ResponseEntity.ok(
            ApiResponse.success("Reservation status updated successfully", response)
        );
    }
    
    @PutMapping("/{reservationNumber}/cancel")
    @Operation(summary = "Cancel reservation", description = "Cancel a reservation")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(
            @PathVariable String reservationNumber) {
        
        log.info("Cancelling reservation: {}", reservationNumber);
        ReservationResponse response = reservationService.cancelReservation(reservationNumber);
        
        return ResponseEntity.ok(
            ApiResponse.success("Reservation cancelled successfully", response)
        );
    }
    
    @PutMapping("/{reservationNumber}")
    @Operation(summary = "Update reservation", description = "Update an existing reservation")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservation(
            @PathVariable String reservationNumber,
            @Valid @RequestBody ReservationRequest request) {
        
        log.info("Updating reservation: {}", reservationNumber);
        ReservationResponse response = reservationService.updateReservation(reservationNumber, request);
        
        return ResponseEntity.ok(
            ApiResponse.success("Reservation updated successfully", response)
        );
    }
}
