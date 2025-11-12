package com.example.backend.controller;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;
import com.example.backend.entity.Medication;
import com.example.backend.service.util.MedicationService;
import lombok.Getter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private MedicationService medicationService;

    public MedicationController(MedicationService medicationService){
        this.medicationService=medicationService;
    }


    @PostMapping("/{userId}")
    ResponseEntity<MedicationDto> addMedication(@PathVariable("userId") Long userId,
                                                @RequestBody CreateMedicationDto createMedicationDto) {

        return ResponseEntity.ok(medicationService.addMedication(userId,createMedicationDto));
    }

    @GetMapping("/user/{userId}")
    ResponseEntity<List<MedicationDto>> getMedicationUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(medicationService.getAllMedicationByUserId(userId));
    }
}
