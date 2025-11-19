package com.example.backend.service;

import com.example.backend.dto.PatientDto;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

public interface DoctorService {
    List<PatientDto> getPatientsForDoctor(Long doctorId) throws AccessDeniedException;
    PatientDto addPatient(Long patientId) throws AccessDeniedException;
    String removePatient(Long patientId);
}
