package com._blog.app.dtos;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PosteUpdateRequest(
        @Size(max = 200, message = "First Name must be between 4 and 20 characters")
        String description,
        List<String> removedMediaIds,
        @NotNull(message = "post_id is required")
        UUID postId
        ) {

}
