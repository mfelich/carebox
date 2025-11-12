package com.example.backend.controller;

import com.example.backend.dto.CreateUserDto;
import com.example.backend.dto.UserDto;
import com.example.backend.dto.auth.AuthReposne;
import com.example.backend.dto.auth.AuthRequest;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService=authService;
    }

    @PostMapping("/register")
    ResponseEntity<UserDto> register(@RequestBody CreateUserDto createUserDto){
        return ResponseEntity.ok(authService.register(createUserDto));
    }

    @PostMapping("/login")
    ResponseEntity<AuthReposne> login(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(authService.login(authRequest));
    }
}
