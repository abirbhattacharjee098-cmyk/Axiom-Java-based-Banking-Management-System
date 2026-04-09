package com.bank.backend.controllers;

import com.bank.backend.models.Account;
import com.bank.backend.models.Transaction;
import com.bank.backend.payload.request.TransactionRequest;
import com.bank.backend.security.services.UserDetailsImpl;
import com.bank.backend.services.AccountService;
import com.bank.backend.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AccountService accountService;

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody TransactionRequest request) {
        try {
            validateAccountAccess(request.getDestinationAccountId());
            Transaction tx = transactionService.deposit(request.getDestinationAccountId(), request.getAmount());
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody TransactionRequest request) {
        try {
            validateAccountAccess(request.getSourceAccountId());
            Transaction tx = transactionService.withdraw(request.getSourceAccountId(), request.getAmount());
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransactionRequest request) {
        try {
            validateAccountAccess(request.getSourceAccountId());
            Transaction tx = transactionService.transfer(request.getSourceAccountId(), request.getDestinationAccountId(), request.getAmount());
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history/{accountId}")
    public ResponseEntity<?> getTransactionHistory(@PathVariable Long accountId) {
        try {
            validateAccountAccess(accountId);
            List<Transaction> transactions = transactionService.getTransactionsForAccount(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private void validateAccountAccess(Long accountId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account account = accountService.getAccountById(accountId);
        if (account == null || !account.getUser().getId().equals(userDetails.getId())) {
            throw new RuntimeException("Account not found or access denied");
        }
    }
}
