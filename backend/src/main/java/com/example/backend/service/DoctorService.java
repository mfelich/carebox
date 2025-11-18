package com.example.backend.service;

import com.example.backend.dto.UserDto;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

public interface DoctorService {
    List<UserDto> getPatients(Long doctorId) throws AccessDeniedException;
    UserDto addPatient(Long patientId) throws AccessDeniedException;
}
