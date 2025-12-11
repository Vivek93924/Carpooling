package com.example.CarpoolingProject.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RideRequestDTO {
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private Long availableSeats;  // changed to Long
    private Double price;
}
