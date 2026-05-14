package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.service.MessageService;
import com.rentora.rentora_backend.service.PropertyService;
import com.rentora.rentora_backend.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    private final PropertyService propertyService;
    private final MessageService messageService;
    private final ScheduleService scheduleService;

    public OwnerController(PropertyService propertyService,
                           MessageService messageService,
                           ScheduleService scheduleService) {
        this.propertyService = propertyService;
        this.messageService = messageService;
        this.scheduleService = scheduleService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getOwnerStats(Authentication authentication) {
        try {
            Map<String, Object> stats = propertyService.getOwnerStats(authentication.getName());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listings")
    public ResponseEntity<?> getOwnerListings(Authentication authentication) {
        try {
            return ResponseEntity.ok(propertyService.getOwnerProperties(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/inquiries")
    public ResponseEntity<?> getOwnerInquiries(Authentication authentication) {
        try {
            return ResponseEntity.ok(messageService.getOwnerConversations(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/visits")
    public ResponseEntity<?> getOwnerVisits(Authentication authentication) {
        try {
            return ResponseEntity.ok(scheduleService.getOwnerSchedules(authentication.getName())
                    .stream()
                    .map(scheduleService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
