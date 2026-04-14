package com.bank.backend.services;

import com.bank.backend.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${axiom.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${axiom.mail.admin-email:admin@axiombank.com}")
    private String adminEmail;

    public void sendFraudAlert(Transaction tx, String reason) {
        String subject = "[AXIOM BANK] Fraud Alert - Transaction " + tx.getReferenceNumber();
        String body = String.format(
                "SUSPICIOUS TRANSACTION DETECTED\n\n" +
                "Reference: %s\n" +
                "Type: %s\n" +
                "Amount: $%s\n" +
                "Reason: %s\n\n" +
                "Please review this transaction immediately in the Admin Dashboard.",
                tx.getReferenceNumber(), tx.getType(), tx.getAmount(), reason
        );

        if (mailEnabled && mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(adminEmail);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("noreply@axiombank.com");
                mailSender.send(message);
                System.out.println("[EMAIL] Fraud alert sent to " + adminEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL] Failed to send fraud alert: " + e.getMessage());
            }
        } else {
            // Fallback: log to console when mail is not configured
            System.out.println("[EMAIL MOCK] Would send to " + adminEmail + ":\n" + subject + "\n" + body);
        }
    }

    public void sendTransactionReceipt(String toEmail, Transaction tx) {
        String subject = "[AXIOM BANK] Transaction Receipt - " + tx.getReferenceNumber();
        String body = String.format(
                "Transaction Confirmation\n\n" +
                "Reference: %s\n" +
                "Type: %s\n" +
                "Amount: $%s\n" +
                "Status: %s\n\n" +
                "Thank you for banking with Axiom.",
                tx.getReferenceNumber(), tx.getType(), tx.getAmount(), tx.getStatus()
        );

        if (mailEnabled && mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("noreply@axiombank.com");
                mailSender.send(message);
            } catch (Exception e) {
                System.err.println("[EMAIL] Failed to send receipt: " + e.getMessage());
            }
        } else {
            System.out.println("[EMAIL MOCK] Receipt for " + tx.getReferenceNumber() + " -> " + toEmail);
        }
    }
}
