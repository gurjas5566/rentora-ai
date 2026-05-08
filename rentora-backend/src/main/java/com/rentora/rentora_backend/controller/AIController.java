package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService)
    {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody Map<String, String> request) {
        try {
            String response = aiService.getChatbotResponse(
                    request.get("message"));
            return ResponseEntity.ok(
                    Map.of("response", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/estimate-price")
    public ResponseEntity<?> estimatePrice(
            @RequestBody Map<String, Object> request) {
        try {
            String estimate = aiService.estimateRentalPrice(
                    (String) request.get("city"),
                    (Integer) request.get("bedrooms"),
                    ((Number) request.get("areaSqft"))
                            .doubleValue(),
                    (String) request.get("furnishing"),
                    (List<String>) request.get("amenities")
            );
            return ResponseEntity.ok(
                    Map.of("estimate", estimate));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PostMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(
            @RequestBody Map<String, Object> request) {
        try {
            String recommendations =
                    aiService.getRecommendations(
                            (String) request.get("city"),
                            ((Number) request.get("budget"))
                                    .doubleValue(),
                            (Integer) request.get("bedrooms"),
                            (List<String>) request.get("preferences")
                    );
            return ResponseEntity.ok(
                    Map.of("recommendations", recommendations));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}
