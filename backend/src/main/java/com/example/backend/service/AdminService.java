package com.example.backend.service;

import com.example.backend.dto.UserDto;
import org.springframework.security.access.AccessDeniedException;

public interface AdminService {
    UserDto setUserToDoctor(Long userId) throws AccessDeniedException;
}
