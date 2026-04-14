package com.bank.backend.controllers;

import com.bank.backend.models.Account;
import com.bank.backend.models.RecurringPayment;
import com.bank.backend.payload.request.RecurringPaymentRequest;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.RecurringPaymentRepository;
import com.bank.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recurring")
public class RecurringPaymentController {

    @Autowired
    private RecurringPaymentRepository recurringPaymentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getRecurringPayments(@PathVariable Long accountId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account account = accountRepository.findById(accountId).orElse(null);
        
        if (account == null || !account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body("Account not found or access denied");
        }

        List<RecurringPayment> payments = recurringPaymentRepository.findBySourceAccount(account);
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<?> createRecurringPayment(@RequestBody RecurringPaymentRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account sourceAccount = accountRepository.findById(request.getSourceAccountId()).orElse(null);

        if (sourceAccount == null || !sourceAccount.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body("Source account not found or access denied");
        }

        RecurringPayment rp = new RecurringPayment();
        rp.setSourceAccount(sourceAccount);
        rp.setDestinationAccountNumber(request.getDestinationAccountNumber());
        rp.setAmount(request.getAmount());
        rp.setFrequency(request.getFrequency()); // e.g. "MONTHLY"
        rp.setNextExecutionDate(request.getStartDate());
        rp.setStatus("ACTIVE");

        recurringPaymentRepository.save(rp);
        return ResponseEntity.ok("Recurring payment scheduled successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRecurringPayment(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        RecurringPayment rp = recurringPaymentRepository.findById(id).orElse(null);
        
        if (rp != null && rp.getSourceAccount().getUser().getId().equals(userDetails.getId())) {
            rp.setStatus("CANCELLED");
            recurringPaymentRepository.save(rp);
            return ResponseEntity.ok("Recurring payment cancelled");
        }
        return ResponseEntity.badRequest().body("Not found or access denied");
    }
}
