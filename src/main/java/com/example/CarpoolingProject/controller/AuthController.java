package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.dto.LoginDTO;
import com.example.CarpoolingProject.dto.RegisterDTO;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.UserRepository;
import com.example.CarpoolingProject.service.UserService;
import com.example.CarpoolingProject.config.JwtUtil;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Temporary in-memory OTP store
    private Map<String, String> otpStore = new HashMap<>();

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterDTO dto, HttpSession session) {
        if (userService.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Normalize email
        dto.setEmail(dto.getEmail().toLowerCase());
        User user = userService.register(dto);

        String token = jwtUtil.generateToken(user.getEmail());
        session.setAttribute("USER", user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("token", token);
        response.put("user", user);

        return response;
    }

    // ---------------- LOGIN WITH PASSWORD ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            String email = loginDTO.getEmail().toLowerCase();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found. Please register."));

            // Authenticate with password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, loginDTO.getPassword())
            );

            String token = jwtUtil.generateToken(email);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // ---------------- SEND OTP ----------------
    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email required");
        }

        String normalizedEmail = email.toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found. Please register."));

        // Generate 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStore.put(normalizedEmail, otp);

        // Send OTP email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(normalizedEmail);
        message.setSubject("Your OTP for SmartRide App");
        message.setText("Your OTP is: " + otp + "\nIt is valid for 10 minutes.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP: " + e.getMessage());
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        return response;
    }

    // ---------------- VERIFY OTP ----------------
    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            throw new RuntimeException("Email and OTP required");
        }

        String normalizedEmail = email.toLowerCase();

        String savedOtp = otpStore.get(normalizedEmail);
        if (savedOtp == null || !savedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        otpStore.remove(normalizedEmail);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found. Please register."));

        String token = jwtUtil.generateToken(normalizedEmail);
        session.setAttribute("USER", normalizedEmail);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "OTP verified. Login successful.");
        response.put("user", user);

        return response;
    }

    // ---------------- LOGOUT ----------------
    @PostMapping("/logout")
    public Map<String, String> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully. Delete your JWT token on client.");
        return response;
    }
}
