package com.oceanview.service;

import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.exception.ValidationException;
import com.oceanview.model.Reservation;
import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import com.oceanview.repository.ReservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Reservation Service - Business Logic Layer
 * Implements business rules and validation
 */
@Service
@Transactional
public class ReservationService {
    
    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);
    
    private final ReservationRepository reservationRepository;
    
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    
    /**
     * Creates a new reservation with validation
     */
    public ReservationResponse createReservation(ReservationRequest request) {
        log.info("Creating reservation for guest: {}", request.getGuestName());
        
        validateReservationDates(request.getCheckInDate(), request.getCheckOutDate());
        checkRoomAvailability(request.getRoomType(), request.getCheckInDate(), request.getCheckOutDate());
        
        Reservation reservation = mapToEntity(request);
        reservation = reservationRepository.save(reservation);
        
        log.info("Reservation created successfully: {}", reservation.getReservationNumber());
        return mapToResponse(reservation);
    }
    
    /**
     * Retrieves reservation by reservation number
     */
    @Transactional(readOnly = true)
    public ReservationResponse getReservationByNumber(String reservationNumber) {
        log.info("Fetching reservation: {}", reservationNumber);
        
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));
        
        return mapToResponse(reservation);
    }
    
    /**
     * Retrieves all reservations
     */
    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Searches reservations by guest name
     */
    @Transactional(readOnly = true)
    public List<ReservationResponse> searchByGuestName(String guestName) {
        return reservationRepository.findByGuestNameContainingIgnoreCase(guestName).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Updates reservation status
     */
    public ReservationResponse updateReservationStatus(String reservationNumber, ReservationStatus status) {
        log.info("Updating reservation {} to status: {}", reservationNumber, status);
        
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));
        
        reservation.setStatus(status);
        reservation = reservationRepository.save(reservation);
        
        return mapToResponse(reservation);
    }
    
    /**
     * Cancels a reservation
     */
    public ReservationResponse cancelReservation(String reservationNumber) {
        return updateReservationStatus(reservationNumber, ReservationStatus.CANCELLED);
    }
    
    /**
     * Updates an existing reservation
     */
    public ReservationResponse updateReservation(String reservationNumber, ReservationRequest request) {
        log.info("Updating reservation: {}", reservationNumber);
        
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));
        
        // Only allow updates for CONFIRMED reservations
        if (!reservation.getStatus().equals(ReservationStatus.CONFIRMED)) {
            throw new ValidationException("Can only update CONFIRMED reservations");
        }
        
        validateReservationDates(request.getCheckInDate(), request.getCheckOutDate());
        
        // Update fields
        reservation.setGuestName(request.getGuestName());
        reservation.setAddress(request.getAddress());
        reservation.setContactNumber(request.getContactNumber());
        reservation.setEmail(request.getEmail());
        reservation.setRoomType(request.getRoomType());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        
        reservation = reservationRepository.save(reservation);
        
        log.info("Reservation updated successfully: {}", reservationNumber);
        return mapToResponse(reservation);
    }
    
    /**
     * Validates reservation dates
     */
    private void validateReservationDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new ValidationException("Check-out date must be after check-in date");
        }
        
        if (checkIn.isBefore(LocalDate.now())) {
            throw new ValidationException("Check-in date cannot be in the past");
        }
    }
    
    /**
     * Checks room availability for given dates
     */
    private void checkRoomAvailability(RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        long overlapping = reservationRepository.countOverlappingReservations(roomType, checkIn, checkOut);
        
        int maxRooms = getMaxRoomsForType(roomType);
        if (overlapping >= maxRooms) {
            throw new ValidationException("No rooms available for selected dates");
        }
    }
    
    /**
     * Gets maximum rooms available for each room type
     */
    private int getMaxRoomsForType(RoomType roomType) {
        return switch (roomType) {
            case STANDARD -> 20;
            case DELUXE -> 15;
            case SUITE -> 10;
            case FAMILY -> 8;
            case PRESIDENTIAL -> 3;
        };
    }
    
    /**
     * Maps request DTO to entity
     */
    private Reservation mapToEntity(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setGuestName(request.getGuestName());
        reservation.setAddress(request.getAddress());
        reservation.setContactNumber(request.getContactNumber());
        reservation.setEmail(request.getEmail());
        reservation.setRoomType(request.getRoomType());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        return reservation;
    }
    
    /**
     * Maps entity to response DTO
     */
    private ReservationResponse mapToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setReservationNumber(reservation.getReservationNumber());
        response.setGuestName(reservation.getGuestName());
        response.setAddress(reservation.getAddress());
        response.setContactNumber(reservation.getContactNumber());
        response.setEmail(reservation.getEmail());
        response.setRoomType(reservation.getRoomType());
        response.setCheckInDate(reservation.getCheckInDate());
        response.setCheckOutDate(reservation.getCheckOutDate());
        response.setStatus(reservation.getStatus());
        response.setNumberOfGuests(reservation.getNumberOfGuests());
        response.setSpecialRequests(reservation.getSpecialRequests());
        response.setTotalAmount(reservation.getTotalAmount());
        response.setNumberOfNights(reservation.getNumberOfNights());
        return response;
    }
}
