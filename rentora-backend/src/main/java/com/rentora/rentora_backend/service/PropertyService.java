package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.Property;
import com.rentora.rentora_backend.model.PropertyImage;
import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.PropertyImageRepository;
import com.rentora.rentora_backend.repository.PropertyRepsitory;
import com.rentora.rentora_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PropertyService {
    private final PropertyRepsitory propertyRepsitory;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PropertyImageRepository propertyImageRepository;

    public PropertyService(PropertyRepsitory propertyRepsitory,
                           UserRepository userRepository,
                           FileStorageService fileStorageService,
                           PropertyImageRepository propertyImageRepository)
    {
        this.propertyRepsitory = propertyRepsitory;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.propertyImageRepository = propertyImageRepository;
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
        
        // Handle numeric fields safely
        try {
            if (request.get("rent") != null && !request.get("rent").toString().isEmpty()) {
                Object rent = request.get("rent");
                property.setRent(rent instanceof Number ? ((Number) rent).doubleValue() : Double.parseDouble(rent.toString()));
            }
            if (request.get("areaSqft") != null && !request.get("areaSqft").toString().isEmpty()) {
                Object area = request.get("areaSqft");
                property.setAreaSqft(area instanceof Number ? ((Number) area).doubleValue() : Double.parseDouble(area.toString()));
            }
            if (request.get("bedrooms") != null && !request.get("bedrooms").toString().isEmpty()) {
                Object beds = request.get("bedrooms");
                property.setBedrooms(beds instanceof Number ? ((Number) beds).intValue() : Integer.parseInt(beds.toString()));
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid numeric value: " + e.getMessage());
        }
        
        property.setFurnishing((String) request.get("furnishing"));
        property.setDescription((String) request.get("description"));
        
        if (request.get("propertyType") != null) {
            try {
                property.setPropertyType(Property.PropertyType
                    .valueOf((String) request.get("propertyType")));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid property type: " + request.get("propertyType"));
            }
        }
        
        property.setAmenities((List<String>) request.get("amenities"));
        property.setStatus(Property.Status.ACTIVE);

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

    public List<PropertyImage> uploadImages(String propertyId, MultipartFile[] files, String ownerEmail) {
        Property property = propertyRepsitory.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        if (!property.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("You can only upload images to your own properties!");
        }

        List<PropertyImage> uploadedImages = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = fileStorageService.storeFile(file);
            PropertyImage image = new PropertyImage();
            image.setProperty(property);
            image.setImageUrl("/api/uploads/" + fileName);
            uploadedImages.add(propertyImageRepository.save(image));
        }
        return uploadedImages;
    }

    public Map<String, Object> getOwnerStats(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found!"));
        List<Property> properties = propertyRepsitory.findByOwner(owner);

        long total = properties.size();
        long active = properties.stream().filter(p -> p.getStatus() == Property.Status.ACTIVE).count();
        long pending = properties.stream().filter(p -> p.getStatus() == Property.Status.PENDING).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProperties", total);
        stats.put("activeProperties", active);
        stats.put("pendingProperties", pending);
        return stats;
    }
}
