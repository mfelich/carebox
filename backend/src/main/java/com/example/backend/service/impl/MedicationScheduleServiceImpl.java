package com.example.backend.service.impl;

import com.example.backend.dto.CreateSchedule;
import com.example.backend.dto.MedicationScheduleDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.User;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationScheduleMapper;
import com.example.backend.repo.MedicationScheduleRepo;
import com.example.backend.service.AccessControlService;
import com.example.backend.service.MedicationScheduleService;
import com.example.backend.service.util.EntityFetcher;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationScheduleServiceImpl implements MedicationScheduleService {

    private EntityFetcher entityFetcher;
    private MedicationScheduleRepo medicationScheduleRepo;
    private MedicationScheduleMapper medicationScheduleMapper;
    private AccessControlService accessControlService;

    public MedicationScheduleServiceImpl(EntityFetcher entityFetcher, MedicationScheduleRepo medicationScheduleRepo, MedicationScheduleMapper medicationScheduleMapper, AccessControlService accessControlService){
        this.entityFetcher=entityFetcher;
        this.medicationScheduleRepo=medicationScheduleRepo;
        this.medicationScheduleMapper=medicationScheduleMapper;
        this.accessControlService=accessControlService;
    };

    @Override
    @Transactional
    public MedicationScheduleDto createScheduleForMedication(CreateSchedule createSchedule, Long medicationId) {

        Medication medication = entityFetcher.findMedicationById(medicationId);
        User currentUser = entityFetcher.getCurrentUser();

        //check if currentUser is ADMIN or DOCTOR related to PATIENT from medication
        if (!accessControlService.hasAccessToPatient(currentUser, medication.getPatient())){
            throw new AccessDeniedException("You can't create schedule for this medication");
        }

        MedicationSchedule newSchedule = new MedicationSchedule();
        newSchedule.setMedication(medication);
        newSchedule.setTime(createSchedule.getTime());
        newSchedule.setDaysOfWeek(createSchedule.getDays());

        MedicationSchedule savedSchedule = medicationScheduleRepo.save(newSchedule);

        return medicationScheduleMapper.mapToDto(savedSchedule);
    }

    @Override
    public String removeSchedule(Long scheduleId) throws AccessDeniedException{
        MedicationSchedule medicationSchedule = medicationScheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new MedicationNotFoundException("Medication shedule not found with id:" + scheduleId));

        User currentUser = entityFetcher.getCurrentUser();
        User patient = medicationSchedule.getMedication().getPatient();

        if (!accessControlService.hasAccessToPatient(currentUser,patient)) {
            throw new AccessDeniedException("You can't delete this medication schedule");
        }

        medicationScheduleRepo.delete(medicationSchedule);
        return "Schedule deleted.";
    }

    @Override
    public List<MedicationScheduleDto> getScheduleForPatient(Long patientId) {
        User currentUser = entityFetcher.getCurrentUser();
        User patient = entityFetcher.findUserById(patientId);

        if (!currentUser.getId().equals(patient.getId())){

            if (!accessControlService.hasAccessToPatient(currentUser,patient)){
                throw new AccessDeniedException("You can not see schedule for this patient.");
            }
        }

        List<MedicationSchedule> schedules = medicationScheduleRepo.findAllByMedication_Patient_Id(patientId);

        if (schedules.isEmpty()) {
            throw new MedicationNotFoundException("No schedules found for this patient");
        }

        return schedules.stream()
                .map(medicationScheduleMapper::mapToDto)
                .collect(Collectors.toList());
    }

}
