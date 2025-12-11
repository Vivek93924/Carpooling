package com.example.CarpoolingProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ========== EXISTING OTP EMAIL METHOD ==========
    public void sendOtpEmail(String to, String otp, String purpose) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Your OTP for " + purpose);
        msg.setText("Your OTP is: " + otp + "\nIt is valid for 5 minutes.\nIf you didn't request this, ignore.");
        mailSender.send(msg);
    }

    // ========== 🔥 NEW METHOD FOR BOOKINGS ==========
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
