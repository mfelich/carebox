package com.example.backend.service.impl;

import com.example.backend.dto.EditUserDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.UserService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    private UserRepo userRepo;
    private UserMapper userMapper;
    private EntityFetcher entityFetcher;

    public UserServiceImpl(UserRepo userRepo,UserMapper userMapper, EntityFetcher entityFetcher) {
        this.userRepo=userRepo;
        this.userMapper=userMapper;
        this.entityFetcher=entityFetcher;
    }

    @Override
    public UserDto getUserById(Long userId) {
        return userMapper.mapToDto(entityFetcher.findUserById(userId));
    }

    @Override
    public Page<UserDto> getAllUsers(Optional<String> sortBy, Optional<String> username, Optional<Integer> page) {

        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                12,
                Sort.Direction.ASC,
                sortBy.orElse("username")
        );

        Page<User> users;

        if (username.isPresent()) {
            users = userRepo.findByUsernameContainingIgnoreCase(username.get(), pageRequest);
        } else {
            users = userRepo.findAll(pageRequest);
        }

        return users.map(userMapper::mapToDto);
    }

    @Override
    public UserDto editUser(Long userId, EditUserDto editUserDto) throws AccessDeniedException{
        User user = entityFetcher.findUserById(userId);
        User currentUser = entityFetcher.getCurrentUser();

        boolean isOwner = user.getId().equals(currentUser.getId());

        // owner and admin can edit user
        if (!isOwner && !currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Access denied!");
        }
        else {
            user.setUsername(editUserDto.getUsername());
            User savedUser = userRepo.save(user);
            return userMapper.mapToDto(savedUser);
        }
    }

    @Override
    public String deleteUser(Long userId) throws AccessDeniedException {
        User user = entityFetcher.findUserById(userId);
        User currentUser = entityFetcher.getCurrentUser();

        boolean isOwner = user.getId().equals(currentUser.getId());

        // owner and admin can delete user
        if (!isOwner && !currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("Access denied!");
        }
        else {
            userRepo.delete(user);
            return "User deleted successfully.";
        }

    }
}
