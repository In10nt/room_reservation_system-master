package com.oceanview.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for Reservation Model
 */
public class ReservationTest {

    private Reservation reservation;

    @BeforeEach
    public void setUp() {
        reservation = new Reservation();
        reservation.setGuestName("John Doe");
        reservation.setEmail("john@example.com");
        reservation.setContactNumber("0771234567");
        reservation.setAddress("123 Main St, Colombo");
        reservation.setRoomType(RoomType.DELUXE);
        reservation.setCheckInDate(LocalDate.now());
        reservation.setCheckOutDate(LocalDate.now().plusDays(3));
        reservation.setNumberOfGuests(2);
        reservation.setStatus(ReservationStatus.CONFIRMED);
    }

    @Test
    public void testReservationNumberGeneration() {
        assertNotNull(reservation.getReservationNumber());
        assertTrue(reservation.getReservationNumber().startsWith("RES-"));
    }

    @Test
    public void testNumberOfNightsCalculation() {
        assertEquals(3, reservation.getNumberOfNights());
    }

    @Test
    public void testTotalAmountCalculation() {
        // DELUXE room: 8000 per night per person
        // 3 nights * 2 guests * 8000 = 48000
        assertEquals(48000.0, reservation.getTotalAmount());
    }

    @Test
    public void testStandardRoomPricing() {
        reservation.setRoomType(RoomType.STANDARD);
        // STANDARD: 5000 per night per person
        // 3 nights * 2 guests * 5000 = 30000
        assertEquals(30000.0, reservation.getTotalAmount());
    }

    @Test
    public void testSuiteRoomPricing() {
        reservation.setRoomType(RoomType.SUITE);
        // SUITE: 12000 per night per person
        // 3 nights * 2 guests * 12000 = 72000
        assertEquals(72000.0, reservation.getTotalAmount());
    }

    @Test
    public void testFamilyRoomPricing() {
        reservation.setRoomType(RoomType.FAMILY);
        // FAMILY: 15000 per night per person
        // 3 nights * 2 guests * 15000 = 90000
        assertEquals(90000.0, reservation.getTotalAmount());
    }

    @Test
    public void testPresidentialRoomPricing() {
        reservation.setRoomType(RoomType.PRESIDENTIAL);
        // PRESIDENTIAL: 25000 per night per person
        // 3 nights * 2 guests * 25000 = 150000
        assertEquals(150000.0, reservation.getTotalAmount());
    }

    @Test
    public void testSingleNightReservation() {
        reservation.setCheckOutDate(LocalDate.now().plusDays(1));
        assertEquals(1, reservation.getNumberOfNights());
    }

    @Test
    public void testMultipleGuestsPricing() {
        reservation.setNumberOfGuests(4);
        // DELUXE: 8000 per night per person
        // 3 nights * 4 guests * 8000 = 96000
        assertEquals(96000.0, reservation.getTotalAmount());
    }

    @Test
    public void testReservationStatusChange() {
        assertEquals(ReservationStatus.CONFIRMED, reservation.getStatus());
        
        reservation.setStatus(ReservationStatus.CHECKED_IN);
        assertEquals(ReservationStatus.CHECKED_IN, reservation.getStatus());
        
        reservation.setStatus(ReservationStatus.CHECKED_OUT);
        assertEquals(ReservationStatus.CHECKED_OUT, reservation.getStatus());
    }

    @Test
    public void testGuestInformationStorage() {
        assertEquals("John Doe", reservation.getGuestName());
        assertEquals("john@example.com", reservation.getEmail());
        assertEquals("0771234567", reservation.getContactNumber());
        assertEquals("123 Main St, Colombo", reservation.getAddress());
    }
}
