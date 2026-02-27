package com.oceanview.config;

import com.oceanview.model.Reservation;
import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import com.oceanview.repository.ReservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Reservation Data Initializer
 * Creates sample reservations on application startup for testing and demonstration
 */
@Component
@Order(2) // Run after UserDataInitializer
public class ReservationDataInitializer implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(ReservationDataInitializer.class);
    
    private final ReservationRepository reservationRepository;
    
    public ReservationDataInitializer(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    
    @Override
    public void run(String... args) {
        try {
            // Check if reservations already exist
            long count = reservationRepository.count();
            if (count > 0) {
                log.info("Sample reservations already exist ({} reservations found)", count);
                return;
            }
            
            log.info("Creating sample reservations...");
            
            // Sample Reservation 1 - Confirmed
            Reservation res1 = new Reservation();
            res1.setReservationNumber("RES1001");
            res1.setGuestName("John Doe");
            res1.setAddress("123 Main St, Colombo");
            res1.setContactNumber("0771234567");
            res1.setEmail("john.doe@email.com");
            res1.setRoomType(RoomType.DELUXE);
            res1.setCheckInDate(LocalDate.now().plusDays(5));
            res1.setCheckOutDate(LocalDate.now().plusDays(9));
            res1.setStatus(ReservationStatus.CONFIRMED);
            res1.setNumberOfGuests(2);
            res1.setSpecialRequests("Late check-in requested");
            res1.setTotalAmount(new BigDecimal("32000.00"));
            reservationRepository.save(res1);
            
            // Sample Reservation 2 - Confirmed
            Reservation res2 = new Reservation();
            res2.setReservationNumber("RES1002");
            res2.setGuestName("Jane Smith");
            res2.setAddress("456 Beach Rd, Galle");
            res2.setContactNumber("0772345678");
            res2.setEmail("jane.smith@email.com");
            res2.setRoomType(RoomType.SUITE);
            res2.setCheckInDate(LocalDate.now().plusDays(10));
            res2.setCheckOutDate(LocalDate.now().plusDays(15));
            res2.setStatus(ReservationStatus.CONFIRMED);
            res2.setNumberOfGuests(2);
            res2.setSpecialRequests("Ocean view preferred");
            res2.setTotalAmount(new BigDecimal("60000.00"));
            reservationRepository.save(res2);
            
            // Sample Reservation 3 - Confirmed
            Reservation res3 = new Reservation();
            res3.setReservationNumber("RES1003");
            res3.setGuestName("Bob Johnson");
            res3.setAddress("789 Hill St, Kandy");
            res3.setContactNumber("0773456789");
            res3.setEmail("bob.johnson@email.com");
            res3.setRoomType(RoomType.FAMILY);
            res3.setCheckInDate(LocalDate.now().plusDays(20));
            res3.setCheckOutDate(LocalDate.now().plusDays(25));
            res3.setStatus(ReservationStatus.CONFIRMED);
            res3.setNumberOfGuests(4);
            res3.setSpecialRequests("Extra bed for children");
            res3.setTotalAmount(new BigDecimal("75000.00"));
            reservationRepository.save(res3);
            
            // Sample Reservation 4 - Checked In
            Reservation res4 = new Reservation();
            res4.setReservationNumber("RES1004");
            res4.setGuestName("Alice Williams");
            res4.setAddress("321 Park Ave, Colombo");
            res4.setContactNumber("0774567890");
            res4.setEmail("alice.williams@email.com");
            res4.setRoomType(RoomType.PRESIDENTIAL);
            res4.setCheckInDate(LocalDate.now().minusDays(2));
            res4.setCheckOutDate(LocalDate.now().plusDays(3));
            res4.setStatus(ReservationStatus.CHECKED_IN);
            res4.setNumberOfGuests(2);
            res4.setSpecialRequests("VIP treatment, champagne on arrival");
            res4.setTotalAmount(new BigDecimal("125000.00"));
            reservationRepository.save(res4);
            
            // Sample Reservation 5 - Checked Out
            Reservation res5 = new Reservation();
            res5.setReservationNumber("RES1005");
            res5.setGuestName("Charlie Brown");
            res5.setAddress("654 Lake View, Kandy");
            res5.setContactNumber("0775678901");
            res5.setEmail("charlie.brown@email.com");
            res5.setRoomType(RoomType.STANDARD);
            res5.setCheckInDate(LocalDate.now().minusDays(7));
            res5.setCheckOutDate(LocalDate.now().minusDays(4));
            res5.setStatus(ReservationStatus.CHECKED_OUT);
            res5.setNumberOfGuests(1);
            res5.setSpecialRequests("Quiet room preferred");
            res5.setTotalAmount(new BigDecimal("15000.00"));
            reservationRepository.save(res5);
            
            // Sample Reservation 6 - Checked Out
            Reservation res6 = new Reservation();
            res6.setReservationNumber("RES1006");
            res6.setGuestName("Diana Prince");
            res6.setAddress("987 Ocean Drive, Galle");
            res6.setContactNumber("0776789012");
            res6.setEmail("diana.prince@email.com");
            res6.setRoomType(RoomType.DELUXE);
            res6.setCheckInDate(LocalDate.now().minusDays(10));
            res6.setCheckOutDate(LocalDate.now().minusDays(7));
            res6.setStatus(ReservationStatus.CHECKED_OUT);
            res6.setNumberOfGuests(2);
            res6.setSpecialRequests("Anniversary celebration");
            res6.setTotalAmount(new BigDecimal("24000.00"));
            reservationRepository.save(res6);
            
            // Sample Reservation 7 - Cancelled
            Reservation res7 = new Reservation();
            res7.setReservationNumber("RES1007");
            res7.setGuestName("Edward Norton");
            res7.setAddress("147 City Center, Colombo");
            res7.setContactNumber("0777890123");
            res7.setEmail("edward.norton@email.com");
            res7.setRoomType(RoomType.SUITE);
            res7.setCheckInDate(LocalDate.now().plusDays(15));
            res7.setCheckOutDate(LocalDate.now().plusDays(18));
            res7.setStatus(ReservationStatus.CANCELLED);
            res7.setNumberOfGuests(2);
            res7.setSpecialRequests("Business trip");
            res7.setTotalAmount(new BigDecimal("36000.00"));
            reservationRepository.save(res7);
            
            // Sample Reservation 8 - Confirmed
            Reservation res8 = new Reservation();
            res8.setReservationNumber("RES1008");
            res8.setGuestName("Fiona Green");
            res8.setAddress("258 Garden Road, Kandy");
            res8.setContactNumber("0778901234");
            res8.setEmail("fiona.green@email.com");
            res8.setRoomType(RoomType.FAMILY);
            res8.setCheckInDate(LocalDate.now().plusDays(30));
            res8.setCheckOutDate(LocalDate.now().plusDays(37));
            res8.setStatus(ReservationStatus.CONFIRMED);
            res8.setNumberOfGuests(5);
            res8.setSpecialRequests("Family vacation, need crib");
            res8.setTotalAmount(new BigDecimal("105000.00"));
            reservationRepository.save(res8);
            
            // Sample Reservation 9 - Checked In
            Reservation res9 = new Reservation();
            res9.setReservationNumber("RES1009");
            res9.setGuestName("George Harris");
            res9.setAddress("369 Mountain View, Nuwara Eliya");
            res9.setContactNumber("0779012345");
            res9.setEmail("george.harris@email.com");
            res9.setRoomType(RoomType.STANDARD);
            res9.setCheckInDate(LocalDate.now().minusDays(1));
            res9.setCheckOutDate(LocalDate.now().plusDays(2));
            res9.setStatus(ReservationStatus.CHECKED_IN);
            res9.setNumberOfGuests(1);
            res9.setSpecialRequests("Business traveler");
            res9.setTotalAmount(new BigDecimal("15000.00"));
            reservationRepository.save(res9);
            
            // Sample Reservation 10 - Confirmed
            Reservation res10 = new Reservation();
            res10.setReservationNumber("RES1010");
            res10.setGuestName("Hannah Lee");
            res10.setAddress("741 Sunset Blvd, Colombo");
            res10.setContactNumber("0770123456");
            res10.setEmail("hannah.lee@email.com");
            res10.setRoomType(RoomType.DELUXE);
            res10.setCheckInDate(LocalDate.now().plusDays(7));
            res10.setCheckOutDate(LocalDate.now().plusDays(10));
            res10.setStatus(ReservationStatus.CONFIRMED);
            res10.setNumberOfGuests(2);
            res10.setSpecialRequests("Honeymoon package");
            res10.setTotalAmount(new BigDecimal("24000.00"));
            reservationRepository.save(res10);
            
            log.info("✅ Successfully created 10 sample reservations");
            log.info("   - 5 CONFIRMED reservations");
            log.info("   - 2 CHECKED_IN reservations");
            log.info("   - 2 CHECKED_OUT reservations");
            log.info("   - 1 CANCELLED reservation");
            
        } catch (Exception e) {
            log.error("Error creating sample reservations: {}", e.getMessage());
        }
    }
}
