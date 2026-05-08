package com.rentora.rentora_backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private String id;
    private String content;
    private String senderRole;
    private LocalDateTime createdAt;

    private SenderDTO tenant;
    private SenderDTO owner;
    private PropertySummaryDTO property;


    @Data
    public static class SenderDTO{
        private String id;
        private String name;
        private String email;
    }

    @Data
    public static class PropertySummaryDTO{
        private String id;
        private String title;
        private String city;
    }
}
