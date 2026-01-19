package com.example.backend.dto;

import com.example.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;
    private UserRole role;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
}
