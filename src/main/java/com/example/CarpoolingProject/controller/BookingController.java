package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.dto.BookingRequestDTO;
import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.config.JwtUtil;
import com.example.CarpoolingProject.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend requests
public class BookingController {

    @Autowired
    private BookingService service;

    @Autowired
    private JwtUtil jwtUtil;

    // Book a ride
    @PostMapping("/book")
    public Booking book(@RequestBody BookingRequestDTO dto,
                        @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        return service.bookRide(dto, email);
    }

    // Get all bookings for the authenticated passenger
    @GetMapping("/my-book")
    public List<Booking> getMyBookings(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        return service.getBookingsByPassenger(email);
    }

    // Cancel a booking
    @DeleteMapping("/cancel/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId,
                                @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        service.cancelBooking(bookingId, email);
        return "Booking cancelled successfully";
    }

    // ===== New: Driver accept/reject booking =====
    @PostMapping("/bookings/{bookingId}/{action}") // action = accept or reject
    public String handleBookingAction(
            @PathVariable Long bookingId,
            @PathVariable String action,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        if ("accept".equalsIgnoreCase(action)) {
            service.acceptBooking(bookingId, email);
            return "Booking accepted successfully";
        } else if ("reject".equalsIgnoreCase(action)) {
            service.rejectBooking(bookingId, email);
            return "Booking rejected successfully";
        } else {
            throw new RuntimeException("Invalid action: " + action);
        }
    }
}
