package com.fooddelivery.controller;

import com.fooddelivery.dto.PaymentRequest;
import com.fooddelivery.dto.PaymentResponse;
import com.fooddelivery.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/create-order/{orderId}")
    public ResponseEntity<PaymentResponse> createPaymentOrder(@PathVariable Long orderId) {
        PaymentResponse response = paymentService.createPaymentOrder(orderId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.verifyAndProcessPayment(request);
        return ResponseEntity.ok(response);
    }
}