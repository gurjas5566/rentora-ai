package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.Review;
import com.rentora.rentora_backend.model.ReviewDTO;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.ReviewRepository;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PropertyRepsitory propertyRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            PropertyRepsitory propertyRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    public Review createReview(
            Map<String, Object> request,
            String tenantEmail) {

        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() ->
                        new RuntimeException("Tenant not found!"));

        if (tenant.getRole() != User.Role.TENANT) {
            throw new RuntimeException(
                    "Only tenants can write reviews!");
        }

        Property property = propertyRepository
                .findById((String) request.get("propertyId"))
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));

        // Check duplicate review
        reviewRepository.findByTenantAndProperty(
                tenant, property).ifPresent(r -> {
            throw new RuntimeException(
                    "You already reviewed this property!");
        });

        // Validate rating
        Integer rating = (Integer) request.get("rating");
        if (rating < 1 || rating > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5!");
        }

        Review review = new Review();
        review.setTenant(tenant);
        review.setProperty(property);
        review.setRating(rating);
        review.setComment((String) request.get("comment"));

        return reviewRepository.save(review);
    }

    public List<Review> getPropertyReviews(String propertyId) {
        Property property = propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));
        return reviewRepository
                .findByPropertyOrderByCreatedAtDesc(property);
    }

    public Double getAverageRating(String propertyId) {
        Property property = propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));
        Double avg = reviewRepository
                .getAverageRating(property);
        return avg != null ?
                Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public void deleteReview(String id, String userEmail,
                             String userRole) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Review not found!"));

        if (userRole.equals("ADMIN")) {
            reviewRepository.delete(review);
            return;
        }

        if (!review.getTenant().getEmail().equals(userEmail)) {
            throw new RuntimeException(
                    "You can only delete your own reviews!");
        }

        reviewRepository.delete(review);
    }
    public ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        ReviewDTO.ReviewerDTO reviewerDTO =
                new ReviewDTO.ReviewerDTO();
        reviewerDTO.setId(review.getTenant().getId());
        reviewerDTO.setName(review.getTenant().getName());
        dto.setTenant(reviewerDTO);

        return dto;
    }
}