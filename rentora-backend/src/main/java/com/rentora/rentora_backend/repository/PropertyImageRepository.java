package com.rentora.rentora_backend.repository;

import com.rentora.rentora_backend.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, String> {
}
