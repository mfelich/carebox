package com.example.backend.controller;

import com.example.backend.dto.EditUserDto;
import com.example.backend.dto.UserDto;
import com.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public ResponseEntity<Page<UserDto>> getAllUsers(@RequestParam Optional<String> sortBy,
                                                     @RequestParam Optional<String> username,
                                                     @RequestParam Optional<Integer> page) {
        return ResponseEntity.ok(service.getAllUsers(sortBy, username, page));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(service.getUserById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> editUser(@PathVariable("userId") Long userId,
                                            @RequestBody EditUserDto editUserDto) throws AccessDeniedException{
        return ResponseEntity.ok(service.editUser(userId,editUserDto));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") Long userId) throws AccessDeniedException {
        return ResponseEntity.ok(service.deleteUser(userId));
    }

}
