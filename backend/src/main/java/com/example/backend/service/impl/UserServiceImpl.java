package com.example.backend.service.impl;

import com.example.backend.entity.User;
import com.example.backend.repo.UserRepo;
import com.example.backend.service.UserService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private UserRepo userRepo;
    private EntityFetcher entityFetcher;

    public UserServiceImpl(UserRepo userRepo, EntityFetcher entityFetcher) {
        this.userRepo=userRepo;
        this.entityFetcher=entityFetcher;
    }

    @Override
    public String deleteUser(Long userId) {
        User user = entityFetcher.findUserById(userId);
        userRepo.delete(user);
        return "User deleted successfully";
    }
}
