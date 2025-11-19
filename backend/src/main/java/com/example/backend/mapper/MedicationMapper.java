package com.example.backend.mapper;

import com.example.backend.dto.MedicationDto;
import com.example.backend.entity.Medication;
import com.example.backend.entity.MedicationSchedule;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MedicationMapper {

    private UserMapper userMapper;


    public MedicationMapper(UserMapper userMapper) {
        this.userMapper=userMapper;
    }

    public MedicationDto mapToDto(Medication medication){
        MedicationDto medicationDto = new MedicationDto();
        medicationDto.setId(medication.getId());
        medicationDto.setName(medication.getName());
        medicationDto.setUser(userMapper.mapToDto(medication.getPatient()));


        return medicationDto;
    }
}
