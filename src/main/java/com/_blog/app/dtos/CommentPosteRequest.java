package com._blog.app.dtos;


import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommentPosteRequest(
        @NotNull(message = "The content of comment is required") @Size(max = 500, message = "Description cannot exceed 500 characters") String description,
        @NotNull(message = "post_id is required") UUID postId) {

}
