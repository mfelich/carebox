package com.example.backend.repo;

import com.example.backend.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDeviceRepo extends JpaRepository<UserDevice, Long> {
    List<UserDevice> findAllByUserId(Long userId);
    Optional<UserDevice> findByDeviceUuid(String deviceUuid);
    boolean existsByDeviceUuidAndUserId(String deviceUuid, Long userId);
}
