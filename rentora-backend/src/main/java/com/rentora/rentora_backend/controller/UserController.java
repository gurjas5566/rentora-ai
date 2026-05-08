package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication)
    {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->
                        new RuntimeException("User not found"));
        Map<String,Object> response = new HashMap<>();
        response.put("id",user.getId());
        response.put("name",user.getName());
        response.put("email",user.getEmail());
        response.put("role",user.getRole());
        response.put("phone",user.getPhone());
        return ResponseEntity.ok(response);
    }
}
