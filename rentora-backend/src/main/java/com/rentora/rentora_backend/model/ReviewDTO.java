package com.rentora.rentora_backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {

    private String id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    private ReviewerDTO tenant;

    @Data
    public static class ReviewerDTO {
        private String id;
        private String name;
    }
}