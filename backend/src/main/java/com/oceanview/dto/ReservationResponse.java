package com.oceanview.dto;

import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Reservation Response DTO
 */
public class ReservationResponse {
    
    private Long id;
    private String reservationNumber;
    private String guestName;
    private String address;
    private String contactNumber;
    private String email;
    private RoomType roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private ReservationStatus status;
    private Integer numberOfGuests;
    private String specialRequests;
    private BigDecimal totalAmount;
    private long numberOfNights;
    
    public ReservationResponse() {
    }
    
    public ReservationResponse(Long id, String reservationNumber, String guestName, String address, 
                              String contactNumber, String email, RoomType roomType, LocalDate checkInDate, 
                              LocalDate checkOutDate, ReservationStatus status, Integer numberOfGuests, 
                              String specialRequests, BigDecimal totalAmount, long numberOfNights) {
        this.id = id;
        this.reservationNumber = reservationNumber;
        this.guestName = guestName;
        this.address = address;
        this.contactNumber = contactNumber;
        this.email = email;
        this.roomType = roomType;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
        this.numberOfGuests = numberOfGuests;
        this.specialRequests = specialRequests;
        this.totalAmount = totalAmount;
        this.numberOfNights = numberOfNights;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getReservationNumber() {
        return reservationNumber;
    }
    
    public void setReservationNumber(String reservationNumber) {
        this.reservationNumber = reservationNumber;
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
    
    public ReservationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReservationStatus status) {
        this.status = status;
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
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public long getNumberOfNights() {
        return numberOfNights;
    }
    
    public void setNumberOfNights(long numberOfNights) {
        this.numberOfNights = numberOfNights;
    }
}
