package com.fooddelivery.controller;

import com.fooddelivery.dto.PaymentRequest;
import com.fooddelivery.dto.PaymentResponse;
import com.fooddelivery.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/create-order/{orderId}")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(@PathVariable Long orderId) {
        try {
            Map<String, Object> response = paymentService.createRazorpayOrder(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.verifyAndProcessPayment(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentByOrderId(@PathVariable Long orderId) {
        try {
            var payment = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(Map.of(
                    "paymentId", payment.getId(),
                    "razorpayOrderId", payment.getRazorpayOrderId(),
                    "razorpayPaymentId", payment.getRazorpayPaymentId(),
                    "status", payment.getStatus(),
                    "amount", payment.getAmount(),
                    "currency", payment.getCurrency()
            ));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}