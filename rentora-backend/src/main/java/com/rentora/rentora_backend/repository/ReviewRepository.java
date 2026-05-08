package com.rentora.rentora_backend.repository;

import com.rentora.rentora_backend.model.Review;
import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository
        extends JpaRepository<Review, String> {

    List<Review> findByPropertyOrderByCreatedAtDesc(
            Property property);

    Optional<Review> findByTenantAndProperty(
            User tenant, Property property);

    @Query("SELECT AVG(r.rating) FROM Review r " +
            "WHERE r.property = :property")
    Double getAverageRating(
            @Param("property") Property property);
}