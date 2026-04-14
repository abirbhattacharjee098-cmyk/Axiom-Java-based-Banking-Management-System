package com.bank.backend.payload.request;

import java.math.BigDecimal;

public class LoanRequest {
    private BigDecimal principal;
    private Integer durationMonths;

    public BigDecimal getPrincipal() { return principal; }
    public void setPrincipal(BigDecimal principal) { this.principal = principal; }
    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
}
