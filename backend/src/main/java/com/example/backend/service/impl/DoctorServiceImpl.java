package com.example.backend.service.impl;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
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

    public DoctorServiceImpl(EntityFetcher entityFetcher, UserRepo userRepo, UserMapper userMapper) {
        this.entityFetcher=entityFetcher;
        this.userRepo=userRepo;
        this.userMapper=userMapper;
    }

    @Override
    public List<UserDto> getPatients(Long doctorId) throws AccessDeniedException {
        User doctor = entityFetcher.findUserById(doctorId);

        if (!doctor.getRole().equals(UserRole.DOCTOR)) {
            throw new AccessDeniedException("User is not doctor, user role is:" + doctor.getRole().toString());
        }
        List<User> patients = userRepo.findByDoctor_Id(doctorId);
        return patients.stream()
                .map(userMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto addPatient(Long patientId) throws AccessDeniedException {
        User doctor = entityFetcher.getCurrentUser();

        if (!doctor.getRole().equals(UserRole.DOCTOR)) {
            throw new AccessDeniedException("You are not a doctor.");
        }

        User patient = entityFetcher.findUserById(patientId);

        if (patient.getRole().equals(UserRole.DOCTOR)) {
            throw new AccessDeniedException("User with id:" + patient.getId() + " is a doctor.");
        }

        // Poveži pacijenta s doktorom
        patient.setDoctor(doctor);
        patient.setRole(UserRole.PATIENT);

        // Spremi pacijenta - Hibernate automatski ažurira listu pacijenata doktora
        User savedPatient = userRepo.save(patient);

        return userMapper.mapToDto(savedPatient);
    }


}
