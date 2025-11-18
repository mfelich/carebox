package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

public interface AdminService {
    UserDto setUserToDoctor(Long userId) throws AccessDeniedException;
    Page<UserDto> getUsersByRole(UserRole role,Optional<String> sortBy, Optional<Integer> page);
}
