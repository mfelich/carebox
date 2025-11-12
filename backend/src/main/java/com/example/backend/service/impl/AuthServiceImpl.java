package com.example.backend.service.impl;

import com.example.backend.dto.CreateUserDto;
import com.example.backend.dto.UserDto;
import com.example.backend.dto.auth.AuthReposne;
import com.example.backend.dto.auth.AuthRequest;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.AuthService;
import com.example.backend.service.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;

    private UserRepo userRepo;
    private UserMapper userMapper;

    public AuthServiceImpl(AuthenticationManager authenticationManager,JwtService jwtService,PasswordEncoder passwordEncoder, UserRepo userRepo, UserMapper userMapper) {
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;
        this.passwordEncoder=passwordEncoder;
        this.userRepo = userRepo;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto register(CreateUserDto createUserDto) {
        User user = new User();
        user.setUsername(createUserDto.getUsername());
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(UserRole.USER);
        user.setEmail(createUserDto.getEmail());
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        user.setFirstName(createUserDto.getFirstName());
        user.setLastName(createUserDto.getLastName());

        User savedUser = userRepo.save(user);

        return userMapper.mapToDto(savedUser);
    }

    @Override
    public AuthReposne login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(authRequest.getEmail());

            AuthReposne response = new AuthReposne();
            response.setAccessToken(token);

            return response;
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }


}
