package com.rentora.rentora_backend.repository;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.Schedule;
import com.rentora.rentora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,String> {

    List<Schedule> findByTenantOrderByVisitDateDesc(
            User tenant
    );

    List<Schedule> findByPropertyOwnerOrderByVisitDateDesc(
            User owner
    );

    List<Schedule> findByPropertyAndStatus(Property property,Schedule.Status status);
}
