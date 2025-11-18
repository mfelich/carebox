package com.example.backend.service.impl;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.AdminService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
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

    @Override
    public Page<UserDto> getUsersByRole(UserRole role, Optional<String> sortBy, Optional<Integer> page) {

        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                12,
                Sort.Direction.ASC,
                sortBy.orElse("username")
        );

        Page<User> users;
        users = userRepo.findAllByRole(role, pageRequest);
        return users.map(userMapper::mapToDto);
    }
}
