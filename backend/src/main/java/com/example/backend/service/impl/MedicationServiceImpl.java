package com.example.backend.service.impl;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationMapper;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.service.AccessControlService;
import com.example.backend.service.util.EntityFetcher;
import com.example.backend.service.MedicationService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationServiceImpl implements MedicationService {

    private MedicationRepo medicationRepo;
    private MedicationMapper medicationMapper;
    private EntityFetcher entityFetcher;
    private AccessControlService accessControlService;

    public MedicationServiceImpl(MedicationRepo medicationRepo, MedicationMapper medicationMapper, EntityFetcher entityFetcher, AccessControlService accessControlService) {
        this.medicationRepo=medicationRepo;
        this.medicationMapper=medicationMapper;
        this.entityFetcher=entityFetcher;
        this.accessControlService=accessControlService;
    }

    @Override
    public List<MedicationDto> getAllMedicationByPatientId(Long patientId) {

        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!currentUser.getId().equals(patientId)) {

            if (!accessControlService.hasAccessToPatient(currentUser, patient)) {
                throw new AccessDeniedException("You cannot view medications for this user");
            }
        }

        List<Medication> medications = medicationRepo.findAllByPatientId(patientId);

        if (medications.isEmpty()) {
            throw new MedicationNotFoundException("No medications found for this user");
        }

        return medications.stream()
                .map(medicationMapper::mapToDto)
                .collect(Collectors.toList());
    }


    @Override
    public String deleteMedication(Long medicationId) {
        User currentUser = entityFetcher.getCurrentUser();
        Medication medication = entityFetcher.findMedicationById(medicationId);

        if (!accessControlService.hasAccessToPatient(currentUser,medication.getPatient())){
            throw new AccessDeniedException("You cannot edit this medication.");
        }

        medicationRepo.delete(medication);
        return "Medication deleted successfully.";
    }

    @Override
    @Transactional
    public MedicationDto addMedicationToPatient(Long patientId, CreateMedicationDto createMedicationDto) {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!accessControlService.hasAccessToPatient(currentUser,patient)) {
            throw new AccessDeniedException("You cannot add medication for this user");
        }

        Medication medication = new Medication();
        medication.setName(createMedicationDto.getName());
        medication.setPatient(patient);

        Medication savedMedication = medicationRepo.save(medication);

        return medicationMapper.mapToDto(savedMedication);
    }

}
