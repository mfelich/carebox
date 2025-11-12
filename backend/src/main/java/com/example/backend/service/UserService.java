package com.example.backend.service;

import com.example.backend.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    //getUser
    //getAllUsers
    //editUser
    String deleteUser(Long userId);
}
