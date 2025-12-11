package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.dto.RideDTO;
import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.entity.Role;
import com.example.CarpoolingProject.repository.BookingRepository;
import com.example.CarpoolingProject.repository.RideRepository;
import com.example.CarpoolingProject.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ---------------- GET DRIVER BY EMAIL ----------------
    public User getDriverByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    // ---------------- UPDATE VEHICLE ----------------
    public User updateVehicle(String email, String model, String license, Integer capacity) {
        User user = getDriverByEmail(email);
        user.setVehicleModel(model);
        user.setLicensePlate(license);
        user.setCapacity(capacity);
        return userRepository.save(user);
    }

    // ---------------- POST NEW RIDE ----------------
    public Ride postRide(String email, RideDTO dto) {
        User driver = getDriverByEmail(email);

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(dto.getSource());
        ride.setDestination(dto.getDestination());
        ride.setDate(dto.getDate());
        ride.setTime(dto.getTime());

        // Explicitly cast int → Long if DTO uses int
        ride.setAvailableSeats(dto.getAvailableSeats() != null ? dto.getAvailableSeats().longValue() : 0L);
        ride.setBookedSeats(0L);

        ride.setPrice(dto.getPrice());

        return rideRepository.save(ride);
    }

    // ---------------- GET RIDES BY DRIVER ----------------
    public List<Ride> getRidesByDriver(String email) {
        User driver = getDriverByEmail(email);
        return rideRepository.findByDriver(driver);
    }

    // ---------------- CALCULATE DRIVER EARNINGS ----------------
    public Double calculateEarnings(String email) {
        User driver = getDriverByEmail(email);
        List<Booking> bookings = bookingRepository.findByRide_Driver(driver);

        return bookings.stream()
                .map(b -> b.getSeatsBooked() * b.getRide().getPrice())
                .mapToDouble(Double::doubleValue)
                .sum();
    }
}
