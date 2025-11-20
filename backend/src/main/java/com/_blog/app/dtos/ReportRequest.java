package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportRequest(

                UUID reportedUser,
                UUID reportedPost,
                @Size(min = 10, max = 255) @NotNull(message = "reasone is required") String reason) {

}
