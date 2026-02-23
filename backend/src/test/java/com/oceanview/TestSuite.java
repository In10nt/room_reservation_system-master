package com.oceanview;

import com.oceanview.controller.AuthControllerTest;
import com.oceanview.controller.ReservationControllerTest;
import com.oceanview.integration.ReservationIntegrationTest;
import com.oceanview.model.ReservationTest;
import com.oceanview.security.JwtUtilTest;
import com.oceanview.service.ReservationServiceTest;
import com.oceanview.service.UserServiceTest;
import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;

/**
 * Test Suite - Runs all tests
 * 
 * To run all tests:
 * mvn test
 * 
 * To run specific test class:
 * mvn test -Dtest=ReservationServiceTest
 * 
 * To run with coverage:
 * mvn clean test jacoco:report
 */
@Suite
@SelectClasses({
    // Controller Tests
    AuthControllerTest.class,
    ReservationControllerTest.class,
    
    // Service Tests
    ReservationServiceTest.class,
    UserServiceTest.class,
    
    // Model Tests
    ReservationTest.class,
    
    // Security Tests
    JwtUtilTest.class,
    
    // Integration Tests
    ReservationIntegrationTest.class
})
public class TestSuite {
    // Test suite configuration
}
