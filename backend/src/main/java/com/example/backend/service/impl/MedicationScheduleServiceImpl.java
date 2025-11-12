package com.example.backend.service.impl;

import com.example.backend.dto.CreateSchedule;
import com.example.backend.dto.MedicationDto;
import com.example.backend.dto.MedicationScheduleDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.User;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.mapper.MedicationMapper;
import com.example.backend.mapper.MedicationScheduleMapper;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.repo.MedicationScheduleRepo;
import com.example.backend.service.MedicationScheduleService;
import com.example.backend.service.util.EntityFetcher;
import jakarta.transaction.Transactional;
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
        this.medicationScheduleRepo=medicationScheduleRepo;
        this.medicationRepo=medicationRepo;
        this.medicationScheduleMapper=medicationScheduleMapper;
    };

    @Override
    @Transactional
    public MedicationScheduleDto createScheduleForMedication(CreateSchedule createSchedule, Long medicationId) {

        Medication medication = entityFetcher.findMedicationById(medicationId);
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
    public String removeSchedule(Long scheduleId) {
        MedicationSchedule medicationSchedule = medicationScheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new MedicationNotFoundException("Medication shedule not found with id:" + scheduleId));

        medicationScheduleRepo.delete(medicationSchedule);

        return "Schedule deleted successfully";
    }

    @Override
    public List<MedicationScheduleDto> getScheduleForUser(Long userId) {
        User user = entityFetcher.findUserById(userId);

        List<Medication> medications = medicationRepo.findAllByUserId(user.getId());
        List<MedicationSchedule> schedules = new ArrayList<>();

        medications.forEach(medication -> schedules.addAll(medication.getSchedules()));

        return schedules.stream()
                .map(medicationScheduleMapper::mapToDto)
                .collect(Collectors.toList());
    }


}
