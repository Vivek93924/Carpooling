package com.example.CarpoolingProject.repository;

import com.example.CarpoolingProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;   // ← ADD THIS

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
