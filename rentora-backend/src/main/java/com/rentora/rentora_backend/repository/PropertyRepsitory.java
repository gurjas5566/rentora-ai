package com.rentora.rentora_backend.repository;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepsitory extends JpaRepository<Property,String> {

    List<Property> findByStatus(Property.Status status);

    List<Property> findByOwner(User user);

    List<Property> findByStatusAndCity(Property.Status status,String city);

    @Query("SELECT p FROM Property p WHERE " +
            "p.status = 'ACTIVE' AND " +
            "(:city IS NULL OR p.city = :city) AND " +
            "(:minRent IS NULL OR p.rent >= :minRent) AND " +
            "(:maxRent IS NULL OR p.rent <= :maxRent) AND " +
            "(:bedrooms IS NULL OR p.bedrooms = :bedrooms) AND " +
            "(:propertyType IS NULL OR CAST(p.propertyType as string) = :propertyType)")
    List<Property> searchProperties(
            @Param("city") String city,
            @Param("minRent") Double minRent,
            @Param("maxRent") Double maxRent,
            @Param("bedrooms") Integer bedrooms,
            @Param("propertyType") String propertyType
    );

}
