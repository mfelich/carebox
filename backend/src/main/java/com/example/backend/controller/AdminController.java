package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService service;

    public AdminController(AdminService service) {
        this.service=service;
    }

    @PostMapping("/{userId}/set-to-doctor")
    public ResponseEntity<UserDto> setUserToDoctor(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(service.setUserToDoctor(userId));
    }
}
