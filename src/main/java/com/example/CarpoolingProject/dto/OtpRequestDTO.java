package com.example.CarpoolingProject.dto;

import lombok.Data;

@Data
public class OtpRequestDTO {
    private String email;
    // For register flow, include extra fields (optional): name, phone, password, role, vehicleModel, licensePlate, capacity
    private String name;
    private String phone;
    private String password;
    private String role; // DRIVER or PASSENGER
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;
}
