package com.rentora.rentora_backend.model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String address;

    private Double rent;
    private Double deposit;
    private Integer bedrooms;
    private String furnishing;
    private String description;
    private String pincode;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "area_sqft")
    private Double areaSqft;



    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @Column(name = "year_built")
    private Integer yearBuilt;

    @ElementCollection
    @CollectionTable(
            name = "property_amenities",
            joinColumns = @JoinColumn(name = "property_id")
    )
    @Column(name = "amenity")
    private List<String> amenities;


    @Enumerated(EnumType.STRING)
    @Column(name = "property_type")
    private PropertyType propertyType;

    public enum Status {
        PENDING, ACTIVE, REJECTED, RENTED
    }

    public enum PropertyType{
        RESIDENTIAL,COMMERCIAL
    }
}