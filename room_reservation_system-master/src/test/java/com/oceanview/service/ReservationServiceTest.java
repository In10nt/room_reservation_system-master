package com.oceanview.service;

import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.exception.ValidationException;
import com.oceanview.model.Reservation;
import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import com.oceanview.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test class for ReservationService
 * Demonstrates Test-Driven Development (TDD) approach
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Reservation Service Tests")
class ReservationServiceTest {
    
    @Mock
    private ReservationRepository reservationRepository;
    
    @InjectMocks
    private ReservationService reservationService;
    
    private ReservationRequest validRequest;
    private Reservation mockReservation;
    
    @BeforeEach
    void setUp() {
        // Arrange - Setup test data
        validRequest = new ReservationRequest();
        validRequest.setGuestName("John Doe");
        validRequest.setAddress("123 Main St, Colombo");
        validRequest.setContactNumber("0771234567");
        validRequest.setEmail("john@example.com");
        validRequest.setRoomType(RoomType.DELUXE);
        validRequest.setCheckInDate(LocalDate.now().plusDays(1));
        validRequest.setCheckOutDate(LocalDate.now().plusDays(3));
        validRequest.setNumberOfGuests(2);
        
        mockReservation = new Reservation();
        mockReservation.setId(1L);
        mockReservation.setReservationNumber("RES123456");
        mockReservation.setGuestName("John Doe");
        mockReservation.setAddress("123 Main St, Colombo");
        mockReservation.setContactNumber("0771234567");
        mockReservation.setEmail("john@example.com");
        mockReservation.setRoomType(RoomType.DELUXE);
        mockReservation.setCheckInDate(LocalDate.now().plusDays(1));
        mockReservation.setCheckOutDate(LocalDate.now().plusDays(3));
        mockReservation.setStatus(ReservationStatus.CONFIRMED);
        mockReservation.setNumberOfGuests(2);
        mockReservation.setTotalAmount(new BigDecimal("16000.00"));
    }
    
    @Test
    @DisplayName("Should create reservation successfully with valid data")
    void testCreateReservation_Success() {
        // Arrange
        when(reservationRepository.countOverlappingReservations(any(), any(), any())).thenReturn(0L);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(mockReservation);
        
        // Act
        ReservationResponse response = reservationService.createReservation(validRequest);
        
        // Assert
        assertNotNull(response);
        assertEquals("RES123456", response.getReservationNumber());
        assertEquals("John Doe", response.getGuestName());
        assertEquals(RoomType.DELUXE, response.getRoomType());
        assertEquals(ReservationStatus.CONFIRMED, response.getStatus());
        
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }
    
    @Test
    @DisplayName("Should throw ValidationException when check-out date is before check-in date")
    void testCreateReservation_InvalidDates() {
        // Arrange
        validRequest.setCheckOutDate(LocalDate.now());
        validRequest.setCheckInDate(LocalDate.now().plusDays(2));
        
        // Act & Assert
        assertThrows(ValidationException.class, () -> {
            reservationService.createReservation(validRequest);
        });
        
        verify(reservationRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should throw ValidationException when check-in date is in the past")
    void testCreateReservation_PastCheckInDate() {
        // Arrange
        validRequest.setCheckInDate(LocalDate.now().minusDays(1));
        validRequest.setCheckOutDate(LocalDate.now().plusDays(1));
        
        // Act & Assert
        assertThrows(ValidationException.class, () -> {
            reservationService.createReservation(validRequest);
        });
        
        verify(reservationRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should throw ValidationException when no rooms available")
    void testCreateReservation_NoRoomsAvailable() {
        // Arrange
        when(reservationRepository.countOverlappingReservations(any(), any(), any())).thenReturn(15L);
        
        // Act & Assert
        assertThrows(ValidationException.class, () -> {
            reservationService.createReservation(validRequest);
        });
        
        verify(reservationRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should retrieve reservation by reservation number")
    void testGetReservationByNumber_Success() {
        // Arrange
        when(reservationRepository.findByReservationNumber("RES123456"))
            .thenReturn(Optional.of(mockReservation));
        
        // Act
        ReservationResponse response = reservationService.getReservationByNumber("RES123456");
        
        // Assert
        assertNotNull(response);
        assertEquals("RES123456", response.getReservationNumber());
        assertEquals("John Doe", response.getGuestName());
        
        verify(reservationRepository, times(1)).findByReservationNumber("RES123456");
    }
    
    @Test
    @DisplayName("Should throw ResourceNotFoundException when reservation not found")
    void testGetReservationByNumber_NotFound() {
        // Arrange
        when(reservationRepository.findByReservationNumber("INVALID"))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.getReservationByNumber("INVALID");
        });
    }
    
    @Test
    @DisplayName("Should retrieve all reservations")
    void testGetAllReservations() {
        // Arrange
        List<Reservation> mockReservations = Arrays.asList(mockReservation, mockReservation);
        when(reservationRepository.findAll()).thenReturn(mockReservations);
        
        // Act
        List<ReservationResponse> responses = reservationService.getAllReservations();
        
        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        
        verify(reservationRepository, times(1)).findAll();
    }
    
    @Test
    @DisplayName("Should search reservations by guest name")
    void testSearchByGuestName() {
        // Arrange
        List<Reservation> mockReservations = Arrays.asList(mockReservation);
        when(reservationRepository.findByGuestNameContainingIgnoreCase("John"))
            .thenReturn(mockReservations);
        
        // Act
        List<ReservationResponse> responses = reservationService.searchByGuestName("John");
        
        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("John Doe", responses.get(0).getGuestName());
        
        verify(reservationRepository, times(1)).findByGuestNameContainingIgnoreCase("John");
    }
    
    @Test
    @DisplayName("Should update reservation status successfully")
    void testUpdateReservationStatus() {
        // Arrange
        when(reservationRepository.findByReservationNumber("RES123456"))
            .thenReturn(Optional.of(mockReservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(mockReservation);
        
        // Act
        ReservationResponse response = reservationService.updateReservationStatus(
            "RES123456", ReservationStatus.CHECKED_IN
        );
        
        // Assert
        assertNotNull(response);
        
        verify(reservationRepository, times(1)).findByReservationNumber("RES123456");
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }
    
    @Test
    @DisplayName("Should cancel reservation successfully")
    void testCancelReservation() {
        // Arrange
        when(reservationRepository.findByReservationNumber("RES123456"))
            .thenReturn(Optional.of(mockReservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(mockReservation);
        
        // Act
        ReservationResponse response = reservationService.cancelReservation("RES123456");
        
        // Assert
        assertNotNull(response);
        
        verify(reservationRepository, times(1)).findByReservationNumber("RES123456");
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }
}
