package com.example.CarpoolingProject.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
@Data
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String code;

    // "REGISTER" or "LOGIN"
    private String purpose;

    private LocalDateTime expiresAt;
    private boolean used = false;
}
