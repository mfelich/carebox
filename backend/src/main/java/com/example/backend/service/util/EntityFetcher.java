package com.example.backend.service.util;
import com.example.backend.entity.Medication;
import com.example.backend.entity.User;
import com.example.backend.entity.UserDevice;
import com.example.backend.entity.UserRole;
import com.example.backend.exception.DeviceNotFoundException;
import com.example.backend.exception.MedicationNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repo.MedicationRepo;
import com.example.backend.repo.UserDeviceRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class EntityFetcher {

    private UserRepo userRepo;
    private MedicationRepo medicationRepo;
    private UserDeviceRepo userDeviceRepo;


    public EntityFetcher(UserRepo userRepo, MedicationRepo medicationRepo, UserDeviceRepo userDeviceRepo) {
        this.userRepo=userRepo;
        this.medicationRepo=medicationRepo;
        this.userDeviceRepo=userDeviceRepo;
    }

    public User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return findUserByEmail(email);
    }

    public User findUserById(Long userId){
        return userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with given id:" + userId + " does not exist!"));
    }

    public User findUserByEmail(String email) {
        Optional<User> user= userRepo.findByEmail(email);

        if (user.isEmpty()){
            throw new UserNotFoundException("User not found with email:" + email);
        }

        else return user.get();
        }

    public Medication findMedicationById(Long medicationId) {
        return medicationRepo.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException("Medication not found with id:" + medicationId));
    }

    public UserDevice getDeviceByUuid(String deviceUuid) {
        return userDeviceRepo.findByDeviceUuid(deviceUuid)
                .orElseThrow(() -> new DeviceNotFoundException("Device not found with uuid:" + deviceUuid));
    }

}
