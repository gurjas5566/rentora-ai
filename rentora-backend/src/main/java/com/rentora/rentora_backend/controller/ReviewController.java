package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.Review;
import com.rentora.rentora_backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            Review review = reviewService.createReview(
                    request, authentication.getName());
            return ResponseEntity.ok(
                    reviewService.convertToDTO(review));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getPropertyReviews(
            @PathVariable String propertyId) {
        try {
            List<Review> reviews = reviewService
                    .getPropertyReviews(propertyId);
            Double avgRating = reviewService
                    .getAverageRating(propertyId);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews.stream()
                    .map(reviewService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList()));
            response.put("averageRating", avgRating);
            response.put("totalReviews", reviews.size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable String id,
            Authentication authentication) {
        try {
            String role = authentication.getAuthorities()
                    .iterator().next().getAuthority()
                    .replace("ROLE_", "");
            reviewService.deleteReview(
                    id, authentication.getName(), role);
            return ResponseEntity.ok(
                    "Review deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}