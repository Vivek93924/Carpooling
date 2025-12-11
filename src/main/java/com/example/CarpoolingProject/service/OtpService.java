package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.entity.Otp;
import com.example.CarpoolingProject.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    private final Random random = new Random();

    public String generateOtpCode() {
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public Otp createOtp(String email, String purpose, int minutesValid) {
        String code = generateOtpCode();
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(code);
        otp.setPurpose(purpose);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(minutesValid));
        otp.setUsed(false);
        return otpRepository.save(otp);
    }

    public boolean verifyOtp(String email, String code, String purpose) {
        return otpRepository.findByEmailAndCodeAndPurposeAndUsedFalse(email, code, purpose)
                .filter(o -> o.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(o -> {
                    o.setUsed(true);
                    otpRepository.save(o);
                    return true;
                }).orElse(false);
    }
}
