package com.ats.ecommerce.mapper;

import com.ats.ecommerce.dto.notification.NotificationDto;
import com.ats.ecommerce.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification notification) {
        if (notification == null) return null;

        return new NotificationDto(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}

