package com.bank.backend.services;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class ForexService {

    // Mock exchange rates with USD as base
    private final Map<String, BigDecimal> rates = Map.of(
        "USD", new BigDecimal("1.0"),
        "EUR", new BigDecimal("0.92"),
        "GBP", new BigDecimal("0.79"),
        "INR", new BigDecimal("83.20")
    );

    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        BigDecimal fromRate = rates.getOrDefault(fromCurrency.toUpperCase(), BigDecimal.ONE);
        BigDecimal toRate = rates.getOrDefault(toCurrency.toUpperCase(), BigDecimal.ONE);

        // Convert to USD first (base), then to target currency
        BigDecimal amountInUSD = amount.divide(fromRate, 4, RoundingMode.HALF_UP);
        return amountInUSD.multiply(toRate).setScale(2, RoundingMode.HALF_UP);
    }
}
