package com.example.backend.service.impl;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.User;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationMapper;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.service.util.EntityFetcher;
import com.example.backend.service.util.MedicationService;
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
    public List<MedicationDto> getAllMedicationByUserId(Long userId) {
        List<Medication> medications = medicationRepo.findAllByUserId(userId);

        if (medications.isEmpty()){
            throw new MedicationNotFoundException("Not find any medications for this user");
        }

        return medications.stream().map(medicationMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MedicationDto addMedication(Long userId, CreateMedicationDto createMedicationDto) {
        User user = entityFetcher.findUserById(userId);

        Medication medication = new Medication();
        medication.setName(createMedicationDto.getName());
        medication.setUser(user);

        Medication savedMedication = medicationRepo.save(medication);

        return medicationMapper.mapToDto(savedMedication);
    }
}
