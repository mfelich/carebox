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
                listOfIds(user.getPatients()));
    }

    public PatientDto mapToPatientDto(User user) {
        return new PatientDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getDoctor().getId()
        );
    }

    public List<Long> listOfIds(List<User> users) {
        List<Long> ids = new ArrayList<>();

        for (User user : users) {
            ids.add(user.getId());
        }
        return ids;
    }
}
