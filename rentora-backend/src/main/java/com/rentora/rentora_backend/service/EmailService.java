package com.rentora.rentora_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email:}")
    private String fromEmail;

    @Value("${app.url}")
    private String appUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public EmailService() {
    }

    // ── Send any HTML email ──────────────────────────
    private void sendEmail(String to, String subject,
                           String htmlContent) {
        try {
            String url = "https://api.sendgrid.com/v3/mail/send";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(sendgridApiKey);

            Map<String, Object> body = new HashMap<>();
            
            // "personalizations" array
            Map<String, Object> personalization = new HashMap<>();
            personalization.put("to", List.of(Map.of("email", to)));
            personalization.put("subject", subject);
            body.put("personalizations", List.of(personalization));

            // "from" object
            body.put("from", Map.of("email", fromEmail, "name", "Rentora AI"));

            // "content" array
            Map<String, String> content = new HashMap<>();
            content.put("type", "text/html");
            content.put("value", htmlContent);
            body.put("content", List.of(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("SendGrid API failed: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send email: " + e.getMessage());
        }
    }

    // ── 1. Verification Email ────────────────────────
    public void sendVerificationEmail(String to,
                                      String name,
                                      String token) {
        String verifyUrl = appUrl +
                "/verify-email?token=" + token;

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Poppins', Arial, sans-serif;
                       background: #F8F5EE; margin: 0; padding: 0; }
                .container { max-width: 560px; margin: 40px auto;
                             background: white; border-radius: 20px;
                             overflow: hidden;
                             box-shadow: 0 4px 24px rgba(30,77,43,0.10); }
                .header { background: linear-gradient(135deg,
                          #1E4D2B, #2D6A3F);
                          padding: 40px 40px 32px;
                          text-align: center; }
                .logo { font-size: 24px; font-weight: 700;
                        color: white; margin-bottom: 4px; }
                .logo span { color: #B8962E; }
                .body { padding: 40px; }
                .greeting { font-size: 22px; font-weight: 700;
                            color: #141A14; margin-bottom: 12px; }
                .text { font-size: 15px; color: #6B7A6B;
                        line-height: 1.7; margin-bottom: 28px; }
                .btn { display: inline-block;
                       background: linear-gradient(135deg,
                         #1E4D2B, #2D6A3F);
                       color: white; padding: 14px 36px;
                       border-radius: 12px; font-size: 15px;
                       font-weight: 600; text-decoration: none;
                       margin-bottom: 28px; }
                .note { font-size: 13px; color: #6B7A6B;
                        background: #F2F7F3;
                        border-radius: 10px; padding: 14px;
                        border-left: 3px solid #4A8C5C; }
                .footer { padding: 24px 40px;
                          border-top: 1px solid #EAF2EC;
                          text-align: center;
                          font-size: 12px; color: #6B7A6B; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">
                    Rentora <span>AI</span>
                  </div>
                  <div style="color:rgba(255,255,255,0.6);
                              font-size:13px;margin-top:4px;">
                    Smart Rental Platform
                  </div>
                </div>
                <div class="body">
                  <p class="greeting">
                    Welcome, %s! 
                  </p>
                  <p class="text">
                    Thanks for joining Rentora AI — India's
                    smartest rental platform. Please verify
                    your email address to get started.
                  </p>
                  <div style="text-align:center;
                              margin-bottom:28px; text-color:white">
                    <a href="%s" class="btn">
                      ✓ Verify Email Address
                    </a>
                  </div>
                  <div class="note">
                    This link expires in 24 hours.
                    If you didn't create an account,
                    you can safely ignore this email.
                  </div>
                </div>
                <div class="footer">
                  © 2026 Rentora AI · Made for renters,
                  by builders.
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, verifyUrl);

        sendEmail(to,
                "Verify your Rentora AI account", html);
    }

    // ── 2. Welcome Email (after verification) ────────
    public void sendWelcomeEmail(String to, String name) {
        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif;
                       background: #F8F5EE; margin: 0; }
                .container { max-width: 560px; margin: 40px auto;
                             background: white;
                             border-radius: 20px; overflow: hidden;
                             box-shadow: 0 4px 24px
                               rgba(30,77,43,0.10); }
                .header { background: linear-gradient(135deg,
                          #1E4D2B, #2D6A3F);
                          padding: 40px; text-align: center; }
                .logo { font-size: 24px; font-weight: 700;
                        color: white; }
                .logo span { color: #B8962E; }
                .body { padding: 40px; }
                .greeting { font-size: 22px; font-weight: 700;
                            color: #141A14; margin-bottom: 12px; }
                .text { font-size: 15px; color: #6B7A6B;
                        line-height: 1.7; margin-bottom: 24px; }
                .feature { display: flex; align-items: center;
                           gap: 12px; padding: 14px;
                           background: #F2F7F3;
                           border-radius: 10px;
                           margin-bottom: 10px; }
                .feature-icon { font-size: 20px; }
                .feature-text { font-size: 14px; color: #3D4A3D;
                                font-weight: 500; }
                .btn { display: inline-block;
                       background: #1E4D2B; color: white;
                       padding: 14px 36px; border-radius: 12px;
                       font-size: 15px; font-weight: 600;
                       text-decoration: none; margin-top: 24px; }
                .footer { padding: 24px 40px;
                          border-top: 1px solid #EAF2EC;
                          text-align: center;
                          font-size: 12px; color: #6B7A6B; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">
                    Rentora <span>AI</span>
                  </div>
                </div>
                <div class="body">
                  <p class="greeting">
                    You're all set, %s! 🎉
                  </p>
                  <p class="text">
                    Your email is verified. Here's what
                    you can do on Rentora AI:
                  </p>
                  <div class="feature">
                    <span class="feature-icon">🏠</span>
                    <span class="feature-text">
                      Browse 12,000+ verified listings
                    </span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">🤖</span>
                    <span class="feature-text">
                      Get AI-powered price estimates
                    </span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">📅</span>
                    <span class="feature-text">
                      Book property visits instantly
                    </span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">💬</span>
                    <span class="feature-text">
                      Chat directly with owners
                    </span>
                  </div>
                  <div style="text-align:center;">
                    <a href="%s/properties" class="btn">
                      Start Exploring →
                    </a>
                  </div>
                </div>
                <div class="footer">
                  © 2026 Rentora AI · Zero Brokerage ·
                  AI Powered
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, appUrl);

        sendEmail(to,
                "Welcome to Rentora AI! 🏠", html);
    }

    // ── 3. Password Reset Email ──────────────────────
    public void sendPasswordResetEmail(String to,
                                       String name,
                                       String token) {
        String resetUrl = appUrl +
                "/reset-password?token=" + token;

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif;
                       background: #F8F5EE; margin: 0; }
                .container { max-width: 560px; margin: 40px auto;
                             background: white;
                             border-radius: 20px; overflow: hidden;
                             box-shadow: 0 4px 24px
                               rgba(30,77,43,0.10); }
                .header { background: linear-gradient(135deg,
                          #1E4D2B, #2D6A3F);
                          padding: 40px; text-align: center; }
                .logo { font-size: 24px; font-weight: 700;
                        color: white; }
                .logo span { color: #B8962E; }
                .body { padding: 40px; }
                .greeting { font-size: 22px; font-weight: 700;
                            color: #141A14; margin-bottom: 12px; }
                .text { font-size: 15px; color: #6B7A6B;
                        line-height: 1.7; margin-bottom: 28px; }
                .btn { display: inline-block;
                       background: #1E4D2B; color: white;
                       padding: 14px 36px; border-radius: 12px;
                       font-size: 15px; font-weight: 600;
                       text-decoration: none;
                       margin-bottom: 28px; }
                .warning { font-size: 13px; color: #92600A;
                           background: #FEF3C7;
                           border-radius: 10px; padding: 14px;
                           border-left: 3px solid #B8962E; }
                .footer { padding: 24px 40px;
                          border-top: 1px solid #EAF2EC;
                          text-align: center;
                          font-size: 12px; color: #6B7A6B; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">
                    Rentora <span>AI</span>
                  </div>
                </div>
                <div class="body">
                  <p class="greeting">
                    Reset your password 🔐
                  </p>
                  <p class="text">
                    Hi %s, we received a request to reset
                    your Rentora AI password. Click the
                    button below to set a new password.
                  </p>
                  <div style="text-align:center;
                              margin-bottom:28px;">
                    <a href="%s" class="btn">
                      Reset Password
                    </a>
                  </div>
                  <div class="warning">
                    ⚠️ This link expires in 1 hour.
                    If you didn't request this,
                    please ignore this email.
                    Your account is safe.
                  </div>
                </div>
                <div class="footer">
                  © 2026 Rentora AI · This is an
                  automated email, please do not reply.
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, resetUrl);

        sendEmail(to,
                "Reset your Rentora AI password", html);
    }

    public void sendVisitConfirmationEmail(
            String to, String tenantName,
            String propertyTitle, String visitDate,
            String ownerName) {

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif;
                       background: #F8F5EE; margin: 0; }
                .container { max-width: 560px; margin: 40px auto;
                             background: white;
                             border-radius: 20px; overflow: hidden;
                             box-shadow: 0 4px 24px
                               rgba(30,77,43,0.10); }
                .header { background: linear-gradient(135deg,
                          #1E4D2B, #2D6A3F);
                          padding: 40px; text-align: center; }
                .logo { font-size: 24px; font-weight: 700;
                        color: white; }
                .logo span { color: #B8962E; }
                .badge { display: inline-block;
                         background: rgba(255,255,255,0.15);
                         color: white; padding: 6px 16px;
                         border-radius: 99px; font-size: 13px;
                         margin-top: 12px; }
                .body { padding: 40px; }
                .greeting { font-size: 22px; font-weight: 700;
                            color: #141A14; margin-bottom: 12px; }
                .text { font-size: 15px; color: #6B7A6B;
                        line-height: 1.7; margin-bottom: 24px; }
                .detail-card { background: #F2F7F3;
                               border-radius: 14px;
                               padding: 20px 24px;
                               margin-bottom: 24px; }
                .detail-row { display: flex;
                              justify-content: space-between;
                              padding: 8px 0;
                              border-bottom: 1px solid
                                rgba(30,77,43,0.1);
                              font-size: 14px; }
                .detail-row:last-child {
                  border-bottom: none; }
                .detail-label { color: #6B7A6B; }
                .detail-value { color: #141A14;
                                font-weight: 600; }
                .footer { padding: 24px 40px;
                          border-top: 1px solid #EAF2EC;
                          text-align: center;
                          font-size: 12px; color: #6B7A6B; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">
                    Rentora <span>AI</span>
                  </div>
                  <div class="badge">
                    ✓ Visit Confirmed
                  </div>
                </div>
                <div class="body">
                  <p class="greeting">
                    Your visit is confirmed! 📅
                  </p>
                  <p class="text">
                    Hi %s, your property visit has been
                    confirmed by the owner.
                    Here are your visit details:
                  </p>
                  <div class="detail-card">
                    <div class="detail-row">
                      <span class="detail-label">
                        Property
                      </span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">
                        Date & Time
                      </span>
                      <span class="detail-value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">
                        Owner
                      </span>
                      <span class="detail-value">%s</span>
                    </div>
                  </div>
                  <p style="font-size:14px;color:#6B7A6B;
                            line-height:1.7;">
                    Please arrive on time. If you need
                    to reschedule, contact the owner
                    through Rentora AI.
                  </p>
                </div>
                <div class="footer">
                  © 2026 Rentora AI · Zero Brokerage
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                tenantName, propertyTitle,
                visitDate, ownerName);

        sendEmail(to,
                "Visit Confirmed — " + propertyTitle, html);
    }
}