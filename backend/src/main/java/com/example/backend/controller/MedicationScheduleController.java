package com.example.backend.controller;

import com.example.backend.dto.CreateMedicationDto;
import com.example.backend.dto.CreateSchedule;
import com.example.backend.dto.MedicationScheduleDto;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.service.MedicationScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications/schedule")
public class MedicationScheduleController {

    private MedicationScheduleService service;

    public MedicationScheduleController(MedicationScheduleService service) {
        this.service=service;
    };


    @PostMapping("/{medicationId}")
    ResponseEntity<MedicationScheduleDto> createScheduleForMedication(@PathVariable("medicationId") Long medicationId,
                                                                      @RequestBody CreateSchedule createSchedule){
        return ResponseEntity.ok(service.createScheduleForMedication(createSchedule,medicationId));
    }

    @GetMapping("/patient/{patientId}")
    ResponseEntity<List<MedicationScheduleDto>> getScheduleForUser(@PathVariable("userId") Long patientId) {
        return ResponseEntity.ok(service.getScheduleForPatient(patientId));
    }

    @DeleteMapping("/{scheduleId}")
    ResponseEntity<String> removeSchedule(@PathVariable("scheduleId") Long scheduleId) {
        return ResponseEntity.ok(service.removeSchedule(scheduleId));
    }
}
