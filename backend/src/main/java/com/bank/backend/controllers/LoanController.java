package com.bank.backend.controllers;

import com.bank.backend.models.Account;
import com.bank.backend.models.Loan;
import com.bank.backend.models.User;
import com.bank.backend.payload.request.LoanRequest;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.LoanRepository;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.security.services.UserDetailsImpl;
import com.bank.backend.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Loan>> getMyLoans() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        return ResponseEntity.ok(loanRepository.findByUser(user));
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setPrincipal(request.getPrincipal());
        loan.setDurationMonths(request.getDurationMonths());
        loan.setInterestRate(new BigDecimal("12.5")); // Fixed 12.5% for demo
        loan.setStatus("PENDING");

        return ResponseEntity.ok(loanRepository.save(loan));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long id, @RequestParam Long accountId) {
        Loan loan = loanRepository.findById(id).orElse(null);
        if (loan == null || !"PENDING".equals(loan.getStatus())) {
            return ResponseEntity.badRequest().body("Loan not found or not pending");
        }
        
        Account targetAccount = accountRepository.findById(accountId).orElse(null);
        if (targetAccount == null || !targetAccount.getUser().getId().equals(loan.getUser().getId())) {
             return ResponseEntity.badRequest().body("Invalid destination account for loan dispersal.");
        }

        loan.setStatus("APPROVED");
        loanRepository.save(loan);
        
        // Disperse principal amount
        transactionService.deposit(targetAccount.getId(), loan.getPrincipal());

        return ResponseEntity.ok("Loan approved and dispersed.");
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable Long id) {
        Loan loan = loanRepository.findById(id).orElse(null);
        if (loan != null && "PENDING".equals(loan.getStatus())) {
            loan.setStatus("REJECTED");
            return ResponseEntity.ok(loanRepository.save(loan));
        }
        return ResponseEntity.badRequest().body("Loan not eligible for rejection.");
    }
}
