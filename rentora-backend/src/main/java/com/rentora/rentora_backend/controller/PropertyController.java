package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.PropertyImage;
import com.rentora.rentora_backend.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(
                propertyService.getAllActiveProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(
            @PathVariable String id) {
        try {
            return ResponseEntity.ok(
                    propertyService.getPropertyById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRent,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) String propertyType) {
        return ResponseEntity.ok(
                propertyService.searchProperties(
                        city, minRent, maxRent,
                        bedrooms, propertyType));
    }

    @PostMapping
    public ResponseEntity<?> createProperty(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(
                    propertyService.createProperty(request, authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProperty(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            Property property = propertyService.updateProperty(
                    id, request, authentication.getName());
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(
            @PathVariable String id,
            Authentication authentication) {
        try {
            String role = authentication.getAuthorities()
                    .iterator().next().getAuthority()
                    .replace("ROLE_", "");
            propertyService.deleteProperty(
                    id, authentication.getName(), role);
            return ResponseEntity.ok(
                    "Property deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProperty(
            @PathVariable String id) {
        try {
            return ResponseEntity.ok(
                    propertyService.approveProperty(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProperty(
            @PathVariable String id) {
        try {
            return ResponseEntity.ok(
                    propertyService.rejectProperty(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/my-listings")
    public ResponseEntity<?> getMyListings(
            Authentication authentication) {
        return ResponseEntity.ok(
                propertyService.getOwnerProperties(
                        authentication.getName()));
    }
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable String id,
            @RequestParam("files") MultipartFile[] files,
            Authentication authentication) {
        try {
            List<PropertyImage> images = propertyService.uploadImages(id, files, authentication.getName());
            return ResponseEntity.ok(images);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}