package com.oceanview.service;

import com.oceanview.model.User;
import com.oceanview.model.UserRole;
import com.oceanview.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for User Service
 */
@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindUserByUsername() {
        User user = userService.findByUsername("admin");
        assertNotNull(user);
        assertEquals("admin", user.getUsername());
        assertEquals(UserRole.ADMIN, user.getRole());
    }

    @Test
    public void testFindNonExistentUser() {
        User user = userService.findByUsername("nonexistent");
        assertNull(user);
    }

    @Test
    public void testUserHasCorrectRole() {
        User admin = userService.findByUsername("admin");
        User receptionist = userService.findByUsername("receptionist");
        User manager = userService.findByUsername("manager");

        assertEquals(UserRole.ADMIN, admin.getRole());
        assertEquals(UserRole.RECEPTIONIST, receptionist.getRole());
        assertEquals(UserRole.MANAGER, manager.getRole());
    }

    @Test
    public void testUserPasswordIsEncoded() {
        User user = userService.findByUsername("admin");
        assertNotNull(user.getPassword());
        // Password should be BCrypt encoded (starts with $2a$ or $2b$)
        assertTrue(user.getPassword().startsWith("$2"));
    }
}
