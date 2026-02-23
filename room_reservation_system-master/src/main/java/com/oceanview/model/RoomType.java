package com.oceanview.model;

import java.math.BigDecimal;

/**
 * Room Type Enumeration
 * Defines available room types with pricing
 */
public enum RoomType {
    STANDARD(new BigDecimal("5000.00"), "Standard Room with basic amenities"),
    DELUXE(new BigDecimal("8000.00"), "Deluxe Room with ocean view"),
    SUITE(new BigDecimal("12000.00"), "Luxury Suite with premium amenities"),
    FAMILY(new BigDecimal("15000.00"), "Family Room with multiple beds"),
    PRESIDENTIAL(new BigDecimal("25000.00"), "Presidential Suite with exclusive services");
    
    private final BigDecimal ratePerNight;
    private final String description;
    
    RoomType(BigDecimal ratePerNight, String description) {
        this.ratePerNight = ratePerNight;
        this.description = description;
    }
    
    public BigDecimal getRatePerNight() {
        return ratePerNight;
    }
    
    public String getDescription() {
        return description;
    }
}
