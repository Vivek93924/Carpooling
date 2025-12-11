package com.example.CarpoolingProject.repository;

import com.example.CarpoolingProject.entity.Ride;
import com.example.CarpoolingProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDate(String source, String destination, LocalDate date);
    List<Ride> findByDriver(User driver);
}
