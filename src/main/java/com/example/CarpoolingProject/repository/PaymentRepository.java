package com.example.CarpoolingProject.repository;

import com.example.CarpoolingProject.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserEmail(String email);
}
