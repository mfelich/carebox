package com.example.backend.service.impl;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationMapper;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.service.util.EntityFetcher;
import com.example.backend.service.MedicationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationServiceImpl implements MedicationService {

    private MedicationRepo medicationRepo;
    private MedicationMapper medicationMapper;
    private EntityFetcher entityFetcher;

    public MedicationServiceImpl(MedicationRepo medicationRepo, MedicationMapper medicationMapper, EntityFetcher entityFetcher) {
        this.medicationRepo=medicationRepo;
        this.medicationMapper=medicationMapper;
        this.entityFetcher=entityFetcher;
    }

    @Override
    public List<MedicationDto> getAllMedicationByUserId(Long patientId) throws AccessDeniedException {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        boolean doctorAccess =
                currentUser.getRole().equals(UserRole.DOCTOR)
                        && patient.getDoctor() != null
                        && patient.getDoctor().getId().equals(currentUser.getId());

        boolean patientAccess =
                currentUser.getId().equals(patientId);

        if (!doctorAccess && !patientAccess) {
            throw new AccessDeniedException("You cannot see medications for this user");
        }

        List<Medication> medications = medicationRepo.findAllByUserId(patientId);

        if (medications.isEmpty()) {
            throw new MedicationNotFoundException("No medications found for this user");
        }

        return medications.stream()
                .map(medicationMapper::mapToDto)
                .collect(Collectors.toList());
    }


    @Override
    public MedicationDto addMedication(Long patientId, CreateMedicationDto createMedicationDto) {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!currentUser.getRole().equals(UserRole.DOCTOR)
                || patient.getDoctor() == null
                || !patient.getDoctor().getId().equals(currentUser.getId())) {

            throw new AccessDeniedException("You cannot add medication for this user");
        }

        Medication medication = new Medication();
        medication.setName(createMedicationDto.getName());
        medication.setUser(patient);

        Medication savedMedication = medicationRepo.save(medication);

        return medicationMapper.mapToDto(savedMedication);
    }

}
