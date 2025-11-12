package com.example.backend.service.impl;

import com.example.backend.dto.NotificationDto;
import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.Notification;
import com.example.backend.entity.UserDevice;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.mapper.NotificationMapper;
import com.example.backend.repo.NotificationRepo;
import com.example.backend.service.NotificationService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private NotificationRepo notificationRepo;
    private EntityFetcher entityFetcher;
    private NotificationMapper notificationMapper;

    public NotificationServiceImpl(NotificationRepo notificationRepo,EntityFetcher entityFetcher, NotificationMapper notificationMapper) {
        this.notificationRepo=notificationRepo;
        this.entityFetcher=entityFetcher;
        this.notificationMapper=notificationMapper;
    }


    @Override
    public NotificationDto createNotification(MedicationSchedule schedule, UserDevice device, String message) {
        Notification notification = new Notification();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setSent(false);

        LocalTime scheduleTime = schedule.getTime();
        LocalDate today = LocalDate.now();

        LocalDateTime scheduledDateTime = LocalDateTime.of(today, scheduleTime);

        notification.setScheduledTime(scheduledDateTime);
        notification.setDevice(device);
        notification.setMedicationSchedule(schedule);
        notification.setMessage(message);

        Notification savedNotification = notificationRepo.save(notification);

        return notificationMapper.mapToDto(notification);
    }

    @Override
    public List<NotificationDto> getAllNotificationsForDevice(String deviceUuid) {
        UserDevice userDevice = entityFetcher.getDeviceByUuid(deviceUuid);
        List<Notification> notifications = notificationRepo.findAllByDeviceAndSentFalse(userDevice);

        return notifications.stream().map(notificationMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public NotificationDto markAsSent(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new UserNotFoundException("Notification not found"));

        notification.setSent(true);
        Notification savedNotification = notificationRepo.save(notification);

        return notificationMapper.mapToDto(savedNotification);
    }
}
