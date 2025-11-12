package com.example.backend.repo;

import com.example.backend.entity.MedicationSchedule;
import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import com.example.backend.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findAllByDeviceAndSentFalse(UserDevice userDevice);
    boolean existsByMedicationScheduleAndDeviceAndScheduledTime(MedicationSchedule schedule, UserDevice device, LocalDateTime scheduledTime);
}
