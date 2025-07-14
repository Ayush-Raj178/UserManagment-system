package com.usermanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendPasswordResetEmail(String email, String token) {
        try {
            Context context = new Context();
            context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + token);
            
            String emailContent = templateEngine.process("password-reset-template", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Password Reset Request");
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Async
    public void sendWelcomeEmail(String email, String name) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("loginLink", frontendUrl + "/login");
            
            String emailContent = templateEngine.process("welcome-template", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Welcome to Our Platform");
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
} 