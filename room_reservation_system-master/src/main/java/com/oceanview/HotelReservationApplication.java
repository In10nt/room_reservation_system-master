package com.oceanview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Class for Ocean View Resort Reservation System
 * This is a Spring Boot application implementing a 3-tier architecture
 * with RESTful web services for hotel room reservation management.
 * 
 * @author Ocean View Resort Development Team
 * @version 1.0.0
 */
@SpringBootApplication
public class HotelReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelReservationApplication.class, args);
        System.out.println("\n==============================================");
        System.out.println("Ocean View Resort Reservation System Started");
        System.out.println("Access API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("==============================================\n");
    }
}
