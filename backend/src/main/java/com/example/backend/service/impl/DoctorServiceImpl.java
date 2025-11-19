package com.example.backend.service.impl;

import com.example.backend.dto.DoctorDto;
import com.example.backend.dto.PatientDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.AccessControlService;
import com.example.backend.service.DoctorService;
import com.example.backend.service.util.EntityFetcher;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private EntityFetcher entityFetcher;
    private UserRepo userRepo;
    private UserMapper userMapper;
    private AccessControlService accessControlService;

    public DoctorServiceImpl(EntityFetcher entityFetcher, UserRepo userRepo, UserMapper userMapper, AccessControlService accessControlService) {
        this.entityFetcher=entityFetcher;
        this.userRepo=userRepo;
        this.userMapper=userMapper;
        this.accessControlService=accessControlService;
    }

    @Override
    public List<PatientDto> getPatientsForDoctor(Long doctorId) {
        User currentUser = entityFetcher.getCurrentUser();
        User doctor = entityFetcher.findUserById(doctorId);

        if (doctor.getRole() != UserRole.DOCTOR) {
            throw new AccessDeniedException("User is not a doctor, role: " + doctor.getRole());
        }

        if (currentUser.getRole() != UserRole.ADMIN && !currentUser.getId().equals(doctorId)) {
            throw new AccessDeniedException("You do not have access to view this doctor's patients.");
        }

        List<User> patients = userRepo.findByDoctor_Id(doctorId);

        return patients.stream()
                .map(userMapper::mapToPatientDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientDto addPatient(Long patientId) throws AccessDeniedException {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!accessControlService.canAddPatient(currentUser,patient)) {
            throw new AccessDeniedException("You cannot assign this patient.");
        }

        patient.setDoctor(currentUser);
        patient.setRole(UserRole.PATIENT);

        User savedPatient = userRepo.save(patient);

        return userMapper.mapToPatientDto(savedPatient);
    }

    public String removePatient(Long patientId) {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!accessControlService.hasAccessToPatient(currentUser,patient)){
            throw new AccessDeniedException("You do not have permission to remove this patient.");
        }

        patient.setDoctor(null);
        userRepo.save(patient);

        return "Patient removed successfully.";
    }


}
