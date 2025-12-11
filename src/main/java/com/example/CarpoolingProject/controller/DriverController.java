package com.example.CarpoolingProject.controller;

import com.example.CarpoolingProject.dto.RideDTO;
import com.example.CarpoolingProject.dto.VehicleDTO;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.service.DriverService;
import com.example.CarpoolingProject.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/driver")
@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from React frontend
public class DriverController {

    @Autowired
    private DriverService driverService;

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

    // ---------------- GET DRIVER VEHICLE ----------------
    @GetMapping("/vehicle")
    public VehicleDTO getVehicle(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);
        User user = driverService.getDriverByEmail(email);

        return new VehicleDTO(
                user.getName(),
                user.getVehicleModel(),
                user.getLicensePlate(),
                user.getCapacity()
        );
    }

    // ---------------- ADD / UPDATE VEHICLE ----------------
    @PutMapping("/vehicle")
    public VehicleDTO updateVehicle(HttpServletRequest request, @RequestBody VehicleDTO dto) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);

        User updatedUser = driverService.updateVehicle(
                email,
                dto.getVehicleModel(),
                dto.getLicensePlate(),
                dto.getCapacity()
        );

        return new VehicleDTO(
                updatedUser.getName(),
                updatedUser.getVehicleModel(),
                updatedUser.getLicensePlate(),
                updatedUser.getCapacity()
        );
    }

    // ---------------- DRIVER POSTS A NEW RIDE ----------------
    @PostMapping("/ride")
    public Ride postRide(HttpServletRequest request, @RequestBody RideDTO dto) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);
        return driverService.postRide(email, dto);
    }

    // ---------------- LIST RIDES CREATED BY DRIVER ----------------
    @GetMapping("/rides")
    public List<Ride> getRides(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);
        return driverService.getRidesByDriver(email);
    }

    // ---------------- DRIVER EARNINGS ----------------
    @GetMapping("/earnings")
    public Double getEarnings(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractEmail(token);
        return driverService.calculateEarnings(email);
    }
}
