package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record PosteUpdateRequest(
                String title,
                String description,
                @NotNull(message = "post_id is required") UUID postId) {

}
