package com.example.backend.controller;

import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(service.deleteUser(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin-endpoint")
    public ResponseEntity<String> helloAdmin() {
        return ResponseEntity.ok("Hello admin!");
    }
}
