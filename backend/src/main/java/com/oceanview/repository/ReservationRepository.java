package com.oceanview.repository;

import com.oceanview.model.Reservation;
import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Reservation Repository - Data Access Layer
 * Implements DAO Pattern for Reservation entity
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    Optional<Reservation> findByReservationNumber(String reservationNumber);
    
    List<Reservation> findByGuestNameContainingIgnoreCase(String guestName);
    
    List<Reservation> findByStatus(ReservationStatus status);
    
    List<Reservation> findByRoomType(RoomType roomType);
    
    List<Reservation> findByCheckInDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT r FROM Reservation r WHERE r.checkInDate <= :date AND r.checkOutDate >= :date AND r.status = :status")
    List<Reservation> findActiveReservationsOnDate(
        @Param("date") LocalDate date, 
        @Param("status") ReservationStatus status
    );
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.roomType = :roomType " +
           "AND r.status IN ('CONFIRMED', 'CHECKED_IN') " +
           "AND ((r.checkInDate <= :checkOut AND r.checkOutDate >= :checkIn))")
    long countOverlappingReservations(
        @Param("roomType") RoomType roomType,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
