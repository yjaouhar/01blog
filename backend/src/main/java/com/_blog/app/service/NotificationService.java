package com._blog.app.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.entities.Notification;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.NotificationRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalDataResponse.NotificationResponse;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    public void insertNotification(UserAccount recever, String content) {
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setResever(recever);
        notificationRepo.save(notification);

    }

    public List<NotificationResponse> getNotification(UserAccount resever) {
        List<Notification> notificationPage = notificationRepo.findAllByReseverId(resever.getId());
        return notificationPage.stream()
                .map(notif -> {
                    return  GlobalDataResponse.NotificationResponse.builder()
                            .id(notif.getId())
                            .content(notif.getContent())
                            .read(notif.isRead())
                            .creatAt(notif.getCreatAt())
                            .build();
                }).toList();

    }

    public void togellNotification(UUID notifId) {
        Notification notif = notificationRepo.findById(notifId)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "notification not found"));
        notif.setRead(!notif.isRead());
        notificationRepo.save(notif);
    }

}
