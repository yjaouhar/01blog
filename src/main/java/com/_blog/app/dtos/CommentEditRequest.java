package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CommentEditRequest(
                String description,
                @NotNull(message = "comment_id is required") UUID commentId
) {
    
}
