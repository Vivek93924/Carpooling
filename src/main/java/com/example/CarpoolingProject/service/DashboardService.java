package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.dto.DriverDashboardDTO;
import com.example.CarpoolingProject.dto.PassengerDashboardDTO;
import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.BookingRepository;
import com.example.CarpoolingProject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private UserRepository userRepo;

    // Passenger Dashboard
    public List<PassengerDashboardDTO> getPassengerDashboard(String passengerEmail) {
        User passenger = userRepo.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        return bookingRepo.findAll().stream()
                .filter(b -> b.getPassenger().getId().equals(passenger.getId()))
                .map(b -> {
                    PassengerDashboardDTO dto = new PassengerDashboardDTO();
                    dto.setSource(b.getRide().getSource());
                    dto.setDestination(b.getRide().getDestination());
                    dto.setDate(b.getRide().getDate());
                    dto.setTime(b.getRide().getTime());

                    // FIX for Line 37: Convert Long to Integer/int for the DTO setter
                    dto.setSeatsBooked(b.getSeatsBooked().intValue());

                    dto.setDriverName(b.getRide().getDriver().getName());
                    dto.setDriverContact(b.getRide().getDriver().getPhone());
                    dto.setVehicleModel(
                            b.getRide().getDriver() != null
                                    ? b.getRide().getDriver().getVehicleModel()
                                    : "N/A"
                    );
                    return dto;
                }).collect(Collectors.toList());
    }

    // Driver Dashboard
    public List<DriverDashboardDTO> getDriverDashboard(String driverEmail) {
        User driver = userRepo.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return bookingRepo.findAll().stream()
                .filter(b -> b.getRide().getDriver().getId().equals(driver.getId()))
                .map(b -> {
                    DriverDashboardDTO dto = new DriverDashboardDTO();
                    dto.setSource(b.getRide().getSource());
                    dto.setDestination(b.getRide().getDestination());
                    dto.setDate(b.getRide().getDate());
                    dto.setTime(b.getRide().getTime());

                    // FIX for Line 57: Convert Long to Integer/int for the DTO setter
                    dto.setSeatsBooked(b.getSeatsBooked().intValue());

                    dto.setPassengerName(b.getPassenger().getName());
                    dto.setPassengerContact(b.getPassenger().getPhone());

                    return dto;
                }).collect(Collectors.toList());
    }
}