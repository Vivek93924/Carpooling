package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.dto.RegisterDTO;
import com.example.CarpoolingProject.entity.Role;
import com.example.CarpoolingProject.entity.User;
import com.example.CarpoolingProject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service("userDetailsService")
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    // Temporary OTP store
    private Map<String, String> otpMap = new HashMap<>();

    // ---------------- REGISTER USER ----------------
    @Transactional
    public User register(RegisterDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();

        if (existsByEmail(email)) {
            throw new RuntimeException("User already registered with this email");
        }

        User u = new User();
        u.setName(dto.getName());
        u.setEmail(email);
        u.setPhone(dto.getPhone());
        u.setRole(dto.getRole());
        u.setPassword(encoder.encode(dto.getPassword()));

        // If driver, set vehicle info
        if (dto.getRole() == Role.DRIVER) {
            u.setVehicleModel(dto.getVehicleModel());
            u.setLicensePlate(dto.getLicensePlate());
            u.setCapacity(dto.getCapacity());
        }

        return repo.save(u);
    }

    // ---------------- LOAD USER FOR SECURITY ----------------
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        email = email.trim().toLowerCase();
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    // ---------------- HELPER METHODS ----------------
    public boolean existsByEmail(String email) {
        return repo.existsByEmail(email.trim().toLowerCase());
    }

    public User findByEmail(String email) {
        email = email.trim().toLowerCase();
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ---------------- OTP FOR LOGIN ----------------
    public String sendOtp(String email) {
        email = email.trim().toLowerCase();
        User user = findByEmail(email);

        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpMap.put(email, otp);

        String message = "Your OTP is: " + otp + "\nIt is valid for 10 minutes.";
        emailService.sendEmail(email, "OTP Verification", message);

        return "OTP sent to your email!";
    }

    public String verifyOtp(String email, String otp) {
        email = email.trim().toLowerCase();
        if (!otpMap.containsKey(email) || !otpMap.get(email).equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        otpMap.remove(email);
        return "OTP verified successfully!";
    }

    // ---------------- RESET PASSWORD ----------------
    public String resetPassword(String email, String otp, String newPassword) {
        email = email.trim().toLowerCase();
        User user = findByEmail(email);

        if (!otpMap.containsKey(email) || !otpMap.get(email).equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setPassword(encoder.encode(newPassword));
        repo.save(user);
        otpMap.remove(email);

        return "Password reset successfully!";
    }
}
