package com.example.CarpoolingProject.repository;

import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get ALL bookings for rides posted by driver
    List<Booking> findByRide_Driver(User driver);

    // Get ONLY pending booking requests for driver's rides
    List<Booking> findByRide_DriverAndStatus(User driver, String status);

    // Passenger bookings
    List<Booking> findByPassenger(User passenger);
}
