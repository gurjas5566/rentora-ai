package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.Schedule;
import com.rentora.rentora_backend.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public ResponseEntity<?> bookVisit(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            Schedule schedule = scheduleService.bookVisit(
                    request, authentication.getName());
            return ResponseEntity.ok(
                    scheduleService.convertToDTO(schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/my-visits")
    public ResponseEntity<?> getTenantSchedules(
            Authentication authentication) {
        return ResponseEntity.ok(
                scheduleService.getTenantSchedules(
                                authentication.getName())
                        .stream()
                        .map(scheduleService::convertToDTO)
                        .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/visit-requests")
    public ResponseEntity<?> getOwnerSchedules(
            Authentication authentication) {
        return ResponseEntity.ok(
                scheduleService.getOwnerSchedules(
                                authentication.getName())
                        .stream()
                        .map(scheduleService::convertToDTO)
                        .collect(java.util.stream.Collectors.toList()));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmVisit(
            @PathVariable String id,
            Authentication authentication) {
        try {
            Schedule schedule = scheduleService.confirmVisit(
                    id, authentication.getName());
            return ResponseEntity.ok(
                    scheduleService.convertToDTO(schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelVisit(
            @PathVariable String id,
            Authentication authentication) {
        try {
            Schedule schedule = scheduleService.cancelVisit(
                    id, authentication.getName());
            return ResponseEntity.ok(
                    scheduleService.convertToDTO(schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeVisit(
            @PathVariable String id,
            Authentication authentication
    ){
        try{
            Schedule schedule = scheduleService.completeVisit(
                    id,authentication.getName()
            );
            return ResponseEntity.ok(
                    scheduleService.convertToDTO(schedule)
            );
        } catch (RuntimeException e){
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    }
