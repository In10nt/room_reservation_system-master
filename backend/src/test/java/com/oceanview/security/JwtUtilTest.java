package com.oceanview.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for JWT Utility
 */
@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = new User("testuser", "password", new ArrayList<>());
    }

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    public void testExtractUsername() {
        String token = jwtUtil.generateToken(userDetails);
        String username = jwtUtil.extractUsername(token);
        assertEquals("testuser", username);
    }

    @Test
    public void testValidateToken() {
        String token = jwtUtil.generateToken(userDetails);
        assertTrue(jwtUtil.validateToken(token, userDetails));
    }

    @Test
    public void testTokenNotExpired() {
        String token = jwtUtil.generateToken(userDetails);
        assertFalse(jwtUtil.isTokenExpired(token));
    }

    @Test
    public void testTokenWithDifferentUser() {
        String token = jwtUtil.generateToken(userDetails);
        UserDetails differentUser = new User("differentuser", "password", new ArrayList<>());
        assertFalse(jwtUtil.validateToken(token, differentUser));
    }

    @Test
    public void testExtractExpirationDate() {
        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(jwtUtil.extractExpiration(token));
    }
}
