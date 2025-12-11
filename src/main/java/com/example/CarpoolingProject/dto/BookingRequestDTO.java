package com.example.CarpoolingProject.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long rideId;
    private Integer seats; // DTO from front-end can remain Integer
}
