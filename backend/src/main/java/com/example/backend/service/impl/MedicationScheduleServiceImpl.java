package com.example.backend.service.impl;

import com.example.backend.dto.CreateSchedule;
import com.example.backend.dto.MedicationDto;
import com.example.backend.dto.MedicationScheduleDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationMapper;
import com.example.backend.mapper.MedicationScheduleMapper;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.repo.MedicationScheduleRepo;
import com.example.backend.service.MedicationScheduleService;
import com.example.backend.service.util.EntityFetcher;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationScheduleServiceImpl implements MedicationScheduleService {

    private EntityFetcher entityFetcher;
    private MedicationRepo medicationRepo;
    private MedicationScheduleRepo medicationScheduleRepo;
    private MedicationScheduleMapper medicationScheduleMapper;

    public MedicationScheduleServiceImpl(EntityFetcher entityFetcher,MedicationRepo medicationRepo, MedicationScheduleRepo medicationScheduleRepo, MedicationScheduleMapper medicationScheduleMapper){
        this.entityFetcher=entityFetcher;
        this.medicationRepo=medicationRepo;
        this.medicationScheduleRepo=medicationScheduleRepo;
        this.medicationScheduleMapper=medicationScheduleMapper;
    };

    @Override
    @Transactional
    public MedicationScheduleDto createScheduleForMedication(CreateSchedule createSchedule, Long medicationId) {

        Medication medication = entityFetcher.findMedicationById(medicationId);

        User doctor = entityFetcher.getCurrentUser();

        if (!doctor.getRole().equals(UserRole.DOCTOR)
                || medication.getUser() == null
                || medication.getUser().getDoctor() == null
                || !medication.getUser().getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You can't create schedule for this medication");
        }

        List<MedicationSchedule> schedules =  medication.getSchedules();

        MedicationSchedule newSchedule = new MedicationSchedule();
        newSchedule.setMedication(medication);
        newSchedule.setTime(createSchedule.getTime());
        newSchedule.setDaysOfWeek(createSchedule.getDays());

        MedicationSchedule savedSchedule = medicationScheduleRepo.save(newSchedule);
        schedules.add(newSchedule);
        medicationRepo.save(medication);

        return medicationScheduleMapper.mapToDto(savedSchedule);
    }

    @Override
    public String removeSchedule(Long scheduleId) throws AccessDeniedException{
        MedicationSchedule medicationSchedule = medicationScheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new MedicationNotFoundException("Medication shedule not found with id:" + scheduleId));

        User doctor = entityFetcher.getCurrentUser();

        if (!doctor.getRole().equals(UserRole.DOCTOR)
                || medicationSchedule.getMedication().getUser() == null
                || medicationSchedule.getMedication().getUser().getDoctor() == null
                || !medicationSchedule.getMedication().getUser().getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You can't create schedule for this medication");
        }

        else {
            throw new AccessDeniedException("You can not delete this schedule");
        }

    }

    @Override
    public List<MedicationScheduleDto> getScheduleForUser(Long userId) {
        User currentUser = entityFetcher.getCurrentUser();
        User user = entityFetcher.findUserById(userId);

        if (currentUser.getRole().equals(UserRole.DOCTOR)) {
            if (user.getDoctor() == null || !user.getDoctor().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You cannot see schedule for this patient");
            }
        } else {
            if (!currentUser.getId().equals(userId)) {
                throw new AccessDeniedException("You cannot see schedule for another user");
            }
        }

        List<MedicationSchedule> schedules = medicationScheduleRepo.findAllByMedication_User_Id(userId);

        if (schedules.isEmpty()) {
            throw new MedicationNotFoundException("No schedules found for this user");
        }

        return schedules.stream()
                .map(medicationScheduleMapper::mapToDto)
                .collect(Collectors.toList());
    }

}
