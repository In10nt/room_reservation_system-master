package com.oceanview.config;

import com.oceanview.model.UserRole;
import com.oceanview.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Data Initializer
 * Creates default users on application startup
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    
    private final UserService userService;
    
    public DataInitializer(UserService userService) {
        this.userService = userService;
    }
    
    @Override
    public void run(String... args) {
        try {
            // Create default admin user
            userService.createUser("admin", "admin123", "System Administrator", UserRole.ADMIN);
            log.info("Default admin user created - Username: admin, Password: admin123");
            
            // Create receptionist user
            userService.createUser("receptionist", "recep123", "Front Desk Receptionist", UserRole.RECEPTIONIST);
            log.info("Default receptionist user created - Username: receptionist, Password: recep123");
            
            // Create manager user
            userService.createUser("manager", "manager123", "Hotel Manager", UserRole.MANAGER);
            log.info("Default manager user created - Username: manager, Password: manager123");
            
        } catch (Exception e) {
            log.info("Default users already exist or error occurred: {}", e.getMessage());
        }
    }
}
