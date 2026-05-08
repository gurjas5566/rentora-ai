package com.rentora.rentora_backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ScheduleDTO {
    private String id;
    private LocalDateTime visitDate;
    private Schedule.Status status;

    private TenantDTO tenant;
    private PropertySummaryDTO property;

    @Data
    public static class TenantDTO {
        private String id;
        private String name;
        private String email;
    }

    @Data
    public static class PropertySummaryDTO {
        private String id;
        private String title;
        private String city;
        private String address;
    }
}