package com.example.backend.mapper;

import com.example.backend.dto.UserDeviceDto;
import com.example.backend.entity.UserDevice;
import org.springframework.stereotype.Component;

@Component
public class UserDeviceMapper {

    private UserMapper userMapper;

    public UserDeviceMapper(UserMapper userMapper) {
        this.userMapper=userMapper;
    }

    public UserDeviceDto mapToDto(UserDevice userDevice) {
        return new UserDeviceDto(userDevice.getId(),
                userDevice.getDeviceUuid(),
                userDevice.getName(),
                userDevice.getIpAddress(),
                userMapper.mapToDto(userDevice.getUser()));
    }
}
