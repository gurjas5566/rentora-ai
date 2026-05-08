package com.rentora.rentora_backend.repository;

import com.rentora.rentora_backend.model.Message;
import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository  extends JpaRepository<Message,String> {
    List<Message> findByOwnerOrderByCreatedAtDesc(User owner);
    List<Message> findByTenantOrderByCreatedAtDesc(User tenant);

    List<Message> findByOwnerAndPropertyId(User owner, String propertyId);

    Optional<Message> findByTenantAndProperty(User tenant, Property property);

    List<Message> findByOwnerOrderByCreatedAtAsc(User owner);

    List<Message> findByTenantOrderByCreatedAtAsc(
            User tenant);

    List<Message> findByTenantAndPropertyOrderByCreatedAtAsc(
            User tenant, Property property);

}
