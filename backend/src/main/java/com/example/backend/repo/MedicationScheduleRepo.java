package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.MedicationSchedule;

import java.util.List;

public interface MedicationScheduleRepo extends JpaRepository<MedicationSchedule,Long> {
    List<MedicationSchedule> findAllByMedication_User_Id(Long userId);
}
