package com.bank.backend.services;

import com.bank.backend.events.TransactionCreatedEvent;
import com.bank.backend.models.Account;
import com.bank.backend.models.Transaction;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ForexService forexService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public List<Transaction> getTransactionsForAccount(Long accountId) {
        return transactionRepository.findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(accountId, accountId);
    }

    @Transactional
    public Transaction deposit(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        return createTransactionRecord(null, accountId, amount, "DEPOSIT");
    }

    @Transactional
    public Transaction withdraw(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        return createTransactionRecord(accountId, null, amount, "WITHDRAWAL");
    }

    @Transactional
    public Transaction transfer(Long sourceId, Long targetId, BigDecimal amount) {
        Account source = accountRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account target = accountRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        if (source.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        source.setBalance(source.getBalance().subtract(amount));
        
        // Convert amount if currencies differ
        BigDecimal convertedAmount = forexService.convert(amount, source.getCurrency(), target.getCurrency());
        target.setBalance(target.getBalance().add(convertedAmount));

        accountRepository.save(source);
        accountRepository.save(target);

        return createTransactionRecord(sourceId, targetId, amount, "TRANSFER");
    }

    private Transaction createTransactionRecord(Long sourceId, Long targetId, BigDecimal amount, String type) {
        Transaction transaction = new Transaction();
        transaction.setReferenceNumber(UUID.randomUUID().toString());
        transaction.setSourceAccountId(sourceId);
        transaction.setDestinationAccountId(targetId);
        transaction.setAmount(amount);
        transaction.setType(type);

        Transaction saved = transactionRepository.save(transaction);

        // Publish event for async fraud detection
        eventPublisher.publishEvent(new TransactionCreatedEvent(this, saved));

        return saved;
    }
}
