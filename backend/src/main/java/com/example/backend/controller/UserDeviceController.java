package com.example.backend.controller;

import com.example.backend.dto.RegisterUserDeviceDto;
import com.example.backend.dto.UserDeviceDto;
import com.example.backend.entity.UserDevice;
import com.example.backend.service.UserDeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class UserDeviceController {

    private UserDeviceService service;

    public UserDeviceController(UserDeviceService service){
        this.service=service;
    }

    @PostMapping("/register")
    ResponseEntity<UserDeviceDto> register(@RequestBody RegisterUserDeviceDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(dto));
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserDeviceDto>> getDevicesForUser(@PathVariable Long userId) {
        List<UserDeviceDto> devices = service.getDevicesForUser(userId);
        return ResponseEntity.ok(devices);
    }


    @GetMapping("/{deviceUuid}")
    public ResponseEntity<UserDeviceDto> getDeviceByUuid(@PathVariable String deviceUuid) {
        UserDeviceDto device = service.getDeviceByUuid(deviceUuid);
        return ResponseEntity.ok(device);
    }


    @PutMapping("/{deviceUuid}/update-ip")
    public ResponseEntity<UserDeviceDto> updateIpAddress(
            @PathVariable String deviceUuid,
            @RequestParam String newIp
    ) {
        UserDeviceDto updatedDevice = service.updateIpAddress(deviceUuid, newIp);
        return ResponseEntity.ok(updatedDevice);
    }


    @GetMapping("/check-link")
    public ResponseEntity<Boolean> isDeviceLinkedToUser(
            @RequestParam String deviceUuid,
            @RequestParam Long userId
    ) {
        boolean linked = service.isDeviceLinkedToUser(deviceUuid, userId);
        return ResponseEntity.ok(linked);
    }

}
