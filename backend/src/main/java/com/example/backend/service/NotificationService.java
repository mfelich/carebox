package com.example.backend.service;

import com.example.backend.dto.NotificationDto;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.UserDevice;

import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(MedicationSchedule schedule, UserDevice device, String message);
    List<NotificationDto> getAllNotificationsForDevice(String deviceUuid);
    NotificationDto markAsSent(Long notificationId);
}
