package com.oceanview.model;

/**
 * Reservation Status Enumeration
 * Tracks the lifecycle of a reservation
 */
public enum ReservationStatus {
    CONFIRMED,
    CHECKED_IN,
    CHECKED_OUT,
    CANCELLED,
    NO_SHOW
}
