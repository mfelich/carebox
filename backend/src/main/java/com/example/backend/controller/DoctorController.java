package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService=doctorService;
    }

    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<List<UserDto>> getPatients(@PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(doctorService.getPatients(doctorId));
    }

    @PostMapping("/add-patient/{patientId}")
    public ResponseEntity<UserDto> addPatient(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(doctorService.addPatient(patientId));
    }

}
