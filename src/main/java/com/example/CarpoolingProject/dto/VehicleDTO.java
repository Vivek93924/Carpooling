package com.example.CarpoolingProject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VehicleDTO {
    private String name;
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;
}
