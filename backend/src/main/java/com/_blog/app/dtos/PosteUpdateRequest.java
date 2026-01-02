package com._blog.app.dtos;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record PosteUpdateRequest(
        String description,
        List<String> removedMediaIds,
        @NotNull(message = "post_id is required")
        UUID postId
        ) {

}
