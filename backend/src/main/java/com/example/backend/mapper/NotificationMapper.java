package com.example.backend.mapper;

import com.example.backend.dto.NotificationDto;
import com.example.backend.entity.Notification;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    private UserMapper userMapper;

    public NotificationMapper(UserMapper userMapper) {
        this.userMapper=userMapper;
    }

    public NotificationDto mapToDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getMessage(),
                notification.isSent(),
                userMapper.mapToDto(notification.getDevice().getUser())
        );
    }
}
