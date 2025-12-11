package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.dto.RideRequestDTO;
import com.example.CarpoolingProject.dto.RideSearchDTO;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.service.RideService;
import com.example.CarpoolingProject.service.BookingService;
import com.example.CarpoolingProject.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ride")
@CrossOrigin(origins = "http://localhost:3000")
public class RideController {

    @Autowired
    private RideService rideService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtUtil jwtUtil;

    // ---------------- POST RIDE ----------------
    @PostMapping("/post")
    public Ride postRide(@RequestBody RideRequestDTO dto,
                         @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return rideService.postRide(dto, email);
    }

    // ---------------- SEARCH RIDES ----------------
    @PostMapping("/search")
    public List<Ride> search(@RequestBody RideSearchDTO dto,
                             @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        jwtUtil.extractEmail(authHeader.substring(7));

        return rideService.search(dto.getSource(), dto.getDestination(), dto.getDate());
    }

    // ---------------- DRIVER → VIEW BOOKING REQUESTS ----------------
    @GetMapping("/booking-requests")
    public List<Booking> getBookingRequestsForDriver(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String driverEmail = jwtUtil.extractEmail(token);

        return bookingService.getBookingRequestsForDriver(driverEmail);
    }
}
