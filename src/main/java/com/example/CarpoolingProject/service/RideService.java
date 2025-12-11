package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.dto.RideRequestDTO;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.RideRepository;
import com.example.CarpoolingProject.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    // ---------------- DRIVER POSTS A RIDE ----------------
    public Ride postRide(RideRequestDTO dto, String driverEmail){
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Ride ride = new Ride();
        ride.setSource(dto.getSource());
        ride.setDestination(dto.getDestination());
        ride.setDate(dto.getDate());
        ride.setTime(dto.getTime());

        // FIX for Line 34: Convert the Integer from the DTO to Long
        // to match the Ride entity's availableSeats field.
        ride.setAvailableSeats(dto.getAvailableSeats().longValue());

        ride.setDriver(driver);

        return rideRepository.save(ride);
    }

    // ---------------- SEARCH RIDES ----------------
    public List<Ride> search(String src, String dest, LocalDate date){
        return rideRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDate(
                src.trim(),
                dest.trim(),
                date
        );
    }

    // ---------------- DRIVER DASHBOARD METHOD ----------------
    public List<Ride> getRidesByDriver(String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return rideRepository.findByDriver(driver);
    }
    public Ride updateRideSeats(Long rideId, Long newlyBooked) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // Increase booked seats
        ride.setBookedSeats(ride.getBookedSeats() + newlyBooked);

        // Decrease available seats
        ride.setAvailableSeats(ride.getAvailableSeats() - newlyBooked);

        return rideRepository.save(ride);
    }

}