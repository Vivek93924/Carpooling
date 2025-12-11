package com.example.CarpoolingProject.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String rideInfo;
    private double amount;
    private String method; // UPI, Card
    private String status; // success, failed
    private LocalDate date;
}
