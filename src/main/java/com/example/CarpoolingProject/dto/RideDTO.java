package com.example.CarpoolingProject.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RideDTO {
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private Integer availableSeats;  // use Integer instead of int
    private Double price;
    private String vehicleModel;
}
