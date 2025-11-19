package com.example.backend.controller;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.MedicationDto;
import com.example.backend.service.MedicationService;
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
    ResponseEntity<MedicationDto> addMedicationToPatient(@PathVariable("userId") Long patientId,
                                                @RequestBody CreateMedicationDto createMedicationDto) {

        return ResponseEntity.ok(medicationService.addMedicationToPatient(patientId,createMedicationDto));
    }

    @GetMapping("/user/{userId}")
    ResponseEntity<List<MedicationDto>> getMedicationPatient(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(medicationService.getAllMedicationByPatientId(userId));
    }

    @DeleteMapping("/{medicationId}")
    ResponseEntity<String> deleteMedication(@PathVariable("medicationId") Long medicationId) {
        return ResponseEntity.ok(medicationService.deleteMedication(medicationId));
    }
}
