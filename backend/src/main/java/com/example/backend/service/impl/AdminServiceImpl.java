package com.example.backend.service.impl;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.AdminService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.security.access.AccessDeniedException;

public class AdminServiceImpl implements AdminService {

    private EntityFetcher entityFetcher;
    private UserRepo userRepo;
    private UserMapper userMapper;

    public AdminServiceImpl(EntityFetcher entityFetcher, UserRepo userRepo, UserMapper userMapper) {
        this.entityFetcher=entityFetcher;
        this.userRepo=userRepo;
        this.userMapper=userMapper;
    }

    @Override
    public UserDto setUserToDoctor(Long userId) throws AccessDeniedException{
        User currentUser = entityFetcher.getCurrentUser();

        if (!currentUser.getRole().equals(UserRole.ADMIN)){
            throw new AccessDeniedException("You need to be ADMIN to set user role to DOCTOR");
        }

        User doctor = entityFetcher.findUserById(userId);

        doctor.setRole(UserRole.DOCTOR);
        doctor.setDoctor(null);

        User saved = userRepo.save(doctor);
        return userMapper.mapToDto(saved);
    }
}
