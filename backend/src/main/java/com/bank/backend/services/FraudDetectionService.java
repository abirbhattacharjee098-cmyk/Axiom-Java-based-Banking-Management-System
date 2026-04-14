package com.bank.backend.services;

import com.bank.backend.events.TransactionCreatedEvent;
import com.bank.backend.models.Transaction;
import com.bank.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class FraudDetectionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @Async
    @EventListener
    public void handleTransactionCreated(TransactionCreatedEvent event) {
        Transaction tx = event.getTransaction();

        boolean isSuspicious = false;
        String reason = "";

        // Rule 1: Amount exceeds $10,000
        if (tx.getAmount().compareTo(new BigDecimal("10000")) > 0) {
            isSuspicious = true;
            reason = "High-value transaction ($" + tx.getAmount() + ")";
        }

        // Rule 2: Rapid consecutive transactions (future: check within time window)
        // Rule 3: Transfer to a new/unknown account (future: check beneficiary history)

        if (isSuspicious) {
            tx.setSuspicious(true);
            transactionRepository.save(tx);

            // Send email alert
            emailNotificationService.sendFraudAlert(tx, reason);

            System.out.println("[FRAUD ALERT] Transaction " + tx.getReferenceNumber() + " flagged: " + reason);
        }
    }
}
