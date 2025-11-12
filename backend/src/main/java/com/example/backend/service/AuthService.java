package com.example.backend.service;

import com.example.backend.dto.CreateUserDto;
import com.example.backend.dto.UserDto;
import com.example.backend.dto.auth.AuthReposne;
import com.example.backend.dto.auth.AuthRequest;

public interface AuthService {

    UserDto register(CreateUserDto createUserDto);
    AuthReposne login(AuthRequest authRequest);
}
