package com.example.backend.mapper;

import com.example.backend.dto.MedicationScheduleDto;
import com.example.backend.entity.MedicationSchedule;
import org.springframework.stereotype.Component;

@Component
public class MedicationScheduleMapper {

    private MedicationMapper medicationMapper;

    public MedicationScheduleMapper(MedicationMapper medicationMapper) {
        this.medicationMapper=medicationMapper;
    }

    public MedicationScheduleDto mapToDto(MedicationSchedule medicationSchedule) {
        return new MedicationScheduleDto(
                medicationSchedule.getId(),
                medicationSchedule.getTime(),
                medicationSchedule.getDaysOfWeek(),
                medicationSchedule.getDosage(),
                medicationMapper.mapToDto(medicationSchedule.getMedication())
        );
    }
}
