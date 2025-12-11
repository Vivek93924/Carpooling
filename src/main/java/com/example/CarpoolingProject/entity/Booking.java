package com.example.CarpoolingProject.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ride_id")
    private Ride ride;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id")
    private User passenger;

    @Column(nullable = false)
    private Long seatsBooked;  // changed from Integer → Long

    @Column(nullable = false)
    private String status = "PENDING"; // default
}
