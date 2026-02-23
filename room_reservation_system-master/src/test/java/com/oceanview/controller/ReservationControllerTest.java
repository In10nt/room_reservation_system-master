package com.oceanview.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import com.oceanview.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ReservationController
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Reservation Controller Integration Tests")
class ReservationControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private ReservationService reservationService;
    
    private ReservationRequest validRequest;
    private ReservationResponse mockResponse;
    
    @BeforeEach
    void setUp() {
        validRequest = new ReservationRequest();
        validRequest.setGuestName("John Doe");
        validRequest.setAddress("123 Main St, Colombo");
        validRequest.setContactNumber("0771234567");
        validRequest.setEmail("john@example.com");
        validRequest.setRoomType(RoomType.DELUXE);
        validRequest.setCheckInDate(LocalDate.now().plusDays(1));
        validRequest.setCheckOutDate(LocalDate.now().plusDays(3));
        validRequest.setNumberOfGuests(2);
        
        mockResponse = new ReservationResponse();
        mockResponse.setId(1L);
        mockResponse.setReservationNumber("RES123456");
        mockResponse.setGuestName("John Doe");
        mockResponse.setAddress("123 Main St, Colombo");
        mockResponse.setContactNumber("0771234567");
        mockResponse.setEmail("john@example.com");
        mockResponse.setRoomType(RoomType.DELUXE);
        mockResponse.setCheckInDate(LocalDate.now().plusDays(1));
        mockResponse.setCheckOutDate(LocalDate.now().plusDays(3));
        mockResponse.setStatus(ReservationStatus.CONFIRMED);
        mockResponse.setNumberOfGuests(2);
        mockResponse.setTotalAmount(new BigDecimal("16000.00"));
        mockResponse.setNumberOfNights(2);
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Should create reservation successfully")
    void testCreateReservation() throws Exception {
        when(reservationService.createReservation(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.reservationNumber").value("RES123456"))
                .andExpect(jsonPath("$.data.guestName").value("John Doe"));
    }
    
    @Test
    @WithMockUser(roles = "RECEPTIONIST")
    @DisplayName("Should get all reservations")
    void testGetAllReservations() throws Exception {
        List<ReservationResponse> mockList = Arrays.asList(mockResponse);
        when(reservationService.getAllReservations()).thenReturn(mockList);
        
        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].reservationNumber").value("RES123456"));
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Should get reservation by number")
    void testGetReservationByNumber() throws Exception {
        when(reservationService.getReservationByNumber("RES123456")).thenReturn(mockResponse);
        
        mockMvc.perform(get("/api/reservations/RES123456"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.reservationNumber").value("RES123456"));
    }
    
    @Test
    @DisplayName("Should return 401 when not authenticated")
    void testUnauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isUnauthorized());
    }
}
