package com.rentora.rentora_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors
                        .configurationSource(
                                corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**", "/auth/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/properties/search")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/properties/{id}")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/properties")
                        .permitAll()
                        .requestMatchers(
                                "/api/reviews/property/**")
                        .permitAll()
                        .requestMatchers("/api/ai/**")
                        .permitAll()
                        .requestMatchers("/api/uploads/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/properties")
                        .hasRole("OWNER")
                        .requestMatchers("/api/owner/**")
                        .hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT,
                                "/api/properties/*/approve")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,
                                "/api/properties/*/reject")

                        .hasRole("ADMIN")
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter
                                .class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://rentora-frontend.onrender.com",
                "https://rentora-frontend-tlce.onrender.com",
                "https://*.vercel.app"
        ));
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT",
                "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept"
        ));
        config.setExposedHeaders(List.of(
                "Authorization"
        ));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(
                "/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}