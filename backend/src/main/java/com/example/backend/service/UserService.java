package com.example.backend.service;

import com.example.backend.dto.EditUserDto;
import com.example.backend.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

public interface UserService {
    UserDto getUserById(Long userId);
    Page<UserDto> getAllUsers(Optional<String> sortBy, Optional<String> username, Optional<Integer> page);
    UserDto editUser(Long userId, EditUserDto editUserDto) throws AccessDeniedException;
    String deleteUser(Long userId) throws AccessDeniedException;
}
