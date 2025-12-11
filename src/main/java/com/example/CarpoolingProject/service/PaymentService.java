package com.example.CarpoolingProject.service;

import com.example.CarpoolingProject.entity.Payment;
import com.example.CarpoolingProject.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;

    public List<Payment> getPaymentsByEmail(String email) {
        return paymentRepo.findByUserEmail(email);
    }
}
