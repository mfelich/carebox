package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.UserRole;
import com.example.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService service;

    public AdminController(AdminService service) {
        this.service=service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/set-to-doctor")
    public ResponseEntity<UserDto> setUserToDoctor(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(service.setUserToDoctor(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/role/{role}")
    public ResponseEntity<Page<UserDto>> getUsersByRole(@PathVariable("role") UserRole role,
                                                        @RequestParam(value = "sortBy", required = false) Optional<String> sortBy,
                                                        @RequestParam(value = "page", required = false) Optional<Integer> page) {
        Page<UserDto> users = service.getUsersByRole(role, sortBy, page);
        return ResponseEntity.ok(users);
    }
}
