package com.example.CarpoolingProject.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PassengerDashboardDTO {
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private int seatsBooked;
    private double price;
    private String driverName;
    private String driverContact; // <-- add this
}
