package com.example.backend.service;

import com.example.backend.dto.CreateSchedule;
import com.example.backend.dto.MedicationScheduleDto;

import java.util.List;

public interface MedicationScheduleService {
    MedicationScheduleDto createScheduleForMedication(CreateSchedule createSchedule, Long medicationId);
    String removeSchedule(Long scheduleId);
    List<MedicationScheduleDto> getScheduleForPatient(Long patientId);
}
