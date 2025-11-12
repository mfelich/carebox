    package com.example.backend.service.impl;

    import com.example.backend.entity.MedicationSchedule;
    import com.example.backend.entity.UserDevice;
    import com.example.backend.repo.MedicationScheduleRepo;
    import com.example.backend.repo.NotificationRepo;
    import com.example.backend.repo.UserDeviceRepo;
    import com.example.backend.service.NotificationService;
    import jakarta.transaction.Transactional;
    import lombok.RequiredArgsConstructor;
    import org.springframework.scheduling.annotation.Scheduled;
    import org.springframework.stereotype.Component;

    import java.time.DayOfWeek;
    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.LocalTime;
    import java.time.temporal.ChronoUnit;
    import java.util.List;

    @Component
    @RequiredArgsConstructor
    public class NotificationScheduler {

        private final MedicationScheduleRepo scheduleRepo;
        private final UserDeviceRepo deviceRepo;
        private final NotificationService notificationService;
        private final NotificationRepo notificationRepo;

        @Scheduled(cron = "0 * * * * *")
        @Transactional
        public void generateNotifications() {
            LocalDateTime now = LocalDateTime.now();
            DayOfWeek today = now.getDayOfWeek();
            LocalTime currentTime = now.toLocalTime().withSecond(0).withNano(0);

            System.out.println("Scheduled task started at: " + currentTime);

            List<MedicationSchedule> schedules = scheduleRepo.findAll();

            for (MedicationSchedule schedule : schedules) {

                // ✅ Provjeri da li je danas dan iz rasporeda
                if (!schedule.getDaysOfWeek().contains(today)) continue;

                // ✅ Vrijeme terapije (za danas)
                LocalTime scheduleTime = schedule.getTime().withSecond(0).withNano(0);

                // ✅ Kreiramo datetime objekat
                LocalDateTime scheduledDateTime = LocalDateTime.of(LocalDate.now(), scheduleTime);

                // ✅ Provjeravamo JEDINO ako je TAČNA minuta
                if (!scheduleTime.equals(currentTime)) continue;

                // ✅ Uzimamo sve uređaje korisnika
                List<UserDevice> devices =
                        deviceRepo.findAllByUserId(schedule.getMedication().getUser().getId());

                for (UserDevice device : devices) {

                    // ✅ Sprječavanje duplikata — egzaktno vrijeme
                    boolean exists = notificationRepo.existsByMedicationScheduleAndDeviceAndScheduledTime(
                            schedule, device, scheduledDateTime
                    );

                    if (!exists) {
                        String message = "Vrijeme za " + schedule.getMedication().getName() + " " + schedule.getDosage();
                        System.out.println("✅ Kreiram NOTIFIKACIJU za device: " + device.getName());
                        notificationService.createNotification(schedule, device, message);
                    } else {
                        System.out.println("⛔ Notifikacija već postoji za device: " + device.getName());
                    }
                }
            }
        }


    }
