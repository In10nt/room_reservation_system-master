package com.oceanview.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for JWT Utility
 */
@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private String testUsername;
    private String testRole;

    @BeforeEach
    public void setUp() {
        testUsername = "testuser";
        testRole = "ADMIN";
    }

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken(testUsername, testRole);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    public void testExtractUsername() {
        String token = jwtUtil.generateToken(testUsername, testRole);
        String username = jwtUtil.extractUsername(token);
        assertEquals("testuser", username);
    }

    @Test
    public void testValidateToken() {
        String token = jwtUtil.generateToken(testUsername, testRole);
        assertTrue(jwtUtil.validateToken(token, testUsername));
    }

    @Test
    public void testValidateTokenWithDifferentUser() {
        String token = jwtUtil.generateToken(testUsername, testRole);
        assertFalse(jwtUtil.validateToken(token, "differentuser"));
    }

    @Test
    public void testGenerateTokenWithDifferentRoles() {
        String adminToken = jwtUtil.generateToken(testUsername, "ADMIN");
        String receptionistToken = jwtUtil.generateToken(testUsername, "RECEPTIONIST");
        
        assertNotNull(adminToken);
        assertNotNull(receptionistToken);
        assertNotEquals(adminToken, receptionistToken);
    }

    @Test
    public void testExtractUsernameFromMultipleTokens() {
        String token1 = jwtUtil.generateToken("user1", "ADMIN");
        String token2 = jwtUtil.generateToken("user2", "RECEPTIONIST");
        
        assertEquals("user1", jwtUtil.extractUsername(token1));
        assertEquals("user2", jwtUtil.extractUsername(token2));
    }
}
