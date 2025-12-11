package com.example.CarpoolingProject.dto;

import lombok.Data;

@Data
public class OtpVerifyDTO {
    private String email;
    private String code;
    private String purpose; // REGISTER or LOGIN
}
