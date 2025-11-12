package com.example.backend.repo;

import com.example.backend.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepo extends JpaRepository<Medication, Long> {
    List<Medication> findAllByUserId(Long userId);
}
