package com.example.CarpoolingProject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String status;
    private int seatsBooked;
    private int totalPrice;          // ride price * seats booked
    private String rideSource;
    private String rideDestination;
    private String rideDate;
    private String rideTime;
    private String driverName;
    private double driverRating;
}
