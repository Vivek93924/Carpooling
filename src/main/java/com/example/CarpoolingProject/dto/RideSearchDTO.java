package com.example.CarpoolingProject.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RideSearchDTO {
    private String source;
    private String destination;
    private LocalDate date;
    private Integer seatsRequested;
}
