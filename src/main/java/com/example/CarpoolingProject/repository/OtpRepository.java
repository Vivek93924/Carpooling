package com.example.CarpoolingProject.repository;

import com.example.CarpoolingProject.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByEmailAndPurposeAndUsedFalseOrderByExpiresAtDesc(String email, String purpose);
    Optional<Otp> findByEmailAndCodeAndPurposeAndUsedFalse(String email, String code, String purpose);
}
