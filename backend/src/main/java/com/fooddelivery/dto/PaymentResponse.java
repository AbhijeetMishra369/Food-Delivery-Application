package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String status;
    private String message;
    private Double amount;
    private String currency;
}