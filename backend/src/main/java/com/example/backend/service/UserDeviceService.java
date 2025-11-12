package com.example.backend.service;

import com.example.backend.dto.RegisterUserDeviceDto;
import com.example.backend.dto.UserDeviceDto;

import java.util.List;

public interface UserDeviceService {
    UserDeviceDto register(RegisterUserDeviceDto dto);
    List<UserDeviceDto> getDevicesForUser(Long userId);
    UserDeviceDto getDeviceByUuid(String deviceUuid);
    UserDeviceDto updateIpAddress(String deviceUuid, String newIp);
    boolean isDeviceLinkedToUser(String deviceUuid, Long userId);
}
