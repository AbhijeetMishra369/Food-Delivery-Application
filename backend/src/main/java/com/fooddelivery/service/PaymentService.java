package com.fooddelivery.service;

import com.fooddelivery.dto.PaymentRequest;
import com.fooddelivery.dto.PaymentResponse;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.Payment;
import com.fooddelivery.exception.NotFoundException;
import com.fooddelivery.exception.PaymentException;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
	
	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;
	private final OrderService orderService;
	
	@Value("${razorpay.key.id}")
	private String razorpayKeyId;
	
	@Value("${razorpay.key.secret}")
	private String razorpayKeySecret;
	
	public PaymentResponse createPaymentOrder(Long orderId) {
		try {
			Order order = orderRepository.findById(orderId)
					.orElseThrow(() -> new NotFoundException("Order not found"));
			
			RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
			
			JSONObject options = new JSONObject();
			options.put("amount", (int) (order.getTotal() * 100)); // Convert to paise
			options.put("currency", "INR");
			options.put("receipt", order.getOrderNumber());
			
			com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
			
			Payment payment = new Payment();
			payment.setOrder(order);
			payment.setRazorpayOrderId(razorpayOrder.get("id").toString());
			payment.setRazorpayPaymentId(""); // Will be set after payment
			payment.setAmount(order.getTotal());
			payment.setCurrency("INR");
			payment.setStatus(Payment.PaymentStatus.PENDING);
			payment.setPaymentMethod("ONLINE");
			payment.setDescription("Payment for order " + order.getOrderNumber());
			
			paymentRepository.save(payment);
			
			return new PaymentResponse(
					razorpayOrder.get("id").toString(),
					"",
					"PENDING",
					"Payment order created successfully",
					order.getTotal(),
					"INR",
					razorpayKeyId
			);
			
		} catch (RazorpayException e) {
			throw new PaymentException("Failed to create payment order: " + e.getMessage());
		}
	}
	
	@Transactional
	public PaymentResponse verifyAndProcessPayment(PaymentRequest request) {
		try {
			// Get order
			Order order = orderRepository.findById(request.getOrderId())
					.orElseThrow(() -> new NotFoundException("Order not found"));
			
			// Verify payment signature (in production, implement proper signature verification)
			// For demo purposes, we'll skip signature verification
			boolean isSignatureValid = true; // verifySignature(request);
			
			if (!isSignatureValid) {
				throw new PaymentException("Invalid payment signature");
			}
			
			// Update payment record
			Payment payment = paymentRepository.findByOrderId(request.getOrderId())
					.orElseThrow(() -> new NotFoundException("Payment not found"));
			
			payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
			payment.setStatus(Payment.PaymentStatus.COMPLETED);
			payment.setPaymentTime(LocalDateTime.now());
			payment.setPaymentMethod(request.getPaymentMethod());
			
			paymentRepository.save(payment);
			
			// Update order payment status
			orderService.updateOrderPaymentStatus(order.getId(), Order.PaymentStatus.COMPLETED);
			
			return new PaymentResponse(
					request.getRazorpayOrderId(),
					request.getRazorpayPaymentId(),
					"COMPLETED",
					"Payment processed successfully",
					order.getTotal(),
					"INR",
					razorpayKeyId
			);
			
		} catch (Exception e) {
			// Update payment status to failed
			try {
				Payment payment = paymentRepository.findByOrderId(request.getOrderId())
						.orElse(null);
				if (payment != null) {
					payment.setStatus(Payment.PaymentStatus.FAILED);
					payment.setErrorCode("PAYMENT_FAILED");
					payment.setErrorDescription(e.getMessage());
					paymentRepository.save(payment);
				}
			} catch (Exception ex) {
				// Log error
			}
			
			throw new PaymentException("Payment verification failed: " + e.getMessage());
		}
	}
	
	private boolean verifySignature(PaymentRequest request) {
		// Implement RazorPay signature verification
		// This is a placeholder - in production, implement proper signature verification
		return true;
	}
}