package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.entity.Payment;
import com.example.CarpoolingProject.config.JwtUtil;
import com.example.CarpoolingProject.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService service;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/my")
    public List<Payment> getMyPayments(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        return service.getPaymentsByEmail(email);
    }
}
