package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.BookingRepository;
import com.example.CarpoolingProject.repository.UserRepository;
import com.example.CarpoolingProject.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passenger")
public class PassengerController {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/history")
    public List<Booking> getRideHistory(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token);
        User passenger = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return bookingRepo.findByPassenger(passenger);
    }

    @GetMapping("/dashboard")
    public List<Booking> getPassengerBookings(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token);
        User passenger = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return bookingRepo.findByPassenger(passenger);
    }
}
