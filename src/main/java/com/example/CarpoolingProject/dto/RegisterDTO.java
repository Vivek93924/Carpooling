package com.example.CarpoolingProject.dto;

import com.example.CarpoolingProject.entity.Role;
import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
    private Role role;
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;
}
