package com.example.backend.service;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;

import java.util.List;

public interface MedicationService {
    List<MedicationDto> getAllMedicationByPatientId(Long patientId);
    //edit
    String deleteMedication(Long medicationId);
    MedicationDto addMedicationToPatient(Long patientId, CreateMedicationDto createMedicationDto);
}
