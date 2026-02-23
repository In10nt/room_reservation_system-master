package com.oceanview.dto;

import com.oceanview.model.RoomType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Reservation Request DTO
 */
public class ReservationRequest {
    
    @NotBlank(message = "Guest name is required")
    @Size(min = 2, max = 100, message = "Guest name must be between 2 and 100 characters")
    private String guestName;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;
    
    @Email(message = "Valid email is required")
    private String email;
    
    @NotNull(message = "Room type is required")
    private RoomType roomType;
    
    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    @Min(value = 1, message = "At least one guest is required")
    @Max(value = 10, message = "Maximum 10 guests allowed")
    private Integer numberOfGuests;
    
    private String specialRequests;
    
    public ReservationRequest() {
    }
    
    public ReservationRequest(String guestName, String address, String contactNumber, String email, 
                             RoomType roomType, LocalDate checkInDate, LocalDate checkOutDate, 
                             Integer numberOfGuests, String specialRequests) {
        this.guestName = guestName;
        this.address = address;
        this.contactNumber = contactNumber;
        this.email = email;
        this.roomType = roomType;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.specialRequests = specialRequests;
    }
    
    public String getGuestName() {
        return guestName;
    }
    
    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getContactNumber() {
        return contactNumber;
    }
    
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public RoomType getRoomType() {
        return roomType;
    }
    
    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }
    
    public LocalDate getCheckInDate() {
        return checkInDate;
    }
    
    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }
    
    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }
    
    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }
    
    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }
    
    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}
