package com.rentora.rentora_backend.security;

import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository)
    {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("JwtFilter: Processing request to " + request.getRequestURI());
        System.out.println("JwtFilter: Auth header: " + (authHeader != null ? "Present" : "Missing"));

        if(authHeader!= null && authHeader.startsWith("Bearer "))
        {
            String token = authHeader.substring(7);
            System.out.println("JwtFilter: Token extracted");

            if(jwtUtil.isTokenValid(token))
            {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);
                System.out.println("JwtFilter: Token valid for email=" + email + ", role=" + role);

                userRepository.findByEmail(email).ifPresentOrElse(user -> {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            email,null, List.of(new SimpleGrantedAuthority("ROLE_"+role))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JwtFilter: Auth context set for user: " + email);
                }, () -> {
                    System.out.println("JwtFilter: User not found in database for email: " + email);
                });
            } else {
                System.out.println("JwtFilter: Token is invalid or expired");
            }
        }
        filterChain.doFilter(request,response);
    }
}
