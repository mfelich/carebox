package com.example.backend.service.impl;

import com.example.backend.dto.RegisterUserDeviceDto;
import com.example.backend.dto.UserDeviceDto;
import com.example.backend.entity.User;
import com.example.backend.entity.UserDevice;
import com.example.backend.exception.DeviceNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.mapper.UserDeviceMapper;
import com.example.backend.repo.UserDeviceRepo;
import com.example.backend.service.UserDeviceService;
import com.example.backend.service.util.EntityFetcher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserDeviceServiceImpl implements UserDeviceService {

    private UserDeviceRepo userDeviceRepo;
    private UserDeviceMapper userDeviceMapper;
    private EntityFetcher entityFetcher;

    public UserDeviceServiceImpl(UserDeviceRepo userDeviceRepo,UserDeviceMapper userDeviceMapper, EntityFetcher entityFetcher) {
        this.userDeviceRepo=userDeviceRepo;
        this.userDeviceMapper=userDeviceMapper;
        this.entityFetcher=entityFetcher;
    }

    @Override
    public UserDeviceDto register(RegisterUserDeviceDto dto) {
        User user = entityFetcher.findUserById(dto.getUserId());

        UserDevice userDevice = new UserDevice();
        userDevice.setName(dto.getName());
        userDevice.setDeviceUuid(dto.getDeviceUuid());
        userDevice.setIpAddress(dto.getIpAddress());
        userDevice.setUser(user);

        UserDevice savedUserDevice = userDeviceRepo.save(userDevice);
        return userDeviceMapper.mapToDto(savedUserDevice);
    }

    @Override
    public List<UserDeviceDto> getDevicesForUser(Long userId) {
        User user = entityFetcher.findUserById(userId);
        List<UserDevice> devices = userDeviceRepo.findAllByUserId(userId);

        if (devices.isEmpty()){
            throw new UserNotFoundException("No devices for user with id:" + user);
        }

        return devices.stream()
                .map(userDeviceMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDeviceDto getDeviceByUuid(String deviceUuid) {
        return userDeviceMapper.mapToDto(entityFetcher.getDeviceByUuid(deviceUuid));
    }

    @Override
    public UserDeviceDto updateIpAddress(String deviceUuid, String newIp) {
        UserDevice userDevice = entityFetcher.getDeviceByUuid(deviceUuid);
        userDevice.setIpAddress(newIp);
        UserDevice savedUserDevice = userDeviceRepo.save(userDevice);

        return userDeviceMapper.mapToDto(savedUserDevice);
    }


    @Override
    public boolean isDeviceLinkedToUser(String deviceUuid, Long userId) {
        return userDeviceRepo.existsByDeviceUuidAndUserId(deviceUuid,userId);
    }
}
