package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Double> request, Authentication authentication) {
        try {
            Double amount = request.get("amount");
            String order = paymentService.createOrder(amount, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> response) {
        boolean isValid = paymentService.verifyPayment(response);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Payment successful, you are now a Gold member!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment verification failed!"));
        }
    }
}
