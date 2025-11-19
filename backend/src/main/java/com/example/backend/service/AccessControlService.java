package com.example.backend.service;

import com.example.backend.entity.User;

public interface AccessControlService {
    boolean hasAccessToPatient(User user, User patient);
    boolean canAddPatient(User doctor, User patient);
}
