package com.rentora.rentora_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="property_images")
public class PropertyImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "property_id",nullable = false)
    private Property property;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_primary")
    private boolean isPrimary = false;

}
