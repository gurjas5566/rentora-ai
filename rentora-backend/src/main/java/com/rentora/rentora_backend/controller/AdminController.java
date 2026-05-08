package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyRepsitory propertyRepository;

    public AdminController(
            UserRepository userRepository,
            PropertyRepsitory propertyRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<User> allUsers = userRepository.findAll();
        List<Property> allProperties =
                propertyRepository.findAll();

        long tenants = allUsers.stream()
                .filter(u -> u.getRole() == User.Role.TENANT)
                .count();
        long owners = allUsers.stream()
                .filter(u -> u.getRole() == User.Role.OWNER)
                .count();
        long pending = allProperties.stream()
                .filter(p -> p.getStatus() ==
                        Property.Status.PENDING)
                .count();
        long active = allProperties.stream()
                .filter(p -> p.getStatus() ==
                        Property.Status.ACTIVE)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", allUsers.size());
        stats.put("totalTenants", tenants);
        stats.put("totalOwners", owners);
        stats.put("totalProperties",
                allProperties.size());
        stats.put("pendingProperties", pending);
        stats.put("activeProperties", active);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingProperties() {
        List<Property> pending = propertyRepository
                .findByStatus(Property.Status.PENDING);
        return ResponseEntity.ok(pending);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(
                "User deleted successfully!");
    }
}