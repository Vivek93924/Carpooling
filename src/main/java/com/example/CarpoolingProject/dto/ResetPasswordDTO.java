package com.example.CarpoolingProject.dto;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String email;
    private String otp;           // OTP received in email
    private String newPassword;   // New password
}
