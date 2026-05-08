package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PropertyService {
    private final PropertyRepsitory propertyRepsitory;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepsitory propertyRepsitory,UserRepository userRepository)
    {
        this.propertyRepsitory = propertyRepsitory;
        this.userRepository = userRepository;
    }
    public Property createProperty(Map<String,Object> request,String ownerEmail)
    {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(()->
                         new RuntimeException("Owner not found"));

        if(owner.getRole()!=User.Role.OWNER)
        {
            throw new RuntimeException(
                    "Only owners can create listings"
            );
        }
        Property property = new Property();
        property.setOwner(owner);
        property.setTitle((String) request.get("title"));
        property.setCity((String) request.get("city"));
        property.setAddress((String) request.get("address"));
        property.setPincode((String) request.get("pincode"));
        property.setRent(((Number) request.get("rent"))
                .doubleValue());
        property.setBedrooms((Integer) request.get("bedrooms"));
        property.setFurnishing((String) request.get("furnishing"));
        property.setDescription((String) request.get("description"));
        property.setPropertyType(Property.PropertyType
                .valueOf((String) request.get("propertyType")));
        property.setAmenities((List<String>) request.get("amenities"));
        property.setStatus(Property.Status.PENDING);

        return propertyRepsitory.save(property);
    }

    public List<Property> getAllActiveProperties()
    {
        return propertyRepsitory.findByStatus(Property.Status.ACTIVE);
    }
    public Property getPropertyById(String id)
    {
        return propertyRepsitory.findById(id)
                .orElseThrow(()-> new RuntimeException("Property not found!"));
    }

    public List<Property> searchProperties(String city,Double minRent,Double maxRent,Integer bedrooms,String propertyType)
    {
        return propertyRepsitory.searchProperties(
                city,minRent,maxRent,bedrooms,propertyType
        );

    }

    public List<Property> getOwnerProperties(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Owner not found!"));
        return propertyRepsitory.findByOwner(owner);
    }

    public Property updateProperty(String id,
                                   Map<String, Object> request,
                                   String ownerEmail) {
        Property property = propertyRepsitory.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));
        if (!property.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException(
                    "You can only update your own properties!");
        }


        if (request.containsKey("title"))
            property.setTitle((String) request.get("title"));
        if (request.containsKey("rent"))
            property.setRent(((Number) request.get("rent"))
                    .doubleValue());
        if (request.containsKey("description"))
            property.setDescription(
                    (String) request.get("description"));
        if (request.containsKey("amenities"))
            property.setAmenities(
                    (List<String>) request.get("amenities"));

        return propertyRepsitory.save(property);
    }

    public void deleteProperty(String id, String userEmail,
                               String userRole) {
        Property property = propertyRepsitory.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));

        if (userRole.equals("ADMIN")) {
            propertyRepsitory.delete(property);
            return;
        }

        if (!property.getOwner().getEmail().equals(userEmail)) {
            throw new RuntimeException(
                    "You can only delete your own properties!");
        }

        propertyRepsitory.delete(property);
    }

    public Property approveProperty(String id) {
        Property property = propertyRepsitory.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));
        property.setStatus(Property.Status.ACTIVE);
        return propertyRepsitory.save(property);
    }

    public Property rejectProperty(String id) {
        Property property = propertyRepsitory.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Property not found!"));
        property.setStatus(Property.Status.REJECTED);
        return propertyRepsitory.save(property);
    }

}
