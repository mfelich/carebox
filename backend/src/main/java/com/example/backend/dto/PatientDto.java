package com.example.backend.dto;

import com.example.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private Long id;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Long doctorId;
}
