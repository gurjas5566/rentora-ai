package com.rentora.rentora_backend.service;

import com.rentora.rentora_backend.model.User;
import com.rentora.rentora_backend.repository.UserRepository;
import com.rentora.rentora_backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ── Register ─────────────────────────────────────
    public Map<String, String> register(
            String name, String email,
            String password, String role) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email already registered!");
        }

        // Generate verification token
        String verificationToken = UUID.randomUUID()
                .toString();

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(password));
        user.setRole(User.Role.valueOf(
                role.toUpperCase()));
        user.setVerificationToken(verificationToken);
        user.setEmailVerified(false);

        userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(
                    email, name, verificationToken);
        } catch (Exception e) {
            System.err.println(
                    "Email sending failed: " +
                            e.getMessage());
        }

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Registration successful! " +
                        "Please check your email to verify " +
                        "your account.");
        response.put("email", email);
        return response;
    }

    // ── Verify Email ─────────────────────────────────
    @Transactional
    public Map<String, String> verifyEmail(
            String token) {

        User user = userRepository
                .findByVerificationToken(token)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid or expired " +
                                        "verification token!"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                    "Email already verified!");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(
                    user.getEmail(), user.getName());
        } catch (Exception e) {
            System.err.println(
                    "Welcome email failed: " +
                            e.getMessage());
        }

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(
                user.getEmail(), user.getRole().name());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("role", user.getRole().name());
        response.put("message",
                "Email verified successfully!");
        return response;
    }

    // ── Login ─────────────────────────────────────────
    public Map<String, String> login(
            String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                password, user.getPassword())) {
            throw new RuntimeException(
                    "Invalid password!");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                    "Please verify your email first! " +
                            "Check your inbox.");
        }

        String token = jwtUtil.generateToken(
                email, user.getRole().name());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("message",
                "Login successful!");
        return response;
    }

    // ── Forgot Password ──────────────────────────────
    public Map<String, String> forgotPassword(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with " +
                                        "this email!"));

        // Generate reset token valid for 1 hour
        String resetToken = UUID.randomUUID()
                .toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(
                LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send reset email
        try {
            emailService.sendPasswordResetEmail(
                    email, user.getName(), resetToken);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send reset email!");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password reset link sent to " +
                        email + "!");
        return response;
    }

    // ── Reset Password ───────────────────────────────
    public Map<String, String> resetPassword(
            String token, String newPassword) {

        User user = userRepository
                .findByResetToken(token)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid reset token!"));

        // Check token expiry
        if (user.getResetTokenExpiry()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Reset token has expired! " +
                            "Please request a new one.");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password reset successfully! " +
                        "Please login.");
        return response;
    }
}