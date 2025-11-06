package com._blog.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.app.entities.Notification;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.NotificationRepo;
import com._blog.app.shared.GlobalDataResponse;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    public void insertNotification( UserAccount recever, String content) {
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setResever(recever);

    }

    public GlobalDataResponse getNotification(UserAccount resever, int page, int size) {
        Page<Notification> notificationPage = notificationRepo.findAllByReseverId(resever.getId(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "creatAt")));
        List<GlobalDataResponse.NotificationResponse> notificatins = notificationPage.getContent().stream()
                .map(notif -> {
                    return new GlobalDataResponse.NotificationResponse( notif.getContent(), notif.isRead(),
                            notif.getCreatAt());
                }).toList();
        List<Notification> notifications = notificationPage.getContent();
        notifications.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(notifications);
        return new GlobalDataResponse<>(notificatins, notificationPage.getNumber(),
                notificationPage.getTotalPages(), notificationPage.hasNext());
    }

}
