package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.dto.ForgotPasswordDTO;
import com.example.CarpoolingProject.dto.ResetPasswordDTO;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.service.UserService;
import com.example.CarpoolingProject.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ---------------- JWT EXTRACTOR ----------------
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new RuntimeException("Missing or invalid Authorization header");
    }

    // ---------------- SEND OTP ----------------
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordDTO dto) {
        return userService.sendOtp(dto.getEmail());
    }

    // ---------------- RESET PASSWORD ----------------
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordDTO dto) {
        return userService.resetPassword(dto.getEmail(), dto.getOtp(), dto.getNewPassword());
    }

    // ---------------- GET USER PROFILE ----------------
    @GetMapping("/profile")
    public User getProfile(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);
        return userService.findByEmail(email); // use findByEmail
    }

}
