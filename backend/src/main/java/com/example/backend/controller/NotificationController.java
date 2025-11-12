package com.example.backend.controller;

import com.example.backend.dto.NotificationDto;
import com.example.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private NotificationService service;

    public NotificationController(NotificationService service) {
        this.service=service;
    }

    @GetMapping("/device/{deviceUuid}")
    public ResponseEntity<List<NotificationDto>> getAllNotificationsForDevice(
            @PathVariable String deviceUuid
    ) {
        List<NotificationDto> notifications = service.getAllNotificationsForDevice(deviceUuid);
        return ResponseEntity.ok(notifications);
    }


    @PostMapping("/{notificationId}/mark-sent")
    public ResponseEntity<NotificationDto> markAsSent(
            @PathVariable Long notificationId
    ) {
        NotificationDto notification = service.markAsSent(notificationId);
        return ResponseEntity.ok(notification);
    }
}
