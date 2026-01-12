package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommentEditRequest(
        @NotBlank(message = "comment content  required to edit the comment")
        @Size(min = 1, max = 500, message = "The comment accepts 1 to 500 characters")
        String description,
        @NotNull(message = "comment_id is required")
        UUID commentId
        ) {

}

