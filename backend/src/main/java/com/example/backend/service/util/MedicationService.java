package com.example.backend.service.util;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;

import java.util.List;

public interface MedicationService {
    List<MedicationDto> getAllMedicationByUserId(Long userId);
    //editMedication
    //getMedicaion
    //deleteMedication
    MedicationDto addMedication(Long userId, CreateMedicationDto createMedicationDto);
}
