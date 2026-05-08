package com.rentora.rentora_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final WebClient webClient;

    public AIService()
    {
        this.webClient = WebClient.builder().build();
    }

    private String callGroq(String systemPrompt,String userMessage)
    {
        Map<String,Object> requestBody = Map.of(
                "model",model,
                "messages", List.of(
                        Map.of("role", "system",
                                "content", systemPrompt),
                        Map.of("role", "user",
                                "content", userMessage)
                ),
                "max_tokens", 1024

        );

        Map response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map> choices = (List<Map>) response
                .get("choices");
        Map message = (Map) choices.get(0).get("message");
        return (String) message.get("content");
    }

    public String getChatbotResponse(String userMessage)
    {
        String systemPrompt = """
                 You are a helpful rental property assistant\s
                 for Rentora AI platform.
                 Help users find properties, understand\s
                 rental trends, and answer questions about\s
                 renting in India.
                 Keep responses concise and helpful.
                """;
        return callGroq(systemPrompt,userMessage);
    }
    public String estimateRentalPrice(
            String city,
            Integer bedrooms,
            Double areaSqft,
            String furnishing,
            List<String> amenities) {

        String systemPrompt = """
                You are a real estate expert in India.
                Estimate fair rental prices based on 
                property details.
                Give a specific price range in INR 
                and brief explanation.
                Keep response under 100 words.
                """;

        String userMessage = String.format(
                "Estimate rent for: %d BHK in %s, " +
                        "%.0f sqft, %s furnished, " +
                        "amenities: %s",
                bedrooms, city, areaSqft,
                furnishing, amenities);

        return callGroq(systemPrompt, userMessage);
    }

    public String getRecommendations(
            String city,
            Double budget,
            Integer bedrooms,
            List<String> preferences) {

        String systemPrompt = """
                You are a rental property advisor in India.
                        Suggest specific residential societies,\s
                        buildings and complexes based on user preferences.
                        For each suggestion include:
                        - Society/Building name
                        - Area/Location
                        - Approximate rent range
                        - Why it matches their preferences
                        Keep response concise and practical.
                """;

        String userMessage = String.format(
                "Recommend rental options for: " +
                        "City: %s, Budget: ₹%.0f/month, " +
                        "Bedrooms: %d, Preferences: %s",
                city, budget, bedrooms, preferences);

        return callGroq(systemPrompt, userMessage);
    }
}


