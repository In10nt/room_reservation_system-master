package com.oceanview.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oceanview.dto.LoginRequest;
import com.oceanview.dto.ReservationRequest;
import com.oceanview.model.RoomType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for complete reservation workflow
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ReservationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;

    @BeforeEach
    public void setUp() throws Exception {
        // Login to get auth token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("admin123");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        authToken = objectMapper.readTree(response).get("data").get("token").asText();
    }

    @Test
    public void testCompleteReservationWorkflow() throws Exception {
        // 1. Create reservation
        ReservationRequest request = createValidReservationRequest();

        MvcResult createResult = mockMvc.perform(post("/api/reservations")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.reservationNumber").exists())
                .andReturn();

        String reservationNumber = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("reservationNumber").asText();

        // 2. Get reservation details
        mockMvc.perform(get("/api/reservations/" + reservationNumber)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.guestName").value("John Doe"));

        // 3. Check in
        mockMvc.perform(put("/api/reservations/" + reservationNumber + "/status?status=CHECKED_IN")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CHECKED_IN"));

        // 4. Check out
        mockMvc.perform(put("/api/reservations/" + reservationNumber + "/status?status=CHECKED_OUT")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CHECKED_OUT"));
    }

    @Test
    public void testSearchReservationsByGuestName() throws Exception {
        // Create a reservation first
        ReservationRequest request = createValidReservationRequest();
        mockMvc.perform(post("/api/reservations")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Search for the reservation
        mockMvc.perform(get("/api/reservations/search?name=John")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].guestName").value("John Doe"));
    }

    @Test
    public void testGetAllReservations() throws Exception {
        mockMvc.perform(get("/api/reservations")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    public void testUnauthorizedAccessWithoutToken() throws Exception {
        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testCancelReservation() throws Exception {
        // Create reservation
        ReservationRequest request = createValidReservationRequest();
        MvcResult createResult = mockMvc.perform(post("/api/reservations")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String reservationNumber = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("reservationNumber").asText();

        // Cancel reservation
        mockMvc.perform(put("/api/reservations/" + reservationNumber + "/cancel")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }

    private ReservationRequest createValidReservationRequest() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestName("John Doe");
        request.setEmail("john@example.com");
        request.setContactNumber("0771234567");
        request.setAddress("123 Main St, Colombo");
        request.setRoomType(RoomType.DELUXE);
        request.setCheckInDate(LocalDate.now().plusDays(1));
        request.setCheckOutDate(LocalDate.now().plusDays(4));
        request.setNumberOfGuests(2);
        request.setSpecialRequests("Late check-in");
        return request;
    }
}
