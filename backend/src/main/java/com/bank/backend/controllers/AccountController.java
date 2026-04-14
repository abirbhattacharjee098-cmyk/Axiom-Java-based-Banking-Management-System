package com.bank.backend.controllers;

import com.bank.backend.models.Account;
import com.bank.backend.models.User;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.security.services.UserDetailsImpl;
import com.bank.backend.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestParam String type) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = accountService.createAccount(user, type);
        return ResponseEntity.ok(account);
    }

    @Cacheable(value = "accountsCache", key = "#root.methodName + '_' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName()")
    @GetMapping
    public ResponseEntity<List<Account>> getUserAccounts() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Account> accounts = accountService.getUserAccounts(userDetails.getId());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<?> getAccountBalance(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account account = accountService.getAccountById(id);
        
        if (account == null || !account.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body("Account not found or access denied");
        }
        
        return ResponseEntity.ok(account.getBalance());
    }
}
