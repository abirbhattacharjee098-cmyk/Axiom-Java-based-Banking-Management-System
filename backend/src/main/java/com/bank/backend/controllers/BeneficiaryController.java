package com.bank.backend.controllers;

import com.bank.backend.models.Beneficiary;
import com.bank.backend.models.User;
import com.bank.backend.repository.BeneficiaryRepository;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Beneficiary>> getUserBeneficiaries() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(beneficiaryRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<?> addBeneficiary(@RequestBody Beneficiary beneficiaryRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setUser(user);
        beneficiary.setName(beneficiaryRequest.getName());
        beneficiary.setAccountNumber(beneficiaryRequest.getAccountNumber());
        
        return ResponseEntity.ok(beneficiaryRepository.save(beneficiary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBeneficiary(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Beneficiary beneficiary = beneficiaryRepository.findById(id).orElse(null);
        if (beneficiary != null && beneficiary.getUser().getId().equals(userDetails.getId())) {
            beneficiaryRepository.delete(beneficiary);
            return ResponseEntity.ok("Beneficiary deleted");
        }
        return ResponseEntity.badRequest().body("Beneficiary not found or access denied");
    }
}
