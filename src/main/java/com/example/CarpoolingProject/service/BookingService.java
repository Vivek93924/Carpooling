package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.dto.BookingRequestDTO;
import com.example.CarpoolingProject.entity.Booking;
import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.BookingRepository;
import com.example.CarpoolingProject.repository.RideRepository;
import com.example.CarpoolingProject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private RideRepository rideRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;


    // -------------------- BOOK A RIDE --------------------
    public Booking bookRide(BookingRequestDTO dto, String passengerEmail) {

        Ride ride = rideRepo.findById(dto.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (dto.getSeats() <= 0)
            throw new RuntimeException("You must book at least 1 seat");

        if (ride.getAvailableSeats() < dto.getSeats())
            throw new RuntimeException("Not enough seats available");

        User passenger = userRepo.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(dto.getSeats().longValue());
        booking.setStatus("PENDING");

        Long seatsToBook = booking.getSeatsBooked();

        // 🔥 FIX: reduce only availableSeats, DO NOT increase bookedSeats here
        ride.setAvailableSeats(ride.getAvailableSeats() - seatsToBook);

        rideRepo.save(ride);
        return bookingRepo.save(booking);
    }


    // -------------------- PASSENGER BOOKINGS --------------------
    public List<Booking> getBookingsByPassenger(String email) {
        User passenger = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return bookingRepo.findByPassenger(passenger);
    }


    // -------------------- DRIVER BOOKING REQUESTS --------------------
    public List<Booking> getBookingRequestsForDriver(String driverEmail) {

        User driver = userRepo.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // ✅ IMPORTANT FIX: only PENDING requests
        return bookingRepo.findByRide_DriverAndStatus(driver, "PENDING");
    }


    // -------------------- CANCEL BOOKING --------------------
    public void cancelBooking(Long bookingId, String passengerEmail) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getPassenger().getEmail().equals(passengerEmail))
            throw new RuntimeException("Not authorized to cancel this booking");

        Ride ride = booking.getRide();

        // Restore seats
        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
        rideRepo.save(ride);

        bookingRepo.delete(booking);
    }


    // -------------------- ACCEPT BOOKING --------------------
    public void acceptBooking(Long bookingId, String driverEmail) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Ride ride = booking.getRide();

        if (!ride.getDriver().getEmail().equals(driverEmail))
            throw new RuntimeException("You are not allowed to modify this booking");

        booking.setStatus("ACCEPTED");

        // 🔥 Move seats from pending to confirmed
        ride.setBookedSeats(ride.getBookedSeats() + booking.getSeatsBooked());

        rideRepo.save(ride);
        bookingRepo.save(booking);

        sendBookingEmails(ride.getDriver(), booking.getPassenger(), ride, booking.getSeatsBooked());
    }


    // -------------------- REJECT BOOKING --------------------
    public void rejectBooking(Long bookingId, String driverEmail) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Ride ride = booking.getRide();

        if (!ride.getDriver().getEmail().equals(driverEmail))
            throw new RuntimeException("You are not allowed to modify this booking");

        booking.setStatus("REJECTED");

        // Restore seats
        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());

        rideRepo.save(ride);
        bookingRepo.save(booking);
    }


    // -------------------- EMAIL NOTIFICATIONS --------------------
    private void sendBookingEmails(User driver, User passenger, Ride ride, Long seats) {
        try {
            String passengerMsg = "Your booking is confirmed!\n\n" +
                    "Ride: " + ride.getSource() + " → " + ride.getDestination() + "\n" +
                    "Driver: " + driver.getName() + "\n" +
                    "Seats: " + seats + "\n" +
                    "Date: " + ride.getDate() + " | Time: " + ride.getTime();

            emailService.sendEmail(passenger.getEmail(), "Booking Confirmed", passengerMsg);

            String driverMsg = "A passenger booked your ride!\n\n" +
                    "Passenger: " + passenger.getName() + "\n" +
                    "Seats: " + seats + "\n" +
                    "Ride: " + ride.getSource() + " → " + ride.getDestination() + "\n" +
                    "Date: " + ride.getDate() + " | Time: " + ride.getTime();

            emailService.sendEmail(driver.getEmail(), "New Booking Accepted", driverMsg);

            System.out.println("Emails sent successfully ✅");

        } catch (Exception ex) {
            System.out.println("Email sending failed ❌: " + ex.getMessage());
            ex.printStackTrace(); // 🔥 Print full error
        }
    }
}
