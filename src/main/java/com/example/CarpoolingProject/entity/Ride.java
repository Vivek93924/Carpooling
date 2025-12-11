package com.example.CarpoolingProject.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;

    private LocalDate date;
    private LocalTime time;

    @Column(nullable = false)
    private Long bookedSeats = 0L;      // newly added column

    @Column(nullable = false)
    private Long availableSeats = 0L;   // modified to BIGINT in DB

    private Double price;
    private Double rating;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @JsonIgnoreProperties({"password", "vehicleModel", "licensePlate", "capacity"})
    private User driver;

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"ride"})
    private List<Booking> bookings = new ArrayList<>();
}
