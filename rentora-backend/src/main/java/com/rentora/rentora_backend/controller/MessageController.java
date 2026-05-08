package com.rentora.rentora_backend.controller;

import com.rentora.rentora_backend.model.Message;
import com.rentora.rentora_backend.model.MessageDTO;
import com.rentora.rentora_backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(
            MessageService messageService) {
        this.messageService = messageService;
    }

    // Tenant sends first message
    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            Message message = messageService
                    .sendMessage(request,
                            authentication.getName());
            return ResponseEntity.ok(
                    messageService.convertToDTO(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Owner replies
    @PostMapping("/reply")
    public ResponseEntity<?> replyMessage(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            Message message = messageService
                    .replyMessage(request,
                            authentication.getName());
            return ResponseEntity.ok(
                    messageService.convertToDTO(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Get full conversation thread
    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(
            @RequestParam String propertyId,
            @RequestParam(required = false)
            String tenantId,
            Authentication authentication) {
        try {
            List<Message> messages = messageService
                    .getConversation(propertyId, tenantId,
                            authentication.getName());
            return ResponseEntity.ok(
                    messages.stream()
                            .map(messageService::convertToDTO)
                            .collect(java.util.stream
                                    .Collectors.toList()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Get all conversations (grouped) for owner
    @GetMapping("/owner-conversations")
    public ResponseEntity<?> getOwnerConversations(
            Authentication authentication) {
        return ResponseEntity.ok(
                messageService.getOwnerConversations(
                        authentication.getName()));
    }

    // Get all conversations (grouped) for tenant
    @GetMapping("/tenant-conversations")
    public ResponseEntity<?> getTenantConversations(
            Authentication authentication) {
        return ResponseEntity.ok(
                messageService.getTenantConversations(
                        authentication.getName()));
    }

    // Legacy endpoints (keep for compatibility)
    @GetMapping("/inbox")
    public ResponseEntity<?> getOwnerMessages(
            Authentication authentication) {
        return ResponseEntity.ok(
                messageService.getOwnerMessages(
                                authentication.getName())
                        .stream()
                        .map(messageService::convertToDTO)
                        .collect(java.util.stream
                                .Collectors.toList()));
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getTenantMessages(
            Authentication authentication) {
        return ResponseEntity.ok(
                messageService.getTenantMessages(
                                authentication.getName())
                        .stream()
                        .map(messageService::convertToDTO)
                        .collect(java.util.stream
                                .Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMessageById(
            @PathVariable String id) {
        try {
            return ResponseEntity.ok(
                    messageService.convertToDTO(
                            messageService
                                    .getMessageById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}