package com._blog.app.dtos;

import java.util.UUID;

public record ReportRequest(

        UUID reportedUser,
        UUID reportedPost,
        String reason) {

}
