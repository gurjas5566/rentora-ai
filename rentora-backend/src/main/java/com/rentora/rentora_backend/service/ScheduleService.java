package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.Schedule;
import com.rentora.rentora_backend.model.ScheduleDTO;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.ScheduleRepository;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PropertyRepsitory propertyRepsitory;

    public ScheduleService(
            ScheduleRepository scheduleRepository,
            UserRepository userRepository,
            PropertyRepsitory propertyRepsitory
    )
    {
        this.scheduleRepository = scheduleRepository;
        this.propertyRepsitory = propertyRepsitory;
        this.userRepository = userRepository;
    }
    public Schedule bookVisit(
            Map<String,String> request, String tenantEmail
    ){
         User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

         if(tenant.getRole()!= User.Role.TENANT){
             throw new RuntimeException("Only tenants can book visits");
         }

        Property property = propertyRepsitory.findById(request.get("propertyId"))
                .orElseThrow(()-> new RuntimeException("Property not found"));

         if(property.getStatus()!= Property.Status.ACTIVE){
             throw new RuntimeException("Property is not available for visits");
         }
        Schedule schedule = new Schedule();
        schedule.setTenant(tenant);
        schedule.setProperty(property);
        schedule.setVisitDate(LocalDateTime.parse(
                request.get("visitDate")));
        schedule.setStatus(Schedule.Status.PENDING);

        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getTenantSchedules(
            String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() ->
                        new RuntimeException("Tenant not found!"));
        return scheduleRepository
                .findByTenantOrderByVisitDateDesc(tenant);
    }

    public List<Schedule> getOwnerSchedules(
            String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Owner not found!"));
        return scheduleRepository
                .findByPropertyOwnerOrderByVisitDateDesc(owner);
    }

    public Schedule confirmVisit(String id, String ownerEmail) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found!"));

        if (!schedule.getProperty().getOwner()
                .getEmail().equals(ownerEmail)) {
            throw new RuntimeException(
                    "You can only confirm your own visits!");
        }

        schedule.setStatus(Schedule.Status.CONFIRMED);
        return scheduleRepository.save(schedule);
    }

    public Schedule cancelVisit(String id, String userEmail) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found!"));

        boolean isTenant = schedule.getTenant()
                .getEmail().equals(userEmail);
        boolean isOwner = schedule.getProperty()
                .getOwner().getEmail().equals(userEmail);

        if (!isTenant && !isOwner) {
            throw new RuntimeException(
                    "You cannot cancel this visit!");
        }

        schedule.setStatus(Schedule.Status.CANCELLED);
        return scheduleRepository.save(schedule);
    }
    public ScheduleDTO convertToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setVisitDate(schedule.getVisitDate());
        dto.setStatus(schedule.getStatus());

        ScheduleDTO.TenantDTO tenantDTO =
                new ScheduleDTO.TenantDTO();
        tenantDTO.setId(schedule.getTenant().getId());
        tenantDTO.setName(schedule.getTenant().getName());
        tenantDTO.setEmail(schedule.getTenant().getEmail());
        dto.setTenant(tenantDTO);

        ScheduleDTO.PropertySummaryDTO propertyDTO =
                new ScheduleDTO.PropertySummaryDTO();
        propertyDTO.setId(schedule.getProperty().getId());
        propertyDTO.setTitle(schedule.getProperty().getTitle());
        propertyDTO.setCity(schedule.getProperty().getCity());
        propertyDTO.setAddress(
                schedule.getProperty().getAddress());
        dto.setProperty(propertyDTO);

        return dto;
    }
    public Schedule completeVisit(String id, String ownerEmail) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found!"));

        if (!schedule.getProperty().getOwner()
                .getEmail().equals(ownerEmail)) {
            throw new RuntimeException(
                    "You can only complete your own visits!");
        }

        if (schedule.getStatus() != Schedule.Status.CONFIRMED) {
            throw new RuntimeException(
                    "Only confirmed visits can be completed!");
        }

        schedule.setStatus(Schedule.Status.COMPLETED);
        return scheduleRepository.save(schedule);
    }
    }


