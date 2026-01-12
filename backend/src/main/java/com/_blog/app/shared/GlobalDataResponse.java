package com._blog.app.shared;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
// @AllArgsConstructor
public class GlobalDataResponse<T> {

    private T data;
    private int currentPage;
    private int totalPages;
    private boolean hasNext;

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
    @Builder
    public static class UserResponse {

        private UUID id;
        private String username;
        private String avatar;
        private String email;
        private String name;
        private Long totalPost;
        private boolean followed;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {

        private UUID id;
        private String username;
        private String avatar;
        private String role;
    }

    @Getter
    @Setter
    @Builder
    public static class NotificationResponse {

        private UUID id;
        private String content;
        private boolean read;
        private LocalDateTime creatAt;

    }

    @Setter
    @Getter
    @Builder
    public static class PostResponse {

        private UUID id;
        private String authore;
        private String avatar;
        private LocalDateTime createTime;
        private String descreption;
        private List<Media> media;
        private long totalLike;
        private long totalComment;
        private boolean liked;
    }

    @Embeddable
    @NoArgsConstructor
    @Getter
    @Setter
    public static class Media {

        private String mediaType;
        private String mediaUrl;

        public Media(String mediaType, String mediaUrl) {
            this.mediaType = mediaType;
            this.mediaUrl = mediaUrl;
        }
    }

    @Builder
    @Getter
    @Setter
    public static class Comment {

        private UUID id;
        private String authore;
        private String avatar;
        private LocalDateTime createTime;
        private String content;
    }

    @Builder
    @Getter
    @Setter
    public static class Stats {

        private Long totalUsers;
        private Long totalPosts;
        private Long activeReports;
        private Long banned;
    }

    @Builder
    @Getter
    @Setter
    public static class Users {

        private UUID id;
        private String avatart;
        private String username;
        private String email;
        private Boolean status;
    }

    @Builder
    @Getter
    @Setter
    public static class Postes {

        private UUID id;
        private String authore;
        private String descreption;
        private Boolean hide;
    }

    @Builder
    @Getter
    @Setter
    public static class Report {

        private UUID id;
        private String type;
        private String reporter;
        private LocalDateTime time;
        private String target;
        private UUID targetId;
        private String reason;
        private String status;
    }

}
