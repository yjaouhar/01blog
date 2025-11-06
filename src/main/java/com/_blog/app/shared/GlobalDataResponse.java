package com._blog.app.shared;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
// @AllArgsConstructor
public class GlobalDataResponse<T> {

    private  T data;
    private  int currentPage;
    private  int totalPages;
    private  boolean hasNext;

    public GlobalDataResponse(T data, int currentPage, int totalPage, boolean hasNext) {
        this.data = data;
        this.currentPage = currentPage;
        this.totalPages = totalPage;
        this.hasNext = hasNext;
    }


    @Getter
    @Setter
    @AllArgsConstructor
    public static class SubscribersResponse {
        private String avatar;
        private String lastName;
        private String firstName;
        private String userName;
        private boolean folloewd;
    }
    
    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserResponse {
        private String avatar;
        private String lastName;
        private String firstName;
        private String userName;
        private boolean folloewd;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class NotificationResponse {
        // private String sender;
        private String content;
        private boolean read;
        private LocalDateTime creatAt;

    }
        @Setter
    @Getter
    @NoArgsConstructor
    // @AllArgsConstructor
    public static class PostResponse {
     
        private UUID id;
        private String title;
        private String descreption;
        private String mediaType;
        private String mediaUrl;
        private long totalLike;
        private long totalComment;
        private boolean liked;
    }
}
