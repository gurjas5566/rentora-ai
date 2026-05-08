package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.Message;
import com.rentora.rentora_backend.model.MessageDTO;
import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.MessageRepository;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepsitory propertyRepository;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            PropertyRepsitory propertyRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    // ── Send message (tenant initiates) ──────────────
    public Message sendMessage(
            Map<String, String> request,
            String tenantEmail) {

        User tenant = userRepository
                .findByEmail(tenantEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tenant not found!"));

        if (tenant.getRole() != User.Role.TENANT) {
            throw new RuntimeException(
                    "Only tenants can initiate messages!");
        }

        Property property = propertyRepository
                .findById(request.get("propertyId"))
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found!"));

        Message message = new Message();
        message.setTenant(tenant);
        message.setOwner(property.getOwner());
        message.setProperty(property);
        message.setContent(request.get("content"));
        message.setSenderRole("TENANT");

        return messageRepository.save(message);
    }

    // ── Reply to message (owner replies) ─────────────
    public Message replyMessage(
            Map<String, String> request,
            String ownerEmail) {

        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Owner not found!"));

        if (owner.getRole() != User.Role.OWNER) {
            throw new RuntimeException(
                    "Only owners can reply!");
        }

        // Find the tenant
        User tenant = userRepository
                .findById(request.get("tenantId"))
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tenant not found!"));

        Property property = propertyRepository
                .findById(request.get("propertyId"))
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found!"));

        // Verify owner owns this property
        if (!property.getOwner().getEmail()
                .equals(ownerEmail)) {
            throw new RuntimeException(
                    "You don't own this property!");
        }

        Message message = new Message();
        message.setTenant(tenant);
        message.setOwner(owner);
        message.setProperty(property);
        message.setContent(request.get("content"));
        message.setSenderRole("OWNER");

        return messageRepository.save(message);
    }

    // ── Get conversation thread ───────────────────────
    public List<Message> getConversation(
            String propertyId,
            String tenantId,
            String userEmail) {

        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found!"));

        Property property = propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found!"));

        User tenant;
        if (user.getRole() == User.Role.TENANT) {
            tenant = user;
        } else {
            tenant = userRepository
                    .findById(tenantId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Tenant not found!"));
        }

        return messageRepository
                .findByTenantAndPropertyOrderByCreatedAtAsc(
                        tenant, property);
    }

    // ── Get all conversations for owner ──────────────
    public List<Map<String, Object>> getOwnerConversations(
            String ownerEmail) {

        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Owner not found!"));

        List<Message> allMessages = messageRepository
                .findByOwnerOrderByCreatedAtAsc(owner);

        // Group by tenant + property
        Map<String, Map<String, Object>> conversations
                = new LinkedHashMap<>();

        for (Message msg : allMessages) {
            String key = msg.getTenant().getId()
                    + "_" + msg.getProperty().getId();

            if (!conversations.containsKey(key)) {
                Map<String, Object> conv =
                        new LinkedHashMap<>();
                conv.put("tenantId",
                        msg.getTenant().getId());
                conv.put("tenantName",
                        msg.getTenant().getName());
                conv.put("tenantEmail",
                        msg.getTenant().getEmail());
                conv.put("propertyId",
                        msg.getProperty().getId());
                conv.put("propertyTitle",
                        msg.getProperty().getTitle());
                conv.put("propertyCity",
                        msg.getProperty().getCity());
                conv.put("lastMessage",
                        msg.getContent());
                conv.put("lastMessageTime",
                        msg.getCreatedAt());
                conv.put("senderRole",
                        msg.getSenderRole());
                conversations.put(key, conv);
            } else {
                // Update last message
                conversations.get(key).put(
                        "lastMessage", msg.getContent());
                conversations.get(key).put(
                        "lastMessageTime",
                        msg.getCreatedAt());
                conversations.get(key).put(
                        "senderRole", msg.getSenderRole());
            }
        }

        return new ArrayList<>(conversations.values());
    }

    // ── Get all conversations for tenant ─────────────
    public List<Map<String, Object>> getTenantConversations(
            String tenantEmail) {

        User tenant = userRepository
                .findByEmail(tenantEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tenant not found!"));

        List<Message> allMessages = messageRepository
                .findByTenantOrderByCreatedAtAsc(tenant);

        // Group by property
        Map<String, Map<String, Object>> conversations
                = new LinkedHashMap<>();

        for (Message msg : allMessages) {
            String key = msg.getProperty().getId();

            if (!conversations.containsKey(key)) {
                Map<String, Object> conv =
                        new LinkedHashMap<>();
                conv.put("propertyId",
                        msg.getProperty().getId());
                conv.put("propertyTitle",
                        msg.getProperty().getTitle());
                conv.put("propertyCity",
                        msg.getProperty().getCity());
                conv.put("ownerName",
                        msg.getOwner().getName());
                conv.put("ownerId",
                        msg.getOwner().getId());
                conv.put("lastMessage",
                        msg.getContent());
                conv.put("lastMessageTime",
                        msg.getCreatedAt());
                conv.put("senderRole",
                        msg.getSenderRole());
                conversations.put(key, conv);
            } else {
                conversations.get(key).put(
                        "lastMessage", msg.getContent());
                conversations.get(key).put(
                        "lastMessageTime",
                        msg.getCreatedAt());
                conversations.get(key).put(
                        "senderRole", msg.getSenderRole());
            }
        }

        return new ArrayList<>(conversations.values());
    }

    // ── Convert to DTO ────────────────────────────────
    public MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setSenderRole(message.getSenderRole());

        MessageDTO.SenderDTO tenantDTO =
                new MessageDTO.SenderDTO();
        tenantDTO.setId(message.getTenant().getId());
        tenantDTO.setName(message.getTenant().getName());
        tenantDTO.setEmail(
                message.getTenant().getEmail());
        dto.setTenant(tenantDTO);

        MessageDTO.SenderDTO ownerDTO =
                new MessageDTO.SenderDTO();
        ownerDTO.setId(message.getOwner().getId());
        ownerDTO.setName(message.getOwner().getName());
        ownerDTO.setEmail(
                message.getOwner().getEmail());
        dto.setOwner(ownerDTO);

        MessageDTO.PropertySummaryDTO propertyDTO =
                new MessageDTO.PropertySummaryDTO();
        propertyDTO.setId(
                message.getProperty().getId());
        propertyDTO.setTitle(
                message.getProperty().getTitle());
        propertyDTO.setCity(
                message.getProperty().getCity());
        dto.setProperty(propertyDTO);

        return dto;
    }

    public List<Message> getOwnerMessages(
            String ownerEmail) {
        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Owner not found!"));
        return messageRepository
                .findByOwnerOrderByCreatedAtDesc(owner);
    }

    public List<Message> getTenantMessages(
            String tenantEmail) {
        User tenant = userRepository
                .findByEmail(tenantEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tenant not found!"));
        return messageRepository
                .findByTenantOrderByCreatedAtDesc(tenant);
    }

    public Message getMessageById(String id) {
        return messageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Message not found!"));
    }
}