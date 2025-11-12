package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.MedicationSchedule;

public interface MedicationScheduleRepo extends JpaRepository<MedicationSchedule,Long> {
}
