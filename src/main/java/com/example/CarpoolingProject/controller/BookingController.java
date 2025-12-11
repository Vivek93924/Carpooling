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
    @PostMapping("/bookings/{bookingId}/{action}")
    public Booking handleBookingAction(
            @PathVariable Long bookingId,
            @PathVariable String action,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);

        Booking updatedBooking;
        if ("accept".equalsIgnoreCase(action)) {
            updatedBooking = service.acceptBooking(bookingId, email);
        } else if ("reject".equalsIgnoreCase(action)) {
            updatedBooking = service.rejectBooking(bookingId, email);
        } else {
            throw new RuntimeException("Invalid action: " + action);
        }

        return updatedBooking;
    }

}
