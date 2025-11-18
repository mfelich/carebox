package com.example.backend.repo;

import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    List<User> findByDoctor_Id(Long doctorId);
    Page<User> findAllByRole(UserRole role, Pageable pageable);
}
