package com.bank.backend.services;

import com.bank.backend.models.Account;
import com.bank.backend.models.Transaction;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class InterestSchedulerService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Run every day at 1am: "0 0 1 * * *"
    // For demonstration, let's say 5% APY -> Daily interest = (Balance * 0.05) / 365
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void calculateDailyInterest() {
        List<Account> savingsAccounts = accountRepository.findAll().stream()
                .filter(a -> "SAVINGS".equals(a.getAccountType()) && "ACTIVE".equals(a.getStatus()))
                .toList();

        BigDecimal apy = new BigDecimal("0.05");
        BigDecimal daysInYear = new BigDecimal("365");

        for (Account account : savingsAccounts) {
            if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal dailyInterest = account.getBalance()
                        .multiply(apy)
                        .divide(daysInYear, 2, RoundingMode.HALF_UP);

                if (dailyInterest.compareTo(BigDecimal.ZERO) > 0) {
                    account.setBalance(account.getBalance().add(dailyInterest));
                    accountRepository.save(account);

                    Transaction tx = new Transaction();
                    tx.setReferenceNumber("INT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                    tx.setType("DEPOSIT");
                    tx.setAmount(dailyInterest);
                    tx.setDestinationAccountId(account.getId());
                    tx.setStatus("COMPLETED");
                    
                    transactionRepository.save(tx);
                }
            }
        }
        System.out.println("Daily interest calculated for " + savingsAccounts.size() + " savings accounts.");
    }
}
