package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.service.BookingService;
import com.example.CarpoolingProject.service.RideService;
import com.example.CarpoolingProject.service.UserService;
import com.example.CarpoolingProject.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private RideService rideService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ---------------- PASSENGER DASHBOARD ----------------
    @GetMapping("/passenger")
    public List<Booking> passengerDashboard(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return bookingService.getBookingsByPassenger(email); // ✅ instance method
    }

    // ---------------- DRIVER DASHBOARD ----------------
    @GetMapping("/driver")
    public List<Ride> driverDashboard(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return rideService.getRidesByDriver(email); // ✅ instance method
    }

    // ---------------- HELPER ----------------
    private String extractEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer "
        return jwtUtil.extractEmail(token);
    }
}
