package com.example.backend.service.impl;

import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.service.AccessControlService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class AccessControlServiceImpl implements AccessControlService {

    private EntityFetcher entityFetcher;

    public AccessControlServiceImpl(EntityFetcher entityFetcher) {
        this.entityFetcher=entityFetcher;
    }

    //return true when user role is ADMIN or DOCTOR related to PATIENT
    public boolean hasAccessToPatient(User user, User patient) {

        if (!user.getRole().equals(UserRole.DOCTOR)
                && !user.getRole().equals(UserRole.ADMIN)) {
            throw new AccessDeniedException("You are not a doctor or admin.");
        }

        if (user.getRole().equals(UserRole.ADMIN)) {
            return true;
        }

        if (user.getRole().equals(UserRole.DOCTOR)) {

            if (patient.getDoctor() == null) {
                throw new AccessDeniedException("Patient does not have an assigned doctor.");
            }

            if (!user.getId().equals(patient.getDoctor().getId())) {
                throw new AccessDeniedException("You are not assigned to this patient.");
            }

            return true;
        }
        return false;
    }

    //return true when user role is DOCTOR and PATIENT unrelated to any DOCTOR
    public boolean canAddPatient(User currentUser, User patient) {
        return currentUser.getRole() == UserRole.DOCTOR && patient.getDoctor() == null;
    }

}
