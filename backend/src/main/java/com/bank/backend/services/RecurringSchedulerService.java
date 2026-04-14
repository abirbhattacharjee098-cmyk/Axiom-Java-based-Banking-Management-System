package com.bank.backend.services;

import com.bank.backend.models.Account;
import com.bank.backend.models.RecurringPayment;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.RecurringPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RecurringSchedulerService {

    @Autowired
    private RecurringPaymentRepository recurringPaymentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionService transactionService;

    // Run every day at 2am
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void processRecurringPayments() {
        LocalDate today = LocalDate.now();
        List<RecurringPayment> duePayments = recurringPaymentRepository.findByNextExecutionDateAndStatus(today, "ACTIVE");

        for (RecurringPayment rp : duePayments) {
            try {
                Account targetAccount = accountRepository.findByAccountNumber(rp.getDestinationAccountNumber())
                        .orElse(null);

                if (targetAccount != null && "ACTIVE".equals(rp.getSourceAccount().getStatus())) {
                    transactionService.transfer(rp.getSourceAccount().getId(), targetAccount.getId(), rp.getAmount());
                }

                // Update next execution date
                if ("MONTHLY".equalsIgnoreCase(rp.getFrequency())) {
                    rp.setNextExecutionDate(today.plusMonths(1));
                } else if ("WEEKLY".equalsIgnoreCase(rp.getFrequency())) {
                    rp.setNextExecutionDate(today.plusWeeks(1));
                } else if ("DAILY".equalsIgnoreCase(rp.getFrequency())) {
                    rp.setNextExecutionDate(today.plusDays(1));
                } else {
                    rp.setStatus("CANCELLED"); // Unknown frequency, cancel it
                }

                recurringPaymentRepository.save(rp);
            } catch (Exception e) {
                // Insufficient funds or error, skip for today or mark failed
                System.err.println("Recurring payment failed for ID " + rp.getId() + ": " + e.getMessage());
            }
        }
    }
}
