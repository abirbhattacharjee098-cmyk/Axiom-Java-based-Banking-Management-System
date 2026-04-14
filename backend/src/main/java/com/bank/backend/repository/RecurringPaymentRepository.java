package com.bank.backend.repository;

import com.bank.backend.models.Account;
import com.bank.backend.models.RecurringPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringPaymentRepository extends JpaRepository<RecurringPayment, Long> {
    List<RecurringPayment> findBySourceAccount(Account account);
    List<RecurringPayment> findByNextExecutionDateAndStatus(LocalDate date, String status);
}
