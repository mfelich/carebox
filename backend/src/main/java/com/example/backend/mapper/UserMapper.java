package com.example.backend.mapper;

import com.example.backend.dto.DoctorDto;
import com.example.backend.dto.PatientDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserMapper {

    public UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt());
    };

    public DoctorDto mapToDoctorDto(User user) {
        return new DoctorDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                mapListToPatientDto(user.getPatients()));
    }

    private List<PatientDto> mapListToPatientDto(List<User> users){
        List<PatientDto> patientDtoList = new ArrayList<>();

        for (User user : users) {
            PatientDto patientDto = mapToPatientDto(user);
            patientDtoList.add(patientDto);
        }
        return patientDtoList;
    }

    public PatientDto mapToPatientDto(User user) {
        return new PatientDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                mapToDoctorDto(user.getDoctor())
        );
    }
}
