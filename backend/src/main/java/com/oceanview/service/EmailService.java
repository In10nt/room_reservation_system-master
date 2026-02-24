package com.oceanview.service;

import com.oceanview.model.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Email Service
 * Handles email sending functionality
 * Note: This is a basic implementation. For production, integrate with actual email service
 * like JavaMail, SendGrid, AWS SES, etc.
 */
@Service
public class EmailService {
    
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
    private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(new Locale("en", "LK"));
    
    /**
     * Send checkout bill to guest email
     * @param reservation The reservation details
     * @param email The recipient email address
     */
    public void sendBillEmail(Reservation reservation, String email) {
        log.info("Preparing to send bill email for reservation {} to {}", 
                reservation.getReservationNumber(), email);
        
        String billHtml = generateBillHtml(reservation);
        
        // TODO: Integrate with actual email service
        // For now, just log the email content
        log.info("Bill email prepared for {}", email);
        log.debug("Email content: {}", billHtml);
        
        // In production, you would use JavaMail or an email service provider:
        /*
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Your Bill - Ocean View Resort - " + reservation.getReservationNumber());
        helper.setText(billHtml, true);
        mailSender.send(message);
        */
        
        // Simulate email sending
        simulateEmailSending(email, billHtml);
    }
    
    /**
     * Generate HTML content for the bill email
     */
    private String generateBillHtml(Reservation reservation) {
        BigDecimal subtotal = reservation.getTotalAmount();
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.12")); // 12% tax
        BigDecimal total = subtotal.add(tax);
        
        BigDecimal pricePerNight = subtotal.divide(
            BigDecimal.valueOf(reservation.getNumberOfNights()), 
            2, 
            RoundingMode.HALF_UP
        );
        
        String checkInDate = reservation.getCheckInDate().format(DATE_FORMATTER);
        String checkOutDate = reservation.getCheckOutDate().format(DATE_FORMATTER);
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #667eea;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #667eea;
                        margin: 0;
                    }
                    .info-section {
                        display: table;
                        width: 100%%;
                        margin-bottom: 30px;
                    }
                    .info-column {
                        display: table-cell;
                        width: 50%%;
                        padding: 10px;
                    }
                    .info-column h3 {
                        color: #667eea;
                        margin-bottom: 10px;
                    }
                    table {
                        width: 100%%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    th {
                        background: #f5f7fa;
                        padding: 12px;
                        text-align: left;
                        border-bottom: 2px solid #667eea;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .summary {
                        text-align: right;
                        margin-top: 20px;
                    }
                    .summary-row {
                        margin: 10px 0;
                    }
                    .total {
                        font-size: 1.2em;
                        font-weight: bold;
                        color: #667eea;
                        border-top: 2px solid #667eea;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Ocean View Resort</h1>
                    <p>123 Beach Road, Colombo, Sri Lanka</p>
                    <p>Tel: +94 11 234 5678 | Email: info@oceanviewresort.lk</p>
                </div>
                
                <div class="info-section">
                    <div class="info-column">
                        <h3>Guest Information</h3>
                        <p><strong>Name:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Contact:</strong> %s</p>
                        <p><strong>Address:</strong> %s</p>
                    </div>
                    <div class="info-column">
                        <h3>Reservation Details</h3>
                        <p><strong>Reservation #:</strong> %s</p>
                        <p><strong>Room Type:</strong> %s</p>
                        <p><strong>Number of Guests:</strong> %d</p>
                    </div>
                </div>
                
                <h3>Stay Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>%s Room</strong><br>
                                <small>Check-in: %s</small><br>
                                <small>Check-out: %s</small>
                            </td>
                            <td>%d nights × %d guests</td>
                            <td>%s</td>
                            <td>%s</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-row">
                        <span>Subtotal: </span>
                        <span>%s</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (12%%): </span>
                        <span>%s</span>
                    </div>
                    <div class="total">
                        <span>Total Amount: </span>
                        <span>%s</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for staying with us!</p>
                    <p>We hope to see you again soon.</p>
                </div>
            </body>
            </html>
            """,
            reservation.getGuestName(),
            reservation.getEmail(),
            reservation.getContactNumber(),
            reservation.getAddress(),
            reservation.getReservationNumber(),
            reservation.getRoomType(),
            reservation.getNumberOfGuests(),
            reservation.getRoomType(),
            checkInDate,
            checkOutDate,
            reservation.getNumberOfNights(),
            reservation.getNumberOfGuests(),
            formatCurrency(pricePerNight),
            formatCurrency(subtotal),
            formatCurrency(subtotal),
            formatCurrency(tax),
            formatCurrency(total)
        );
    }
    
    /**
     * Simulate email sending (for development/testing)
     */
    private void simulateEmailSending(String email, String content) {
        log.info("=== SIMULATED EMAIL ===");
        log.info("To: {}", email);
        log.info("Subject: Your Bill - Ocean View Resort");
        log.info("Content length: {} characters", content.length());
        log.info("======================");
        
        // In production, replace this with actual email sending logic
    }
    
    /**
     * Format currency value
     */
    private String formatCurrency(BigDecimal amount) {
        return String.format("LKR %.2f", amount);
    }
}
